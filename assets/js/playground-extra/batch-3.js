window.PLAYGROUND_EXTRA_PROBLEMS = (window.PLAYGROUND_EXTRA_PROBLEMS || []).concat([
  // ========== Tree ==========
  {
    id: 437,
    title: 'LC 437 - 路径总和 III',
    difficulty: 'Medium',
    tags: ['tree'],
    description: `
<h3>437. 路径总和 III <span class="difficulty-tag medium">Medium</span></h3>
<p>给定二叉树的根节点 <code>root</code> 和整数 <code>targetSum</code>，统计路径和等于 <code>targetSum</code> 的路径数。</p>
<p>路径必须向下（从父到子），但不要求从根开始，也不要求到叶子结束。</p>
<h4>示例</h4>
<pre>root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
输出: 3</pre>
<h4>提示</h4>
<ul>
  <li>节点数在合理范围内；节点值可能为负</li>
  <li>输入以数组层序表示二叉树，<code>null</code> 表示空节点</li>
</ul>`,
    template: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def path_sum(root, targetSum):
    """
    :type root: TreeNode
    :type targetSum: int
    :rtype: int
    """
    # write your code here
    pass
`,
    functionName: 'path_sum',
    setup: BINARY_TREE_SETUP,
    argWrappers: ['_to_tree'],
    testCases: [
      { input: [[10, 5, -3, 3, 2, null, 11, 3, -2, null, 1], 8], expected: 3 },
      { input: [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], 22], expected: 3 },
      { input: [[], 0], expected: 0 },
      { input: [[1], 1], expected: 1 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/path-sum-iii/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772929.html',
  },
  {
    id: 236,
    title: 'LC 236 - 二叉树的最近公共祖先',
    difficulty: 'Medium',
    tags: ['tree'],
    description: `
<h3>236. 二叉树的最近公共祖先 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定二叉树 <code>root</code>，以及两个节点值 <code>p</code> 和 <code>q</code>，返回它们的最近公共祖先节点的值。</p>
<p>说明：这里本地练习使用 <code>p</code>/<code>q</code> 的节点值作为输入（假设树中值唯一）。</p>
<h4>示例</h4>
<pre>root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
输出: 3</pre>`,
    template: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def lowest_common_ancestor(root, p, q):
    """
    :type root: TreeNode
    :type p: int
    :type q: int
    :rtype: int
    """
    # write your code here (return LCA's value)
    pass
`,
    functionName: 'lowest_common_ancestor',
    setup: BINARY_TREE_SETUP,
    argWrappers: ['_to_tree'],
    testCases: [
      { input: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1], expected: 3 },
      { input: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 4], expected: 5 },
      { input: [[1, 2], 1, 2], expected: 1 },
      { input: [[1, 2, 3], 2, 3], expected: 1 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772930.html',
  },
  {
    id: 124,
    title: 'LC 124 - 二叉树中的最大路径和',
    difficulty: 'Hard',
    tags: ['tree'],
    description: `
<h3>124. 二叉树中的最大路径和 <span class="difficulty-tag hard">Hard</span></h3>
<p>路径被定义为从任意节点出发，到任意节点结束，沿父子连接移动的节点序列（不必经过根）。</p>
<p>路径至少包含一个节点，返回路径中各节点值之和的最大值。</p>
<h4>示例</h4>
<pre>root = [-10,9,20,null,null,15,7]
输出: 42</pre>`,
    template: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def max_path_sum(root):
    """
    :type root: TreeNode
    :rtype: int
    """
    # write your code here
    pass
`,
    functionName: 'max_path_sum',
    setup: BINARY_TREE_SETUP,
    argWrappers: ['_to_tree'],
    testCases: [
      { input: [[1, 2, 3]], expected: 6 },
      { input: [[-10, 9, 20, null, null, 15, 7]], expected: 42 },
      { input: [[2, -1]], expected: 2 },
      { input: [[-3]], expected: -3 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/binary-tree-maximum-path-sum/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772931.html',
  },

  // ========== Graph ==========
  {
    id: 994,
    title: 'LC 994 - 腐烂的橘子',
    difficulty: 'Medium',
    tags: ['graph'],
    description: `
<h3>994. 腐烂的橘子 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定 <code>m x n</code> 网格：</p>
<ul>
  <li><code>0</code> 空格子</li>
  <li><code>1</code> 新鲜橘子</li>
  <li><code>2</code> 腐烂橘子</li>
</ul>
<p>每分钟，腐烂橘子会使上下左右相邻的新鲜橘子腐烂。返回所有橘子腐烂所需的最小分钟数；若不可能则返回 <code>-1</code>。</p>
<h4>示例</h4>
<pre><code>输入：grid = [[2,1,1],[1,1,0],[0,1,1]]
输出：4

输入：grid = [[2,1,1],[0,1,1],[1,0,1]]
输出：-1

输入：grid = [[0,2]]
输出：0</code></pre>`,
    template: `def oranges_rotting(grid):
    """
    :type grid: List[List[int]]
    :rtype: int
    """
    # write your code here
    pass
`,
    functionName: 'oranges_rotting',
    testCases: [
      { input: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expected: 4 },
      { input: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], expected: -1 },
      { input: [[[0, 2]]], expected: 0 },
      { input: [[[1]]], expected: -1 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/rotting-oranges/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772933.html',
  },
  {
    id: 207,
    title: 'LC 207 - 课程表',
    difficulty: 'Medium',
    tags: ['graph'],
    description: `
<h3>207. 课程表 <span class="difficulty-tag medium">Medium</span></h3>
<p>你需要选修 <code>numCourses</code> 门课，课程编号 <code>0..numCourses-1</code>。</p>
<p><code>prerequisites[i] = [a, b]</code> 表示学习课程 <code>a</code> 之前必须先学 <code>b</code>。</p>
<p>如果能完成所有课程返回 <code>True</code>，否则返回 <code>False</code>。</p>`,
    template: `def can_finish(numCourses, prerequisites):
    """
    :type numCourses: int
    :type prerequisites: List[List[int]]
    :rtype: bool
    """
    # write your code here
    pass
`,
    functionName: 'can_finish',
    testCases: [
      { input: [2, [[1, 0]]], expected: true },
      { input: [2, [[1, 0], [0, 1]]], expected: false },
      { input: [4, [[1, 0], [2, 0], [3, 1], [3, 2]]], expected: true },
      { input: [1, []], expected: true },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/course-schedule/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772934.html',
  },
  {
    id: 208,
    title: 'LC 208 - 实现 Trie (前缀树)',
    difficulty: 'Medium',
    tags: ['graph'],
    description: `
<h3>208. 实现 Trie (前缀树) <span class="difficulty-tag medium">Medium</span></h3>
<p>实现一个 Trie，支持：</p>
<ul>
  <li><code>insert(word)</code></li>
  <li><code>search(word)</code></li>
  <li><code>starts_with(prefix)</code></li>
</ul>
<p>说明：该题为类设计题，本地练习允许不提供可运行测试用例。</p>`,
    template: `class Trie:
    def __init__(self):
        # write your code here
        pass

    def insert(self, word):
        """
        :type word: str
        :rtype: None
        """
        # write your code here
        pass

    def search(self, word):
        """
        :type word: str
        :rtype: bool
        """
        # write your code here
        pass

    def starts_with(self, prefix):
        """
        :type prefix: str
        :rtype: bool
        """
        # write your code here
        pass
`,
    functionName: 'Trie',
    testCases: [],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/implement-trie-prefix-tree/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772935.html',
  },

  // ========== Backtrack ==========
  {
    id: 17,
    title: 'LC 17 - 电话号码的字母组合',
    difficulty: 'Medium',
    tags: ['backtrack'],
    description: `
<h3>17. 电话号码的字母组合 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定仅包含数字 <code>2-9</code> 的字符串 <code>digits</code>，返回它能表示的所有字母组合。</p>
<p>数字与字母的映射与电话按键相同。返回顺序任意。</p>`,
    template: `def letter_combinations(digits):
    """
    :type digits: str
    :rtype: List[str]
    """
    # write your code here
    pass
`,
    functionName: 'letter_combinations',
    testCases: [
      { input: ['23'], expected: ['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf'] },
      { input: [''], expected: [] },
      { input: ['2'], expected: ['a', 'b', 'c'] },
      {
        input: ['79'],
        expected: [
          'pw', 'px', 'py', 'pz',
          'qw', 'qx', 'qy', 'qz',
          'rw', 'rx', 'ry', 'rz',
          'sw', 'sx', 'sy', 'sz',
        ],
      },
    ],
    compareFunc: 'sorted',
    solutionUrl: 'https://leetcode.cn/problems/letter-combinations-of-a-phone-number/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772973.html',
  },
  {
    id: 39,
    title: 'LC 39 - 组合总和',
    difficulty: 'Medium',
    tags: ['backtrack'],
    description: `
<h3>39. 组合总和 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定无重复元素数组 <code>candidates</code> 和目标值 <code>target</code>，找出所有和为 <code>target</code> 的组合。</p>
<p><code>candidates</code> 中的数字可以无限次选取。组合内元素顺序不重要。</p>`,
    template: `def combination_sum(candidates, target):
    """
    :type candidates: List[int]
    :type target: int
    :rtype: List[List[int]]
    """
    # write your code here
    pass
`,
    functionName: 'combination_sum',
    testCases: [
      { input: [[2, 3, 6, 7], 7], expected: [[2, 2, 3], [7]] },
      { input: [[2, 3, 5], 8], expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]] },
      { input: [[2], 1], expected: [] },
      { input: [[1], 2], expected: [[1, 1]] },
    ],
    compareFunc: 'sorted_nested',
    solutionUrl: 'https://leetcode.cn/problems/combination-sum/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772974.html',
  },
  {
    id: 22,
    title: 'LC 22 - 括号生成',
    difficulty: 'Medium',
    tags: ['backtrack'],
    description: `
<h3>22. 括号生成 <span class="difficulty-tag medium">Medium</span></h3>
<p>数字 <code>n</code> 表示括号对数，返回所有有效的括号组合。</p>`,
    template: `def generate_parenthesis(n):
    """
    :type n: int
    :rtype: List[str]
    """
    # write your code here
    pass
`,
    functionName: 'generate_parenthesis',
    testCases: [
      { input: [3], expected: ['((()))', '(()())', '(())()', '()(())', '()()()'] },
      { input: [1], expected: ['()'] },
      { input: [2], expected: ['(())', '()()'] },
    ],
    compareFunc: 'sorted',
    solutionUrl: 'https://leetcode.cn/problems/generate-parentheses/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772975.html',
  },
  {
    id: 79,
    title: 'LC 79 - 单词搜索',
    difficulty: 'Medium',
    tags: ['backtrack'],
    description: `
<h3>79. 单词搜索 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定 <code>m x n</code> 字符网格 <code>board</code> 和字符串 <code>word</code>，判断是否存在一条路径使得路径上的字符依次拼成 <code>word</code>。</p>
<p>每个格子最多使用一次，路径只能上下左右移动。</p>`,
    template: `def exist(board, word):
    """
    :type board: List[List[str]]
    :type word: str
    :rtype: bool
    """
    # write your code here
    pass
`,
    functionName: 'exist',
    testCases: [
      { input: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'ABCCED'], expected: true },
      { input: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'SEE'], expected: true },
      { input: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'ABCB'], expected: false },
      { input: [[['a']], 'a'], expected: true },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/word-search/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772976.html',
  },
  {
    id: 131,
    title: 'LC 131 - 分割回文串',
    difficulty: 'Medium',
    tags: ['backtrack'],
    description: `
<h3>131. 分割回文串 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定字符串 <code>s</code>，将其分割成若干子串，使得每个子串都是回文串。返回所有可能的分割方案。</p>
<p>返回顺序任意。</p>`,
    template: `def partition(s):
    """
    :type s: str
    :rtype: List[List[str]]
    """
    # write your code here
    pass
`,
    functionName: 'partition',
    setup: `
def _parts_to_strings(parts):
    # Convert [['aa','b'], ['a','a','b']] -> ['aa|b','a|a|b'] for stable comparison.
    if parts is None:
        return None
    return sorted(['|'.join(p) for p in parts])
`,
    returnWrapper: '_parts_to_strings',
    testCases: [
      { input: ['aab'], expected: ['a|a|b', 'aa|b'] },
      { input: ['a'], expected: ['a'] },
      { input: ['aba'], expected: ['a|b|a', 'aba'] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/palindrome-partitioning/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772977.html',
  },
  {
    id: 51,
    title: 'LC 51 - N 皇后',
    difficulty: 'Hard',
    tags: ['backtrack'],
    description: `
<h3>51. N 皇后 <span class="difficulty-tag hard">Hard</span></h3>
<p>在 <code>n x n</code> 的棋盘上放置 <code>n</code> 个皇后，使得任意两个皇后都不在同一行、同一列、同一对角线上。</p>
<p>返回所有不同的解，每个解是棋盘的字符串表示。</p>`,
    template: `def solve_n_queens(n):
    """
    :type n: int
    :rtype: List[List[str]]
    """
    # write your code here
    pass
`,
    functionName: 'solve_n_queens',
    setup: `
def _boards_to_strings(boards):
    # Convert List[List[str]] boards into sorted List[str] for stable comparison.
    if boards is None:
        return None
    return sorted(['\\n'.join(b) for b in boards])
`,
    returnWrapper: '_boards_to_strings',
    testCases: [
      {
        input: [4],
        expected: [
          '.Q..\\n...Q\\nQ...\\n..Q.',
          '..Q.\\nQ...\\n...Q\\n.Q..',
        ],
      },
      { input: [1], expected: ['Q'] },
      { input: [2], expected: [] },
      { input: [3], expected: [] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/n-queens/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772978.html',
  },
]);

if (typeof window.syncPlaygroundProblems === 'function' && document.readyState !== 'loading') {
  window.syncPlaygroundProblems();
}
