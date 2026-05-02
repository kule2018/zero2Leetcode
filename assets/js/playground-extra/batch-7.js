// Extra playground problems (batch 7) — 华为/腾讯面试高频补充
// Note: Keep this file self-contained. It only appends objects into window.PLAYGROUND_EXTRA_PROBLEMS.

window.PLAYGROUND_EXTRA_PROBLEMS = (window.PLAYGROUND_EXTRA_PROBLEMS || []).concat([
  {
    id: 217,
    title: 'LC 217 - 存在重复元素',
    difficulty: 'Easy',
    tags: ['哈希表', '数组'],
    description: `
<h3>217. 存在重复元素 <span class="difficulty-tag easy">Easy</span></h3>
<p>给你一个整数数组 <code>nums</code>。如果任一值在数组中出现<strong>至少两次</strong>，返回 <code>True</code>；如果每个元素互不相同，返回 <code>False</code>。</p>
<h4>示例</h4>
<pre>输入：nums = [1,2,3,1]
输出：True</pre>
<pre>输入：nums = [1,2,3,4]
输出：False</pre>
<pre>输入：nums = [1,1,1,3,3,4,3,2,4,2]
输出：True</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= nums.length &lt;= 10<sup>5</sup></li>
<li>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></li>
</ul>`,
    template: `def contains_duplicate(nums):
    """
    :type nums: List[int]
    :rtype: bool
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'contains_duplicate',
    testCases: [
      { input: [[1, 2, 3, 1]], expected: true },
      { input: [[1, 2, 3, 4]], expected: false },
      { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/contains-duplicate/solutions/',
  },
  {
    id: 704,
    title: 'LC 704 - 二分查找',
    difficulty: 'Easy',
    tags: ['二分查找', '数组'],
    description: `
<h3>704. 二分查找 <span class="difficulty-tag easy">Easy</span></h3>
<p>给定一个 <code>n</code> 个元素有序的（升序）整型数组 <code>nums</code> 和一个目标值 <code>target</code>，写一个函数搜索 <code>nums</code> 中的 <code>target</code>，如果目标值存在返回下标，否则返回 <code>-1</code>。</p>
<h4>示例</h4>
<pre>输入：nums = [-1,0,3,5,9,12], target = 9
输出：4</pre>
<pre>输入：nums = [-1,0,3,5,9,12], target = 2
输出：-1</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= nums.length &lt;= 10<sup>4</sup></li>
<li>nums 中的所有元素互不相同</li>
<li>nums 按升序排列</li>
</ul>`,
    template: `def search(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'search',
    testCases: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { input: [[5], 5], expected: 0 },
      { input: [[2, 5], 5], expected: 1 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/binary-search/solutions/',
  },
  {
    id: 71,
    title: 'LC 71 - 简化路径',
    difficulty: 'Medium',
    tags: ['栈', '字符串'],
    description: `
<h3>71. 简化路径 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个字符串 <code>path</code>，表示指向某一文件或目录的 Unix 风格<strong>绝对路径</strong>（以 <code>'/'</code> 开头），请你将其转化为更加简洁的规范路径。</p>
<p>规则：</p>
<ul>
<li><code>.</code> 表示当前目录</li>
<li><code>..</code> 表示上一级目录</li>
<li>多个连续斜杠视为单个斜杠</li>
<li>任何以 <code>.</code> 开头的非特殊目录名（如 <code>...</code>）视为普通目录名</li>
</ul>
<h4>示例</h4>
<pre>输入：path = "/home/"
输出："/home"</pre>
<pre>输入：path = "/home//foo/"
输出："/home/foo"</pre>
<pre>输入：path = "/home/user/Documents/../Pictures"
输出："/home/user/Pictures"</pre>
<pre>输入：path = "/../"
输出："/"</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= path.length &lt;= 3000</li>
<li>path 由英文字母、数字、'.'、'/' 或 '_' 组成</li>
<li>path 是一个有效的 Unix 风格绝对路径</li>
</ul>`,
    template: `def simplify_path(path):
    """
    :type path: str
    :rtype: str
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'simplify_path',
    testCases: [
      { input: ['/home/'], expected: '/home' },
      { input: ['/home//foo/'], expected: '/home/foo' },
      { input: ['/home/user/Documents/../Pictures'], expected: '/home/user/Pictures' },
      { input: ['/../'], expected: '/' },
      { input: ['/.../a/../b/c/../d/./'], expected: '/.../b/d' },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/simplify-path/solutions/',
  },
  {
    id: 91,
    title: 'LC 91 - 解码方法',
    difficulty: 'Medium',
    tags: ['动态规划', '字符串'],
    description: `
<h3>91. 解码方法 <span class="difficulty-tag medium">Medium</span></h3>
<p>一条包含字母 <code>A-Z</code> 的消息通过以下映射进行了编码：<code>'A' -> "1"</code>, <code>'B' -> "2"</code>, ..., <code>'Z' -> "26"</code>。</p>
<p>给你一个只含数字的<strong>非空</strong>字符串 <code>s</code>，请计算并返回<strong>解码</strong>方法的总数。</p>
<h4>示例</h4>
<pre>输入：s = "12"
输出：2
解释：它可以解码为 "AB"（1 2）或者 "L"（12）</pre>
<pre>输入：s = "226"
输出：3
解释："BZ"（2 26）、"VF"（22 6）、"BBF"（2 2 6）</pre>
<pre>输入：s = "06"
输出：0
解释："06" 无法映射到 "F"，因为有前导零</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= s.length &lt;= 100</li>
<li>s 只包含数字，可能包含前导零</li>
</ul>`,
    template: `def num_decodings(s):
    """
    :type s: str
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'num_decodings',
    testCases: [
      { input: ['12'], expected: 2 },
      { input: ['226'], expected: 3 },
      { input: ['06'], expected: 0 },
      { input: ['11106'], expected: 2 },
      { input: ['10'], expected: 1 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/decode-ways/solutions/',
  },
  {
    id: 134,
    title: 'LC 134 - 加油站',
    difficulty: 'Medium',
    tags: ['贪心', '数组'],
    description: `
<h3>134. 加油站 <span class="difficulty-tag medium">Medium</span></h3>
<p>在一条环路上有 <code>n</code> 个加油站，其中第 <code>i</code> 个加油站有汽油 <code>gas[i]</code> 升。</p>
<p>你有一辆油箱容量无限的汽车，从第 <code>i</code> 个加油站开往第 <code>i+1</code> 个加油站需要消耗汽油 <code>cost[i]</code> 升。你从其中的一个加油站出发，开始时油箱为空。</p>
<p>给定两个整数数组 <code>gas</code> 和 <code>cost</code>，如果你可以按顺序绕环路行驶一周，则返回出发时加油站的编号，否则返回 <code>-1</code>。如果存在解，则保证它是唯一的。</p>
<h4>示例</h4>
<pre>输入：gas = [1,2,3,4,5], cost = [3,4,5,1,2]
输出：3</pre>
<pre>输入：gas = [2,3,4], cost = [3,4,3]
输出：-1</pre>
<h4>提示</h4>
<ul>
<li>gas.length == cost.length == n</li>
<li>1 &lt;= n &lt;= 10<sup>5</sup></li>
<li>0 &lt;= gas[i], cost[i] &lt;= 10<sup>4</sup></li>
</ul>`,
    template: `def can_complete_circuit(gas, cost):
    """
    :type gas: List[int]
    :type cost: List[int]
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'can_complete_circuit',
    testCases: [
      { input: [[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]], expected: 3 },
      { input: [[2, 3, 4], [3, 4, 3]], expected: -1 },
      { input: [[5, 1, 2, 3, 4], [4, 4, 1, 5, 1]], expected: 4 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/gas-station/solutions/',
  },
  {
    id: 456,
    title: 'LC 456 - 132 模式',
    difficulty: 'Medium',
    tags: ['单调栈', '数组'],
    description: `
<h3>456. 132 模式 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个整数数组 <code>nums</code>，数组中共有 <code>n</code> 个整数。<strong>132 模式</strong>的子序列由三个整数 <code>nums[i]</code>、<code>nums[j]</code>、<code>nums[k]</code> 组成，并同时满足：<code>i &lt; j &lt; k</code> 且 <code>nums[i] &lt; nums[k] &lt; nums[j]</code>。</p>
<p>如果 <code>nums</code> 中存在 132 模式的子序列，返回 <code>True</code>，否则返回 <code>False</code>。</p>
<h4>示例</h4>
<pre>输入：nums = [1,2,3,4]
输出：False
解释：序列中不存在 132 模式的子序列</pre>
<pre>输入：nums = [3,1,4,2]
输出：True
解释：序列中有一个 132 模式的子序列 [1,4,2]</pre>
<pre>输入：nums = [-1,3,2,0]
输出：True
解释：序列中有多个 132 模式的子序列，如 [-1,3,2]、[-1,3,0]、[-1,2,0]</pre>
<h4>提示</h4>
<ul>
<li>n == nums.length</li>
<li>1 &lt;= n &lt;= 2 * 10<sup>5</sup></li>
<li>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></li>
</ul>`,
    template: `def find132pattern(nums):
    """
    :type nums: List[int]
    :rtype: bool
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'find132pattern',
    testCases: [
      { input: [[1, 2, 3, 4]], expected: false },
      { input: [[3, 1, 4, 2]], expected: true },
      { input: [[-1, 3, 2, 0]], expected: true },
      { input: [[1, 0, 1, -4, -3]], expected: false },
      { input: [[3, 5, 0, 3, 4]], expected: true },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/132-pattern/solutions/',
  },
  {
    id: 718,
    title: 'LC 718 - 最长重复子数组',
    difficulty: 'Medium',
    tags: ['动态规划', '数组'],
    description: `
<h3>718. 最长重复子数组 <span class="difficulty-tag medium">Medium</span></h3>
<p>给两个整数数组 <code>nums1</code> 和 <code>nums2</code>，返回两个数组中<strong>公共的、长度最长的子数组</strong>的长度。</p>
<p><strong>注意：</strong>子数组是连续的（区别于子序列）。</p>
<h4>示例</h4>
<pre>输入：nums1 = [1,2,3,2,1], nums2 = [3,2,1,4,7]
输出：3
解释：长度最长的公共子数组是 [3,2,1]</pre>
<pre>输入：nums1 = [0,0,0,0,0], nums2 = [0,0,0,0,0]
输出：5</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= nums1.length, nums2.length &lt;= 1000</li>
<li>0 &lt;= nums1[i], nums2[i] &lt;= 100</li>
</ul>`,
    template: `def find_length(nums1, nums2):
    """
    :type nums1: List[int]
    :type nums2: List[int]
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'find_length',
    testCases: [
      { input: [[1, 2, 3, 2, 1], [3, 2, 1, 4, 7]], expected: 3 },
      { input: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], expected: 5 },
      { input: [[1, 2, 3], [4, 5, 6]], expected: 0 },
      { input: [[5, 14, 53, 80, 48], [50, 47, 3, 80, 83]], expected: 1 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/maximum-length-of-repeated-subarray/solutions/',
  },
  {
    id: 986,
    title: 'LC 986 - 区间列表的交集',
    difficulty: 'Medium',
    tags: ['双指针', '数组'],
    description: `
<h3>986. 区间列表的交集 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定两个由一些<strong>闭区间</strong>组成的列表 <code>firstList</code> 和 <code>secondList</code>，其中每个区间列表都是成对<strong>不相交</strong>的，并且已经排序。</p>
<p>返回这两个区间列表的交集。</p>
<h4>示例</h4>
<pre>输入：firstList = [[0,2],[5,10],[13,23],[24,25]], secondList = [[1,5],[8,12],[15,24],[25,26]]
输出：[[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]</pre>
<pre>输入：firstList = [[1,3],[5,9]], secondList = []
输出：[]</pre>
<h4>提示</h4>
<ul>
<li>0 &lt;= firstList.length, secondList.length &lt;= 1000</li>
<li>0 &lt;= start<sub>i</sub> &lt; end<sub>i</sub> &lt;= 10<sup>9</sup></li>
</ul>`,
    template: `def interval_intersection(firstList, secondList):
    """
    :type firstList: List[List[int]]
    :type secondList: List[List[int]]
    :rtype: List[List[int]]
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'interval_intersection',
    testCases: [
      { input: [[[0, 2], [5, 10], [13, 23], [24, 25]], [[1, 5], [8, 12], [15, 24], [25, 26]]], expected: [[1, 2], [5, 5], [8, 10], [15, 23], [24, 24], [25, 25]] },
      { input: [[[1, 3], [5, 9]], []], expected: [] },
      { input: [[[1, 7]], [[3, 10]]], expected: [[3, 7]] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/interval-list-intersections/solutions/',
  },
  {
    id: 1423,
    title: 'LC 1423 - 可获得的最大点数',
    difficulty: 'Medium',
    tags: ['滑动窗口', '数组'],
    description: `
<h3>1423. 可获得的最大点数 <span class="difficulty-tag medium">Medium</span></h3>
<p>几张卡牌排成一行，每张卡牌都有一个对应的点数。点数由整数数组 <code>cardPoints</code> 给出。</p>
<p>每次行动，你可以从行的开头或者末尾拿一张卡牌，最终你必须正好拿 <code>k</code> 张卡牌。</p>
<p>你的点数就是你拿到手中的所有卡牌的点数之和。返回你能获得的最大点数。</p>
<h4>示例</h4>
<pre>输入：cardPoints = [1,2,3,4,5,6,1], k = 3
输出：12
解释：取右边三张 [1,6,5] 或左1+右2 等组合，最优为 6+5+1=12</pre>
<pre>输入：cardPoints = [2,2,2], k = 2
输出：4</pre>
<pre>输入：cardPoints = [9,7,7,9,7,7,9], k = 7
输出：55</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= cardPoints.length &lt;= 10<sup>5</sup></li>
<li>1 &lt;= cardPoints[i] &lt;= 10<sup>4</sup></li>
<li>1 &lt;= k &lt;= cardPoints.length</li>
</ul>`,
    template: `def max_score(cardPoints, k):
    """
    :type cardPoints: List[int]
    :type k: int
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'max_score',
    testCases: [
      { input: [[1, 2, 3, 4, 5, 6, 1], 3], expected: 12 },
      { input: [[2, 2, 2], 2], expected: 4 },
      { input: [[9, 7, 7, 9, 7, 7, 9], 7], expected: 55 },
      { input: [[1, 1000, 1], 1], expected: 1000 },
      { input: [[1, 79, 80, 1, 1, 1, 200, 1], 3], expected: 202 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/maximum-points-you-can-obtain-from-cards/solutions/',
  },
]);

if (typeof window.syncPlaygroundProblems === 'function' && document.readyState !== 'loading') {
  window.syncPlaygroundProblems();
}
