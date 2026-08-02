/* global cheerpjInit, cheerpjRunLibrary */

const CHEERPJ_LOADER_URL = 'https://cjrtnc.leaningtech.com/4.3/loader.js';
const RUNNER_JAR_FILE = 'assets/vendor/zero2leetcode-java-runner-20260803.jar';
const MAX_OUTPUT_BYTES = 64 * 1024;

let runnerClass = null;
let initializationPromise = null;

function sendStatus(message) {
    self.postMessage({ type: 'status', message });
}

async function initialize() {
    if (runnerClass) return runnerClass;
    if (initializationPromise) return initializationPromise;

    initializationPromise = (async () => {
        sendStatus('正在加载 Java 17...');
        importScripts(CHEERPJ_LOADER_URL);

        const appBaseUrl = new URL('../../', self.location.href);
        await cheerpjInit({
            version: 17,
            status: 'none',
            overrideDocumentBase: appBaseUrl.href,
            execCallback() {
                throw new Error('Java 外部进程调用已禁用。');
            }
        });

        sendStatus('正在加载 Java 编译器...');
        const runnerUrl = new URL(RUNNER_JAR_FILE, appBaseUrl);
        const runnerJarPath = `/app${runnerUrl.pathname}`;
        const library = await cheerpjRunLibrary(runnerJarPath);
        runnerClass = await library.top.onefly.zero2leetcode.runner.BrowserJavaRunner;
        const warmupResult = await runnerClass.warmup();
        const warmupText = typeof warmupResult === 'string'
            ? warmupResult
            : await warmupResult.toString();
        if (warmupText !== 'ok') {
            throw new Error(`Java 编译器初始化失败：${warmupText}`);
        }
        return runnerClass;
    })();

    try {
        return await initializationPromise;
    } finally {
        initializationPromise = null;
    }
}

async function execute(request) {
    const runner = await initialize();
    const rawResult = await runner.run(request.code, request.stdin, MAX_OUTPUT_BYTES);
    const resultText = typeof rawResult === 'string'
        ? rawResult
        : await rawResult.toString();
    return JSON.parse(resultText);
}

self.addEventListener('message', async (event) => {
    const request = event.data || {};
    if (request.type !== 'execute') return;

    try {
        const result = await execute(request);
        self.postMessage({ type: 'result', id: request.id, result });
    } catch (error) {
        self.postMessage({
            type: 'failure',
            id: request.id,
            message: error && error.message ? error.message : String(error)
        });
    }
});

initialize()
    .then(() => self.postMessage({ type: 'ready' }))
    .catch((error) => {
        self.postMessage({
            type: 'init-error',
            message: error && error.message ? error.message : String(error)
        });
    });
