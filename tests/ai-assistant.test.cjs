const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const assistantPath = path.join(root, 'assets/js/ai-assistant.js');
const assistantSource = fs.readFileSync(assistantPath, 'utf8');
const {
    AIAssistant,
    AI_DEFAULT_MODEL,
    QUICK_ACTIONS,
    SYSTEM_PROMPT,
    boundedHistory,
    buildContextMessage,
    collectAssistantContext,
    copyTextToClipboard,
    decorateAssistantCodeBlocks,
    getQuickActionPrompt,
    loadAIConfig,
    normalizeConfiguredModel,
    normalizeGeneratedCodeLanguage,
    saveAIConfig,
    streamChatCompletion,
    validateAssistantResponse,
} = require(assistantPath);

function withBrowserGlobals(values, callback) {
    const previous = {};
    for (const [key, value] of Object.entries(values)) {
        previous[key] = globalThis[key];
        globalThis[key] = value;
    }
    try {
        return callback();
    } finally {
        for (const key of Object.keys(values)) {
            if (previous[key] === undefined) delete globalThis[key];
            else globalThis[key] = previous[key];
        }
    }
}

test('ACM AI DOM and local assets are wired', () => {
    const html = fs.readFileSync(path.join(root, 'acm-playground.html'), 'utf8');
    const requiredIds = [
        'ai-fab', 'ai-panel', 'ai-context-summary', 'ai-messages', 'ai-quick-actions',
        'ai-input', 'ai-send-btn', 'ai-config-modal',
    ];

    assert.match(html, /<body\s+data-ai-surface="acm">/);
    for (const id of requiredIds) assert.match(html, new RegExp(`id="${id}"`));
    assert.match(html, /data-action="convert-java"/);
    assert.match(html, /data-action="convert-go"/);
    assert.match(html, /marked@15\.0\.12\/marked\.min\.js/);
    assert.match(html, /integrity="sha384-[^"]+"/);
    assert.ok(
        html.indexOf('marked.min.js') < html.indexOf('assets/js/ai-assistant.js'),
        'Marked must be declared before the assistant'
    );
    assert.ok(
        html.indexOf('assets/js/acm-playground.js') < html.indexOf('assets/js/ai-assistant.js'),
        'The ACM editor must initialize before the assistant reads it'
    );

    const localAssets = Array.from(html.matchAll(/(?:href|src)="(assets\/[^"?#]+)(?:[?#][^"]*)?"/g))
        .map((match) => match[1]);
    for (const asset of localAssets) {
        assert.equal(fs.existsSync(path.join(root, asset)), true, `Missing local asset: ${asset}`);
    }
});

test('LeetCode quick actions include a Python code generation button', () => {
    const html = fs.readFileSync(path.join(root, 'playground.html'), 'utf8');

    assert.match(html, /data-action="give-code"[^>]*>💻 给我代码<\/button>/);
    assert.equal(QUICK_ACTIONS['give-code'].label, '给我代码');
    assert.match(QUICK_ACTIONS['give-code'].prompt, /Python 3/);
    assert.match(QUICK_ACTIONS['give-code'].prompt, /完整/);
});

test('give-code quick action sends its dedicated Python implementation prompt', () => {
    const assistant = Object.create(AIAssistant.prototype);
    assistant.inputEl = { value: '', style: {}, scrollHeight: 40 };
    const sent = [];
    assistant.send = (options) => sent.push(options);

    assistant.handleQuickAction('give-code');

    assert.match(assistant.inputEl.value, /Python 3/);
    assert.match(assistant.inputEl.value, /完整/);
    assert.deepEqual(sent, [{ visibleMessage: '给我代码', expectedLanguage: '' }]);
});

test('ACM context includes language, code, stdin, stdout, expected output, and status', () => {
    const elements = {
        'language-select': { value: 'python' },
        'stdin-area': { value: '2\n3 5\n' },
        'stdout-area': { textContent: '8\n', classList: { contains: () => false } },
        'expected-area': { value: '8\n' },
        'run-status': { textContent: '12.4 ms' },
        'status-info': { textContent: '运行完成' },
        'diff-result': { textContent: 'ACCEPTED' },
    };
    const document = {
        body: { dataset: { aiSurface: 'acm' } },
        getElementById(id) { return elements[id] || null; },
        querySelector() { return null; },
    };
    const window = {
        acmEditor: { getValue: () => 'a, b = map(int, input().split())\nprint(a + b)\n' },
    };

    withBrowserGlobals({ document, window }, () => {
        const context = collectAssistantContext();
        const message = buildContextMessage('转成其他语言', context);
        assert.match(message, /当前语言：Python 3/);
        assert.match(message, /```python\na, b = map/);
        assert.match(message, /【标准输入 stdin】\n2\n3 5/);
        assert.match(message, /【最近输出 stdout】\n8/);
        assert.match(message, /【期望输出 expected】\n8/);
        assert.match(message, /运行完成/);
        assert.match(message, /ACCEPTED/);
        assert.doesNotMatch(message, /undefined/);
    });
});

test('ACM code fences follow the active language', () => {
    const cases = [
        ['python', 'Python 3', 'python'],
        ['go', 'Go', 'go'],
        ['java', 'Java 17', 'java'],
    ];
    for (const [language, languageLabel, fence] of cases) {
        const message = buildContextMessage('检查', {
            surface: 'acm',
            language,
            languageLabel,
            code: 'sample code',
        });
        assert.match(message, new RegExp(`当前语言：${languageLabel}`));
        assert.match(message, new RegExp('```' + fence + '\\nsample code'));
    }
});

test('conversion actions issue complete target-specific ACM prompts', () => {
    for (const [action, required] of [
        ['convert-java', ['Java 17', 'public class Main', 'stdin', 'stdout', '算法语义']],
        ['convert-go', ['Go', 'package main', 'stdin', 'stdout', '算法语义']],
    ]) {
        const assistant = Object.create(AIAssistant.prototype);
        assistant.inputEl = { value: '', style: {}, scrollHeight: 40 };
        const sent = [];
        assistant.send = (options) => sent.push(options);
        assistant.handleQuickAction(action);

        for (const fragment of required) assert.match(assistant.inputEl.value, new RegExp(fragment));
        assert.equal(sent.length, 1);
        assert.equal(sent[0].visibleMessage, QUICK_ACTIONS[action].label);
    }
});

test('conversion prompts use the actual source language', () => {
    const prompt = getQuickActionPrompt('convert-java', {
        surface: 'acm',
        language: 'go',
        languageLabel: 'Go',
        code: 'package main',
    });
    assert.match(prompt, /当前 Go 实现/);
    assert.doesNotMatch(prompt, /当前 Python 实现/);
});

test('LeetCode context includes a hard Python-only execution harness', () => {
    const message = buildContextMessage('给出代码', {
        surface: 'leetcode',
        language: 'python',
        languageLabel: 'Python 3',
        problemTitle: '合并 K 个升序链表',
        problem: '合并所有链表并返回。',
    });

    assert.match(message, /【运行环境硬约束】/);
    assert.match(message, /仅支持 Python 3/);
    assert.match(message, /禁止输出 Java、Go/);
    assert.ok(
        message.indexOf('【运行环境硬约束】') < message.indexOf('【用户提问】'),
        'The Python-only harness must be injected before the user request'
    );
});

test('LeetCode response validation rejects non-Python generated code', () => {
    assert.equal(
        validateAssistantResponse('```python\ndef merge_k_lists(lists):\n    return None\n```', 'python').valid,
        true
    );
    assert.equal(
        validateAssistantResponse('```java\nclass Solution {}\n```', 'python').valid,
        false
    );
    assert.equal(
        validateAssistantResponse('public class Solution {}', 'python').valid,
        false
    );
    assert.equal(
        validateAssistantResponse('```go\npackage main\nfunc main() {}\n```', 'python').valid,
        false
    );
});

test('ordinary LeetCode sends enforce Python response validation', () => {
    assert.match(assistantSource, /const expectedLanguage = options\.expectedLanguage \|\| \(context\.surface === 'leetcode' \? 'python' : ''\)/);
});

test('shared assistant keeps the LeetCode problem and Python editor context', () => {
    const document = {
        body: { dataset: {} },
        createElement() {
            return {
                textContent: '',
                set innerHTML(value) { this.textContent = String(value).replace(/<[^>]+>/g, ''); },
            };
        },
        getElementById() { return null; },
        querySelector() { return null; },
    };
    const window = {
        currentProblem: {
            title: '两数之和',
            description: '<p>返回两个数的下标</p>',
            template: '# template',
        },
        editor: { getValue: () => 'def two_sum(nums, target):\n    return []' },
    };

    withBrowserGlobals({ document, window }, () => {
        const message = buildContextMessage('给我提示');
        assert.match(message, /两数之和/);
        assert.match(message, /返回两个数的下标/);
        assert.match(message, /```python/);
        assert.match(message, /def two_sum/);
        assert.match(message, /【用户提问】\n给我提示/);
    });
});

test('assistant prompt and renderer are language-aware and sanitize Markdown HTML', () => {
    assert.match(SYSTEM_PROMPT, /代码块标注当前语言或目标语言/);
    assert.doesNotMatch(SYSTEM_PROMPT, /代码块使用\s+```python/);
    assert.match(assistantSource, /sanitizeMarkdownHtml\(marked\.parse\(text\)\)/);
    assert.match(assistantSource, /dangerousTags/);
    assert.match(assistantSource, /const safeHref =/);
    assert.match(assistantSource, /element\.removeAttribute\('href'\)/);
});

test('generated code language aliases are normalized without guessing unknown fences', () => {
    for (const [input, expected] of [
        ['python', 'python'], ['language-py', 'python'], ['Language-Python', 'python'], ['python3', 'python'],
        ['go', 'go'], ['golang', 'go'], ['java', 'java'], ['java17', 'java'],
        ['text', ''], ['', ''],
    ]) {
        assert.equal(normalizeGeneratedCodeLanguage(input), expected);
    }
});

test('conversion response validation rejects safety classifiers and incomplete programs', () => {
    assert.equal(validateAssistantResponse('User Safety: safe').valid, false);
    assert.equal(validateAssistantResponse('User Safety: unsafe.').valid, false);
    assert.equal(validateAssistantResponse('```java\nclass Solution {}\n```', 'java').valid, false);
    assert.equal(validateAssistantResponse('```go\nfunc main() {}\n```', 'go').valid, false);
    assert.equal(
        validateAssistantResponse('```java\npublic class Main {}\n```', 'java').valid,
        true
    );
    assert.equal(
        validateAssistantResponse('```go\npackage main\nfunc main() {}\n```', 'go').valid,
        true
    );
});

test('legacy dynamic free router migrates to the verified code model', () => {
    assert.equal(AI_DEFAULT_MODEL, 'poolside/laguna-s-2.1:free');
    assert.equal(normalizeConfiguredModel('openrouter/free'), AI_DEFAULT_MODEL);
    assert.equal(normalizeConfiguredModel('custom/model'), 'custom/model');

    const writes = [];
    const localStorage = {
        getItem() {
            return JSON.stringify({
                baseUrl: 'https://openrouter.ai/api/v1',
                apiKey: 'saved-key',
                model: 'openrouter/free',
            });
        },
        setItem(key, value) { writes.push([key, JSON.parse(value)]); },
    };
    withBrowserGlobals({ localStorage }, () => {
        const config = loadAIConfig();
        assert.equal(config.model, AI_DEFAULT_MODEL);
        assert.equal(writes.length, 1);
        assert.equal(writes[0][1].model, AI_DEFAULT_MODEL);
    });
});

test('copy helper uses the browser clipboard without changing code text', async () => {
    const copied = [];
    const result = await copyTextToClipboard('System.out.println("<ok>");\n', {
        clipboard: { writeText: async (value) => copied.push(value) },
    }, null);
    assert.equal(result, true);
    assert.deepEqual(copied, ['System.out.println("<ok>");\n']);
});

test('code block decorator adds local copy and editor actions once', () => {
    function element(tagName) {
        const node = {
            tagName: tagName.toUpperCase(),
            children: [],
            parentElement: null,
            parentNode: null,
            className: '',
            dataset: {},
            attributes: {},
            textContent: '',
            type: '',
            disabled: false,
            title: '',
            setAttribute(name, value) { this.attributes[name] = String(value); },
            append(...children) {
                for (const child of children) {
                    if (child.parentNode?.children) {
                        child.parentNode.children = child.parentNode.children.filter((item) => item !== child);
                    }
                    child.parentNode = this;
                    child.parentElement = this;
                    this.children.push(child);
                }
            },
            get classList() {
                return { contains: (name) => this.className.split(/\s+/).includes(name) };
            },
        };
        return node;
    }

    const root = element('div');
    const pre = element('pre');
    const code = element('code');
    code.className = 'language-java';
    code.textContent = 'public class Main {}\n';
    pre.append(code);
    root.append(pre);
    root.ownerDocument = { createElement: element };
    root.querySelectorAll = () => [code];
    root.insertBefore = function insertBefore(child, reference) {
        child.parentNode = this;
        child.parentElement = this;
        this.children.splice(this.children.indexOf(reference), 0, child);
    };

    assert.equal(decorateAssistantCodeBlocks(root, { surface: 'acm' }), 1);
    assert.equal(decorateAssistantCodeBlocks(root, { surface: 'acm' }), 0);
    const block = root.children[0];
    assert.equal(block.className, 'ai-code-block');
    assert.equal(block.dataset.aiCodeLanguage, 'java');
    assert.equal(block.children[1], pre);
    const actions = block.children[0].children[1].children;
    assert.equal(actions[0].dataset.aiCodeAction, 'copy');
    assert.equal(actions[0].textContent, '复制');
    assert.equal(actions[1].dataset.aiCodeAction, 'apply');
    assert.equal(actions[1].textContent, '写入编辑器');
    assert.equal(actions[1].disabled, false);
});

test('streaming responses pin the viewport to the start instead of chasing new tokens', () => {
    assert.match(assistantSource, /scrollMessageToStart\(assistantMessage\)/);
    assert.match(assistantSource, /addMessage\('assistant', '', \{ loading: true, scroll: false \}\)/);

    const renderResponseBody = assistantSource.match(/const renderResponse = \(\) => \{([\s\S]*?)\n        \};/i)?.[1] || '';
    assert.doesNotMatch(renderResponseBody, /scrollToBottom/);
    assert.doesNotMatch(assistantSource, /this\.discardCurrentResponse = false;\n\s*this\.scrollToBottom\(\);/);
});

test('scrollMessageToStart aligns the new answer with a small reading offset', () => {
    const assistant = Object.create(AIAssistant.prototype);
    const scheduled = [];
    assistant.messagesEl = { scrollTop: 0 };
    const message = { offsetTop: 240 };

    withBrowserGlobals({
        window: { requestAnimationFrame: (callback) => scheduled.push(callback) },
    }, () => {
        assistant.scrollMessageToStart(message);
        assert.equal(assistant.messagesEl.scrollTop, 0);
        scheduled[0]();
        assert.equal(assistant.messagesEl.scrollTop, 228);
    });
});

test('history applies a hard limit even when the latest message is oversized', () => {
    const result = boundedHistory([
        { role: 'assistant', content: 'old' },
        { role: 'user', content: 'x'.repeat(100000) },
    ]);
    assert.equal(result.length, 1);
    assert.ok(result[0].content.length <= 60000);
});

test('stream parser preserves split UTF-8 and cancels after the done event', async () => {
    const originalFetch = globalThis.fetch;
    const encoder = new TextEncoder();
    let cancelled = false;
    const event = encoder.encode('data: {"choices":[{"delta":{"content":"你好"}}]}\n');
    const splitAt = event.indexOf(0xe5) + 1;
    const done = encoder.encode('data: [DONE]\n');
    globalThis.fetch = async () => ({
        ok: true,
        body: new ReadableStream({
            start(controller) {
                controller.enqueue(event.slice(0, splitAt));
                controller.enqueue(event.slice(splitAt));
                controller.enqueue(done);
            },
            cancel() { cancelled = true; },
        }),
    });

    try {
        const chunks = [];
        for await (const chunk of streamChatCompletion([], {
            baseUrl: 'https://example.test/v1',
            apiKey: 'key',
            model: 'model',
        })) chunks.push(chunk);
        assert.deepEqual(chunks, ['你好']);
        assert.equal(cancelled, true);
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test('stream parser reads a final SSE event without a trailing newline', async () => {
    const originalFetch = globalThis.fetch;
    const encoder = new TextEncoder();
    globalThis.fetch = async () => ({
        ok: true,
        body: new ReadableStream({
            start(controller) {
                controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":"tail"}}]}'));
                controller.close();
            },
        }),
    });

    try {
        const chunks = [];
        for await (const chunk of streamChatCompletion([], {
            baseUrl: 'https://example.test/v1',
            apiKey: 'key',
            model: 'model',
        })) chunks.push(chunk);
        assert.deepEqual(chunks, ['tail']);
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test('an unsaved custom API config remains active for the current page session', () => {
    const custom = {
        baseUrl: 'https://example.test/v1',
        apiKey: 'custom-key',
        model: 'custom-model',
    };
    const localStorage = {
        setItem() { throw new Error('storage disabled'); },
        getItem() { return null; },
    };

    withBrowserGlobals({ localStorage }, () => {
        assert.equal(saveAIConfig(custom), false);
        assert.deepEqual(loadAIConfig(), custom);
    });
});
