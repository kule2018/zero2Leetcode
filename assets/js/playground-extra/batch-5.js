// Extra playground problems (batch 5)
// Note: Keep this file self-contained. It only appends objects into window.PLAYGROUND_EXTRA_PROBLEMS.

window.PLAYGROUND_EXTRA_PROBLEMS = (window.PLAYGROUND_EXTRA_PROBLEMS || []).concat([
  {
    id: 5,
    title: 'LC 5 - 最长回文子串',
    difficulty: 'Medium',
    tags: ['动态规划', '字符串'],
    description: `
<h3>5. 最长回文子串 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个字符串 <code>s</code>，找到 <code>s</code> 中最长的回文子串，并返回该子串。</p>
<p><strong>回文串</strong> 是正着读和反着读都一样的字符串。</p>
<h4>示例</h4>
<pre>输入：s = "cbbd"
输出："bb"</pre>
<pre>输入：s = "aaaa"
输出："aaaa"</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= s.length &lt;= 1000</li>
<li>s 仅由数字和英文字母组成</li>
 </ul>`,
    template: `def longest_palindrome(s):
    """
    :type s: str
    :rtype: str
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'longest_palindrome',
    testCases: [
      { input: ['cbbd'], expected: 'bb' },
      { input: ['bananas'], expected: 'anana' },
      { input: ['aaaa'], expected: 'aaaa' },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/longest-palindromic-substring/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19778834.html',
  },
  {
    id: 1143,
    title: 'LC 1143 - 最长公共子序列',
    difficulty: 'Medium',
    tags: ['动态规划', '字符串'],
    description: `
<h3>1143. 最长公共子序列 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定两个字符串 <code>text1</code> 和 <code>text2</code>，返回这两个字符串的最长公共子序列的长度。</p>
<p>如果不存在公共子序列，返回 0。</p>
<p><strong>子序列</strong> 是从原字符串删除（或不删除）一些字符而不改变剩余字符相对顺序得到的新字符串。</p>
<h4>示例</h4>
<pre>输入：text1 = "abcde", text2 = "ace"
输出：3</pre>
<pre>输入：text1 = "abc", text2 = "def"
输出：0</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= text1.length, text2.length &lt;= 1000</li>
<li>text1 和 text2 仅由小写英文字母组成</li>
</ul>`,
    template: `def longest_common_subsequence(text1, text2):
    """
    :type text1: str
    :type text2: str
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'longest_common_subsequence',
    testCases: [
      { input: ['abcde', 'ace'], expected: 3 },
      { input: ['abc', 'abc'], expected: 3 },
      { input: ['abc', 'def'], expected: 0 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/longest-common-subsequence/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19778835.html',
  },
  {
    id: 72,
    title: 'LC 72 - 编辑距离',
    difficulty: 'Medium',
    tags: ['动态规划', '字符串'],
    description: `
<h3>72. 编辑距离 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你两个单词 <code>word1</code> 和 <code>word2</code>，请返回将 <code>word1</code> 转换成 <code>word2</code> 所使用的最少操作数。</p>
<p>你可以对一个单词进行如下三种操作：</p>
<ul>
<li>插入一个字符</li>
<li>删除一个字符</li>
<li>替换一个字符</li>
</ul>
<h4>示例</h4>
<pre>输入：word1 = "horse", word2 = "ros"
输出：3</pre>
<pre>输入：word1 = "intention", word2 = "execution"
输出：5</pre>
<h4>提示</h4>
<ul>
<li>0 &lt;= word1.length, word2.length &lt;= 500</li>
<li>word1 和 word2 由小写英文字母组成</li>
</ul>`,
    template: `def min_distance(word1, word2):
    """
    :type word1: str
    :type word2: str
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'min_distance',
    testCases: [
      { input: ['horse', 'ros'], expected: 3 },
      { input: ['intention', 'execution'], expected: 5 },
      { input: ['', 'a'], expected: 1 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/edit-distance/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19778836.html',
  },
  {
    id: 45,
    title: 'LC 45 - 跳跃游戏 II',
    difficulty: 'Medium',
    tags: ['贪心', '数组'],
    description: `
<h3>45. 跳跃游戏 II <span class="difficulty-tag medium">Medium</span></h3>
<p>给定一个长度为 <code>n</code> 的 0 索引整数数组 <code>nums</code>。你最初位于 <code>nums[0]</code>。</p>
<p>数组中的每个元素 <code>nums[i]</code> 表示你在位置 <code>i</code> 最多可以向前跳跃的步数。</p>
<p>返回到达 <code>nums[n - 1]</code> 的最少跳跃次数。题目保证可以到达终点。</p>
<h4>示例</h4>
<pre>输入：nums = [2,3,1,1,4]
输出：2</pre>
<pre>输入：nums = [2,3,0,1,4]
输出：2</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= nums.length &lt;= 10<sup>4</sup></li>
<li>0 &lt;= nums[i] &lt;= 1000</li>
</ul>`,
    template: `def jump(nums):
    """
    :type nums: List[int]
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'jump',
    testCases: [
      { input: [[2, 3, 1, 1, 4]], expected: 2 },
      { input: [[2, 3, 0, 1, 4]], expected: 2 },
      { input: [[0]], expected: 0 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/jump-game-ii/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19778838.html',
  },
  {
    id: 763,
    title: 'LC 763 - 划分字母区间',
    difficulty: 'Medium',
    tags: ['贪心', '双指针', '字符串'],
    description: `
<h3>763. 划分字母区间 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个字符串 <code>s</code>。我们要把这个字符串尽可能多地划分为若干段，同一个字母最多出现在其中的一段。</p>
<p>返回一个表示每个字符串片段的长度的列表。</p>
<h4>示例</h4>
<pre>输入：s = "ababcbacadefegdehijhklij"
输出：[9,7,8]</pre>
<pre>输入：s = "eccbbbbdec"
输出：[10]</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= s.length &lt;= 500</li>
<li>s 由小写英文字母组成</li>
</ul>`,
    template: `def partition_labels(s):
    """
    :type s: str
    :rtype: List[int]
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'partition_labels',
    testCases: [
      { input: ['ababcbacadefegdehijhklij'], expected: [9, 7, 8] },
      { input: ['eccbbbbdec'], expected: [10] },
      { input: ['a'], expected: [1] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/partition-labels/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19778839.html',
  },
  {
    id: 347,
    title: 'LC 347 - 前 K 个高频元素',
    difficulty: 'Medium',
    tags: ['堆', '哈希表', '数组'],
    description: `
<h3>347. 前 K 个高频元素 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个整数数组 <code>nums</code> 和一个整数 <code>k</code>，请你返回其中出现频率前 <code>k</code> 高的元素。</p>
<p>你可以按任意顺序返回答案。</p>
<h4>示例</h4>
<pre>输入：nums = [1,1,1,2,2,3], k = 2
输出：[1,2]</pre>
<pre>输入：nums = [1], k = 1
输出：[1]</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= nums.length &lt;= 10<sup>5</sup></li>
<li>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></li>
<li>k 的取值范围是 [1, 数组中不相同的元素的个数]</li>
</ul>`,
    template: `def top_k_frequent(nums, k):
    """
    :type nums: List[int]
    :type k: int
    :rtype: List[int]
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'top_k_frequent',
    testCases: [
      { input: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] },
      { input: [[4, 1, -1, 2, -1, 2, 3], 2], expected: [-1, 2] },
      { input: [[1], 1], expected: [1] },
    ],
    compareFunc: 'sorted',
    solutionUrl: 'https://leetcode.cn/problems/top-k-frequent-elements/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19778841.html',
  },
  {
    id: 295,
    title: 'LC 295 - 数据流的中位数',
    difficulty: 'Hard',
    tags: ['堆', '设计', '数据流'],
    description: `
<h3>295. 数据流的中位数 <span class="difficulty-tag hard">Hard</span></h3>
<p>中位数是有序整数列表中的中间值。如果列表长度是偶数，中位数是中间两个数的平均值。</p>
<p>设计一个支持以下两种操作的数据结构：</p>
<ul>
<li><code>addNum(num)</code>：从数据流中添加一个整数 <code>num</code></li>
<li><code>findMedian()</code>：返回目前所有元素的中位数</li>
</ul>
<p><strong>说明：</strong>这是设计题，本地练习暂不提供统一的自动测试用例；你可以自行编写交互测试。</p>`,
    template: `class MedianFinder:
    def __init__(self):
        # 在这里初始化你的数据结构
        pass

    def addNum(self, num):
        """
        :type num: int
        :rtype: None
        """
        # 在这里写你的代码
        pass

    def findMedian(self):
        """
        :rtype: float
        """
        # 在这里写你的代码
        pass
`,
    functionName: 'MedianFinder',
    testCases: [],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/find-median-from-data-stream/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19778842.html',
  },
  {
    id: 73,
    title: 'LC 73 - 矩阵置零',
    difficulty: 'Medium',
    tags: ['矩阵', '数组'],
    description: `
<h3>73. 矩阵置零 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定一个 <code>m x n</code> 的矩阵 <code>matrix</code>。如果一个元素为 0，则将其所在行和列的所有元素都设为 0。</p>
<p>请使用<strong>原地</strong>算法。</p>
<p><strong>说明：</strong>本地练习返回修改后的 <code>matrix</code> 即可。</p>
<h4>示例</h4>
<pre>输入：matrix = [[1,1,1],[1,0,1],[1,1,1]]
输出：[[1,0,1],[0,0,0],[1,0,1]]</pre>
<pre>输入：matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
输出：[[0,0,0,0],[0,4,5,0],[0,3,1,0]]</pre>`,
    template: `def set_zeroes(matrix):
    """
    :type matrix: List[List[int]]
    :rtype: List[List[int]]
    """
    # 在这里写你的代码（原地修改 matrix 后返回）
    pass
`,
    functionName: 'set_zeroes',
    testCases: [
      { input: [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]], expected: [[1, 0, 1], [0, 0, 0], [1, 0, 1]] },
      { input: [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]], expected: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/set-matrix-zeroes/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19778843.html',
  },
  {
    id: 54,
    title: 'LC 54 - 螺旋矩阵',
    difficulty: 'Medium',
    tags: ['矩阵', '数组'],
    description: `
<h3>54. 螺旋矩阵 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个 <code>m x n</code> 矩阵 <code>matrix</code>，请按照顺时针螺旋顺序，返回矩阵中的所有元素。</p>
<h4>示例</h4>
<pre>输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
输出：[1,2,3,6,9,8,7,4,5]</pre>
<pre>输入：matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
输出：[1,2,3,4,8,12,11,10,9,5,6,7]</pre>`,
    template: `def spiral_order(matrix):
    """
    :type matrix: List[List[int]]
    :rtype: List[int]
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'spiral_order',
    testCases: [
      { input: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [1, 2, 3, 6, 9, 8, 7, 4, 5] },
      { input: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] },
      { input: [[[1]]], expected: [1] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/spiral-matrix/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19778846.html',
  },
  {
    id: 240,
    title: 'LC 240 - 搜索二维矩阵 II',
    difficulty: 'Medium',
    tags: ['矩阵', '二分', '搜索'],
    description: `
<h3>240. 搜索二维矩阵 II <span class="difficulty-tag medium">Medium</span></h3>
<p>编写一个高效的算法来搜索 <code>m x n</code> 矩阵 <code>matrix</code> 中的一个目标值 <code>target</code>。</p>
<p>该矩阵具有以下特性：</p>
<ul>
<li>每行的元素从左到右升序排列</li>
<li>每列的元素从上到下升序排列</li>
</ul>
<h4>示例</h4>
<pre>输入：matrix = [
  [1,4,7,11,15],
  [2,5,8,12,19],
  [3,6,9,16,22],
  [10,13,14,17,24],
  [18,21,23,26,30]
], target = 5
输出：true</pre>`,
    template: `def search_matrix(matrix, target):
    """
    :type matrix: List[List[int]]
    :type target: int
    :rtype: bool
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'search_matrix',
    testCases: [
      {
        input: [
          [[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]],
          5,
        ],
        expected: true,
      },
      {
        input: [
          [[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]],
          20,
        ],
        expected: false,
      },
      { input: [[], 1], expected: false },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/search-a-2d-matrix-ii/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19778848.html',
  },
  {
    id: 75,
    title: 'LC 75 - 颜色分类',
    difficulty: 'Medium',
    tags: ['排序', '双指针', '数组'],
    description: `
<h3>75. 颜色分类 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定一个包含红色、白色和蓝色、共 <code>n</code> 个元素的数组 <code>nums</code>，原地对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。</p>
<p>我们使用整数 <code>0</code>、<code>1</code> 和 <code>2</code> 分别表示红色、白色和蓝色。</p>
<p><strong>说明：</strong>本地练习返回排序后的 <code>nums</code> 即可。</p>
<h4>示例</h4>
<pre>输入：nums = [2,0,2,1,1,0]
输出：[0,0,1,1,2,2]</pre>`,
    template: `def sort_colors(nums):
    """
    :type nums: List[int]
    :rtype: List[int]
    """
    # 在这里写你的代码（原地排序 nums 后返回）
    pass
`,
    functionName: 'sort_colors',
    testCases: [
      { input: [[2, 0, 2, 1, 1, 0]], expected: [0, 0, 1, 1, 2, 2] },
      { input: [[2, 0, 1]], expected: [0, 1, 2] },
      { input: [[0]], expected: [0] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/sort-colors/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19778849.html',
  },
  {
    id: 31,
    title: 'LC 31 - 下一个排列',
    difficulty: 'Medium',
    tags: ['技巧', '数组', '双指针'],
    description: `
<h3>31. 下一个排列 <span class="difficulty-tag medium">Medium</span></h3>
<p>整数数组的一个排列就是将其所有成员以序列或线性顺序排列。</p>
<p>例如，<code>[1,2,3]</code>、<code>[1,3,2]</code>、<code>[3,1,2]</code> 都是 <code>[1,2,3]</code> 的排列。</p>
<p>给你一个整数数组 <code>nums</code>，找出 <code>nums</code> 的下一个排列。</p>
<p>下一个排列是指将数组重新排列成字典序中下一个更大的排列。如果不存在更大的排列，则将其重新排列为字典序最小的排列（即升序排列）。</p>
<p><strong>说明：</strong>本地练习返回修改后的 <code>nums</code> 即可。</p>
<h4>示例</h4>
<pre>输入：nums = [1,2,3]
输出：[1,3,2]</pre>
<pre>输入：nums = [3,2,1]
输出：[1,2,3]</pre>`,
    template: `def next_permutation(nums):
    """
    :type nums: List[int]
    :rtype: List[int]
    """
    # 在这里写你的代码（原地修改 nums 后返回）
    pass
`,
    functionName: 'next_permutation',
    testCases: [
      { input: [[1, 2, 3]], expected: [1, 3, 2] },
      { input: [[3, 2, 1]], expected: [1, 2, 3] },
      { input: [[1, 1, 5]], expected: [1, 5, 1] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/next-permutation/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19778850.html',
  },
  {
    id: 287,
    title: 'LC 287 - 寻找重复数',
    difficulty: 'Medium',
    tags: ['技巧', '数组', '双指针'],
    description: `
<h3>287. 寻找重复数 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定一个包含 <code>n + 1</code> 个整数的数组 <code>nums</code>，其数字都在 <code>[1, n]</code> 范围内（包括 1 和 n），可知至少存在一个重复的整数。</p>
<p>假设 <code>nums</code> 只有一个重复的整数，返回这个重复的数。</p>
<p><strong>要求：</strong>不能修改数组，且只使用常数级额外空间。</p>
<h4>示例</h4>
<pre>输入：nums = [1,3,4,2,2]
输出：2</pre>
<pre>输入：nums = [3,1,3,4,2]
输出：3</pre>`,
    template: `def find_duplicate(nums):
    """
    :type nums: List[int]
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'find_duplicate',
    testCases: [
      { input: [[1, 3, 4, 2, 2]], expected: 2 },
      { input: [[3, 1, 3, 4, 2]], expected: 3 },
      { input: [[1, 1]], expected: 1 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/find-the-duplicate-number/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19778852.html',
  },
  {
    id: 41,
    title: 'LC 41 - 缺失的第一个正数',
    difficulty: 'Hard',
    tags: ['技巧', '数组', '原地哈希'],
    description: `
<h3>41. 缺失的第一个正数 <span class="difficulty-tag hard">Hard</span></h3>
<p>给你一个未排序的整数数组 <code>nums</code>，请你找出其中没有出现的最小的正整数。</p>
<p>请你实现时间复杂度为 <code>O(n)</code> 并且只使用常数级别额外空间的解决方案。</p>
<h4>示例</h4>
<pre>输入：nums = [1,2,0]
输出：3</pre>
<pre>输入：nums = [3,4,-1,1]
输出：2</pre>
<pre>输入：nums = [7,8,9,11,12]
输出：1</pre>`,
    template: `def first_missing_positive(nums):
    """
    :type nums: List[int]
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'first_missing_positive',
    testCases: [
      { input: [[1, 2, 0]], expected: 3 },
      { input: [[3, 4, -1, 1]], expected: 2 },
      { input: [[7, 8, 9, 11, 12]], expected: 1 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/first-missing-positive/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19778854.html',
  },
]);

if (typeof window.syncPlaygroundProblems === 'function' && document.readyState !== 'loading') {
  window.syncPlaygroundProblems();
}
