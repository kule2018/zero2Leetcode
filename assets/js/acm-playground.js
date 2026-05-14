// =============================================
// Zero2Leetcode ACM Playground - ACM 模拟 IDE
// =============================================

// ---------- ACM 输入模板 ----------
const ACM_TEMPLATES = {
    single: {
        code: `n = int(input())
print(n)
`,
        input: '42'
    },
    two: {
        code: `n, m = map(int, input().split())
print(n + m)
`,
        input: '3 5'
    },
    array: {
        code: `n = int(input())
arr = list(map(int, input().split()))
arr.sort()
print(' '.join(map(str, arr)))
`,
        input: '5\n3 1 4 1 5'
    },
    matrix: {
        code: `n, m = map(int, input().split())
matrix = []
for i in range(n):
    row = list(map(int, input().split()))
    matrix.append(row)

# 打印矩阵
for row in matrix:
    print(' '.join(map(str, row)))
`,
        input: '3 3\n1 2 3\n4 5 6\n7 8 9'
    },
    multi: {
        code: `T = int(input())
for _ in range(T):
    n = int(input())
    arr = list(map(int, input().split()))
    print(sum(arr))
`,
        input: '2\n3\n1 2 3\n4\n1 2 3 4'
    },
    string: {
        code: `s = input()
print(s[::-1])
`,
        input: 'hello'
    },
    graph: {
        code: `n, m = map(int, input().split())
graph = [[] for _ in range(n + 1)]
for _ in range(m):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)

for i in range(1, n + 1):
    print(f"Node {i}: {sorted(graph[i])}")
`,
        input: '4 4\n1 2\n1 3\n2 4\n3 4'
    }
};

const DEFAULT_CODE = `# ACM 模式：使用 input() 读取输入，print() 输出结果
# 在右侧「输入」区粘贴测试数据，点击运行即可
#
# 常用输入技巧:
#   n = int(input())                    # 读取单个整数
#   a, b = map(int, input().split())    # 读取一行多个整数
#   arr = list(map(int, input().split()))  # 读取数组
#   s = input()                         # 读取字符串

n = int(input())
arr = list(map(int, input().split()))

arr.sort()
print(' '.join(map(str, arr)))
`;

const DEFAULT_INPUT = `5
3 1 4 1 5`;

// ---------- 全局状态 ----------
let pyodide = null;
let debugFrames = [];
let debugIndex = -1;
let debugLineWidget = null; // CodeMirror line class marker
const breakpoints = new Set(); // line numbers (0-based)
const STORAGE_KEY = 'z2l-acm-code';
const STORAGE_INPUT_KEY = 'z2l-acm-input';

// ---------- CodeMirror 编辑器初始化 ----------
function initEditor() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: 'python',
        theme: isDark ? 'material-darker' : 'eclipse',
        lineNumbers: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        matchBrackets: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
        gutters: ['CodeMirror-linenumbers', 'breakpoints'],
        extraKeys: {
            'Tab': (cm) => cm.execCommand('indentMore'),
            'Shift-Tab': (cm) => cm.execCommand('indentLess'),
            'Ctrl-Enter': () => runCode(),
            'Cmd-Enter': () => runCode(),
            'Ctrl-/': 'toggleComment',
            'Cmd-/': 'toggleComment'
        }
    });

    // 断点点击
    editor.on('gutterClick', (cm, line, gutter) => {
        if (gutter === 'CodeMirror-linenumbers' || gutter === 'breakpoints') {
            toggleBreakpoint(cm, line);
        }
    });

    // 自动保存
    let saveTimer = null;
    editor.on('change', () => {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, editor.getValue());
        }, 500);
    });

    // 恢复代码
    const saved = localStorage.getItem(STORAGE_KEY);
    editor.setValue(saved || DEFAULT_CODE);

    window.acmEditor = editor;
    return editor;
}

function toggleBreakpoint(cm, line) {
    const info = cm.lineInfo(line);
    if (info.gutterMarkers && info.gutterMarkers.breakpoints) {
        cm.setGutterMarker(line, 'breakpoints', null);
        breakpoints.delete(line);
    } else {
        const marker = document.createElement('div');
        marker.className = 'acm-breakpoint';
        cm.setGutterMarker(line, 'breakpoints', marker);
        breakpoints.add(line);
    }
}

// ---------- Pyodide 初始化 ----------
async function initPyodide() {
    const status = document.getElementById('pyodide-status');
    const runBtn = document.getElementById('run-btn');
    const debugBtn = document.getElementById('debug-btn');
    try {
        pyodide = await loadPyodide();
        status.textContent = 'Pyodide 就绪';
        status.classList.remove('loading');
        status.classList.add('ready');
        runBtn.disabled = false;
        debugBtn.disabled = false;
    } catch (e) {
        status.textContent = '加载失败';
        status.classList.remove('loading');
        status.classList.add('error');
        console.error('Pyodide load error:', e);
    }
}

// ---------- 代码运行 ----------
let pyodideCorrupted = false; // 标记 Pyodide 运行时是否损坏（如超时后）

function getTimeoutMs() {
    const sel = document.getElementById('timeout-select');
    return sel ? parseInt(sel.value, 10) : 10000;
}

async function runCode() {
    if (!pyodide || pyodideCorrupted) {
        if (pyodideCorrupted) {
            await reinitPyodide();
        }
        if (!pyodide) return;
    }

    const runBtn = document.getElementById('run-btn');
    const debugBtn = document.getElementById('debug-btn');
    const stdoutArea = document.getElementById('stdout-area');
    const runStatus = document.getElementById('run-status');
    const statusInfo = document.getElementById('status-info');
    const statusTime = document.getElementById('status-time');

    runBtn.disabled = true;
    debugBtn.disabled = true;
    runStatus.textContent = '运行中...';
    runStatus.className = 'run-status running';
    statusInfo.textContent = '运行中...';
    stdoutArea.textContent = '';
    stdoutArea.classList.remove('has-error', 'placeholder-text');

    const userCode = window.acmEditor.getValue();
    const stdinText = document.getElementById('stdin-area').value;

    const t0 = performance.now();

    try {
        const result = await executePython(userCode, stdinText);
        const elapsed = (performance.now() - t0).toFixed(1);

        if (result.error) {
            const parts = [result.stdout, result.error].filter(Boolean);
            stdoutArea.textContent = parts.join('\n');
            stdoutArea.classList.add('has-error');
            runStatus.textContent = '运行错误';
            runStatus.className = 'run-status error';
            statusInfo.textContent = classifyError(result.error);
        } else {
            stdoutArea.textContent = result.stdout || '(无输出)';
            if (!result.stdout) stdoutArea.classList.add('placeholder-text');
            runStatus.textContent = `${elapsed} ms`;
            runStatus.className = 'run-status success';
            statusInfo.textContent = result.warning ? '运行完成（有警告）' : '运行完成';
        }
        statusTime.textContent = `耗时 ${elapsed} ms`;

        // 自动对比
        compareOutput();
    } catch (e) {
        stdoutArea.textContent = String(e);
        stdoutArea.classList.add('has-error');
        runStatus.textContent = '异常';
        runStatus.className = 'run-status error';
        statusInfo.textContent = '运行异常';
    }

    runBtn.disabled = false;
    debugBtn.disabled = false;
}

async function reinitPyodide() {
    const status = document.getElementById('pyodide-status');
    status.textContent = '重新初始化...';
    status.classList.remove('ready', 'error');
    status.classList.add('loading');
    pyodideCorrupted = false;
    try {
        pyodide = await loadPyodide();
        status.textContent = 'Pyodide 就绪';
        status.classList.remove('loading');
        status.classList.add('ready');
    } catch (e) {
        status.textContent = '加载失败';
        status.classList.remove('loading');
        status.classList.add('error');
        pyodide = null;
    }
}

async function executePython(code, stdinText) {
    const stdinLines = stdinText.split('\n');
    let stdinIndex = 0;

    // 配置 stdin
    pyodide.setStdin({
        stdin: () => {
            if (stdinIndex < stdinLines.length) {
                return stdinLines[stdinIndex++];
            }
            return undefined; // EOF
        }
    });

    // 自动检测并加载第三方包（numpy, scipy 等）
    try {
        await pyodide.loadPackagesFromImports(code);
    } catch (_) {}

    // 根据超时设置决定是否注入循环保护
    const timeoutMs = getTimeoutMs();
    const guardedCode = timeoutMs > 0 ? addLoopGuard(code) : code;

    // 捕获 stdout 和 stderr
    const captureCode = `
import sys, io
__stdout_capture = io.StringIO()
__stderr_capture = io.StringIO()
sys.stdout = __stdout_capture
sys.stderr = __stderr_capture
`;

    const restoreCode = `
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
__out = __stdout_capture.getvalue()
__err = __stderr_capture.getvalue()
`;

    // 使用 Promise.race 添加超时保护（设为 0 表示无限制）
    const execPromise = pyodide.runPythonAsync(guardedCode);
    const raceTarget = timeoutMs > 0
        ? Promise.race([
            execPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('__TIMEOUT__')), timeoutMs))
          ])
        : execPromise;

    try {
        await pyodide.runPythonAsync(captureCode);
        try {
            await raceTarget;
        } catch (e) {
            const errMsg = String(e.message || e);
            if (errMsg === '__TIMEOUT__' || errMsg.includes('__LoopTimeout__')) {
                // 超时：Pyodide 可能仍在运行，标记为损坏
                pyodideCorrupted = true;
                const stdout = tryGetStdout();
                const secs = (timeoutMs / 1000).toFixed(0);
                return {
                    stdout,
                    error: `⏱ 执行超时（超过 ${secs} 秒）\n\n可能原因：\n` +
                           '  1. while 循环条件永远为真（无限循环）\n' +
                           '  2. 递归没有正确的终止条件\n' +
                           '  3. 输入数据量过大导致算法超时\n\n' +
                           '提示：如果是 ML/DL 训练代码，可将超时设为「5min」或「无限制」。\n' +
                           '运行时已自动重置，可直接修改代码后重新运行。'
                };
            }
            if (errMsg.includes('__LoopGuardExceeded__')) {
                try { await pyodide.runPythonAsync(restoreCode); } catch (_) {}
                const stdout = pyodide.globals.get('__out') || '';
                return {
                    stdout,
                    error: '⏱ 循环次数超限（超过 10,000,000 次迭代）\n\n可能原因：\n' +
                           '  1. while 循环条件永远为真（无限循环）\n' +
                           '  2. 循环变量未正确更新\n\n' +
                           '提示：检查循环条件，确保循环变量在每次迭代后向终止条件靠近。'
                };
            }
            // 普通 Python 运行时错误 — 恢复 stdout
            try { await pyodide.runPythonAsync(restoreCode); } catch (_) {}
            const stdout = pyodide.globals.get('__out') || '';
            return { stdout, error: extractPythonError(e) };
        }
        await pyodide.runPythonAsync(restoreCode);
        const stdout = pyodide.globals.get('__out') || '';
        const stderr = pyodide.globals.get('__err') || '';
        return { stdout, warning: stderr || null, error: null };
    } catch (e) {
        const errMsg = String(e.message || e);
        if (errMsg === '__TIMEOUT__') {
            pyodideCorrupted = true;
            const secs = (timeoutMs / 1000).toFixed(0);
            return {
                stdout: '',
                error: `⏱ 执行超时（超过 ${secs} 秒）\n\n` +
                       '提示：如果是 ML/DL 训练代码，可将超时设为「5min」或「无限制」。\n' +
                       '运行时已自动重置，可直接修改代码后重新运行。'
            };
        }
        // 最终兜底：恢复 stdout
        try { await pyodide.runPythonAsync(`import sys; sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__`); } catch (_) {}
        return { stdout: '', error: extractPythonError(e) };
    }
}

function tryGetStdout() {
    try {
        return pyodide.globals.get('__out') || '';
    } catch (_) {
        try {
            return pyodide.globals.get('__stdout_capture')?.getvalue() || '';
        } catch (_) {}
    }
    return '';
}

// 在 while 循环中注入迭代计数器，防止无限循环锁死浏览器
function addLoopGuard(code) {
    const MAX_ITERATIONS = 10000000;
    const lines = code.split('\n');
    const result = [`__loop_guard_counter = 0`];
    for (let i = 0; i < lines.length; i++) {
        result.push(lines[i]);
        const stripped = lines[i].trimStart();
        if (/^while\s+/.test(stripped) && stripped.endsWith(':')) {
            const baseIndent = lines[i].length - lines[i].trimStart().length;
            const bodyIndent = ' '.repeat(baseIndent + 4);
            result.push(bodyIndent + '__loop_guard_counter += 1');
            result.push(bodyIndent + `if __loop_guard_counter > ${MAX_ITERATIONS}: raise RuntimeError("__LoopGuardExceeded__")`);
        }
    }
    return result.join('\n');
}

function extractPythonError(err) {
    const msg = String(err.message || err);
    // 移除 Pyodide 包装信息，只保留 Python traceback
    const idx = msg.indexOf('Traceback');
    if (idx >= 0) {
        const traceback = msg.slice(idx);
        // 在 traceback 末尾追加友好提示
        const hint = getErrorHint(traceback);
        return hint ? traceback + '\n\n💡 ' + hint : traceback;
    }
    // 取最后几行有意义的信息
    const lines = msg.split('\n').filter(l => l.trim());
    const shortMsg = lines.slice(-3).join('\n') || msg;
    const hint = getErrorHint(shortMsg);
    return hint ? shortMsg + '\n\n💡 ' + hint : shortMsg;
}

function getErrorHint(errorText) {
    if (/ValueError.*invalid literal/i.test(errorText)) {
        return '输入格式错误：尝试将非数字字符串转为整数。请检查输入数据格式是否与 input() 读取方式匹配。';
    }
    if (/EOFError|StopIteration/i.test(errorText)) {
        return '输入不足：代码尝试读取更多输入，但输入已用完。请检查「输入」区的数据行数是否足够。';
    }
    if (/IndexError/i.test(errorText)) {
        return '下标越界：访问了列表/数组中不存在的索引。检查数组长度和循环边界。';
    }
    if (/TypeError.*argument/i.test(errorText) || /TypeError.*expected/i.test(errorText)) {
        return '参数类型错误：函数接收到了不匹配的参数类型。检查变量类型是否正确。';
    }
    if (/RecursionError|maximum recursion/i.test(errorText)) {
        return '递归深度超限：递归没有正确终止，或数据规模过大。考虑加 sys.setrecursionlimit() 或改用迭代。';
    }
    if (/NameError/i.test(errorText)) {
        return '变量未定义：使用了未声明或拼写错误的变量名。';
    }
    if (/SyntaxError/i.test(errorText)) {
        return '语法错误：代码格式不正确。检查缩进、括号、冒号等是否匹配。';
    }
    if (/KeyError/i.test(errorText)) {
        return '键不存在：字典中没有该 key。考虑使用 dict.get() 或先检查 key 是否存在。';
    }
    if (/ZeroDivisionError/i.test(errorText)) {
        return '除零错误：除数为 0。检查除法运算前是否需要特判。';
    }
    if (/MemoryError/i.test(errorText)) {
        return '内存不足：数据结构占用过多内存。考虑优化算法的空间复杂度。';
    }
    if (/__LoopGuardExceeded__/i.test(errorText)) {
        return '循环次数过多，可能是无限循环。';
    }
    return '';
}

function classifyError(errorText) {
    if (/超时|__TIMEOUT__|__LoopTimeout__/i.test(errorText)) return '执行超时（可能无限循环）';
    if (/LoopGuardExceeded/i.test(errorText)) return '无限循环';
    if (/SyntaxError/i.test(errorText)) return '语法错误';
    if (/ValueError.*invalid literal/i.test(errorText)) return '输入格式错误';
    if (/EOFError|StopIteration/i.test(errorText)) return '输入不足';
    if (/IndexError/i.test(errorText)) return '下标越界';
    if (/TypeError/i.test(errorText)) return '类型错误';
    if (/RecursionError/i.test(errorText)) return '递归超限';
    if (/NameError/i.test(errorText)) return '变量未定义';
    if (/KeyError/i.test(errorText)) return '键不存在';
    if (/ZeroDivisionError/i.test(errorText)) return '除零错误';
    if (/MemoryError/i.test(errorText)) return '内存不足';
    return '运行错误';
}

// ---------- 输出对比 ----------
function compareOutput() {
    const expectedArea = document.getElementById('expected-area');
    const diffResult = document.getElementById('diff-result');
    const expected = expectedArea.value.trim();
    const actual = document.getElementById('stdout-area').textContent.trim();

    if (!expected) {
        diffResult.textContent = '';
        diffResult.className = 'diff-result';
        return;
    }

    if (actual === expected) {
        diffResult.textContent = 'ACCEPTED';
        diffResult.className = 'diff-result match';
    } else {
        diffResult.textContent = 'WRONG ANSWER';
        diffResult.className = 'diff-result mismatch';
    }
}

// ---------- 调试功能 ----------
async function runDebug() {
    if (!pyodide || pyodideCorrupted) {
        if (pyodideCorrupted) {
            await reinitPyodide();
        }
        if (!pyodide) return;
    }

    const debugBtn = document.getElementById('debug-btn');
    const runBtn = document.getElementById('run-btn');
    const debugPanel = document.getElementById('debug-panel');
    const stdoutArea = document.getElementById('stdout-area');
    const runStatus = document.getElementById('run-status');
    const statusInfo = document.getElementById('status-info');

    debugBtn.disabled = true;
    runBtn.disabled = true;
    statusInfo.textContent = '调试录制中...';
    runStatus.textContent = '调试中...';
    runStatus.className = 'run-status running';

    const userCode = window.acmEditor.getValue();
    const stdinText = document.getElementById('stdin-area').value;

    // 配置 stdin
    const stdinLines = stdinText.split('\n');
    let stdinIndex = 0;
    pyodide.setStdin({
        stdin: () => {
            if (stdinIndex < stdinLines.length) {
                return stdinLines[stdinIndex++];
            }
            return undefined;
        }
    });

    // 自动检测并加载第三方包
    try {
        await pyodide.loadPackagesFromImports(userCode);
    } catch (_) {}

    // 计算用户代码行偏移 (trace 包装会在前面插入行)
    const traceSetupLines = buildTraceSetup().split('\n').length;

    const traceCode = buildTraceSetup() + '\n' + userCode + '\n' + buildTraceEnd();

    stdoutArea.textContent = '';
    stdoutArea.classList.remove('has-error', 'placeholder-text');

    const debugTimeoutMs = getTimeoutMs();
    const debugExecPromise = pyodide.runPythonAsync(traceCode);
    const debugRaceTarget = debugTimeoutMs > 0
        ? Promise.race([
            debugExecPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('__TIMEOUT__')), debugTimeoutMs))
          ])
        : debugExecPromise;

    try {
        await debugRaceTarget;
        const framesProxy = pyodide.globals.get('__trace_frames');
        const stdoutVal = pyodide.globals.get('__out') || '';
        const stderrVal = pyodide.globals.get('__err') || '';

        // 将 Python list 转为 JS
        debugFrames = [];
        if (framesProxy && framesProxy.length) {
            for (let i = 0; i < framesProxy.length; i++) {
                const f = framesProxy.get(i);
                const localsProxy = f.get('locals');
                const locals = {};
                const keys = localsProxy.toJs();
                // localsProxy 是 Python dict，转为 JS object
                if (keys instanceof Map) {
                    keys.forEach((v, k) => { locals[k] = String(v); });
                } else if (typeof keys === 'object') {
                    Object.entries(keys).forEach(([k, v]) => { locals[k] = String(v); });
                }
                debugFrames.push({
                    line: f.get('line') - traceSetupLines - 1, // 映射回用户代码行 (0-based for CodeMirror)
                    locals
                });
                f.destroy();
            }
            framesProxy.destroy();
        }

        // 显示输出
        if (stderrVal) {
            stdoutArea.textContent = stdoutVal + '\n' + stderrVal;
            stdoutArea.classList.add('has-error');
        } else {
            stdoutArea.textContent = stdoutVal || '(无输出)';
        }

        // 过滤掉不在用户代码范围内的帧
        const totalLines = userCode.split('\n').length;
        debugFrames = debugFrames.filter(f => f.line >= 0 && f.line < totalLines);

        if (debugFrames.length > 0) {
            debugPanel.style.display = 'flex';
            debugIndex = 0;
            renderDebugFrame();
            statusInfo.textContent = `调试完成 · ${debugFrames.length} 步`;
            runStatus.textContent = `${debugFrames.length} 步`;
            runStatus.className = 'run-status success';
        } else {
            statusInfo.textContent = '无可调试步骤';
            runStatus.textContent = '无步骤';
            runStatus.className = 'run-status error';
        }

        compareOutput();
    } catch (e) {
        const errMsg = String(e.message || e);
        if (errMsg === '__TIMEOUT__') {
            pyodideCorrupted = true;
            stdoutArea.textContent = '⏱ 调试超时（超过 10 秒）\n\n' +
                '可能存在无限循环，请检查 while 循环条件。\n' +
                '运行时已自动重置，可直接修改代码后重新运行。';
            stdoutArea.classList.add('has-error');
            runStatus.textContent = '超时';
            runStatus.className = 'run-status error';
            statusInfo.textContent = '调试超时（可能无限循环）';
        } else {
            stdoutArea.textContent = extractPythonError(e);
            stdoutArea.classList.add('has-error');
            runStatus.textContent = '调试错误';
            runStatus.className = 'run-status error';
            statusInfo.textContent = classifyError(errMsg);
            // 仍然尝试提取已录制的帧
            try {
                const stdoutVal = pyodide.globals.get('__out') || '';
                if (stdoutVal) {
                    stdoutArea.textContent = stdoutVal + '\n' + stdoutArea.textContent;
                }
            } catch (_) {}
        }
    }

    // 恢复 stdout（如果 Pyodide 没有损坏）
    if (!pyodideCorrupted) {
        try {
            await pyodide.runPythonAsync(`import sys; sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__`);
        } catch (_) {}
    }

    debugBtn.disabled = false;
    runBtn.disabled = false;
}

function buildTraceSetup() {
    return `import sys, io, copy
__stdout_capture = io.StringIO()
__stderr_capture = io.StringIO()
sys.stdout = __stdout_capture
sys.stderr = __stderr_capture
__trace_frames = []
__trace_code_name = '<module>'
def __tracer(frame, event, arg):
    if event == 'line' and frame.f_code.co_filename == '<exec>':
        safe_locals = {}
        for k, v in frame.f_locals.items():
            if k.startswith('_'):
                continue
            try:
                r = repr(v)
                if len(r) > 200:
                    r = r[:200] + '...'
                safe_locals[k] = r
            except:
                safe_locals[k] = '<unprintable>'
        __trace_frames.append({'line': frame.f_lineno, 'locals': safe_locals})
    return __tracer
sys.settrace(__tracer)
`;
}

function buildTraceEnd() {
    return `
sys.settrace(None)
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
__out = __stdout_capture.getvalue()
__err = __stderr_capture.getvalue()
`;
}

function renderDebugFrame() {
    if (debugIndex < 0 || debugIndex >= debugFrames.length) return;

    const frame = debugFrames[debugIndex];
    const prevFrame = debugIndex > 0 ? debugFrames[debugIndex - 1] : null;

    // 更新步进信息
    document.getElementById('debug-step-info').textContent =
        `Step ${debugIndex + 1}/${debugFrames.length}`;

    // 高亮当前行
    const cm = window.acmEditor;
    if (debugLineWidget !== null) {
        cm.removeLineClass(debugLineWidget, 'background', 'debug-current-line');
    }
    debugLineWidget = frame.line;
    cm.addLineClass(frame.line, 'background', 'debug-current-line');
    cm.scrollIntoView({ line: frame.line, ch: 0 }, 100);

    // 渲染变量
    const varsEl = document.getElementById('debug-vars');
    const entries = Object.entries(frame.locals);
    if (entries.length === 0) {
        varsEl.innerHTML = '<div class="debug-placeholder">当前行无变量</div>';
        return;
    }

    varsEl.innerHTML = entries.map(([name, value]) => {
        const prevValue = prevFrame ? prevFrame.locals[name] : undefined;
        const changed = prevValue !== undefined && prevValue !== value;
        const isNew = prevValue === undefined;
        const valueClass = (changed || isNew) ? 'debug-var-value debug-var-changed' : 'debug-var-value';
        return `<div class="debug-var-row">
            <span class="debug-var-name">${escapeHtml(name)}</span>
            <span class="debug-var-eq">=</span>
            <span class="${valueClass}">${escapeHtml(value)}</span>
        </div>`;
    }).join('');
}

function debugStep(delta) {
    const newIndex = debugIndex + delta;
    if (newIndex < 0 || newIndex >= debugFrames.length) return;
    debugIndex = newIndex;
    renderDebugFrame();
}

function debugJumpToBreakpoint(direction) {
    if (breakpoints.size === 0) return;
    const start = debugIndex + direction;
    const end = direction > 0 ? debugFrames.length : -1;
    for (let i = start; i !== end; i += direction) {
        if (breakpoints.has(debugFrames[i].line)) {
            debugIndex = i;
            renderDebugFrame();
            return;
        }
    }
}

function closeDebugPanel() {
    document.getElementById('debug-panel').style.display = 'none';
    if (debugLineWidget !== null) {
        window.acmEditor.removeLineClass(debugLineWidget, 'background', 'debug-current-line');
        debugLineWidget = null;
    }
    debugFrames = [];
    debugIndex = -1;
}

// ---------- 工具函数 ----------
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ---------- 事件绑定 ----------
function bindEvents() {
    document.getElementById('run-btn').addEventListener('click', runCode);
    document.getElementById('debug-btn').addEventListener('click', runDebug);

    document.getElementById('reset-btn').addEventListener('click', () => {
        window.acmEditor.setValue(DEFAULT_CODE);
        document.getElementById('stdin-area').value = DEFAULT_INPUT;
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_INPUT_KEY);
        document.getElementById('stdout-area').textContent = '点击「运行」或按 Ctrl+Enter 执行代码';
        document.getElementById('stdout-area').className = 'io-output placeholder-text';
        document.getElementById('run-status').textContent = '';
        document.getElementById('run-status').className = 'run-status';
        document.getElementById('diff-result').textContent = '';
        document.getElementById('diff-result').className = 'diff-result';
        document.getElementById('status-info').textContent = '就绪';
        document.getElementById('status-time').textContent = '';
        closeDebugPanel();
    });

    // 清空输入
    document.getElementById('clear-input-btn').addEventListener('click', () => {
        document.getElementById('stdin-area').value = '';
        localStorage.removeItem(STORAGE_INPUT_KEY);
    });

    // 模板选择
    document.getElementById('template-select').addEventListener('change', (e) => {
        const key = e.target.value;
        if (!key || !ACM_TEMPLATES[key]) return;
        const tpl = ACM_TEMPLATES[key];
        window.acmEditor.setValue(tpl.code);
        document.getElementById('stdin-area').value = tpl.input;
        e.target.value = ''; // 重置 select
    });

    // 输入自动保存
    const stdinArea = document.getElementById('stdin-area');
    const savedInput = localStorage.getItem(STORAGE_INPUT_KEY);
    const savedCode = localStorage.getItem(STORAGE_KEY);
    if (savedInput && savedInput.trim()) {
        stdinArea.value = savedInput;
    } else if (!savedCode || savedCode === DEFAULT_CODE) {
        // 无保存输入且代码是默认的，使用默认输入
        stdinArea.value = DEFAULT_INPUT;
    } else {
        stdinArea.value = '';
    }
    let inputTimer = null;
    stdinArea.addEventListener('input', () => {
        clearTimeout(inputTimer);
        inputTimer = setTimeout(() => {
            localStorage.setItem(STORAGE_INPUT_KEY, stdinArea.value);
        }, 500);
    });

    // 期望输出变化时自动对比
    document.getElementById('expected-area').addEventListener('input', compareOutput);

    // 调试控制
    document.getElementById('debug-prev').addEventListener('click', () => debugStep(-1));
    document.getElementById('debug-next').addEventListener('click', () => debugStep(1));
    document.getElementById('debug-prev-bp').addEventListener('click', () => debugJumpToBreakpoint(-1));
    document.getElementById('debug-next-bp').addEventListener('click', () => debugJumpToBreakpoint(1));
    document.getElementById('debug-close-btn').addEventListener('click', closeDebugPanel);

    // 键盘快捷键：左右方向键在调试模式下步进
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('debug-panel').style.display === 'none') return;
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); debugStep(-1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); debugStep(1); }
    });

    // 移动端导航切换
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }

    // URL 参数：?code=...&input=...&expected=...（从真题文章跳转）
    const params = new URLSearchParams(window.location.search);
    if (params.has('code')) {
        try {
            window.acmEditor.setValue(decodeB64(params.get('code')));
        } catch (_) {}
    }
    if (params.has('input')) {
        try {
            document.getElementById('stdin-area').value = decodeB64(params.get('input'));
        } catch (_) {}
    }
    if (params.has('expected')) {
        try {
            document.getElementById('expected-area').value = decodeB64(params.get('expected'));
        } catch (_) {}
    }
}

// Base64 解码（支持 Unicode / 中文）
// 注意：URLSearchParams 会把 + 转成空格，必须先还原
function decodeB64(str) {
    str = str.replace(/ /g, '+');
    var raw = atob(str);
    try {
        var bytes = Uint8Array.from(raw, function(c) { return c.charCodeAt(0); });
        return new TextDecoder('utf-8').decode(bytes);
    } catch (e) {
        try { return decodeURIComponent(escape(raw)); } catch (_) {}
        return raw;
    }
}

// ---------- 启动 ----------
document.addEventListener('DOMContentLoaded', () => {
    initEditor();
    bindEvents();
    initPyodide();
});
