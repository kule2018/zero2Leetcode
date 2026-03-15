// =============================================
// Zero2Leetcode Playground - 在线 OJ
// =============================================

// ---------- 链表基础设施（注入到 Python 环境）----------
const LINKED_LIST_SETUP = `
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
    def __repr__(self):
        vals = []
        node = self
        while node:
            vals.append(str(node.val))
            node = node.next
        return ' -> '.join(vals)

def _to_linked_list(arr):
    dummy = ListNode()
    curr = dummy
    for v in arr:
        curr.next = ListNode(v)
        curr = curr.next
    return dummy.next

def _to_array(node):
    result = []
    while node:
        result.append(node.val)
        node = node.next
    return result
`;

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
        solutionUrl: 'https://leetcode.cn/problems/two-sum/solutions/',
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
        solutionUrl: 'https://leetcode.cn/problems/climbing-stairs/solutions/',
    },
    {
        id: 206,
        title: 'LC 206 - 反转链表',
        difficulty: 'Easy',
        tags: ['链表'],
        description: `
<h3>206. 反转链表 <span class="difficulty-tag easy">Easy</span></h3>
<p>给你单链表的头节点 <code>head</code>，请你反转链表，并返回反转后的链表。</p>
<p><strong>说明：</strong>已内置 <code>ListNode</code> 类（<code>val</code> + <code>next</code>），输入输出自动转换，直接操作链表即可。</p>
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
        template: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def reverse_list(head):
    """
    :type head: ListNode
    :rtype: ListNode
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'reverse_list',
        setup: LINKED_LIST_SETUP,
        argWrappers: ['_to_linked_list'],
        returnWrapper: '_to_array',
        testCases: [
            { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
            { input: [[1, 2]], expected: [2, 1] },
            { input: [[]], expected: [] },
            { input: [[1]], expected: [1] },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/reverse-linked-list/solutions/',
    },
    {
        id: 20,
        title: 'LC 20 - 有效的括号',
        difficulty: 'Easy',
        tags: ['栈'],
        description: `
<h3>20. 有效的括号 <span class="difficulty-tag easy">Easy</span></h3>
<p>给定一个只包括 <code>'('</code>，<code>')'</code>，<code>'{'</code>，<code>'}'</code>，<code>'['</code>，<code>']'</code> 的字符串 <code>s</code>，判断字符串是否有效。</p>
<p>有效字符串需满足：</p>
<ul>
<li>左括号必须用相同类型的右括号闭合。</li>
<li>左括号必须以正确的顺序闭合。</li>
<li>每个右括号都有一个对应的相同类型的左括号。</li>
</ul>
<h4>示例</h4>
<pre>输入：s = "()"
输出：True</pre>
<pre>输入：s = "()[]{}"
输出：True</pre>
<pre>输入：s = "(]"
输出：False</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= s.length &lt;= 10<sup>4</sup></li>
<li>s 仅由括号 '()[]{}' 组成</li>
</ul>`,
        template: `def is_valid(s):
    """
    :type s: str
    :rtype: bool
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'is_valid',
        testCases: [
            { input: ['()'], expected: true },
            { input: ['()[]{}'], expected: true },
            { input: ['(]'], expected: false },
            { input: ['([)]'], expected: false },
            { input: ['{[]}'], expected: true },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/valid-parentheses/solutions/',
    },
    {
        id: 21,
        title: 'LC 21 - 合并两个有序链表',
        difficulty: 'Easy',
        tags: ['链表'],
        description: `
<h3>21. 合并两个有序链表 <span class="difficulty-tag easy">Easy</span></h3>
<p>将两个升序链表合并为一个新的<strong>升序</strong>链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。</p>
<p><strong>说明：</strong>已内置 <code>ListNode</code> 类（<code>val</code> + <code>next</code>），输入输出自动转换，直接操作链表即可。</p>
<h4>示例</h4>
<pre>输入：list1 = [1,2,4], list2 = [1,3,4]
输出：[1,1,2,3,4,4]</pre>
<pre>输入：list1 = [], list2 = []
输出：[]</pre>
<pre>输入：list1 = [], list2 = [0]
输出：[0]</pre>
<h4>提示</h4>
<ul>
<li>两个链表的节点数目范围是 [0, 50]</li>
<li>-100 &lt;= Node.val &lt;= 100</li>
<li>两个链表均按非递减顺序排列</li>
</ul>`,
        template: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def merge_two_lists(list1, list2):
    """
    :type list1: ListNode
    :type list2: ListNode
    :rtype: ListNode
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'merge_two_lists',
        setup: LINKED_LIST_SETUP,
        argWrappers: ['_to_linked_list', '_to_linked_list'],
        returnWrapper: '_to_array',
        testCases: [
            { input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] },
            { input: [[], []], expected: [] },
            { input: [[], [0]], expected: [0] },
            { input: [[1], [2]], expected: [1, 2] },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/merge-two-sorted-lists/solutions/',
    },
    {
        id: 35,
        title: 'LC 35 - 搜索插入位置',
        difficulty: 'Easy',
        tags: ['二分查找'],
        description: `
<h3>35. 搜索插入位置 <span class="difficulty-tag easy">Easy</span></h3>
<p>给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。</p>
<p>请必须使用时间复杂度为 <code>O(log n)</code> 的算法。</p>
<h4>示例</h4>
<pre>输入：nums = [1,3,5,6], target = 5
输出：2</pre>
<pre>输入：nums = [1,3,5,6], target = 2
输出：1</pre>
<pre>输入：nums = [1,3,5,6], target = 7
输出：4</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= nums.length &lt;= 10<sup>4</sup></li>
<li>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></li>
<li>nums 为无重复元素的升序排列数组</li>
</ul>`,
        template: `def search_insert(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'search_insert',
        testCases: [
            { input: [[1, 3, 5, 6], 5], expected: 2 },
            { input: [[1, 3, 5, 6], 2], expected: 1 },
            { input: [[1, 3, 5, 6], 7], expected: 4 },
            { input: [[1, 3, 5, 6], 0], expected: 0 },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/search-insert-position/solutions/',
    },
    {
        id: 118,
        title: 'LC 118 - 杨辉三角',
        difficulty: 'Easy',
        tags: ['动态规划'],
        description: `
<h3>118. 杨辉三角 <span class="difficulty-tag easy">Easy</span></h3>
<p>给定一个非负整数 <code>numRows</code>，生成「杨辉三角」的前 <code>numRows</code> 行。</p>
<p>在「杨辉三角」中，每个数是它左上方和右上方的数的和。</p>
<h4>示例</h4>
<pre>输入：numRows = 5
输出：[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]</pre>
<pre>输入：numRows = 1
输出：[[1]]</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= numRows &lt;= 30</li>
</ul>`,
        template: `def generate(num_rows):
    """
    :type num_rows: int
    :rtype: List[List[int]]
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'generate',
        testCases: [
            { input: [5], expected: [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]] },
            { input: [1], expected: [[1]] },
            { input: [3], expected: [[1], [1, 1], [1, 2, 1]] },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/pascals-triangle/solutions/',
    },
    {
        id: 121,
        title: 'LC 121 - 买卖股票的最佳时机',
        difficulty: 'Easy',
        tags: ['贪心'],
        description: `
<h3>121. 买卖股票的最佳时机 <span class="difficulty-tag easy">Easy</span></h3>
<p>给定一个数组 <code>prices</code>，它的第 <code>i</code> 个元素 <code>prices[i]</code> 表示一支给定股票第 <code>i</code> 天的价格。</p>
<p>你只能选择<strong>某一天</strong>买入这只股票，并选择在<strong>未来的某一个不同的日子</strong>卖出该股票。设计一个算法来计算你所能获取的最大利润。</p>
<p>返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 <code>0</code>。</p>
<h4>示例</h4>
<pre>输入：prices = [7,1,5,3,6,4]
输出：5
解释：在第 2 天买入（价格 = 1），第 5 天卖出（价格 = 6），利润 = 6-1 = 5</pre>
<pre>输入：prices = [7,6,4,3,1]
输出：0
解释：在这种情况下, 没有交易完成, 所以最大利润为 0</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= prices.length &lt;= 10<sup>5</sup></li>
<li>0 &lt;= prices[i] &lt;= 10<sup>4</sup></li>
</ul>`,
        template: `def max_profit(prices):
    """
    :type prices: List[int]
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'max_profit',
        testCases: [
            { input: [[7, 1, 5, 3, 6, 4]], expected: 5 },
            { input: [[7, 6, 4, 3, 1]], expected: 0 },
            { input: [[2, 4, 1]], expected: 2 },
            { input: [[1]], expected: 0 },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/solutions/',
    },
    {
        id: 136,
        title: 'LC 136 - 只出现一次的数字',
        difficulty: 'Easy',
        tags: ['位运算'],
        description: `
<h3>136. 只出现一次的数字 <span class="difficulty-tag easy">Easy</span></h3>
<p>给你一个<strong>非空</strong>整数数组 <code>nums</code>，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。</p>
<p>你必须设计并实现线性时间复杂度的算法来解决此问题，且该算法只使用常量额外空间。</p>
<h4>示例</h4>
<pre>输入：nums = [2,2,1]
输出：1</pre>
<pre>输入：nums = [4,1,2,1,2]
输出：4</pre>
<pre>输入：nums = [1]
输出：1</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= nums.length &lt;= 3 * 10<sup>4</sup></li>
<li>-3 * 10<sup>4</sup> &lt;= nums[i] &lt;= 3 * 10<sup>4</sup></li>
<li>除了某个元素只出现一次以外，其余每个元素均出现两次</li>
</ul>`,
        template: `def single_number(nums):
    """
    :type nums: List[int]
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'single_number',
        testCases: [
            { input: [[2, 2, 1]], expected: 1 },
            { input: [[4, 1, 2, 1, 2]], expected: 4 },
            { input: [[1]], expected: 1 },
            { input: [[0, 1, 0]], expected: 1 },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/single-number/solutions/',
    },
    {
        id: 169,
        title: 'LC 169 - 多数元素',
        difficulty: 'Easy',
        tags: ['技巧'],
        description: `
<h3>169. 多数元素 <span class="difficulty-tag easy">Easy</span></h3>
<p>给定一个大小为 <code>n</code> 的数组 <code>nums</code>，返回其中的多数元素。多数元素是指在数组中出现次数<strong>大于</strong> <code>⌊ n/2 ⌋</code> 的元素。</p>
<p>你可以假设数组是非空的，并且给定的数组总是存在多数元素。</p>
<h4>示例</h4>
<pre>输入：nums = [3,2,3]
输出：3</pre>
<pre>输入：nums = [2,2,1,1,1,2,2]
输出：2</pre>
<h4>提示</h4>
<ul>
<li>n == nums.length</li>
<li>1 &lt;= n &lt;= 5 * 10<sup>4</sup></li>
<li>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></li>
</ul>
<p><strong>进阶：</strong>尝试设计时间复杂度为 O(n)、空间复杂度为 O(1) 的算法（Boyer-Moore 投票法）。</p>`,
        template: `def majority_element(nums):
    """
    :type nums: List[int]
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'majority_element',
        testCases: [
            { input: [[3, 2, 3]], expected: 3 },
            { input: [[2, 2, 1, 1, 1, 2, 2]], expected: 2 },
            { input: [[1]], expected: 1 },
            { input: [[6, 5, 5]], expected: 5 },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/majority-element/solutions/',
    },
    {
        id: 283,
        title: 'LC 283 - 移动零',
        difficulty: 'Easy',
        tags: ['双指针'],
        description: `
<h3>283. 移动零 <span class="difficulty-tag easy">Easy</span></h3>
<p>给定一个数组 <code>nums</code>，编写一个函数将所有 <code>0</code> 移动到数组的末尾，同时保持非零元素的相对顺序。</p>
<p><strong>请注意</strong>，必须在不复制数组的情况下原地对数组进行操作。</p>
<h4>示例</h4>
<pre>输入：nums = [0,1,0,3,12]
输出：[0,1,0,3,12] → [1,3,12,0,0]</pre>
<pre>输入：nums = [0]
输出：[0]</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= nums.length &lt;= 10<sup>4</sup></li>
<li>-2<sup>31</sup> &lt;= nums[i] &lt;= 2<sup>31</sup> - 1</li>
</ul>
<p><strong>说明：</strong>本题返回修改后的数组即可。</p>`,
        template: `def move_zeroes(nums):
    """
    :type nums: List[int]
    :rtype: List[int]
    """
    # 在这里写你的代码（原地修改 nums 后返回）
    pass
`,
        functionName: 'move_zeroes',
        testCases: [
            { input: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] },
            { input: [[0]], expected: [0] },
            { input: [[1, 0, 0, 2]], expected: [1, 2, 0, 0] },
            { input: [[1, 2, 3]], expected: [1, 2, 3] },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/move-zeroes/solutions/',
    },
];

// ---------- 本地缓存 ----------
const STORAGE_KEY = 'z2l_playground_';

function saveCode(problemId, code) {
    try { localStorage.setItem(STORAGE_KEY + problemId, code); } catch (e) { /* quota */ }
}

function loadCode(problemId) {
    try { return localStorage.getItem(STORAGE_KEY + problemId); } catch (e) { return null; }
}

function clearSavedCode(problemId) {
    try { localStorage.removeItem(STORAGE_KEY + problemId); } catch (e) { /* noop */ }
}

// ---------- Python 自动补全 ----------
const PYTHON_KEYWORDS = [
    // 关键字
    'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await',
    'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
    'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is',
    'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return',
    'try', 'while', 'with', 'yield',
    // 内置函数
    'abs', 'all', 'any', 'bin', 'bool', 'chr', 'dict', 'dir',
    'divmod', 'enumerate', 'filter', 'float', 'format', 'frozenset',
    'getattr', 'hasattr', 'hash', 'hex', 'id', 'input', 'int',
    'isinstance', 'issubclass', 'iter', 'len', 'list', 'map', 'max',
    'min', 'next', 'object', 'oct', 'open', 'ord', 'pow', 'print',
    'property', 'range', 'repr', 'reversed', 'round', 'set',
    'setattr', 'slice', 'sorted', 'str', 'sum', 'super', 'tuple',
    'type', 'vars', 'zip',
    // 常用方法
    'append', 'extend', 'insert', 'remove', 'pop', 'clear', 'index',
    'count', 'sort', 'reverse', 'copy', 'keys', 'values', 'items',
    'get', 'update', 'add', 'discard', 'union', 'intersection',
    'split', 'join', 'strip', 'replace', 'find', 'startswith', 'endswith',
    'upper', 'lower', 'isdigit', 'isalpha',
];

function pythonHint(cm) {
    const cur = cm.getCursor();
    const token = cm.getTokenAt(cur);
    let start = token.start;
    let end = cur.ch;
    const word = token.string.slice(0, end - start);

    if (!word || word.length < 1) return;

    // 从代码中提取用户定义的标识符
    const code = cm.getValue();
    const userIdents = new Set();
    const identRe = /\b([a-zA-Z_]\w*)\b/g;
    let m;
    while ((m = identRe.exec(code)) !== null) {
        if (m[1] !== word) userIdents.add(m[1]);
    }

    const allWords = [...new Set([...PYTHON_KEYWORDS, ...userIdents])];
    const matches = allWords.filter(w =>
        w.startsWith(word) && w !== word
    ).sort();

    if (!matches.length) return;

    return {
        list: matches.slice(0, 15),
        from: CodeMirror.Pos(cur.line, start),
        to: CodeMirror.Pos(cur.line, end),
    };
}

// ---------- 全局状态 ----------
let pyodide = null;
let editor = null;
let currentProblem = PROBLEMS[0];

// ---------- 初始化 ----------
document.addEventListener('DOMContentLoaded', () => {
    initEditor();
    initProblemSelect();

    // 支持 URL 参数 ?id=70 直接跳转到指定题目
    const urlId = new URLSearchParams(window.location.search).get('id');
    if (urlId) {
        const idx = PROBLEMS.findIndex(p => p.id === parseInt(urlId));
        if (idx !== -1) {
            currentProblem = PROBLEMS[idx];
            document.getElementById('problem-select').value = idx;
        }
    }

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
        hintOptions: { completeSingle: false },
        extraKeys: {
            'Tab': (cm) => cm.replaceSelection('    ', 'end'),
            'Ctrl-Enter': () => runCode(),
            'Cmd-Enter': () => runCode(),
            'Ctrl-Space': (cm) => cm.showHint({ hint: pythonHint }),
        },
    });

    // 输入时自动弹出补全
    editor.on('inputRead', (cm, change) => {
        if (change.origin !== '+input') return;
        const ch = change.text[0];
        // 输入字母/下划线且当前 token 长度 >= 2 时触发
        if (/[a-zA-Z_]/.test(ch)) {
            const token = cm.getTokenAt(cm.getCursor());
            if (token.string.length >= 2) {
                cm.showHint({ hint: pythonHint });
            }
        }
    });

    // 自动保存到 localStorage（防抖）
    let saveTimer = null;
    editor.on('change', () => {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            saveCode(currentProblem.id, editor.getValue());
        }, 500);
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
    const footer = document.getElementById('problem-footer');
    if (problem.solutionUrl) {
        footer.innerHTML = `<a href="${problem.solutionUrl}" target="_blank" rel="noopener" class="solution-btn">查看题解 ↗</a>`;
        footer.style.display = '';
    } else {
        footer.innerHTML = '';
        footer.style.display = 'none';
    }
    // 优先从缓存恢复代码
    const cached = loadCode(problem.id);
    editor.setValue(cached || problem.template);
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
        clearSavedCode(currentProblem.id);
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
    const totalStart = performance.now();

    for (let i = 0; i < total; i++) {
        const tc = problem.testCases[i];
        const result = await runTestCase(userCode, problem, tc, i + 1);
        outputArea.appendChild(result.element);
        if (result.passed) passed++;
    }

    const totalTime = (performance.now() - totalStart).toFixed(1);

    // 更新总结
    if (passed === total) {
        summary.textContent = `${passed}/${total} 全部通过  ${totalTime} ms`;
        summary.className = 'result-summary all-pass';
    } else {
        summary.textContent = `${passed}/${total} 通过  ${totalTime} ms`;
        summary.className = 'result-summary has-fail';
    }

    runBtn.disabled = false;
    runBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2l10 6-10 6V2z"/></svg> 运行代码`;
}

async function runTestCase(userCode, problem, testCase, index) {
    const div = document.createElement('div');

    try {
        // 构建 Python 代码：setup + 用户函数 + 调用
        const argsStr = testCase.input.map((arg, i) => {
            const repr = pythonRepr(arg);
            const wrapper = problem.argWrappers?.[i];
            return wrapper ? `${wrapper}(${repr})` : repr;
        }).join(', ');
        const callExpr = `${problem.functionName}(${argsStr})`;
        const resultExpr = problem.returnWrapper
            ? `${problem.returnWrapper}(${callExpr})`
            : callExpr;
        const fullCode = `
${problem.setup || ''}
${userCode}

__result__ = ${resultExpr}
`;
        const t0 = performance.now();
        await pyodide.runPythonAsync(fullCode);
        const elapsed = (performance.now() - t0).toFixed(1);
        const actual = pyodide.globals.get('__result__');
        const actualJS = toJS(actual);

        const pass = compareResults(actualJS, testCase.expected, problem.compareFunc);

        div.className = `test-case ${pass ? 'pass' : 'fail'}`;
        div.innerHTML = `
<div class="test-header">
    <span class="test-icon">${pass ? '&#10004;' : '&#10008;'}</span>
    <span class="test-label">测试用例 ${index}</span>
    <span class="test-time">${elapsed} ms</span>
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
