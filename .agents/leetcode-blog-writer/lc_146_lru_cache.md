# LeetCode-146：LRU 缓存，哈希表 + 双向链表，让查找和淘汰都是 O(1)

> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开刷 Hot 100。

## 题目概述

设计一个满足 **LRU（最近最少使用）** 缓存约束的数据结构，支持以下操作：

- `get(key)`：如果 key 存在，返回对应 value 并标记为"最近使用"；否则返回 -1
- `put(key, value)`：插入或更新键值对；如果容量已满，淘汰最久未使用的键

**要求：`get` 和 `put` 都必须是 O(1) 时间复杂度。**

```
输入：
["LRUCache","put","put","get","put","get","put","get","get","get"]
[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]

输出：[null,null,null,1,null,-1,null,-1,3,4]
```

---

## 核心思路

这题的难点在于：如何同时做到 **O(1) 查找** 和 **O(1) 淘汰最久未使用的元素**？

- **哈希表**：可以 O(1) 通过 key 找到对应节点
- **双向链表**：可以 O(1) 在任意位置删除节点，O(1) 在头部插入节点

两者结合：

> **哈希表存 key → 链表节点的映射，双向链表维护访问顺序。**

规则：
- 最近使用的放链表**头部**
- 最久未使用的在链表**尾部**
- 淘汰时删除尾部节点
- 每次 get/put 都把对应节点移到头部

使用 **dummy head** 和 **dummy tail** 哨兵节点，避免处理边界条件。

---

## 代码实现

```python
class Node:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}  # key -> Node
        self.head = Node()  # dummy head
        self.tail = Node()  # dummy tail
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        """从双向链表中删除一个节点"""
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add_to_head(self, node):
        """把节点插入到 head 之后（最近使用）"""
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node

    def _move_to_head(self, node):
        """先删除，再插入头部"""
        self._remove(node)
        self._add_to_head(node)

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._move_to_head(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            node = self.cache[key]
            node.val = value
            self._move_to_head(node)
        else:
            node = Node(key, value)
            self.cache[key] = node
            self._add_to_head(node)
            if len(self.cache) > self.cap:
                # 淘汰尾部节点
                lru = self.tail.prev
                self._remove(lru)
                del self.cache[lru.key]
```

---

## 逐行拆解

### 1. Node 类

每个节点存 `key`、`val`、`prev`、`next`。之所以要存 `key`，是因为淘汰尾部节点时需要从哈希表中删除对应的 key。

### 2. 初始化

```python
self.head.next = self.tail
self.tail.prev = self.head
```

初始链表：`head ↔ tail`，中间没有数据节点。哨兵节点让插入和删除永远不用处理 None。

### 3. `_remove(node)`

断开 node 的前后连接，O(1) 操作：

```
A ↔ node ↔ B  →  A ↔ B
```

### 4. `_add_to_head(node)`

把 node 插入到 head 和 head.next 之间：

```
head ↔ old_first  →  head ↔ node ↔ old_first
```

### 5. `get(key)`

查哈希表，找到节点后移到头部（标记为最近使用），返回值。

### 6. `put(key, value)`

- key 已存在：更新 value，移到头部
- key 不存在：创建新节点，加入头部和哈希表；如果超容量，淘汰 `tail.prev`（最久未使用）

---

## 手动模拟

容量 = 2，操作序列：

| 操作 | 链表状态（head→tail） | cache | 返回值 |
|------|----------------------|-------|--------|
| put(1,1) | head ↔ [1:1] ↔ tail | {1} | - |
| put(2,2) | head ↔ [2:2] ↔ [1:1] ↔ tail | {1,2} | - |
| get(1) | head ↔ [1:1] ↔ [2:2] ↔ tail | {1,2} | **1** |
| put(3,3) | head ↔ [3:3] ↔ [1:1] ↔ tail | {1,3}（淘汰2） | - |
| get(2) | 不变 | {1,3} | **-1** |
| put(4,4) | head ↔ [4:4] ↔ [3:3] ↔ tail | {3,4}（淘汰1） | - |
| get(1) | 不变 | {3,4} | **-1** |
| get(3) | head ↔ [3:3] ↔ [4:4] ↔ tail | {3,4} | **3** |
| get(4) | head ↔ [4:4] ↔ [3:3] ↔ tail | {3,4} | **4** |

输出：`[null,null,null,1,null,-1,null,-1,3,4]`，与预期一致。

---

## 复杂度分析

| | 复杂度 | 说明 |
|---|---|---|
| 时间 | O(1) | get 和 put 都是哈希表查找 + 链表指针操作 |
| 空间 | O(capacity) | 哈希表和链表各存 capacity 个节点 |

---

## 为什么不用 Python 的 OrderedDict？

Python 的 `collections.OrderedDict` 内部就是哈希表 + 双向链表，用它可以几行写完：

```python
class LRUCache(OrderedDict):
    def __init__(self, capacity):
        self.cap = capacity
    def get(self, key):
        if key not in self: return -1
        self.move_to_end(key)
        return self[key]
    def put(self, key, value):
        if key in self: self.move_to_end(key)
        self[key] = value
        if len(self) > self.cap:
            self.popitem(last=False)
```

但面试中通常要求**手写底层实现**，理解哈希表 + 双向链表的配合才是这题的意义。

---

## 总结

| 要点 | 内容 |
|------|------|
| 数据结构 | 哈希表（O(1) 查找）+ 双向链表（O(1) 增删） |
| 淘汰策略 | 最近使用放头部，最久未使用在尾部，满了删尾部 |
| 关键细节 | Node 要存 key（淘汰时需要从 cache 中 del）|
| 哨兵节点 | dummy head/tail 消除边界判断 |

这题是**数据结构设计**的经典题，考察的不是算法技巧，而是对链表和哈希表的深入理解。把"哈希表负责快速定位，链表负责维护顺序"这个搭配记住，后面遇到 LFU 缓存等变种也会更容易上手。
