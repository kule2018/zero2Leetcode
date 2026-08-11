// Extra playground problems (batch 8) — 设计与其他技巧
// Note: Keep this file self-contained. It only appends objects into window.PLAYGROUND_EXTRA_PROBLEMS.

window.PLAYGROUND_EXTRA_PROBLEMS = (window.PLAYGROUND_EXTRA_PROBLEMS || []).concat([
  {
    id: 189,
    title: 'LC 189 - 轮转数组',
    difficulty: 'Medium',
    tags: ['数组', '双指针'],
    description: `
<h3>189. 轮转数组 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定一个整数数组 <code>nums</code>，将数组中的元素向右轮转 <code>k</code> 个位置，其中 <code>k</code> 是非负数。</p>
<p>请<strong>原地</strong>修改数组；本站测试会读取修改后的 <code>nums</code>，无需返回值。</p>
<h4>示例</h4>
<pre>输入：nums = [1,2,3,4,5,6,7], k = 3
输出：[5,6,7,1,2,3,4]</pre>
<pre>输入：nums = [-1,-100,3,99], k = 2
输出：[3,99,-1,-100]</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= nums.length &lt;= 10<sup>5</sup></li>
<li>0 &lt;= k &lt;= 10<sup>5</sup></li>
<li>尝试使用空间复杂度为 <code>O(1)</code> 的原地算法。</li>
</ul>`,
    template: `def rotate(nums, k):
    """
    :type nums: List[int]
    :type k: int
    :rtype: None
    """
    # 请原地修改 nums
    pass
`,
    functionName: '_run_rotate',
    setup: `
def _run_rotate(nums, k):
    rotate(nums, k)
    return nums
`,
    testCases: [
      { input: [[1, 2, 3, 4, 5, 6, 7], 3], expected: [5, 6, 7, 1, 2, 3, 4] },
      { input: [[-1, -100, 3, 99], 2], expected: [3, 99, -1, -100] },
      { input: [[1, 2], 3], expected: [2, 1] },
      { input: [[1], 0], expected: [1] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/rotate-array/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/22228302.html',
  },
  {
    id: 238,
    title: 'LC 238 - 除自身以外数组的乘积',
    difficulty: 'Medium',
    tags: ['数组', '前缀积'],
    description: `
<h3>238. 除自身以外数组的乘积 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个整数数组 <code>nums</code>，返回数组 <code>answer</code>，其中 <code>answer[i]</code> 等于 <code>nums</code> 中除 <code>nums[i]</code> 之外其余各元素的乘积。</p>
<p>题目数据保证数组中任意元素的全部前缀元素和后缀元素的乘积都在 32 位整数范围内。</p>
<p>请在 <code>O(n)</code> 时间复杂度内完成，并且不能使用除法。</p>
<h4>示例</h4>
<pre>输入：nums = [1,2,3,4]
输出：[24,12,8,6]</pre>
<pre>输入：nums = [-1,1,0,-3,3]
输出：[0,0,9,0,0]</pre>
<h4>提示</h4>
<ul>
<li>2 &lt;= nums.length &lt;= 10<sup>5</sup></li>
<li>-30 &lt;= nums[i] &lt;= 30</li>
<li>进阶：除输出数组外，能否只使用 <code>O(1)</code> 额外空间？</li>
</ul>`,
    template: `def product_except_self(nums):
    """
    :type nums: List[int]
    :rtype: List[int]
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'product_except_self',
    testCases: [
      { input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
      { input: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] },
      { input: [[0, 0]], expected: [0, 0] },
      { input: [[2, 3]], expected: [3, 2] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/product-of-array-except-self/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/22228304.html',
  },
  {
    id: 146,
    title: 'LC 146 - LRU 缓存',
    difficulty: 'Medium',
    tags: ['设计', '哈希表', '链表'],
    description: `
<h3>146. LRU 缓存 <span class="difficulty-tag medium">Medium</span></h3>
<p>请你设计并实现一个满足 <a href="https://baike.baidu.com/item/LRU" target="_blank">LRU (最近最少使用) 缓存</a> 约束的数据结构。</p>
<p>实现 <code>LRUCache</code> 类：</p>
<ul>
<li><code>LRUCache(int capacity)</code> 以<strong>正整数</strong>作为容量 <code>capacity</code> 初始化 LRU 缓存</li>
<li><code>int get(int key)</code> 如果关键字 <code>key</code> 存在于缓存中，则返回关键字的值，否则返回 <code>-1</code></li>
<li><code>void put(int key, int value)</code> 如果关键字 <code>key</code> 已经存在，则变更其数据值 <code>value</code>；如果不存在，则向缓存中插入该组 <code>key-value</code>。如果插入操作导致关键字数量超过 <code>capacity</code>，则应该<strong>逐出</strong>最久未使用的关键字。</li>
</ul>
<p>函数 <code>get</code> 和 <code>put</code> 必须以 <code>O(1)</code> 的平均时间复杂度运行。</p>
<h4>示例</h4>
<pre>输入：
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
输出：
[null, null, null, 1, null, -1, null, -1, 3, 4]

解释：
LRUCache lru = new LRUCache(2);
lru.put(1, 1); // 缓存是 {1=1}
lru.put(2, 2); // 缓存是 {1=1, 2=2}
lru.get(1);    // 返回 1
lru.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
lru.get(2);    // 返回 -1 (未找到)
lru.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
lru.get(1);    // 返回 -1 (未找到)
lru.get(3);    // 返回 3
lru.get(4);    // 返回 4</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= capacity &lt;= 3000</li>
<li>0 &lt;= key &lt;= 10<sup>4</sup></li>
<li>0 &lt;= value &lt;= 10<sup>5</sup></li>
<li>最多调用 2 * 10<sup>5</sup> 次 get 和 put</li>
</ul>`,
    template: `class LRUCache:
    def __init__(self, capacity):
        """
        :type capacity: int
        """
        # 在这里写你的代码
        pass

    def get(self, key):
        """
        :type key: int
        :rtype: int
        """
        # 在这里写你的代码
        pass

    def put(self, key, value):
        """
        :type key: int
        :type value: int
        :rtype: None
        """
        # 在这里写你的代码
        pass
`,
    functionName: '_run_class_ops',
    setup: `
def _run_class_ops(operations, arguments):
    obj = None
    results = []
    for op, args in zip(operations, arguments):
        if op == "LRUCache":
            obj = LRUCache(*args)
            results.append(None)
        else:
            ret = getattr(obj, op)(*args)
            results.append(ret)
    return results
`,
    testCases: [
      {
        input: [
          ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"],
          [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
        ],
        expected: [null, null, null, 1, null, -1, null, -1, 3, 4]
      },
      {
        input: [
          ["LRUCache", "put", "put", "get", "put", "put", "get"],
          [[2], [2, 1], [2, 2], [2], [1, 1], [4, 1], [2]]
        ],
        expected: [null, null, null, 2, null, null, -1]
      },
      {
        input: [
          ["LRUCache", "put", "get", "put", "get", "get"],
          [[1], [2, 1], [2], [3, 2], [2], [3]]
        ],
        expected: [null, null, 1, null, -1, 2]
      },
      {
        input: [
          ["LRUCache", "put", "put", "put", "put", "get", "get"],
          [[2], [2, 1], [1, 1], [2, 3], [4, 1], [1], [2]]
        ],
        expected: [null, null, null, null, null, -1, 3]
      },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/lru-cache/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19769206',
  },
  {
    id: 902,
    title: 'LC 902 - 最大为 N 的数字组合',
    difficulty: 'Hard',
    tags: ['动态规划', '数位 DP'],
    description: `
<h3>902. 最大为 N 的数字组合 <span class="difficulty-tag hard">Hard</span></h3>
<p>给定一个按非递减顺序排列且元素互不相同的数字字符数组 <code>digits</code>，你可以使用其中任意次数的数字组成正整数。</p>
<p>返回可以生成的小于或等于整数 <code>n</code> 的正整数个数。</p>
<h4>示例</h4>
<pre>输入：digits = ["1","3","5","7"], n = 100
输出：20</pre>
<pre>输入：digits = ["1","4","9"], n = 1000000000
输出：29523</pre>
<pre>输入：digits = ["7"], n = 8
输出：1</pre>
<h4>提示</h4>
<ul>
<li><code>1 &lt;= digits.length &lt;= 9</code></li>
<li><code>digits[i]</code> 是从 <code>'1'</code> 到 <code>'9'</code> 的数字字符</li>
<li><code>digits</code> 中的所有值互不相同，并按非递减顺序排列</li>
<li><code>1 &lt;= n &lt;= 10<sup>9</sup></code></li>
</ul>`,
    template: `def at_most_n_given_digit_set(digits, n):
    """
    :type digits: List[str]
    :type n: int
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'at_most_n_given_digit_set',
    testCases: [
      { input: [["1", "3", "5", "7"], 100], expected: 20 },
      { input: [["1", "4", "9"], 1000000000], expected: 29523 },
      { input: [["7"], 8], expected: 1 },
      { input: [["1", "2", "3", "4", "5", "6", "7", "8", "9"], 9], expected: 9 },
      { input: [["3", "4", "8"], 4], expected: 2 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/numbers-at-most-n-given-digit-set/solutions/',
  },
]);

if (typeof window.syncPlaygroundProblems === 'function' && document.readyState !== 'loading') {
  window.syncPlaygroundProblems();
}
