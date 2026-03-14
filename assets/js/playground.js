// =============================================
// Zero2Leetcode Playground - 在线 OJ
// =============================================

// ---------- 题目数据 ----------
const PROBLEMS = [
    {
        id: 1,
        title: 'LC 1 - 两数之和',
        difficulty: 'Easy',
        tags: ['哈希表'],
        description: `
<h3>1. 两数之和 <span class="difficulty-tag easy">Easy</span></h3>
<p>给定一个整数数组 <code>nums</code> 和一个整数目标值 <code>target</code>，请你在该数组中找出<strong>和为目标值</strong>的那<strong>两个</strong>整数，并返回它们的数组下标。</p>
<p>你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。</p>
<p>你可以按任意顺序返回答案。</p>
<h4>示例</h4>
<pre>输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9，返回 [0, 1]</pre>
<pre>输入：nums = [3,2,4], target = 6
输出：[1,2]</pre>
<h4>提示</h4>
<ul>
<li>2 &lt;= nums.length &lt;= 10<sup>4</sup></li>
<li>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></li>
<li>只会存在一个有效答案</li>
</ul>`,
        template: `def two_sum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'two_sum',
        testCases: [
            { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
            { input: [[3, 2, 4], 6], expected: [1, 2] },
            { input: [[3, 3], 6], expected: [0, 1] },
        ],
        compareFunc: 'sorted',
    },
    {
        id: 70,
        title: 'LC 70 - 爬楼梯',
        difficulty: 'Easy',
        tags: ['动态规划'],
        description: `
<h3>70. 爬楼梯 <span class="difficulty-tag easy">Easy</span></h3>
<p>假设你正在爬楼梯。需要 <code>n</code> 阶你才能到达楼顶。</p>
<p>每次你可以爬 <code>1</code> 或 <code>2</code> 个台阶。你有多少种不同的方法可以爬到楼顶呢？</p>
<h4>示例</h4>
<pre>输入：n = 2
输出：2
解释：有两种方法：1+1 和 2</pre>
<pre>输入：n = 3
输出：3
解释：有三种方法：1+1+1、1+2 和 2+1</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= n &lt;= 45</li>
</ul>`,
        template: `def climb_stairs(n):
    """
    :type n: int
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'climb_stairs',
        testCases: [
            { input: [2], expected: 2 },
            { input: [3], expected: 3 },
            { input: [5], expected: 8 },
            { input: [10], expected: 89 },
        ],
        compareFunc: 'equal',
    },
    {
        id: 206,
        title: 'LC 206 - 反转链表',
        difficulty: 'Easy',
        tags: ['链表'],
        description: `
<h3>206. 反转链表 <span class="difficulty-tag easy">Easy</span></h3>
<p>给你单链表的头节点，请你反转链表，并返回反转后的链表。</p>
<p><strong>注意：</strong>本题使用<strong>数组模拟链表</strong>，输入和输出均为数组。</p>
<h4>示例</h4>
<pre>输入：head = [1,2,3,4,5]
输出：[5,4,3,2,1]</pre>
<pre>输入：head = [1,2]
输出：[2,1]</pre>
<pre>输入：head = []
输出：[]</pre>
<h4>提示</h4>
<ul>
<li>链表中节点的数目范围是 [0, 5000]</li>
<li>-5000 &lt;= Node.val &lt;= 5000</li>
</ul>`,
        template: `def reverse_list(head):
    """
    反转链表（用数组模拟）
    :type head: List[int]
    :rtype: List[int]
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'reverse_list',
        testCases: [
            { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
            { input: [[1, 2]], expected: [2, 1] },
            { input: [[]], expected: [] },
            { input: [[1]], expected: [1] },
        ],
        compareFunc: 'equal',
    },
];

// ---------- 全局状态 ----------
let pyodide = null;
let editor = null;
let currentProblem = PROBLEMS[0];

// ---------- 初始化 ----------
document.addEventListener('DOMContentLoaded', () => {
    initEditor();
    initProblemSelect();
    loadProblem(currentProblem);
    initPyodide();
    bindEvents();
});

function initEditor() {
    editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: 'python',
        theme: 'material-darker',
        lineNumbers: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        lineWrapping: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        extraKeys: {
            'Tab': (cm) => cm.replaceSelection('    ', 'end'),
            'Ctrl-Enter': () => runCode(),
            'Cmd-Enter': () => runCode(),
        },
    });
}

function initProblemSelect() {
    const select = document.getElementById('problem-select');
    PROBLEMS.forEach((p, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = p.title;
        select.appendChild(opt);
    });
}

function loadProblem(problem) {
    currentProblem = problem;
    document.getElementById('problem-description').innerHTML = problem.description;
    editor.setValue(problem.template);
    clearOutput();
}

async function initPyodide() {
    const status = document.getElementById('pyodide-status');
    const runBtn = document.getElementById('run-btn');
    try {
        pyodide = await loadPyodide();
        status.textContent = 'Pyodide 就绪';
        status.classList.remove('loading');
        status.classList.add('ready');
        runBtn.disabled = false;
    } catch (e) {
        status.textContent = '加载失败';
        status.classList.remove('loading');
        status.classList.add('error');
        console.error('Pyodide load error:', e);
    }
}

function bindEvents() {
    document.getElementById('problem-select').addEventListener('change', (e) => {
        loadProblem(PROBLEMS[e.target.value]);
    });

    document.getElementById('run-btn').addEventListener('click', runCode);

    document.getElementById('reset-btn').addEventListener('click', () => {
        editor.setValue(currentProblem.template);
        clearOutput();
    });

    // 移动端导航切换
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }
}

// ---------- 代码执行 ----------
async function runCode() {
    if (!pyodide) return;

    const runBtn = document.getElementById('run-btn');
    runBtn.disabled = true;
    runBtn.textContent = '运行中...';

    const outputArea = document.getElementById('output-area');
    const summary = document.getElementById('result-summary');
    outputArea.innerHTML = '';

    const userCode = editor.getValue();
    const problem = currentProblem;
    let passed = 0;
    const total = problem.testCases.length;

    for (let i = 0; i < total; i++) {
        const tc = problem.testCases[i];
        const result = await runTestCase(userCode, problem, tc, i + 1);
        outputArea.appendChild(result.element);
        if (result.passed) passed++;
    }

    // 更新总结
    if (passed === total) {
        summary.textContent = `${passed}/${total} 全部通过`;
        summary.className = 'result-summary all-pass';
    } else {
        summary.textContent = `${passed}/${total} 通过`;
        summary.className = 'result-summary has-fail';
    }

    runBtn.disabled = false;
    runBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2l10 6-10 6V2z"/></svg> 运行代码`;
}

async function runTestCase(userCode, problem, testCase, index) {
    const div = document.createElement('div');

    try {
        // 构建 Python 代码：用户函数 + 调用
        const argsStr = testCase.input.map(pythonRepr).join(', ');
        const fullCode = `
${userCode}

__result__ = ${problem.functionName}(${argsStr})
`;
        await pyodide.runPythonAsync(fullCode);
        const actual = pyodide.globals.get('__result__');
        const actualJS = toJS(actual);

        const pass = compareResults(actualJS, testCase.expected, problem.compareFunc);

        div.className = `test-case ${pass ? 'pass' : 'fail'}`;
        div.innerHTML = `
<div class="test-header">
    <span class="test-icon">${pass ? '&#10004;' : '&#10008;'}</span>
    <span class="test-label">测试用例 ${index}</span>
    <span class="test-status ${pass ? 'pass' : 'fail'}">${pass ? '通过' : '失败'}</span>
</div>
<div class="test-detail">
    <div class="test-row"><span class="test-key">输入：</span><code>${formatInput(problem, testCase.input)}</code></div>
    <div class="test-row"><span class="test-key">预期：</span><code>${JSON.stringify(testCase.expected)}</code></div>
    <div class="test-row"><span class="test-key">实际：</span><code>${JSON.stringify(actualJS)}</code></div>
</div>`;

        return { element: div, passed: pass };
    } catch (err) {
        div.className = 'test-case error';
        div.innerHTML = `
<div class="test-header">
    <span class="test-icon">&#10008;</span>
    <span class="test-label">测试用例 ${index}</span>
    <span class="test-status fail">错误</span>
</div>
<div class="test-detail">
    <div class="test-row"><span class="test-key">输入：</span><code>${formatInput(problem, testCase.input)}</code></div>
    <div class="test-row error-msg"><span class="test-key">错误：</span><code>${escapeHtml(extractError(err))}</code></div>
</div>`;
        return { element: div, passed: false };
    }
}

// ---------- 工具函数 ----------
function pythonRepr(val) {
    if (val === null || val === undefined) return 'None';
    if (typeof val === 'boolean') return val ? 'True' : 'False';
    if (typeof val === 'number') return String(val);
    if (typeof val === 'string') return JSON.stringify(val);
    if (Array.isArray(val)) return '[' + val.map(pythonRepr).join(', ') + ']';
    return JSON.stringify(val);
}

function toJS(pyVal) {
    if (pyVal === undefined || pyVal === null) return null;
    if (typeof pyVal === 'number' || typeof pyVal === 'string' || typeof pyVal === 'boolean') return pyVal;
    if (pyVal.toJs) {
        const jsVal = pyVal.toJs({ dict_converter: Object.fromEntries });
        if (jsVal instanceof Map) return Array.from(jsVal.values());
        return jsVal;
    }
    return pyVal;
}

function compareResults(actual, expected, mode) {
    if (mode === 'sorted') {
        if (!Array.isArray(actual) || !Array.isArray(expected)) return false;
        return JSON.stringify([...actual].sort()) === JSON.stringify([...expected].sort());
    }
    // 'equal' default
    return JSON.stringify(actual) === JSON.stringify(expected);
}

function formatInput(problem, inputs) {
    // 获取函数的参数名（从 template 解析）
    const match = problem.template.match(/def\s+\w+\(([^)]*)\)/);
    if (match) {
        const params = match[1].split(',').map(s => s.trim());
        return inputs.map((v, i) => `${params[i] || 'arg' + i} = ${JSON.stringify(v)}`).join(', ');
    }
    return inputs.map(v => JSON.stringify(v)).join(', ');
}

function extractError(err) {
    const msg = String(err.message || err);
    // 提取最后一行 Python 错误信息
    const lines = msg.split('\n').filter(l => l.trim());
    return lines[lines.length - 1] || msg;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function clearOutput() {
    document.getElementById('output-area').innerHTML =
        '<div class="output-placeholder">点击「运行代码」查看测试结果</div>';
    document.getElementById('result-summary').textContent = '';
    document.getElementById('result-summary').className = 'result-summary';
}
