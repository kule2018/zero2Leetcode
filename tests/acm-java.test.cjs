const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/js/acm-playground.js'), 'utf8');

class FakeTimers {
    constructor() {
        this.nextId = 1;
        this.tasks = new Map();
    }

    setTimeout(callback, delay = 0) {
        const id = this.nextId++;
        this.tasks.set(id, { callback, delay: Number(delay) });
        return id;
    }

    clearTimeout(id) {
        this.tasks.delete(id);
    }

    runByDelay(delay) {
        const match = Array.from(this.tasks.entries())
            .find(([, task]) => task.delay === delay);
        assert.ok(match, `Expected a pending ${delay}ms timer`);
        const [id, task] = match;
        this.tasks.delete(id);
        task.callback();
    }
}

function createContext(search = '?language=java') {
    const storage = new Map();
    const timers = new FakeTimers();
    const workers = [];
    const timeoutSelect = {
        value: '10000',
        options: ['10000', '30000', '60000', '300000', '0'].map((value) => ({ value }))
    };
    const controls = {
        'timeout-select': timeoutSelect,
        'run-btn': { disabled: false },
        'debug-btn': { disabled: false, title: '' },
        'language-select': { disabled: false },
        'runtime-status': { textContent: '', className: '' }
    };

    class FakeWorker {
        constructor(url) {
            this.url = url;
            this.messages = [];
            this.terminateCount = 0;
            workers.push(this);
        }

        postMessage(message) {
            this.messages.push(message);
        }

        terminate() {
            this.terminateCount += 1;
        }

        emitMessage(data) {
            assert.equal(typeof this.onmessage, 'function');
            this.onmessage({ data });
        }

        emitError(message) {
            assert.equal(typeof this.onerror, 'function');
            let prevented = false;
            this.onerror({
                message,
                preventDefault() {
                    prevented = true;
                }
            });
            this.errorWasPrevented = prevented;
        }
    }

    const context = {
        AbortController,
        TextDecoder,
        TextEncoder,
        URLSearchParams,
        Worker: FakeWorker,
        atob,
        btoa,
        clearTimeout: timers.clearTimeout.bind(timers),
        console,
        document: {
            addEventListener() {},
            createElement() {
                return {};
            },
            getElementById(id) {
                return controls[id] || null;
            }
        },
        fetch: async () => {
            throw new Error('Unexpected network request');
        },
        localStorage: {
            getItem(key) {
                return storage.has(key) ? storage.get(key) : null;
            },
            removeItem(key) {
                storage.delete(key);
            },
            setItem(key, value) {
                storage.set(key, String(value));
            }
        },
        performance: { now: () => 0 },
        setTimeout: timers.setTimeout.bind(timers),
        testControls: controls,
        testTimers: timers,
        testWorkers: workers,
        window: {
            location: { search }
        }
    };
    context.window.window = context.window;
    vm.createContext(context);
    vm.runInContext(source, context, { filename: 'acm-playground.js' });
    return context;
}

function evaluate(context, expression) {
    return vm.runInContext(expression, context);
}

async function startJavaExecution(context, code = 'public class Main {}', stdin = '') {
    const execution = evaluate(
        context,
        `executeJava(${JSON.stringify(code)}, ${JSON.stringify(stdin)})`
    );
    const worker = context.testWorkers[0];
    assert.ok(worker, 'executeJava should create a browser Worker');
    worker.emitMessage({ type: 'ready' });
    await new Promise((resolve) => setImmediate(resolve));

    assert.equal(worker.messages.length, 1);
    const request = worker.messages[0];
    assert.equal(request.type, 'execute');
    assert.equal(request.code, code);
    assert.equal(request.stdin, stdin);
    return { execution, request, worker };
}

test('Java language uses the CheerpJ browser executor', () => {
    const context = createContext();
    const config = JSON.parse(evaluate(context, `JSON.stringify({
        currentLanguage,
        label: LANGUAGES.java.label,
        mode: LANGUAGES.java.mode,
        extension: LANGUAGES.java.fileExtension,
        mimeType: LANGUAGES.java.mimeType,
        supportsDebug: LANGUAGES.java.supportsDebug,
        executionMode: LANGUAGES.java.executionMode,
        runtime: LANGUAGES.java.runtime,
        maxTimeoutMs: LANGUAGES.java.maxTimeoutMs,
        executorMatches: LANGUAGES.java.executor === executeJava,
        templates: Object.keys(LANGUAGES.java.templates)
    })`));

    assert.deepEqual(config, {
        currentLanguage: 'java',
        label: 'Java 17',
        mode: 'text/x-java',
        extension: 'java',
        mimeType: 'text/x-java;charset=utf-8',
        supportsDebug: false,
        executionMode: 'browser',
        runtime: 'cheerpj',
        maxTimeoutMs: 10000,
        executorMatches: true,
        templates: ['single', 'two', 'array', 'matrix', 'multi', 'string', 'graph']
    });
});

test('Java participates in source saving and workspace imports', () => {
    const context = createContext();
    const result = JSON.parse(evaluate(context, `JSON.stringify({
        sourceName: lastSourceNames.java,
        validationError: validateWorkspace({
            format: WORKSPACE_FORMAT,
            version: WORKSPACE_VERSION,
            language: 'java',
            code: 'public class Main {}',
            input: '',
            expected: ''
        })
    })`));

    assert.deepEqual(result, {
        sourceName: 'Main',
        validationError: ''
    });
});

test('workspace imports activate the imported language runtime', () => {
    const context = createContext('?language=java');
    const result = JSON.parse(evaluate(context, `
        globalThis.__activatedLanguage = null;
        saveCurrentDraft = () => true;
        persistImportedWorkspace = () => true;
        setEditorValue = () => {};
        restoreTimeoutSelection = () => {};
        clearBreakpoints = () => {};
        resetExecutionUi = () => {};
        updateLanguageUi = () => {};
        showFileToast = () => {};
        activateCurrentRuntime = () => { globalThis.__activatedLanguage = currentLanguage; };
        window.acmEditor = { focus() {} };
        document.getElementById = () => ({});
        JSON.stringify({
            applied: applyImportedWorkspace({
                language: 'python',
                code: 'print(1)',
                input: '',
                expected: '1'
            }),
            currentLanguage,
            activatedLanguage: globalThis.__activatedLanguage
        })
    `));

    assert.deepEqual(result, {
        applied: true,
        currentLanguage: 'python',
        activatedLanguage: 'python'
    });
});

test('Java templates keep escaped newline character literals', () => {
    const context = createContext();
    const templates = JSON.parse(evaluate(
        context,
        'JSON.stringify([JAVA_TEMPLATES.matrix.code, JAVA_TEMPLATES.multi.code, JAVA_TEMPLATES.graph.code])'
    ));

    templates.forEach((code) => {
        assert.match(code, /append\('\\n'\)/);
        assert.doesNotMatch(code, /append\('\r?\n'\)/);
        assert.match(code, /public class Main/);
    });
});

test('Java code, stdin, and expected output use isolated storage keys', () => {
    const context = createContext();
    const stored = JSON.parse(evaluate(context, `
        localStorage.setItem(getCodeStorageKey('java'), 'java-code');
        localStorage.setItem(getInputStorageKey('java'), 'java-input');
        localStorage.setItem(getExpectedStorageKey('java'), 'java-output');
        localStorage.setItem(getTimeoutStorageKey('java'), '10000');
        JSON.stringify({
            code: getSavedCode('java'),
            input: getSavedInput('java'),
            expected: getSavedExpected('java'),
            timeout: getSavedTimeout('java'),
            pythonCode: getSavedCode('python')
        })
    `));

    assert.deepEqual(stored, {
        code: 'java-code',
        input: 'java-input',
        expected: 'java-output',
        timeout: '10000',
        pythonCode: null
    });
});

test('AI generated code writes through the ACM adapter and persists immediately', () => {
    const context = createContext('?language=java');
    const result = JSON.parse(evaluate(context, `
        globalThis.__editorValue = 'public class Main { /* old */ }';
        globalThis.__draftSaved = false;
        window.acmEditor = {
            getValue() { return globalThis.__editorValue; },
            firstLine() { return 0; },
            lastLine() { return 0; },
            getLine() { return globalThis.__editorValue; },
            replaceRange(value) { globalThis.__editorValue = value; },
            operation(callback) { callback(); },
            refresh() {},
        };
        saveCurrentDraft = () => { globalThis.__draftSaved = true; return true; };
        clearBreakpoints = () => {};
        resetExecutionUi = () => {};
        document.getElementById = () => ({ value: '' });
        const applied = window.acmApplyGeneratedCode({
            language: 'java',
            code: 'public class Main { public static void main(String[] args) {} }'
        });
        JSON.stringify({
            applied,
            value: globalThis.__editorValue,
            stored: localStorage.getItem(getCodeStorageKey('java')),
            draftSaved: globalThis.__draftSaved
        });
    `));

    assert.equal(result.applied.ok, true);
    assert.equal(result.applied.language, 'java');
    assert.match(result.value, /public static void main/);
    assert.equal(result.stored, result.value);
    assert.equal(result.draftSaved, true);
});

test('AI generated cross-language writes preserve the source draft before switching', () => {
    const context = createContext('?language=python');
    const result = JSON.parse(evaluate(context, `
        globalThis.__editorValue = 'print("source draft")';
        globalThis.__switchedTo = '';
        window.acmEditor = {
            getValue() { return globalThis.__editorValue; },
            firstLine() { return 0; },
            lastLine() { return 0; },
            getLine() { return globalThis.__editorValue; },
            replaceRange(value) { globalThis.__editorValue = value; },
            operation(callback) { callback(); },
            clearHistory() {},
            refresh() {},
        };
        switchLanguage = (nextLanguage) => {
            localStorage.setItem(getCodeStorageKey(currentLanguage), globalThis.__editorValue);
            globalThis.__editorValue = 'public class Main { /* prior Java draft */ }';
            currentLanguage = nextLanguage;
            globalThis.__switchedTo = nextLanguage;
        };
        clearBreakpoints = () => {};
        resetExecutionUi = () => {};
        document.getElementById = () => ({ value: '' });
        const applied = window.acmApplyGeneratedCode({
            language: 'java',
            code: 'public class Main { public static void main(String[] args) {} }'
        });
        JSON.stringify({
            applied,
            currentLanguage,
            switchedTo: globalThis.__switchedTo,
            pythonDraft: localStorage.getItem(getCodeStorageKey('python')),
            javaDraft: localStorage.getItem(getCodeStorageKey('java'))
        });
    `));

    assert.equal(result.applied.ok, true);
    assert.equal(result.currentLanguage, 'java');
    assert.equal(result.switchedTo, 'java');
    assert.equal(result.pythonDraft, 'print("source draft")');
    assert.match(result.javaDraft, /public static void main/);
});

test('ACM generated code adapter rejects unknown languages without changing the editor', () => {
    const context = createContext('?language=java');
    const result = JSON.parse(evaluate(context, `
        globalThis.__editorValue = 'keep me';
        window.acmEditor = { getValue() { return globalThis.__editorValue; } };
        const applied = window.acmApplyGeneratedCode({ language: 'javascript', code: 'alert(1)' });
        JSON.stringify({ applied, value: globalThis.__editorValue });
    `));

    assert.equal(result.applied.ok, false);
    assert.equal(result.value, 'keep me');
});

test('Java is enabled in the selector and CodeMirror loads Java syntax mode', () => {
    const html = fs.readFileSync(path.join(root, 'acm-playground.html'), 'utf8');
    const option = html.match(/<option\s+value="java"([^>]*)>Java 17<\/option>/);

    assert.ok(option, 'Expected a Java 17 language option');
    assert.doesNotMatch(option[1], /\bdisabled\b/);
    assert.match(html, /mode\/clike\/clike\.min\.js/);
});

test('ACM navigation prioritizes written and interview question archives', () => {
    const html = fs.readFileSync(path.join(root, 'acm-playground.html'), 'utf8');
    const nav = html.match(/<ul class="nav-menu">([\s\S]*?)<\/ul>/)?.[1] || '';

    assert.match(nav, /href="04_real_interviews\/index\.html"[^>]*>笔试真题<\/a>/);
    assert.match(nav, /href="05_interview\/"[^>]*>面试真题<\/a>/);
    assert.doesNotMatch(nav, />学习路线<\/a>/);
    assert.doesNotMatch(nav, />知识模块<\/a>/);
});

test('browser worker pins CheerpJ 4.3 and initializes Java 17', () => {
    const workerSource = fs.readFileSync(path.join(root, 'assets/js/java-runner-worker.js'), 'utf8');

    assert.match(workerSource, /cjrtnc\.leaningtech\.com\/4\.3\/loader\.js/);
    assert.match(workerSource, /cheerpjInit\(\{[\s\S]*version:\s*17/);
    assert.match(workerSource, /cheerpjRunLibrary\(runnerJarPath\)/);
    assert.match(workerSource, /self\.addEventListener\('message'/);

    const deployedWorker = new URL(
        'https://onefly.top/zero2Leetcode/assets/js/java-runner-worker.js'
    );
    const appBaseUrl = new URL('../../', deployedWorker);
    const runnerUrl = new URL(
        'assets/vendor/zero2leetcode-java-runner-20260803.jar',
        appBaseUrl
    );
    assert.equal(appBaseUrl.href, 'https://onefly.top/zero2Leetcode/');
    assert.equal(
        `/app${runnerUrl.pathname}`,
        '/app/zero2Leetcode/assets/vendor/zero2leetcode-java-runner-20260803.jar'
    );
});

test('Fake Worker returns a successful Java execution result', async () => {
    const code = 'public class Main { public static void main(String[] args) {} }';
    const { execution, request, worker } = await startJavaExecution(createContext(), code, '3 5\n');

    worker.emitMessage({
        type: 'result',
        id: request.id,
        result: { stdout: '8\n', error: null, phase: null }
    });
    const result = await execution;

    assert.equal(result.stdout, '8\n');
    assert.equal(result.error, null);
    assert.equal(result.phase, null);
    assert.equal(worker.terminateCount, 0);
});

test('Fake Worker preserves Java compilation errors', async () => {
    const { execution, request, worker } = await startJavaExecution(createContext());
    worker.emitMessage({
        type: 'result',
        id: request.id,
        result: {
            stdout: '',
            error: "Main.java:1: error: ';' expected",
            phase: 'compile'
        }
    });
    const result = await execution;

    assert.equal(result.phase, 'compile');
    assert.match(result.error, /Main\.java:1/);
    assert.match(result.error, /expected/);
});

test('Worker errors fail the active Java execution and terminate the runtime', async () => {
    const context = createContext();
    const { execution, worker } = await startJavaExecution(context);
    worker.emitError('worker crashed');
    const result = await execution;

    assert.equal(result.phase, 'service');
    assert.match(result.error, /worker crashed/);
    assert.equal(worker.errorWasPrevented, true);
    assert.equal(worker.terminateCount, 1);
    assert.equal(evaluate(context, 'javaRuntimeState'), 'error');
});

test('Java timeout restarts the Worker and ignores stale Worker messages', async () => {
    const context = createContext();
    const { execution, worker } = await startJavaExecution(context);
    context.testTimers.runByDelay(10000);
    const result = await execution;

    assert.equal(result.phase, 'timeout');
    assert.match(result.error, /10 秒/);
    assert.match(result.error, /终止浏览器 Worker/);
    assert.equal(worker.terminateCount, 1);

    context.testTimers.runByDelay(0);
    const replacementWorker = context.testWorkers[1];
    assert.ok(replacementWorker, 'Expected Java runtime to restart after timeout');

    worker.emitMessage({ type: 'init-error', message: 'stale failure' });
    assert.equal(replacementWorker.terminateCount, 0);
    assert.equal(evaluate(context, 'javaRuntimeState'), 'loading');

    replacementWorker.emitMessage({ type: 'ready' });
    assert.equal(evaluate(context, 'javaRuntimeState'), 'ready');
});

test('Java source size limit rejects the request before creating a Worker', async () => {
    const context = createContext();
    const maximum = evaluate(context, 'JAVA_MAX_CODE_BYTES');
    const result = await evaluate(context, `executeJava('a'.repeat(${maximum + 1}), '')`);

    assert.equal(result.phase, 'request');
    assert.match(result.error, /48 KB/);
    assert.equal(context.testWorkers.length, 0);
});

test('Java stdin size limit rejects the request before creating a Worker', async () => {
    const context = createContext();
    const maximum = evaluate(context, 'JAVA_MAX_STDIN_BYTES');
    const result = await evaluate(context, `executeJava('public class Main {}', 'a'.repeat(${maximum + 1}))`);

    assert.equal(result.phase, 'request');
    assert.match(result.error, /16 KB/);
    assert.equal(context.testWorkers.length, 0);
});

test('article bridge recognizes Java code fences', () => {
    const bridge = fs.readFileSync(path.join(root, 'assets/js/acm-bridge.js'), 'utf8');
    assert.match(bridge, /language-java/);
    assert.match(bridge, /language = 'java'/);
});
