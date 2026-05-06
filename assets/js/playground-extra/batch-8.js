// Extra playground problems (batch 8) — 设计类题目
// Note: Keep this file self-contained. It only appends objects into window.PLAYGROUND_EXTRA_PROBLEMS.

window.PLAYGROUND_EXTRA_PROBLEMS = (window.PLAYGROUND_EXTRA_PROBLEMS || []).concat([
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
]);

if (typeof window.syncPlaygroundProblems === 'function' && document.readyState !== 'loading') {
  window.syncPlaygroundProblems();
}
