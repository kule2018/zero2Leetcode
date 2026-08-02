const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const assistantPath = path.join(root, 'assets/js/ai-assistant.js');
const assistantSource = fs.readFileSync(assistantPath, 'utf8');
const {
    AIAssistant,
    QUICK_ACTIONS,
    SYSTEM_PROMPT,
    buildContextMessage,
    collectAssistantContext,
    loadAIConfig,
    saveAIConfig,
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
