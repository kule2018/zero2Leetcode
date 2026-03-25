window.PLAYGROUND_EXTRA_PROBLEMS = (window.PLAYGROUND_EXTRA_PROBLEMS || []).concat([
  // ========== Binary Search ==========
  {
    id: 74,
    title: 'LC 74 - 搜索二维矩阵',
    difficulty: 'Medium',
    tags: ['binary-search'],
    description: `
<h3>74. 搜索二维矩阵 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个满足下述性质的 <code>m x n</code> 整数矩阵 <code>matrix</code>：</p>
<ul>
  <li>每行中的整数从左到右按非递减顺序排列</li>
  <li>每行的第一个整数大于前一行的最后一个整数</li>
</ul>
<p>给定目标值 <code>target</code>，如果 <code>target</code> 在矩阵中，返回 <code>true</code>，否则返回 <code>false</code>。</p>
<h4>示例</h4>
<pre>matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
输出: true</pre>
<pre>matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
输出: false</pre>`,
    template: `def search_matrix(matrix, target):
    """
    :type matrix: List[List[int]]
    :type target: int
    :rtype: bool
    """
    # write your code here
    pass
`,
    functionName: 'search_matrix',
    testCases: [
      {
        input: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3],
        expected: true,
      },
      {
        input: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13],
        expected: false,
      },
      { input: [[[1]], 1], expected: true },
      { input: [[[1]], 0], expected: false },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/search-a-2d-matrix/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772979.html',
  },
  {
    id: 33,
    title: 'LC 33 - 搜索旋转排序数组',
    difficulty: 'Medium',
    tags: ['binary-search'],
    description: `
<h3>33. 搜索旋转排序数组 <span class="difficulty-tag medium">Medium</span></h3>
<p>整数数组 <code>nums</code> 按升序排列并在某个点上进行了旋转。给定 <code>nums</code> 和目标值 <code>target</code>，若 <code>target</code> 存在返回其下标，否则返回 <code>-1</code>。</p>
<p>要求时间复杂度为 <code>O(log n)</code>。</p>
<h4>示例</h4>
<pre>nums = [4,5,6,7,0,1,2], target = 0
输出: 4</pre>
<pre>nums = [4,5,6,7,0,1,2], target = 3
输出: -1</pre>`,
    template: `def search(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: int
    """
    # write your code here
    pass
`,
    functionName: 'search',
    testCases: [
      { input: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
      { input: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
      { input: [[1], 0], expected: -1 },
      { input: [[1], 1], expected: 0 },
      { input: [[5, 1, 3], 3], expected: 2 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/search-in-rotated-sorted-array/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772981.html',
  },
  {
    id: 153,
    title: 'LC 153 - 寻找旋转排序数组中的最小值',
    difficulty: 'Medium',
    tags: ['binary-search'],
    description: `
<h3>153. 寻找旋转排序数组中的最小值 <span class="difficulty-tag medium">Medium</span></h3>
<p>已知一个长度为 <code>n</code> 的数组 <code>nums</code> 是按升序排列后在某个点上进行了旋转（元素互不相同）。请找出并返回数组中的最小元素。</p>
<p>要求时间复杂度为 <code>O(log n)</code>。</p>
<h4>示例</h4>
<pre>nums = [3,4,5,1,2]
输出: 1</pre>
<pre>nums = [4,5,6,7,0,1,2]
输出: 0</pre>`,
    template: `def find_min(nums):
    """
    :type nums: List[int]
    :rtype: int
    """
    # write your code here
    pass
`,
    functionName: 'find_min',
    testCases: [
      { input: [[3, 4, 5, 1, 2]], expected: 1 },
      { input: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 },
      { input: [[11, 13, 15, 17]], expected: 11 },
      { input: [[2, 1]], expected: 1 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772982.html',
  },
  {
    id: 4,
    title: 'LC 4 - 寻找两个正序数组的中位数',
    difficulty: 'Hard',
    tags: ['binary-search'],
    description: `
<h3>4. 寻找两个正序数组的中位数 <span class="difficulty-tag hard">Hard</span></h3>
<p>给定两个大小分别为 <code>m</code> 和 <code>n</code> 的正序数组 <code>nums1</code> 和 <code>nums2</code>，请你找出并返回这两个正序数组的中位数。</p>
<p>要求算法的时间复杂度为 <code>O(log(m+n))</code>。</p>
<h4>示例</h4>
<pre>nums1 = [1,3], nums2 = [2]
输出: 2.0</pre>
<pre>nums1 = [1,2], nums2 = [3,4]
输出: 2.5</pre>`,
    template: `def find_median_sorted_arrays(nums1, nums2):
    """
    :type nums1: List[int]
    :type nums2: List[int]
    :rtype: float
    """
    # write your code here
    pass
`,
    functionName: 'find_median_sorted_arrays',
    testCases: [],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/median-of-two-sorted-arrays/solutions/',
    blogUrl: '',
  },

  // ========== DP ==========
  {
    id: 279,
    title: 'LC 279 - 完全平方数',
    difficulty: 'Medium',
    tags: ['dp'],
    description: `
<h3>279. 完全平方数 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个整数 <code>n</code>，返回和为 <code>n</code> 的完全平方数的最少数量。</p>
<p>完全平方数是一个整数的平方，例如 <code>1, 4, 9, 16 ...</code>。</p>
<h4>示例</h4>
<pre>n = 12
输出: 3
解释: 12 = 4 + 4 + 4</pre>
<pre>n = 13
输出: 2
解释: 13 = 4 + 9</pre>`,
    template: `def num_squares(n):
    """
    :type n: int
    :rtype: int
    """
    # write your code here
    pass
`,
    functionName: 'num_squares',
    testCases: [
      { input: [12], expected: 3 },
      { input: [13], expected: 2 },
      { input: [1], expected: 1 },
      { input: [43], expected: 3 },
      { input: [100], expected: 1 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/perfect-squares/solutions/',
    blogUrl: '',
  },
  {
    id: 139,
    title: 'LC 139 - 单词拆分',
    difficulty: 'Medium',
    tags: ['dp'],
    description: `
<h3>139. 单词拆分 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个字符串 <code>s</code> 和一个字符串列表 <code>wordDict</code>，判断 <code>s</code> 是否可以由 <code>wordDict</code> 中的单词拼接出来。</p>
<p>注意：可以重复使用字典中的单词。</p>
<h4>示例</h4>
<pre>s = "leetcode", wordDict = ["leet","code"]
输出: true</pre>
<pre>s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
输出: false</pre>`,
    template: `def word_break(s, wordDict):
    """
    :type s: str
    :type wordDict: List[str]
    :rtype: bool
    """
    # write your code here
    pass
`,
    functionName: 'word_break',
    testCases: [
      { input: ['leetcode', ['leet', 'code']], expected: true },
      { input: ['applepenapple', ['apple', 'pen']], expected: true },
      { input: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], expected: false },
      { input: ['aaaaaaa', ['aaaa', 'aaa']], expected: true },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/word-break/solutions/',
    blogUrl: '',
  },
  {
    id: 300,
    title: 'LC 300 - 最长递增子序列',
    difficulty: 'Medium',
    tags: ['dp'],
    description: `
<h3>300. 最长递增子序列 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个整数数组 <code>nums</code>，返回其最长严格递增子序列的长度。</p>
<p>子序列不要求连续。</p>
<h4>示例</h4>
<pre>nums = [10,9,2,5,3,7,101,18]
输出: 4</pre>`,
    template: `def length_of_lis(nums):
    """
    :type nums: List[int]
    :rtype: int
    """
    # write your code here
    pass
`,
    functionName: 'length_of_lis',
    testCases: [
      { input: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4 },
      { input: [[0, 1, 0, 3, 2, 3]], expected: 4 },
      { input: [[7, 7, 7, 7, 7]], expected: 1 },
      { input: [[5, 4, 3, 2, 1]], expected: 1 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/longest-increasing-subsequence/solutions/',
    blogUrl: '',
  },
  {
    id: 152,
    title: 'LC 152 - 乘积最大子数组',
    difficulty: 'Medium',
    tags: ['dp'],
    description: `
<h3>152. 乘积最大子数组 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个整数数组 <code>nums</code>，请你找出数组中乘积最大的非空连续子数组，并返回该子数组所对应的乘积。</p>
<h4>示例</h4>
<pre>nums = [2,3,-2,4]
输出: 6</pre>
<pre>nums = [-2,0,-1]
输出: 0</pre>`,
    template: `def max_product(nums):
    """
    :type nums: List[int]
    :rtype: int
    """
    # write your code here
    pass
`,
    functionName: 'max_product',
    testCases: [
      { input: [[2, 3, -2, 4]], expected: 6 },
      { input: [[-2, 0, -1]], expected: 0 },
      { input: [[-2, 3, -4]], expected: 24 },
      { input: [[-1, -2, -9, -6]], expected: 108 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/maximum-product-subarray/solutions/',
    blogUrl: '',
  },
  {
    id: 416,
    title: 'LC 416 - 分割等和子集',
    difficulty: 'Medium',
    tags: ['dp'],
    description: `
<h3>416. 分割等和子集 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个只包含正整数的非空数组 <code>nums</code>，请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。</p>
<h4>示例</h4>
<pre>nums = [1,5,11,5]
输出: true</pre>
<pre>nums = [1,2,3,5]
输出: false</pre>`,
    template: `def can_partition(nums):
    """
    :type nums: List[int]
    :rtype: bool
    """
    # write your code here
    pass
`,
    functionName: 'can_partition',
    testCases: [
      { input: [[1, 5, 11, 5]], expected: true },
      { input: [[1, 2, 3, 5]], expected: false },
      { input: [[2, 2, 1, 1]], expected: true },
      { input: [[1]], expected: false },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/partition-equal-subset-sum/solutions/',
    blogUrl: '',
  },
  {
    id: 32,
    title: 'LC 32 - 最长有效括号',
    difficulty: 'Hard',
    tags: ['dp'],
    description: `
<h3>32. 最长有效括号 <span class="difficulty-tag hard">Hard</span></h3>
<p>给你一个只包含 <code>'('</code> 和 <code>')'</code> 的字符串 <code>s</code>，找出最长有效（格式正确且连续）括号子串的长度。</p>
<h4>示例</h4>
<pre>s = "(()"
输出: 2</pre>
<pre>s = ")()())"
输出: 4</pre>`,
    template: `def longest_valid_parentheses(s):
    """
    :type s: str
    :rtype: int
    """
    # write your code here
    pass
`,
    functionName: 'longest_valid_parentheses',
    testCases: [
      { input: ['(()'], expected: 2 },
      { input: [')()())'], expected: 4 },
      { input: [''], expected: 0 },
      { input: ['()(())'], expected: 6 },
      { input: ['())(())'], expected: 4 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/longest-valid-parentheses/solutions/',
    blogUrl: '',
  },
  {
    id: 62,
    title: 'LC 62 - 不同路径',
    difficulty: 'Medium',
    tags: ['dp'],
    description: `
<h3>62. 不同路径 <span class="difficulty-tag medium">Medium</span></h3>
<p>一个机器人位于一个 <code>m x n</code> 网格的左上角。机器人每次只能向下或者向右移动一步。</p>
<p>机器人试图到达网格的右下角。问总共有多少条不同的路径？</p>
<h4>示例</h4>
<pre>m = 3, n = 7
输出: 28</pre>
<pre>m = 3, n = 2
输出: 3</pre>`,
    template: `def unique_paths(m, n):
    """
    :type m: int
    :type n: int
    :rtype: int
    """
    # write your code here
    pass
`,
    functionName: 'unique_paths',
    testCases: [
      { input: [3, 7], expected: 28 },
      { input: [3, 2], expected: 3 },
      { input: [1, 1], expected: 1 },
      { input: [1, 10], expected: 1 },
      { input: [10, 1], expected: 1 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/unique-paths/solutions/',
    blogUrl: '',
  },
  {
    id: 64,
    title: 'LC 64 - 最小路径和',
    difficulty: 'Medium',
    tags: ['dp'],
    description: `
<h3>64. 最小路径和 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定一个包含非负整数的 <code>m x n</code> 网格 <code>grid</code>，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。</p>
<p>每次只能向下或者向右移动一步。</p>
<h4>示例</h4>
<pre>grid = [[1,3,1],[1,5,1],[4,2,1]]
输出: 7</pre>`,
    template: `def min_path_sum(grid):
    """
    :type grid: List[List[int]]
    :rtype: int
    """
    # write your code here
    pass
`,
    functionName: 'min_path_sum',
    testCases: [
      { input: [[[1, 3, 1], [1, 5, 1], [4, 2, 1]]], expected: 7 },
      { input: [[[1, 2, 3], [4, 5, 6]]], expected: 12 },
      { input: [[[5]]], expected: 5 },
      { input: [[[0, 0], [0, 0]]], expected: 0 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/minimum-path-sum/solutions/',
    blogUrl: '',
  },
]);

