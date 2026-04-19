// Extra playground problems (batch 6) — 字节面试高频题补充
// Note: Keep this file self-contained. It only appends objects into window.PLAYGROUND_EXTRA_PROBLEMS.

window.PLAYGROUND_EXTRA_PROBLEMS = (window.PLAYGROUND_EXTRA_PROBLEMS || []).concat([
  {
    id: 88,
    title: 'LC 88 - 合并两个有序数组',
    difficulty: 'Easy',
    tags: ['数组', '双指针', '排序'],
    description: `
<h3>88. 合并两个有序数组 <span class="difficulty-tag easy">Easy</span></h3>
<p>给你两个按<strong>非递减顺序</strong>排列的整数数组 <code>nums1</code> 和 <code>nums2</code>，另有两个整数 <code>m</code> 和 <code>n</code>，分别表示 <code>nums1</code> 和 <code>nums2</code> 中的元素数目。</p>
<p>请你合并 <code>nums2</code> 到 <code>nums1</code> 中，使合并后的数组同样按<strong>非递减顺序</strong>排列。</p>
<p><strong>说明：</strong>最终结果存储在数组 <code>nums1</code> 中。<code>nums1</code> 的初始长度为 <code>m + n</code>，后 <code>n</code> 个元素为 0，仅用于占位。</p>
<h4>示例</h4>
<pre>输入：nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
输出：[1,2,2,3,5,6]</pre>
<pre>输入：nums1 = [1], m = 1, nums2 = [], n = 0
输出：[1]</pre>
<h4>提示</h4>
<ul>
<li>nums1.length == m + n</li>
<li>nums2.length == n</li>
<li>0 &lt;= m, n &lt;= 200</li>
</ul>`,
    template: `def merge(nums1, m, nums2, n):
    """
    :type nums1: List[int]
    :type m: int
    :type nums2: List[int]
    :type n: int
    :rtype: List[int]
    """
    # 在这里写你的代码（原地修改 nums1 后返回）
    pass
`,
    functionName: 'merge',
    testCases: [
      { input: [[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3], expected: [1, 2, 2, 3, 5, 6] },
      { input: [[1], 1, [], 0], expected: [1] },
      { input: [[0], 0, [1], 1], expected: [1] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/merge-sorted-array/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19892041.html',
  },
  {
    id: 92,
    title: 'LC 92 - 反转链表 II',
    difficulty: 'Medium',
    tags: ['链表'],
    description: `
<h3>92. 反转链表 II <span class="difficulty-tag medium">Medium</span></h3>
<p>给你单链表的头指针 <code>head</code> 和两个整数 <code>left</code> 和 <code>right</code>，其中 <code>left &lt;= right</code>。请你反转从位置 <code>left</code> 到位置 <code>right</code> 的链表节点，返回反转后的链表。</p>
<h4>示例</h4>
<pre>输入：head = [1,2,3,4,5], left = 2, right = 4
输出：[1,4,3,2,5]</pre>
<pre>输入：head = [5], left = 1, right = 1
输出：[5]</pre>
<h4>提示</h4>
<ul>
<li>链表节点数为 n，1 &lt;= n &lt;= 500</li>
<li>1 &lt;= left &lt;= right &lt;= n</li>
</ul>
<p><strong>说明：</strong>本地练习使用数组模拟链表，输入输出均为数组。</p>`,
    template: `def reverse_between(head, left, right):
    """
    :type head: List[int] (模拟链表)
    :type left: int
    :type right: int
    :rtype: List[int]
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'reverse_between',
    testCases: [
      { input: [[1, 2, 3, 4, 5], 2, 4], expected: [1, 4, 3, 2, 5] },
      { input: [[5], 1, 1], expected: [5] },
      { input: [[3, 5], 1, 2], expected: [5, 3] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/reverse-linked-list-ii/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19892043.html',
  },
  {
    id: 122,
    title: 'LC 122 - 买卖股票的最佳时机 II',
    difficulty: 'Medium',
    tags: ['贪心', '数组', '动态规划'],
    description: `
<h3>122. 买卖股票的最佳时机 II <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个整数数组 <code>prices</code>，其中 <code>prices[i]</code> 表示某支股票第 <code>i</code> 天的价格。</p>
<p>在每一天，你可以决定是否购买和/或出售股票。你在任何时候最多只能持有一股股票。你也可以在同一天买入并立即卖出。</p>
<p>返回你能获得的<strong>最大</strong>利润。</p>
<h4>示例</h4>
<pre>输入：prices = [7,1,5,3,6,4]
输出：7
解释：第2天买入(1)，第3天卖出(5)，利润4；第4天买入(3)，第5天卖出(6)，利润3。总利润7。</pre>
<pre>输入：prices = [1,2,3,4,5]
输出：4</pre>
<pre>输入：prices = [7,6,4,3,1]
输出：0</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= prices.length &lt;= 3 * 10<sup>4</sup></li>
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
      { input: [[7, 1, 5, 3, 6, 4]], expected: 7 },
      { input: [[1, 2, 3, 4, 5]], expected: 4 },
      { input: [[7, 6, 4, 3, 1]], expected: 0 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19892044.html',
  },
  {
    id: 165,
    title: 'LC 165 - 比较版本号',
    difficulty: 'Medium',
    tags: ['字符串', '双指针'],
    description: `
<h3>165. 比较版本号 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你两个版本号 <code>version1</code> 和 <code>version2</code>，请你比较它们。</p>
<p>版本号由一个或多个修订号组成，各修订号由一个 <code>.</code> 连接。每个修订号由多位数字组成，可能包含前导零。</p>
<p>比较规则：按从左到右的顺序依次比较修订号。如果某个版本号没有指定修订号，则该修订号视为 0。</p>
<p>返回规则：</p>
<ul>
<li>如果 version1 > version2 返回 1</li>
<li>如果 version1 < version2 返回 -1</li>
<li>相等则返回 0</li>
</ul>
<h4>示例</h4>
<pre>输入：version1 = "1.01", version2 = "1.001"
输出：0</pre>
<pre>输入：version1 = "1.0", version2 = "1.0.0"
输出：0</pre>
<pre>输入：version1 = "0.1", version2 = "1.1"
输出：-1</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= version1.length, version2.length &lt;= 500</li>
<li>version1 和 version2 仅包含数字和 '.'</li>
</ul>`,
    template: `def compare_version(version1, version2):
    """
    :type version1: str
    :type version2: str
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'compare_version',
    testCases: [
      { input: ['1.01', '1.001'], expected: 0 },
      { input: ['1.0', '1.0.0'], expected: 0 },
      { input: ['0.1', '1.1'], expected: -1 },
      { input: ['1.0.1', '1'], expected: 1 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/compare-version-numbers/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19892045.html',
  },
  {
    id: 209,
    title: 'LC 209 - 长度最小的子数组',
    difficulty: 'Medium',
    tags: ['滑动窗口', '数组', '二分查找'],
    description: `
<h3>209. 长度最小的子数组 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定一个含有 <code>n</code> 个正整数的数组和一个正整数 <code>target</code>。</p>
<p>找出该数组中满足其总和大于等于 <code>target</code> 的长度最小的<strong>连续子数组</strong>，并返回其长度。如果不存在符合条件的子数组，返回 0。</p>
<h4>示例</h4>
<pre>输入：target = 7, nums = [2,3,1,2,4,3]
输出：2
解释：子数组 [4,3] 是该条件下长度最小的子数组。</pre>
<pre>输入：target = 4, nums = [1,4,4]
输出：1</pre>
<pre>输入：target = 11, nums = [1,1,1,1,1,1,1,1]
输出：0</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= target &lt;= 10<sup>9</sup></li>
<li>1 &lt;= nums.length &lt;= 10<sup>5</sup></li>
<li>1 &lt;= nums[i] &lt;= 10<sup>4</sup></li>
</ul>`,
    template: `def min_sub_array_len(target, nums):
    """
    :type target: int
    :type nums: List[int]
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'min_sub_array_len',
    testCases: [
      { input: [7, [2, 3, 1, 2, 4, 3]], expected: 2 },
      { input: [4, [1, 4, 4]], expected: 1 },
      { input: [11, [1, 1, 1, 1, 1, 1, 1, 1]], expected: 0 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/minimum-size-subarray-sum/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19892046.html',
  },
  {
    id: 232,
    title: 'LC 232 - 用栈实现队列',
    difficulty: 'Easy',
    tags: ['栈', '设计', '队列'],
    description: `
<h3>232. 用栈实现队列 <span class="difficulty-tag easy">Easy</span></h3>
<p>请你仅使用两个栈实现先入先出队列。队列应当支持一般队列支持的所有操作：</p>
<ul>
<li><code>push(x)</code>：将元素 x 推到队列的末尾</li>
<li><code>pop()</code>：从队列的开头移除并返回元素</li>
<li><code>peek()</code>：返回队列开头的元素</li>
<li><code>empty()</code>：如果队列为空返回 true，否则返回 false</li>
</ul>
<h4>示例</h4>
<pre>输入：
["MyQueue", "push", "push", "peek", "pop", "empty"]
[[], [1], [2], [], [], []]
输出：[null, null, null, 1, 1, false]</pre>
<p><strong>说明：</strong>这是设计题，本地练习通过操作序列自动测试。</p>`,
    template: `class MyQueue:
    def __init__(self):
        # 在这里初始化你的数据结构（只能用栈/列表模拟栈）
        pass

    def push(self, x):
        """
        :type x: int
        :rtype: None
        """
        pass

    def pop(self):
        """
        :rtype: int
        """
        pass

    def peek(self):
        """
        :rtype: int
        """
        pass

    def empty(self):
        """
        :rtype: bool
        """
        pass
`,
    functionName: 'MyQueue',
    testCases: [],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/implement-queue-using-stacks/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19892047.html',
  },
  {
    id: 415,
    title: 'LC 415 - 字符串相加',
    difficulty: 'Easy',
    tags: ['字符串', '数学', '模拟'],
    description: `
<h3>415. 字符串相加 <span class="difficulty-tag easy">Easy</span></h3>
<p>给定两个字符串形式的非负整数 <code>num1</code> 和 <code>num2</code>，计算它们的和并同样以字符串形式返回。</p>
<p><strong>注意：</strong>不能使用任何内建的用于处理大整数的库（比如 BigInteger），也不能直接将输入的字符串转换为整数形式。</p>
<h4>示例</h4>
<pre>输入：num1 = "11", num2 = "123"
输出："134"</pre>
<pre>输入：num1 = "456", num2 = "77"
输出："533"</pre>
<pre>输入：num1 = "0", num2 = "0"
输出："0"</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= num1.length, num2.length &lt;= 10<sup>4</sup></li>
<li>num1 和 num2 都只包含数字 0-9</li>
<li>num1 和 num2 都不包含前导零（除了数字 0 本身）</li>
</ul>`,
    template: `def add_strings(num1, num2):
    """
    :type num1: str
    :type num2: str
    :rtype: str
    """
    # 在这里写你的代码（不能用 int() 转换整个字符串）
    pass
`,
    functionName: 'add_strings',
    testCases: [
      { input: ['11', '123'], expected: '134' },
      { input: ['456', '77'], expected: '533' },
      { input: ['0', '0'], expected: '0' },
      { input: ['9999', '1'], expected: '10000' },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/add-strings/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19892048.html',
  },
  {
    id: 912,
    title: 'LC 912 - 排序数组',
    difficulty: 'Medium',
    tags: ['排序', '数组', '分治'],
    description: `
<h3>912. 排序数组 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个整数数组 <code>nums</code>，请你将该数组升序排列。</p>
<p><strong>要求：</strong>时间复杂度 O(nlogn)，不使用内置排序函数。面试中常要求手写快排或归并排序。</p>
<h4>示例</h4>
<pre>输入：nums = [5,2,3,1]
输出：[1,2,3,5]</pre>
<pre>输入：nums = [5,1,1,2,0,0]
输出：[0,0,1,1,2,5]</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= nums.length &lt;= 5 * 10<sup>4</sup></li>
<li>-5 * 10<sup>4</sup> &lt;= nums[i] &lt;= 5 * 10<sup>4</sup></li>
</ul>`,
    template: `def sort_array(nums):
    """
    :type nums: List[int]
    :rtype: List[int]
    """
    # 在这里写你的代码（手写快排/归并，不要用 sort()）
    pass
`,
    functionName: 'sort_array',
    testCases: [
      { input: [[5, 2, 3, 1]], expected: [1, 2, 3, 5] },
      { input: [[5, 1, 1, 2, 0, 0]], expected: [0, 0, 1, 1, 2, 5] },
      { input: [[1]], expected: [1] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/sort-an-array/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19892049.html',
  },
]);

if (typeof window.syncPlaygroundProblems === 'function' && document.readyState !== 'loading') {
  window.syncPlaygroundProblems();
}
