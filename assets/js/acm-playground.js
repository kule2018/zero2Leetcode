// =============================================
// Zero2Leetcode ACM Playground - ACM 模拟 IDE
// =============================================

// ---------- ACM 输入模板 ----------
const PYTHON_TEMPLATES = {
    single: {
        code: `n = int(input())
print(n)
`,
        input: '42',
        expected: '42'
    },
    two: {
        code: `n, m = map(int, input().split())
print(n + m)
`,
        input: '3 5',
        expected: '8'
    },
    array: {
        code: `n = int(input())
arr = list(map(int, input().split()))
arr.sort()
print(' '.join(map(str, arr)))
`,
        input: '5\n3 1 4 1 5',
        expected: '1 1 3 4 5'
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
        input: '3 3\n1 2 3\n4 5 6\n7 8 9',
        expected: '1 2 3\n4 5 6\n7 8 9'
    },
    multi: {
        code: `T = int(input())
for _ in range(T):
    n = int(input())
    arr = list(map(int, input().split()))
    print(sum(arr))
`,
        input: '2\n3\n1 2 3\n4\n1 2 3 4',
        expected: '6\n10'
    },
    string: {
        code: `s = input()
print(s[::-1])
`,
        input: 'hello',
        expected: 'olleh'
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
        input: '4 4\n1 2\n1 3\n2 4\n3 4',
        expected: 'Node 1: [2, 3]\nNode 2: [1, 4]\nNode 3: [1, 4]\nNode 4: [2, 3]'
    }
};

const GO_TEMPLATES = {
    single: {
        code: `package main

import "fmt"

func main() {
    var n int
    fmt.Scan(&n)
    fmt.Println(n)
}
`,
        input: '42',
        expected: '42'
    },
    two: {
        code: `package main

import "fmt"

func main() {
    var n, m int
    fmt.Scan(&n, &m)
    fmt.Println(n + m)
}
`,
        input: '3 5',
        expected: '8'
    },
    array: {
        code: `package main

import (
    "bufio"
    "fmt"
    "os"
    "sort"
)

func main() {
    in := bufio.NewReader(os.Stdin)
    out := bufio.NewWriter(os.Stdout)
    defer out.Flush()

    var n int
    fmt.Fscan(in, &n)
    arr := make([]int, n)
    for i := range arr {
        fmt.Fscan(in, &arr[i])
    }

    sort.Ints(arr)
    for i, value := range arr {
        if i > 0 {
            fmt.Fprint(out, " ")
        }
        fmt.Fprint(out, value)
    }
    fmt.Fprintln(out)
}
`,
        input: '5\n3 1 4 1 5',
        expected: '1 1 3 4 5'
    },
    matrix: {
        code: `package main

import (
    "bufio"
    "fmt"
    "os"
)

func main() {
    in := bufio.NewReader(os.Stdin)
    out := bufio.NewWriter(os.Stdout)
    defer out.Flush()

    var n, m int
    fmt.Fscan(in, &n, &m)
    matrix := make([][]int, n)
    for i := range matrix {
        matrix[i] = make([]int, m)
        for j := range matrix[i] {
            fmt.Fscan(in, &matrix[i][j])
        }
    }

    for _, row := range matrix {
        for j, value := range row {
            if j > 0 {
                fmt.Fprint(out, " ")
            }
            fmt.Fprint(out, value)
        }
        fmt.Fprintln(out)
    }
}
`,
        input: '3 3\n1 2 3\n4 5 6\n7 8 9',
        expected: '1 2 3\n4 5 6\n7 8 9'
    },
    multi: {
        code: `package main

import (
    "bufio"
    "fmt"
    "os"
)

func main() {
    in := bufio.NewReader(os.Stdin)
    out := bufio.NewWriter(os.Stdout)
    defer out.Flush()

    var tests int
    fmt.Fscan(in, &tests)
    for ; tests > 0; tests-- {
        var n, sum, value int
        fmt.Fscan(in, &n)
        for i := 0; i < n; i++ {
            fmt.Fscan(in, &value)
            sum += value
        }
        fmt.Fprintln(out, sum)
    }
}
`,
        input: '2\n3\n1 2 3\n4\n1 2 3 4',
        expected: '6\n10'
    },
    string: {
        code: `package main

import (
    "bufio"
    "fmt"
    "os"
    "strings"
)

func main() {
    reader := bufio.NewReader(os.Stdin)
    text, _ := reader.ReadString('\\n')
    text = strings.TrimRight(text, "\\r\\n")

    chars := []rune(text)
    for left, right := 0, len(chars)-1; left < right; left, right = left+1, right-1 {
        chars[left], chars[right] = chars[right], chars[left]
    }
    fmt.Println(string(chars))
}
`,
        input: 'hello',
        expected: 'olleh'
    },
    graph: {
        code: `package main

import (
    "bufio"
    "fmt"
    "os"
    "sort"
)

func main() {
    in := bufio.NewReader(os.Stdin)
    out := bufio.NewWriter(os.Stdout)
    defer out.Flush()

    var n, m int
    fmt.Fscan(in, &n, &m)
    graph := make([][]int, n+1)
    for i := 0; i < m; i++ {
        var u, v int
        fmt.Fscan(in, &u, &v)
        graph[u] = append(graph[u], v)
        graph[v] = append(graph[v], u)
    }

    for node := 1; node <= n; node++ {
        sort.Ints(graph[node])
        fmt.Fprintf(out, "Node %d: [", node)
        for i, neighbor := range graph[node] {
            if i > 0 {
                fmt.Fprint(out, ", ")
            }
            fmt.Fprint(out, neighbor)
        }
        fmt.Fprintln(out, "]")
    }
}
`,
        input: '4 4\n1 2\n1 3\n2 4\n3 4',
        expected: 'Node 1: [2, 3]\nNode 2: [1, 4]\nNode 3: [1, 4]\nNode 4: [2, 3]'
    }
};

const JAVA_FAST_SCANNER = `    private static final class FastScanner {
        private final BufferedInputStream input = new BufferedInputStream(System.in);
        private final byte[] buffer = new byte[1 << 16];
        private int pointer = 0;
        private int length = 0;

        private int read() throws IOException {
            if (pointer >= length) {
                length = input.read(buffer);
                pointer = 0;
                if (length <= 0) return -1;
            }
            return buffer[pointer++] & 0xff;
        }

        String next() throws IOException {
            StringBuilder value = new StringBuilder();
            int ch;
            do {
                ch = read();
            } while (ch <= ' ' && ch != -1);
            while (ch > ' ') {
                value.append((char) ch);
                ch = read();
            }
            return value.toString();
        }

        int nextInt() throws IOException {
            return Integer.parseInt(next());
        }
    }`;

const JAVA_TEMPLATES = {
    single: {
        code: `import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        FastScanner in = new FastScanner();
        int n = in.nextInt();
        System.out.println(n);
    }

${JAVA_FAST_SCANNER}
}
`,
        input: '42',
        expected: '42'
    },
    two: {
        code: `import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        FastScanner in = new FastScanner();
        int n = in.nextInt();
        int m = in.nextInt();
        System.out.println(n + m);
    }

${JAVA_FAST_SCANNER}
}
`,
        input: '3 5',
        expected: '8'
    },
    array: {
        code: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        FastScanner in = new FastScanner();
        int n = in.nextInt();
        int[] values = new int[n];
        for (int i = 0; i < n; i++) {
            values[i] = in.nextInt();
        }

        Arrays.sort(values);
        StringBuilder output = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (i > 0) output.append(' ');
            output.append(values[i]);
        }
        System.out.println(output);
    }

${JAVA_FAST_SCANNER}
}
`,
        input: '5\n3 1 4 1 5',
        expected: '1 1 3 4 5'
    },
    matrix: {
        code: `import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        FastScanner in = new FastScanner();
        int rows = in.nextInt();
        int columns = in.nextInt();
        int[][] matrix = new int[rows][columns];

        for (int row = 0; row < rows; row++) {
            for (int column = 0; column < columns; column++) {
                matrix[row][column] = in.nextInt();
            }
        }

        StringBuilder output = new StringBuilder();
        for (int row = 0; row < rows; row++) {
            for (int column = 0; column < columns; column++) {
                if (column > 0) output.append(' ');
                output.append(matrix[row][column]);
            }
            output.append('\\n');
        }
        System.out.print(output);
    }

${JAVA_FAST_SCANNER}
}
`,
        input: '3 3\n1 2 3\n4 5 6\n7 8 9',
        expected: '1 2 3\n4 5 6\n7 8 9'
    },
    multi: {
        code: `import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        FastScanner in = new FastScanner();
        int tests = in.nextInt();
        StringBuilder output = new StringBuilder();

        while (tests-- > 0) {
            int n = in.nextInt();
            long sum = 0;
            for (int i = 0; i < n; i++) {
                sum += in.nextInt();
            }
            output.append(sum).append('\\n');
        }
        System.out.print(output);
    }

${JAVA_FAST_SCANNER}
}
`,
        input: '2\n3\n1 2 3\n4\n1 2 3 4',
        expected: '6\n10'
    },
    string: {
        code: `import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        String text = reader.readLine();
        System.out.println(new StringBuilder(text).reverse());
    }
}
`,
        input: 'hello',
        expected: 'olleh'
    },
    graph: {
        code: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        FastScanner in = new FastScanner();
        int n = in.nextInt();
        int m = in.nextInt();
        List<List<Integer>> graph = new ArrayList<>();
        for (int node = 0; node <= n; node++) {
            graph.add(new ArrayList<>());
        }

        for (int edge = 0; edge < m; edge++) {
            int from = in.nextInt();
            int to = in.nextInt();
            graph.get(from).add(to);
            graph.get(to).add(from);
        }

        StringBuilder output = new StringBuilder();
        for (int node = 1; node <= n; node++) {
            Collections.sort(graph.get(node));
            output.append("Node ").append(node).append(": ")
                .append(graph.get(node)).append('\\n');
        }
        System.out.print(output);
    }

${JAVA_FAST_SCANNER}
}
`,
        input: '4 4\n1 2\n1 3\n2 4\n3 4',
        expected: 'Node 1: [2, 3]\nNode 2: [1, 4]\nNode 3: [1, 4]\nNode 4: [2, 3]'
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

const DEFAULT_GO_CODE = GO_TEMPLATES.array.code;
const DEFAULT_JAVA_CODE = JAVA_TEMPLATES.array.code;

const LANGUAGES = {
    python: {
        label: 'Python 3',
        mode: 'python',
        fileExtension: 'py',
        mimeType: 'text/x-python;charset=utf-8',
        defaultCode: DEFAULT_CODE,
        defaultInput: DEFAULT_INPUT,
        templates: PYTHON_TEMPLATES,
        supportsDebug: true,
        executionMode: 'browser',
        runtime: 'pyodide',
        executor: executePython
    },
    go: {
        label: 'Go',
        mode: 'text/x-go',
        fileExtension: 'go',
        mimeType: 'text/x-go;charset=utf-8',
        defaultCode: DEFAULT_GO_CODE,
        defaultInput: DEFAULT_INPUT,
        templates: GO_TEMPLATES,
        supportsDebug: false,
        executionMode: 'remote',
        runtime: 'go-playground',
        executor: executeGo
    },
    java: {
        label: 'Java 17',
        mode: 'text/x-java',
        fileExtension: 'java',
        mimeType: 'text/x-java;charset=utf-8',
        defaultCode: DEFAULT_JAVA_CODE,
        defaultInput: DEFAULT_INPUT,
        templates: JAVA_TEMPLATES,
        supportsDebug: false,
        executionMode: 'browser',
        runtime: 'cheerpj',
        executor: executeJava,
        maxTimeoutMs: 10000
    }
};

const GO_PLAYGROUND_API = 'https://play.golang.org/compile';
const JAVA_WORKER_URL = 'assets/js/java-runner-worker.js?v=20260803';
const JAVA_INIT_TIMEOUT_MS = 90000;
const JAVA_MAX_CODE_BYTES = 48 * 1024;
const JAVA_MAX_STDIN_BYTES = 16 * 1024;
const GENERATED_CODE_MAX_BYTES = 96 * 1024;
const STORAGE_LANGUAGE_KEY = 'z2l-acm-language';
const LEGACY_STORAGE_KEY = 'z2l-acm-code';
const LEGACY_STORAGE_INPUT_KEY = 'z2l-acm-input';
const WORKSPACE_FORMAT = 'zero2leetcode-acm';
const WORKSPACE_VERSION = 1;
const MAX_WORKSPACE_FILE_SIZE = 2 * 1024 * 1024;

// ---------- 全局状态 ----------
let pyodide = null;
let pyodideLoading = false;
let pyodideLoadFailed = false;
let pyodideInitPromise = null;
let isRunning = false;
const remoteRuntimeStates = {
    go: 'ready'
};
let javaWorker = null;
let javaInitPromise = null;
let javaInitResolve = null;
let javaInitReject = null;
let javaInitTimeoutId = null;
let javaRuntimeState = 'idle';
let javaRuntimeMessage = '';
let javaPendingRequest = null;
let javaRequestSequence = 0;
let codeSaveTimer = null;
let inputSaveTimer = null;
let expectedSaveTimer = null;
let fileToastTimer = null;
let suppressEditorSave = false;
let debugFrames = [];
let debugIndex = -1;
let debugLineWidget = null; // CodeMirror line class marker
const breakpoints = new Set(); // line numbers (0-based)
let currentLanguage = getInitialLanguage();
const lastSourceNames = { python: 'main', go: 'main', java: 'Main' };

function normalizeLanguage(language) {
    return Object.prototype.hasOwnProperty.call(LANGUAGES, language) ? language : 'python';
}

function getInitialLanguage() {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('language') || params.get('lang');
    return normalizeLanguage(requested || localStorage.getItem(STORAGE_LANGUAGE_KEY));
}

function getCodeStorageKey(language) {
    return `z2l-acm-code:${language}`;
}

function getInputStorageKey(language) {
    return `z2l-acm-input:${language}`;
}

function getExpectedStorageKey(language) {
    return `z2l-acm-expected:${language}`;
}

function getTimeoutStorageKey(language) {
    return `z2l-acm-timeout:${language}`;
}

function getSavedCode(language) {
    const saved = localStorage.getItem(getCodeStorageKey(language));
    if (saved !== null) return saved;
    return language === 'python' ? localStorage.getItem(LEGACY_STORAGE_KEY) : null;
}

function getSavedInput(language) {
    const saved = localStorage.getItem(getInputStorageKey(language));
    if (saved !== null) return saved;
    return language === 'python' ? localStorage.getItem(LEGACY_STORAGE_INPUT_KEY) : null;
}

function getSavedExpected(language) {
    return localStorage.getItem(getExpectedStorageKey(language));
}

function getSavedTimeout(language) {
    return localStorage.getItem(getTimeoutStorageKey(language));
}

function restoreTimeoutSelection(language) {
    const timeoutSelect = document.getElementById('timeout-select');
    const saved = getSavedTimeout(language);
    const hasSavedOption = saved !== null && Array.from(timeoutSelect.options)
        .some((option) => option.value === saved);
    timeoutSelect.value = hasSavedOption ? saved : '10000';
}

function setEditorValue(value) {
    suppressEditorSave = true;
    window.acmEditor.setValue(value);
    suppressEditorSave = false;
}

function replaceEditorContents(editor, value, origin = '+ai') {
    const doc = editor?.getDoc?.() || editor;
    if (typeof doc?.replaceRange !== 'function') {
        editor?.setValue?.(value);
        return;
    }
    const firstLine = typeof doc.firstLine === 'function' ? doc.firstLine() : 0;
    const lastLine = typeof doc.lastLine === 'function'
        ? doc.lastLine()
        : Math.max(firstLine, (doc.lineCount?.() || 1) - 1);
    const replace = () => doc.replaceRange(
        value,
        { line: firstLine, ch: 0 },
        { line: lastLine, ch: (doc.getLine?.(lastLine) || '').length },
        origin
    );
    if (typeof editor.operation === 'function') editor.operation(replace);
    else replace();
}

// ---------- CodeMirror 编辑器初始化 ----------
function initEditor() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const language = LANGUAGES[currentLanguage];
    const editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: language.mode,
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
        if (LANGUAGES[currentLanguage].supportsDebug &&
            (gutter === 'CodeMirror-linenumbers' || gutter === 'breakpoints')) {
            toggleBreakpoint(cm, line);
        }
    });

    // 自动保存
    editor.on('change', () => {
        if (suppressEditorSave) return;
        clearTimeout(codeSaveTimer);
        const languageAtChange = currentLanguage;
        codeSaveTimer = setTimeout(() => {
            localStorage.setItem(getCodeStorageKey(languageAtChange), editor.getValue());
        }, 500);
    });

    // 恢复代码
    const saved = getSavedCode(currentLanguage);
    editor.setValue(saved !== null ? saved : language.defaultCode);

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

function clearBreakpoints() {
    breakpoints.clear();
    if (window.acmEditor) {
        window.acmEditor.clearGutter('breakpoints');
    }
}

function setRuntimeStatus(text, state) {
    const status = document.getElementById('runtime-status');
    if (!status) return;
    status.textContent = text;
    status.className = `runtime-status ${state}`;
}

function updateRuntimeControls() {
    const runBtn = document.getElementById('run-btn');
    const debugBtn = document.getElementById('debug-btn');
    const languageSelect = document.getElementById('language-select');
    const importWorkspaceBtn = document.getElementById('import-workspace-btn');
    if (!runBtn || !debugBtn) return;

    if (languageSelect) languageSelect.disabled = isRunning;
    if (importWorkspaceBtn) importWorkspaceBtn.disabled = isRunning;

    const config = LANGUAGES[currentLanguage];
    if (config.runtime === 'go-playground') {
        const states = {
            ready: [`${config.label} 在线编译`, 'ready'],
            loading: [`${config.label} 编译中...`, 'loading'],
            checking: [`${config.label} 检查沙箱...`, 'loading'],
            unavailable: [`${config.label} 暂不可用`, 'error'],
            error: [`${config.label} 服务异常`, 'error']
        };
        const runtimeState = remoteRuntimeStates[currentLanguage] || 'ready';
        setRuntimeStatus(...states[runtimeState]);
        runBtn.disabled = isRunning || runtimeState === 'checking' || runtimeState === 'unavailable';
        debugBtn.disabled = true;
        debugBtn.title = `${config.label} 暂不支持逐行调试`;
        return;
    }

    if (config.runtime === 'cheerpj') {
        const states = {
            idle: ['Java 17 浏览器运行', 'ready'],
            loading: [javaRuntimeMessage || 'Java 17 加载中...', 'loading'],
            ready: ['Java 17 浏览器运行', 'ready'],
            error: ['Java 17 加载失败', 'error']
        };
        setRuntimeStatus(...states[javaRuntimeState]);
        runBtn.disabled = isRunning || javaRuntimeState === 'loading';
        debugBtn.disabled = true;
        debugBtn.title = 'Java 17 暂不支持逐行调试';
        return;
    }

    if (pyodide) {
        setRuntimeStatus(`${config.label} 就绪`, 'ready');
    } else if (pyodideLoadFailed) {
        setRuntimeStatus('Python 加载失败', 'error');
    } else {
        setRuntimeStatus(pyodideLoading ? 'Python 加载中...' : 'Python 未加载', 'loading');
    }
    runBtn.disabled = isRunning || !pyodide;
    debugBtn.disabled = isRunning || !pyodide;
    debugBtn.title = '逐行调试 Python 代码';
}

// ---------- Pyodide 初始化 ----------
async function initPyodide() {
    if (pyodide) return pyodide;
    if (pyodideInitPromise) return pyodideInitPromise;

    pyodideLoading = true;
    pyodideLoadFailed = false;
    updateRuntimeControls();

    pyodideInitPromise = (async () => {
        try {
            pyodide = await loadPyodide();
            return pyodide;
        } catch (e) {
            pyodideLoadFailed = true;
            console.error('Pyodide load error:', e);
            return null;
        } finally {
            pyodideLoading = false;
            pyodideInitPromise = null;
            updateRuntimeControls();
        }
    })();

    return pyodideInitPromise;
}

// ---------- 代码运行 ----------
let pyodideCorrupted = false; // 标记 Pyodide 运行时是否损坏（如超时后）

function getTimeoutMs() {
    const sel = document.getElementById('timeout-select');
    const value = sel ? parseInt(sel.value, 10) : 10000;
    return Number.isFinite(value) ? value : 10000;
}

async function runCode() {
    if (isRunning) return;

    const languageAtStart = currentLanguage;
    const languageConfig = LANGUAGES[languageAtStart];
    const stdoutArea = document.getElementById('stdout-area');
    const runStatus = document.getElementById('run-status');
    const statusInfo = document.getElementById('status-info');
    const statusTime = document.getElementById('status-time');

    isRunning = true;
    if (languageConfig.executionMode === 'remote') {
        remoteRuntimeStates[languageAtStart] = 'loading';
    }
    updateRuntimeControls();
    try {
        if (languageConfig.runtime === 'pyodide' && (!pyodide || pyodideCorrupted)) {
            if (pyodideCorrupted) await reinitPyodide();
            if (!pyodide) {
                stdoutArea.textContent = 'Python 运行时尚未就绪，请稍后重试。';
                stdoutArea.classList.add('has-error');
                statusInfo.textContent = 'Python 运行时未就绪';
                return;
            }
        }

        const isRemote = languageConfig.executionMode === 'remote';
        const needsCompilation = languageConfig.runtime === 'go-playground' ||
            languageConfig.runtime === 'cheerpj';
        runStatus.textContent = needsCompilation ? '编译中...' : '运行中...';
        runStatus.className = 'run-status running';
        statusInfo.textContent = needsCompilation
            ? `${languageConfig.label} 编译中...`
            : '运行中...';
        stdoutArea.textContent = '';
        stdoutArea.classList.remove('has-error', 'placeholder-text');

        const userCode = window.acmEditor.getValue();
        const stdinText = document.getElementById('stdin-area').value;
        const t0 = performance.now();

        try {
            const result = await languageConfig.executor(userCode, stdinText);
            const elapsed = (performance.now() - t0).toFixed(1);

            if (isRemote) {
                remoteRuntimeStates[languageAtStart] = result.phase === 'service' ? 'error' : 'ready';
            }

            if (result.error) {
                const parts = [result.stdout, result.error].filter(Boolean);
                stdoutArea.textContent = parts.join('\n');
                stdoutArea.classList.add('has-error');
                const errorLabels = {
                    compile: '编译错误',
                    limit: '输出超限',
                    request: '请求错误',
                    'rate-limit': '请求受限',
                    service: '服务异常',
                    timeout: '执行超时'
                };
                runStatus.textContent = errorLabels[result.phase] || '运行错误';
                runStatus.className = 'run-status error';
                statusInfo.textContent = classifyError(result.error, languageAtStart, result.phase);
            } else {
                const warningText = result.warning
                    ? `${result.warningLabel || '警告'}:\n${String(result.warning).trimEnd()}`
                    : '';
                stdoutArea.textContent = [result.stdout || '(无输出)', warningText]
                    .filter(Boolean)
                    .join('\n\n');
                if (!result.stdout && !warningText) stdoutArea.classList.add('placeholder-text');
                runStatus.textContent = `${elapsed} ms`;
                runStatus.className = 'run-status success';
                statusInfo.textContent = result.warning ? '运行完成（有警告）' : '运行完成';
            }
            statusTime.textContent = `耗时 ${elapsed} ms`;

            if (result.error) {
                const diffResult = document.getElementById('diff-result');
                diffResult.textContent = '';
                diffResult.className = 'diff-result';
            } else {
                compareOutput(result.stdout);
            }
        } catch (e) {
            if (isRemote) remoteRuntimeStates[languageAtStart] = 'error';
            stdoutArea.textContent = String(e);
            stdoutArea.classList.add('has-error');
            runStatus.textContent = '异常';
            runStatus.className = 'run-status error';
            statusInfo.textContent = '运行异常';
        }
    } finally {
        isRunning = false;
        if (languageConfig.executionMode === 'remote' &&
            remoteRuntimeStates[languageAtStart] === 'loading') {
            remoteRuntimeStates[languageAtStart] = 'ready';
        }
        updateRuntimeControls();
    }
}

async function reinitPyodide() {
    pyodideCorrupted = false;
    pyodide = null;
    return initPyodide();
}

// Playground 支持 txtar 多文件格式；辅助文件注入 stdin，避免改写用户源码。
function buildGoPlaygroundSource(code, stdinText) {
    const stdinLiteral = JSON.stringify(stdinText);
    return `-- 000_z2l_stdin.go --
package main

import "os"

var _ = func() bool {
    reader, writer, err := os.Pipe()
    if err != nil {
        panic(err)
    }
    os.Stdin = reader
    go func() {
        _, _ = writer.Write([]byte(${stdinLiteral}))
        _ = writer.Close()
    }()
    return true
}()
-- main.go --
${code}
`;
}

async function executeGo(code, stdinText) {
    const controller = new AbortController();
    const timeoutMs = getTimeoutMs();
    const timeoutId = timeoutMs > 0
        ? setTimeout(() => controller.abort(), timeoutMs)
        : null;

    try {
        const body = new URLSearchParams({
            version: '2',
            withVet: 'true',
            body: buildGoPlaygroundSource(code, stdinText)
        });
        const response = await fetch(GO_PLAYGROUND_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body,
            signal: controller.signal
        });

        if (!response.ok) {
            return {
                stdout: '',
                error: `Go 在线编译服务请求失败（HTTP ${response.status}）`,
                phase: 'service'
            };
        }

        const data = await response.json();
        if (data.Errors) {
            return {
                stdout: '',
                error: String(data.Errors).trimEnd(),
                phase: 'compile'
            };
        }

        let stdout = '';
        let stderr = '';
        const events = Array.isArray(data.Events) ? data.Events : [];
        events.forEach((event) => {
            if (event.Kind === 'stderr') {
                stderr += event.Message || '';
            } else {
                stdout += event.Message || '';
            }
        });

        const failed = (typeof data.Status === 'number' && data.Status !== 0) || Boolean(stderr);
        return {
            stdout,
            error: failed ? (stderr || `Go 程序异常退出（状态码 ${data.Status}）`) : null,
            warning: data.VetErrors || null,
            warningLabel: 'Go vet',
            phase: failed ? 'runtime' : null
        };
    } catch (e) {
        const timedOut = e && e.name === 'AbortError';
        return {
            stdout: '',
            error: timedOut
                ? `Go 在线编译请求超时（超过 ${(timeoutMs / 1000).toFixed(0)} 秒）`
                : '无法连接 Go 在线编译服务，请检查网络后重试。',
            phase: timedOut ? 'timeout' : 'service'
        };
    } finally {
        if (timeoutId !== null) clearTimeout(timeoutId);
    }
}

function getBoundedTimeoutMs(language) {
    const configured = getTimeoutMs();
    const maximum = LANGUAGES[language].maxTimeoutMs;
    if (!maximum) return configured;
    return configured <= 0 ? maximum : Math.min(configured, maximum);
}

function utf8ByteLength(value) {
    return new TextEncoder().encode(String(value)).byteLength;
}

function stopJavaRuntime(nextState = 'idle', message = '') {
    if (javaWorker) javaWorker.terminate();
    if (javaInitTimeoutId !== null) clearTimeout(javaInitTimeoutId);
    javaWorker = null;
    javaInitPromise = null;
    javaInitResolve = null;
    javaInitReject = null;
    javaInitTimeoutId = null;
    javaRuntimeState = nextState;
    javaRuntimeMessage = message;
    updateRuntimeControls();
}

function failJavaRuntime(message) {
    const initializationReject = javaInitReject;
    const pending = javaPendingRequest;
    javaPendingRequest = null;
    if (pending) clearTimeout(pending.timeoutId);

    stopJavaRuntime('error', message);
    if (initializationReject) initializationReject(new Error(message));
    if (pending) {
        pending.resolve({
            stdout: '',
            error: `Java 浏览器运行时异常：${message}`,
            phase: 'service'
        });
    }
}

function restartJavaRuntimeInBackground() {
    stopJavaRuntime('idle');
    if (currentLanguage !== 'java') return;
    setTimeout(() => {
        if (currentLanguage !== 'java') return;
        initJavaRuntime().catch((error) => {
            console.error('Java runtime reload error:', error);
        });
    }, 0);
}

function handleJavaWorkerMessage(event, sourceWorker) {
    if (sourceWorker !== javaWorker) return;

    const message = event.data || {};
    if (message.type === 'status') {
        javaRuntimeState = 'loading';
        javaRuntimeMessage = String(message.message || 'Java 17 加载中...');
        updateRuntimeControls();
        return;
    }

    if (message.type === 'ready') {
        const resolve = javaInitResolve;
        if (javaInitTimeoutId !== null) clearTimeout(javaInitTimeoutId);
        javaInitTimeoutId = null;
        javaRuntimeState = 'ready';
        javaRuntimeMessage = '';
        javaInitResolve = null;
        javaInitReject = null;
        javaInitPromise = null;
        updateRuntimeControls();
        if (resolve) resolve(true);
        return;
    }

    if (message.type === 'init-error') {
        failJavaRuntime(String(message.message || 'Java 17 初始化失败。'));
        return;
    }

    const pending = javaPendingRequest;
    if (!pending || pending.id !== message.id) return;
    clearTimeout(pending.timeoutId);
    javaPendingRequest = null;

    if (message.type === 'result') {
        const result = message.result && typeof message.result === 'object'
            ? message.result
            : {
                stdout: '',
                error: 'Java 浏览器运行时返回了无效结果。',
                phase: 'service'
            };
        pending.resolve(result);
        if (result.restartRuntime) restartJavaRuntimeInBackground();
        return;
    }

    const failureMessage = String(message.message || 'Java 编译器执行失败。');
    stopJavaRuntime('error', failureMessage);
    pending.resolve({
        stdout: '',
        error: `Java 浏览器运行时异常：${failureMessage}`,
        phase: 'service'
    });
}

function initJavaRuntime() {
    if (javaRuntimeState === 'ready' && javaWorker) return Promise.resolve(true);
    if (javaInitPromise) return javaInitPromise;

    if (typeof Worker !== 'function') {
        javaRuntimeState = 'error';
        javaRuntimeMessage = '当前浏览器不支持 Web Worker。';
        updateRuntimeControls();
        return Promise.reject(new Error(javaRuntimeMessage));
    }

    javaRuntimeState = 'loading';
    javaRuntimeMessage = '正在启动 Java 17...';
    updateRuntimeControls();

    javaInitPromise = new Promise((resolve, reject) => {
        javaInitResolve = resolve;
        javaInitReject = reject;
        try {
            const worker = new Worker(JAVA_WORKER_URL);
            javaWorker = worker;
            worker.onmessage = (event) => handleJavaWorkerMessage(event, worker);
            worker.onerror = (event) => {
                if (worker !== javaWorker) return;
                if (event && typeof event.preventDefault === 'function') event.preventDefault();
                failJavaRuntime(event && event.message
                    ? event.message
                    : 'Java Worker 加载失败。');
            };
        } catch (error) {
            const message = error && error.message ? error.message : String(error);
            setTimeout(() => failJavaRuntime(message), 0);
            return;
        }

        javaInitTimeoutId = setTimeout(() => {
            if (javaRuntimeState === 'loading') {
                failJavaRuntime('Java 17 首次加载超时，请检查网络后重试。');
            }
        }, JAVA_INIT_TIMEOUT_MS);
    });
    return javaInitPromise;
}

async function executeJava(code, stdinText) {
    if (utf8ByteLength(code) > JAVA_MAX_CODE_BYTES) {
        return {
            stdout: '',
            error: 'Java 源码超过 48 KB 限制。',
            phase: 'request'
        };
    }
    if (utf8ByteLength(stdinText) > JAVA_MAX_STDIN_BYTES) {
        return {
            stdout: '',
            error: 'Java 标准输入超过 16 KB 限制。',
            phase: 'request'
        };
    }

    try {
        await initJavaRuntime();
    } catch (error) {
        return {
            stdout: '',
            error: `Java 17 浏览器运行时加载失败：${
                error && error.message ? error.message : String(error)
            }`,
            phase: 'service'
        };
    }

    const timeoutMs = getBoundedTimeoutMs('java');
    const requestId = ++javaRequestSequence;
    return new Promise((resolve) => {
        const timeoutId = setTimeout(() => {
            if (!javaPendingRequest || javaPendingRequest.id !== requestId) return;
            javaPendingRequest = null;
            stopJavaRuntime('idle');
            resolve({
                stdout: '',
                error: `Java 编译或运行超过 ${timeoutMs / 1000} 秒，已终止浏览器 Worker。`,
                phase: 'timeout'
            });
            restartJavaRuntimeInBackground();
        }, timeoutMs);

        javaPendingRequest = { id: requestId, resolve, timeoutId };
        try {
            javaWorker.postMessage({
                type: 'execute',
                id: requestId,
                code,
                stdin: stdinText
            });
        } catch (error) {
            clearTimeout(timeoutId);
            javaPendingRequest = null;
            failJavaRuntime(error && error.message ? error.message : String(error));
            resolve({
                stdout: '',
                error: '无法向 Java 浏览器 Worker 发送代码。',
                phase: 'service'
            });
        }
    });
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

    const timeoutMs = getTimeoutMs();

    // 将 setup + 用户代码 + teardown 合成单次调用（与调试模式一致，避免跨调用状态丢失）
    const indentedCode = code.split('\n').map(l => '    ' + l).join('\n');
    const wrappedCode = `
import sys, io as __io, traceback as __tb
__stdout_capture = __io.StringIO()
__stderr_capture = __io.StringIO()
sys.stdout = __stdout_capture
sys.stderr = __stderr_capture
try:
${indentedCode}
except Exception as __e:
    __stderr_capture.write(__tb.format_exc())
finally:
    sys.stdout = sys.__stdout__
    sys.stderr = sys.__stderr__
    __out = __stdout_capture.getvalue()
    __err = __stderr_capture.getvalue()
`;

    const execPromise = pyodide.runPythonAsync(wrappedCode);
    const raceTarget = timeoutMs > 0
        ? Promise.race([
            execPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('__TIMEOUT__')), timeoutMs))
          ])
        : execPromise;

    try {
        await raceTarget;
        const stdout = pyodide.globals.get('__out') || '';
        const stderr = pyodide.globals.get('__err') || '';
        if (stderr) {
            const hint = getErrorHint(stderr);
            const errorMsg = stderr.includes('Traceback') ? stderr : stderr;
            return { stdout, error: hint ? errorMsg + '\n\n💡 ' + hint : errorMsg };
        }
        return { stdout, warning: null, error: null };
    } catch (e) {
        const errMsg = String(e.message || e);
        if (errMsg === '__TIMEOUT__') {
            pyodideCorrupted = true;
            const secs = (timeoutMs / 1000).toFixed(0);
            return {
                stdout: tryGetStdout(),
                error: `⏱ 执行超时（超过 ${secs} 秒）\n\n可能原因：\n` +
                       '  1. while 循环条件永远为真（无限循环）\n' +
                       '  2. 递归没有正确的终止条件\n' +
                       '  3. 输入数据量过大导致算法超时\n\n' +
                       '提示：如果是 ML/DL 训练代码，可将超时设为「5min」或「无限制」。\n' +
                       '运行时已自动重置，可直接修改代码后重新运行。'
            };
        }
        // 兜底：恢复 stdout
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
    return '';
}

function classifyError(errorText, language = currentLanguage, phase = null) {
    if (phase === 'timeout' || /超时|timeout|timed out|__TIMEOUT__|__LoopTimeout__/i.test(errorText)) {
        return '执行超时（可能无限循环）';
    }
    if (phase === 'limit') return '输出超过限制';
    if (phase === 'request') return 'Java 请求无效';
    if (phase === 'rate-limit') return 'Java 请求频率受限';
    if (phase === 'service') {
        if (language === 'java') return 'Java 17 浏览器运行时异常';
        const label = LANGUAGES[language] ? LANGUAGES[language].label : '远程';
        return `${label} 执行服务异常`;
    }
    if (language === 'go') {
        if (phase === 'compile' || /syntax error|undefined:|imported and not used|cannot use/i.test(errorText)) {
            return 'Go 编译错误';
        }
        if (/deadlock/i.test(errorText)) return 'Go 协程死锁';
        if (/panic:|fatal error:/i.test(errorText)) return 'Go 运行时异常';
        return 'Go 运行错误';
    }
    if (language === 'java') {
        if (phase === 'compile' || /cannot find symbol|class .* is public|';' expected|illegal start/i.test(errorText)) {
            return 'Java 编译错误';
        }
        if (/NumberFormatException|InputMismatchException|NoSuchElementException/i.test(errorText)) {
            return 'Java 输入格式错误';
        }
        if (/ArrayIndexOutOfBoundsException|IndexOutOfBoundsException/i.test(errorText)) return 'Java 下标越界';
        if (/NullPointerException/i.test(errorText)) return 'Java 空指针异常';
        if (/StackOverflowError/i.test(errorText)) return 'Java 栈溢出';
        if (/OutOfMemoryError/i.test(errorText)) return 'Java 内存不足';
        if (/ArithmeticException.*\/ by zero/i.test(errorText)) return 'Java 除零错误';
        return 'Java 运行错误';
    }
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
function compareOutput(actualOutput = null) {
    const expectedArea = document.getElementById('expected-area');
    const diffResult = document.getElementById('diff-result');
    const expected = expectedArea.value.trim();
    const actual = (actualOutput === null
        ? document.getElementById('stdout-area').textContent
        : actualOutput).trim();

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
    if (currentLanguage !== 'python' || isRunning) return;

    isRunning = true;
    updateRuntimeControls();
    try {
        await runDebugSession();
    } finally {
        isRunning = false;
        updateRuntimeControls();
    }
}

async function runDebugSession() {
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

function showFileToast(message, type = 'success') {
    const toast = document.getElementById('file-toast');
    clearTimeout(fileToastTimer);
    toast.textContent = message;
    toast.className = `file-toast ${type} is-visible`;
    fileToastTimer = setTimeout(() => {
        toast.classList.remove('is-visible');
    }, 3200);
}

function downloadTextFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function openSaveCodeDialog() {
    const config = LANGUAGES[currentLanguage];
    const dialog = document.getElementById('save-code-dialog');
    const input = document.getElementById('save-code-filename');
    document.getElementById('save-code-extension').textContent = `.${config.fileExtension}`;
    document.getElementById('save-code-error').textContent = '';
    document.getElementById('filename-field').classList.remove('has-error');
    input.setAttribute('aria-invalid', 'false');
    input.value = lastSourceNames[currentLanguage] || 'main';
    dialog.showModal();
    requestAnimationFrame(() => {
        input.focus();
        input.select();
    });
}

function closeSaveCodeDialog() {
    const dialog = document.getElementById('save-code-dialog');
    if (dialog.open) dialog.close();
}

function validateSourceName(value) {
    const extension = `.${LANGUAGES[currentLanguage].fileExtension}`;
    let name = value.trim();
    if (name.toLowerCase().endsWith(extension.toLowerCase())) {
        name = name.slice(0, -extension.length).trim();
    }

    if (!name) return { error: '请输入文件名' };
    if (name === '.' || name === '..') return { error: '请输入有效的文件名' };
    if (/[<>:"/\\|?*\u0000-\u001F]/.test(name)) {
        return { error: '文件名不能包含 < > : " / \\ | ? *' };
    }
    if (/[. ]$/.test(name)) return { error: '文件名不能以空格或句点结尾' };
    if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/i.test(name)) {
        return { error: '该文件名是系统保留名称，请换一个名称' };
    }
    return { name };
}

function saveSourceCode() {
    const input = document.getElementById('save-code-filename');
    const result = validateSourceName(input.value);
    const error = document.getElementById('save-code-error');
    const field = document.getElementById('filename-field');

    if (result.error) {
        error.textContent = result.error;
        field.classList.add('has-error');
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        return;
    }

    const config = LANGUAGES[currentLanguage];
    const filename = `${result.name}.${config.fileExtension}`;
    lastSourceNames[currentLanguage] = result.name;
    downloadTextFile(window.acmEditor.getValue(), filename, config.mimeType);
    closeSaveCodeDialog();
    document.getElementById('status-info').textContent = `代码已保存为 ${filename}`;
    showFileToast(`代码已保存为 ${filename}`);
}

function getWorkspaceExportName() {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, '0');
    const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
    return `acm-practice-${currentLanguage}-${stamp}.json`;
}

function exportWorkspace() {
    const payload = {
        format: WORKSPACE_FORMAT,
        version: WORKSPACE_VERSION,
        language: currentLanguage,
        code: window.acmEditor.getValue(),
        input: document.getElementById('stdin-area').value,
        expected: document.getElementById('expected-area').value
    };
    const filename = getWorkspaceExportName();
    downloadTextFile(`${JSON.stringify(payload, null, 2)}\n`, filename, 'application/json;charset=utf-8');
    document.getElementById('status-info').textContent = `练习包已导出为 ${filename}`;
    showFileToast('练习包已导出（含代码、输入和期望输出）');
}

function validateWorkspace(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return '练习包内容必须是 JSON 对象';
    }
    if (payload.format !== WORKSPACE_FORMAT) return '不是 Zero2Leetcode ACM 练习包';
    if (payload.version !== WORKSPACE_VERSION) return `暂不支持练习包版本 ${payload.version}`;
    if (!Object.prototype.hasOwnProperty.call(LANGUAGES, payload.language)) {
        return `暂不支持语言 ${String(payload.language)}`;
    }
    if (typeof payload.code !== 'string') return '练习包缺少有效的代码内容';
    if (typeof payload.input !== 'string') return '练习包缺少有效的标准输入';
    if (typeof payload.expected !== 'string') return '练习包缺少有效的期望输出';
    return '';
}

function persistStorageEntries(entries) {
    let previousValues;
    let writtenCount = 0;

    try {
        previousValues = entries.map(([key]) => localStorage.getItem(key));
        entries.forEach(([key, value]) => {
            localStorage.setItem(key, value);
            writtenCount += 1;
        });
        return true;
    } catch (_) {
        if (previousValues) {
            entries.slice(0, writtenCount).forEach(([key]) => {
                try { localStorage.removeItem(key); } catch (_) {}
            });
            entries.slice(0, writtenCount).forEach(([key], index) => {
                try {
                    const previous = previousValues[index];
                    if (previous !== null) localStorage.setItem(key, previous);
                } catch (_) {}
            });
        }
        return false;
    }
}

function persistImportedWorkspace(payload) {
    return persistStorageEntries([
        [getCodeStorageKey(payload.language), payload.code],
        [getInputStorageKey(payload.language), payload.input],
        [getExpectedStorageKey(payload.language), payload.expected],
        [STORAGE_LANGUAGE_KEY, payload.language]
    ]);
}

function applyImportedWorkspace(payload) {
    clearTimeout(codeSaveTimer);
    clearTimeout(inputSaveTimer);
    clearTimeout(expectedSaveTimer);

    if (payload.language !== currentLanguage) {
        if (!saveCurrentDraft()) return false;
    }
    if (!persistImportedWorkspace(payload)) return false;

    currentLanguage = payload.language;

    setEditorValue(payload.code);
    document.getElementById('stdin-area').value = payload.input;
    document.getElementById('expected-area').value = payload.expected;
    restoreTimeoutSelection(currentLanguage);
    document.getElementById('template-select').value = '';
    clearBreakpoints();
    resetExecutionUi();
    updateLanguageUi();
    activateCurrentRuntime();
    document.getElementById('status-info').textContent = '练习包已导入';
    showFileToast('练习包已导入，代码、输入和期望输出已恢复');
    window.acmEditor.focus();
    return true;
}

async function importWorkspaceFile(file) {
    if (!file) return;
    if (isRunning) {
        showFileToast('代码运行或调试期间不能导入练习包', 'error');
        return;
    }
    if (file.size > MAX_WORKSPACE_FILE_SIZE) {
        showFileToast('导入失败：练习包不能超过 2 MB', 'error');
        return;
    }

    let payload;
    try {
        payload = JSON.parse(await file.text());
    } catch (_) {
        showFileToast('导入失败：文件不是有效的 JSON', 'error');
        return;
    }

    const validationError = validateWorkspace(payload);
    if (validationError) {
        showFileToast(`导入失败：${validationError}`, 'error');
        return;
    }
    if (isRunning) {
        showFileToast('代码运行或调试期间不能导入练习包', 'error');
        return;
    }
    if (!applyImportedWorkspace(payload)) {
        showFileToast('导入失败：浏览器无法保存练习草稿', 'error');
    }
}

function resetExecutionUi() {
    document.getElementById('stdout-area').textContent = '点击「运行」或按 Ctrl+Enter 执行代码';
    document.getElementById('stdout-area').className = 'io-output placeholder-text';
    document.getElementById('run-status').textContent = '';
    document.getElementById('run-status').className = 'run-status';
    document.getElementById('diff-result').textContent = '';
    document.getElementById('diff-result').className = 'diff-result';
    document.getElementById('status-info').textContent = '就绪';
    document.getElementById('status-time').textContent = '';
    closeDebugPanel();
}

function saveCurrentDraft() {
    clearTimeout(codeSaveTimer);
    clearTimeout(inputSaveTimer);
    clearTimeout(expectedSaveTimer);
    return persistStorageEntries([
        [getCodeStorageKey(currentLanguage), window.acmEditor.getValue()],
        [getInputStorageKey(currentLanguage), document.getElementById('stdin-area').value],
        [getExpectedStorageKey(currentLanguage), document.getElementById('expected-area').value],
        [getTimeoutStorageKey(currentLanguage), document.getElementById('timeout-select').value]
    ]);
}

function updateLanguageUi() {
    const config = LANGUAGES[currentLanguage];
    const languageSelect = document.getElementById('language-select');
    const languageHint = document.getElementById('language-hint');
    const runtimeStatus = document.getElementById('runtime-status');
    const timeoutSelect = document.getElementById('timeout-select');
    const debugTip = document.getElementById('debug-tip');
    const saveCodeBtn = document.getElementById('save-code-btn');

    languageSelect.value = currentLanguage;
    languageHint.textContent = `${config.label} · ACM 模式`;
    const runtimeTitles = {
        python: 'Python 代码在当前浏览器内运行',
        go: '代码通过官方 Go Playground 在线编译运行',
        java: 'Java 17 源码在当前浏览器内编译运行，代码不会上传'
    };
    runtimeStatus.title = runtimeTitles[currentLanguage];

    Array.from(timeoutSelect.options).forEach((option) => {
        const value = parseInt(option.value, 10);
        option.disabled = Boolean(config.maxTimeoutMs) &&
            (value === 0 || value > config.maxTimeoutMs);
    });
    if (config.maxTimeoutMs &&
        (getTimeoutMs() === 0 || getTimeoutMs() > config.maxTimeoutMs)) {
        timeoutSelect.value = String(config.maxTimeoutMs);
        localStorage.setItem(getTimeoutStorageKey(currentLanguage), timeoutSelect.value);
    }
    timeoutSelect.title = config.maxTimeoutMs
        ? `Java 编译与运行合计最多 ${config.maxTimeoutMs / 1000} 秒`
        : currentLanguage === 'go'
            ? '请求等待上限；Go 程序另受官方沙箱时间限制'
            : '执行超时时间';
    debugTip.textContent = config.supportsDebug
        ? '点击行号设置断点'
        : `${config.label} 暂不支持逐行调试`;
    saveCodeBtn.title = `保存为本地 .${config.fileExtension} 文件`;

    window.acmEditor.setOption('mode', config.mode);
    window.acmEditor.setOption('indentWithTabs', currentLanguage === 'go');
    window.acmEditor.refresh();
    updateRuntimeControls();
}

function activateCurrentRuntime() {
    const config = LANGUAGES[currentLanguage];
    if (config.runtime === 'pyodide') {
        initPyodide();
    } else if (config.runtime === 'cheerpj') {
        initJavaRuntime().catch((error) => {
            console.error('Java runtime preload error:', error);
        });
    }
}

function switchLanguage(nextLanguage) {
    const next = normalizeLanguage(nextLanguage);
    if (next === currentLanguage) return;

    if (!saveCurrentDraft()) {
        document.getElementById('language-select').value = currentLanguage;
        showFileToast('切换失败：浏览器无法保存当前草稿', 'error');
        return;
    }
    currentLanguage = next;
    localStorage.setItem(STORAGE_LANGUAGE_KEY, currentLanguage);
    clearBreakpoints();
    closeDebugPanel();

    const config = LANGUAGES[currentLanguage];
    const savedCode = getSavedCode(currentLanguage);
    const savedInput = getSavedInput(currentLanguage);
    const savedExpected = getSavedExpected(currentLanguage);
    setEditorValue(savedCode !== null ? savedCode : config.defaultCode);
    document.getElementById('stdin-area').value = savedInput !== null
        ? savedInput
        : config.defaultInput;
    document.getElementById('expected-area').value = savedExpected !== null
        ? savedExpected
        : '';
    restoreTimeoutSelection(currentLanguage);
    document.getElementById('template-select').value = '';
    resetExecutionUi();
    updateLanguageUi();
    activateCurrentRuntime();
}

function applyGeneratedCode(payload = {}) {
    const language = String(payload.language || '');
    const code = payload.code;
    if (!Object.prototype.hasOwnProperty.call(LANGUAGES, language)) {
        return { ok: false, message: '代码块未标注 Python、Go 或 Java 17。' };
    }
    if (typeof code !== 'string' || !code.trim()) {
        return { ok: false, message: '代码块为空，无法写入编辑器。' };
    }
    if (isRunning) {
        return { ok: false, message: '代码正在运行，请结束后再写入。' };
    }
    const maximumBytes = language === 'java' ? JAVA_MAX_CODE_BYTES : GENERATED_CODE_MAX_BYTES;
    if (utf8ByteLength(code) > maximumBytes) {
        return { ok: false, message: `代码超过 ${Math.round(maximumBytes / 1024)} KB，无法写入编辑器。` };
    }
    if (!window.acmEditor) {
        return { ok: false, message: '编辑器尚未准备好，请稍后重试。' };
    }

    const changedLanguage = language !== currentLanguage;
    const sourceInput = changedLanguage
        ? document.getElementById('stdin-area').value
        : null;
    const sourceExpected = changedLanguage
        ? document.getElementById('expected-area').value
        : null;
    if (changedLanguage) {
        switchLanguage(language);
        if (currentLanguage !== language) {
            return { ok: false, message: '无法保存当前语言草稿，未切换编辑器。' };
        }
        window.acmEditor.clearHistory?.();
    } else if (!saveCurrentDraft()) {
        return { ok: false, message: '浏览器无法保存当前草稿，未写入代码。' };
    }

    const previousCode = window.acmEditor.getValue();
    const inputArea = document.getElementById('stdin-area');
    const expectedArea = document.getElementById('expected-area');
    const targetInput = changedLanguage ? sourceInput : inputArea.value;
    const targetExpected = changedLanguage ? sourceExpected : expectedArea.value;
    const storageEntries = [
        [getCodeStorageKey(language), code],
        [getInputStorageKey(language), targetInput],
        [getExpectedStorageKey(language), targetExpected]
    ];
    if (previousCode !== code) {
        clearTimeout(codeSaveTimer);
        try {
            replaceEditorContents(window.acmEditor, code);
        } catch (error) {
            return { ok: false, message: '写入编辑器失败，请重试。' };
        }
    }
    if (!persistStorageEntries(storageEntries)) {
        if (previousCode !== code) {
            replaceEditorContents(window.acmEditor, previousCode, '+ai-rollback');
        }
        if (changedLanguage) {
            inputArea.value = sourceInput;
            expectedArea.value = sourceExpected;
        }
        return { ok: false, message: '浏览器无法保存生成的代码，输入和期望输出未被覆盖。' };
    }
    if (changedLanguage) {
        clearTimeout(inputSaveTimer);
        clearTimeout(expectedSaveTimer);
        inputArea.value = targetInput;
        expectedArea.value = targetExpected;
    }

    clearBreakpoints();
    document.getElementById('template-select').value = '';
    resetExecutionUi();
    window.acmEditor.refresh?.();
    return { ok: true, language };
}

window.acmApplyGeneratedCode = applyGeneratedCode;

// ---------- 事件绑定 ----------
function bindEvents() {
    document.getElementById('run-btn').addEventListener('click', runCode);
    document.getElementById('debug-btn').addEventListener('click', runDebug);
    document.getElementById('save-code-btn').addEventListener('click', openSaveCodeDialog);
    document.getElementById('save-code-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveSourceCode();
    });
    document.getElementById('save-code-close').addEventListener('click', closeSaveCodeDialog);
    document.getElementById('save-code-cancel').addEventListener('click', closeSaveCodeDialog);
    document.getElementById('save-code-filename').addEventListener('input', () => {
        document.getElementById('save-code-error').textContent = '';
        document.getElementById('filename-field').classList.remove('has-error');
        document.getElementById('save-code-filename').setAttribute('aria-invalid', 'false');
    });
    document.getElementById('export-workspace-btn').addEventListener('click', exportWorkspace);
    document.getElementById('import-workspace-btn').addEventListener('click', () => {
        document.getElementById('workspace-file-input').click();
    });
    document.getElementById('workspace-file-input').addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        e.target.value = '';
        await importWorkspaceFile(file);
    });

    document.getElementById('language-select').addEventListener('change', (e) => {
        switchLanguage(e.target.value);
    });

    const timeoutSelect = document.getElementById('timeout-select');
    restoreTimeoutSelection(currentLanguage);
    timeoutSelect.addEventListener('change', () => {
        localStorage.setItem(getTimeoutStorageKey(currentLanguage), timeoutSelect.value);
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
        const config = LANGUAGES[currentLanguage];
        clearTimeout(codeSaveTimer);
        clearTimeout(inputSaveTimer);
        clearTimeout(expectedSaveTimer);
        localStorage.removeItem(getCodeStorageKey(currentLanguage));
        localStorage.removeItem(getInputStorageKey(currentLanguage));
        localStorage.removeItem(getExpectedStorageKey(currentLanguage));
        if (currentLanguage === 'python') {
            localStorage.removeItem(LEGACY_STORAGE_KEY);
            localStorage.removeItem(LEGACY_STORAGE_INPUT_KEY);
        }
        setEditorValue(config.defaultCode);
        document.getElementById('stdin-area').value = config.defaultInput;
        document.getElementById('expected-area').value = '';
        clearBreakpoints();
        resetExecutionUi();
    });

    // 清空输入
    document.getElementById('clear-input-btn').addEventListener('click', () => {
        document.getElementById('stdin-area').value = '';
        localStorage.setItem(getInputStorageKey(currentLanguage), '');
    });

    // 模板选择
    document.getElementById('template-select').addEventListener('change', (e) => {
        const key = e.target.value;
        const templates = LANGUAGES[currentLanguage].templates;
        if (!key || !templates[key]) return;
        const tpl = templates[key];
        setEditorValue(tpl.code);
        document.getElementById('stdin-area').value = tpl.input;
        document.getElementById('expected-area').value = tpl.expected || '';
        localStorage.setItem(getCodeStorageKey(currentLanguage), tpl.code);
        localStorage.setItem(getInputStorageKey(currentLanguage), tpl.input);
        localStorage.setItem(getExpectedStorageKey(currentLanguage), tpl.expected || '');
        resetExecutionUi();
        e.target.value = '';
    });

    // 输入自动保存
    const stdinArea = document.getElementById('stdin-area');
    const config = LANGUAGES[currentLanguage];
    const savedInput = getSavedInput(currentLanguage);
    const savedCode = getSavedCode(currentLanguage);
    if (savedInput !== null) {
        stdinArea.value = savedInput;
    } else if (savedCode === null || savedCode === config.defaultCode) {
        // 无保存输入且代码是默认的，使用默认输入
        stdinArea.value = config.defaultInput;
    } else {
        stdinArea.value = '';
    }
    stdinArea.addEventListener('input', () => {
        clearTimeout(inputSaveTimer);
        const languageAtChange = currentLanguage;
        inputSaveTimer = setTimeout(() => {
            localStorage.setItem(getInputStorageKey(languageAtChange), stdinArea.value);
        }, 500);
    });

    // 期望输出自动保存，并在已有运行结果时更新对比
    const expectedArea = document.getElementById('expected-area');
    const savedExpected = getSavedExpected(currentLanguage);
    expectedArea.value = savedExpected !== null ? savedExpected : '';
    expectedArea.addEventListener('input', () => {
        compareOutput();
        clearTimeout(expectedSaveTimer);
        const languageAtChange = currentLanguage;
        expectedSaveTimer = setTimeout(() => {
            localStorage.setItem(getExpectedStorageKey(languageAtChange), expectedArea.value);
        }, 500);
    });

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

    // URL 参数：?language=java&code=...&input=...&expected=...（从真题文章跳转）
    const params = new URLSearchParams(window.location.search);
    if (shouldClearExpectedForUrl(params)) {
        document.getElementById('expected-area').value = '';
        localStorage.setItem(getExpectedStorageKey(currentLanguage), '');
    }
    if (params.has('code')) {
        try {
            window.acmEditor.setValue(decodeB64(params.get('code')));
        } catch (_) {}
    }
    if (params.has('input')) {
        try {
            const input = decodeB64(params.get('input'));
            document.getElementById('stdin-area').value = input;
            localStorage.setItem(getInputStorageKey(currentLanguage), input);
        } catch (_) {}
    }
    if (params.has('expected')) {
        try {
            const expected = decodeB64(params.get('expected'));
            document.getElementById('expected-area').value = expected;
            localStorage.setItem(getExpectedStorageKey(currentLanguage), expected);
        } catch (_) {}
    }

    localStorage.setItem(STORAGE_LANGUAGE_KEY, currentLanguage);
    updateLanguageUi();
}

function shouldClearExpectedForUrl(params) {
    return (params.has('code') || params.has('input')) && !params.has('expected');
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
    activateCurrentRuntime();
});
