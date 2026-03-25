# LeetCode-138：随机链表的复制，难点不是"复制节点"，而是"复制关系"

> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开刷 Hot 100。

## 一、题目概述

给定一个长度为 `n` 的链表，每个节点除了有一个 `next` 指针指向下一个节点之外，还有一个 `random` 指针，可以指向链表中的任意节点，也可以指向 `null`。

请你构造这个链表的**深拷贝**。深拷贝意味着你要创建全新的节点，新链表中的每个节点的 `next` 和 `random` 指针都不能指向原链表中的节点。

### 示例 1

```
输入：head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
输出：[[7,null],[13,0],[11,4],[10,2],[1,0]]
```

每个节点用 `[val, random_index]` 表示，`random_index` 是 `random` 指针指向的节点的索引（从 0 开始），`null` 表示 `random` 指向空。

---

### 示例 2

```
输入：head = [[1,1],[2,1]]
输出：[[1,1],[2,1]]
```

---

### 示例 3

```
输入：head = [[3,null],[3,0],[3,null]]
输出：[[3,null],[3,0],[3,null]]
```

---

## 二、这题难在哪

如果链表只有 `next` 指针，深拷贝非常简单：遍历一遍，依次创建新节点，把 `next` 串起来就行。

但这道题多了一个 `random` 指针，它可以指向链表中的**任意节点**，甚至是还没被创建的节点。

问题就出在这里：

> 当你复制到某个节点，想设置它的 `random` 指针时，`random` 指向的那个新节点可能还不存在。

比如第一个节点的 `random` 指向第三个节点，但你才刚开始复制，第三个新节点还没创建出来。

所以这题的核心挑战是：**怎么在复制节点的同时，正确地建立 `random` 指向关系？**

---

## 三、核心思路：用哈希表建立"旧节点 -> 新节点"的映射

解法分两步：

### 第一遍遍历：只管创建节点

遍历原链表，对每个旧节点创建一个对应的新节点（只复制 `val`），然后把"旧节点 -> 新节点"这个对应关系存进一个哈希表。

遍历完之后，哈希表里就有了所有旧节点和新节点的一一对应关系。

### 第二遍遍历：设置 next 和 random

再遍历一次原链表，对每个旧节点：

- 旧节点的 `next` 是谁？去哈希表里查出对应的新节点，作为新节点的 `next`
- 旧节点的 `random` 是谁？同样去哈希表里查出对应的新节点，作为新节点的 `random`

这样，不管 `random` 指向链表中的哪个位置，都能通过哈希表在 O(1) 时间内找到对应的新节点。

---

## 四、代码实现

```python
class Solution:
    def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':
        if not head:
            return None

        old_to_new = {}

        cur = head
        while cur:
            old_to_new[cur] = Node(cur.val)
            cur = cur.next

        cur = head
        while cur:
            old_to_new[cur].next = old_to_new.get(cur.next)
            old_to_new[cur].random = old_to_new.get(cur.random)
            cur = cur.next

        return old_to_new[head]
```

---

## 五、逐行拆解

### 1. 处理空链表

```python
if not head:
    return None
```

如果链表为空，直接返回 `None`，没什么好复制的。

---

### 2. 创建哈希表

```python
old_to_new = {}
```

这个字典用来存储"旧节点 -> 新节点"的映射关系。键是原链表中的节点对象，值是新创建的节点对象。

---

### 3. 第一遍遍历：创建所有新节点

```python
cur = head
while cur:
    old_to_new[cur] = Node(cur.val)
    cur = cur.next
```

遍历整条原链表，对每个旧节点创建一个新节点，只复制 `val` 值。此时新节点的 `next` 和 `random` 都还是默认的 `None`。

遍历完之后，哈希表里存了所有旧节点到新节点的一一对应关系。

---

### 4. 第二遍遍历：连接 next 和 random

```python
cur = head
while cur:
    old_to_new[cur].next = old_to_new.get(cur.next)
    old_to_new[cur].random = old_to_new.get(cur.random)
    cur = cur.next
```

再遍历一次原链表，这次的任务是把新节点之间的关系建立起来：

- `old_to_new[cur]` 是当前旧节点对应的新节点
- `cur.next` 是旧链表中的下一个节点，通过 `old_to_new.get(cur.next)` 找到它对应的新节点，设为新节点的 `next`
- `cur.random` 同理，通过哈希表找到对应的新节点，设为新节点的 `random`

这里用 `get` 而不是 `[]` 是因为 `cur.next` 或 `cur.random` 可能是 `None`，而 `get` 对不存在的键会返回 `None`，刚好符合语义。

---

### 5. 返回新链表的头节点

```python
return old_to_new[head]
```

原链表的头节点 `head` 对应的新节点就是新链表的头。

---

## 六、手动模拟

以 `head = [[7,null],[13,0],[11,4],[10,2],[1,0]]` 为例。

原链表结构：

```
节点0(7) -> 节点1(13) -> 节点2(11) -> 节点3(10) -> 节点4(1) -> None

random 指向：
节点0.random = None
节点1.random = 节点0
节点2.random = 节点4
节点3.random = 节点2
节点4.random = 节点0
```

### 第一遍遍历：创建新节点

| cur（旧节点） | 创建的新节点 | old_to_new 中新增的映射 |
|-------------|------------|----------------------|
| 节点0(7)    | 新节点0(7) | 节点0 -> 新节点0      |
| 节点1(13)   | 新节点1(13)| 节点1 -> 新节点1      |
| 节点2(11)   | 新节点2(11)| 节点2 -> 新节点2      |
| 节点3(10)   | 新节点3(10)| 节点3 -> 新节点3      |
| 节点4(1)    | 新节点4(1) | 节点4 -> 新节点4      |

此时所有新节点的 `next` 和 `random` 都是 `None`。

### 第二遍遍历：设置指针

| cur（旧节点） | 新节点.next 设为 | 新节点.random 设为 |
|-------------|----------------|-------------------|
| 节点0(7)    | 新节点1(13)     | None              |
| 节点1(13)   | 新节点2(11)     | 新节点0(7)         |
| 节点2(11)   | 新节点3(10)     | 新节点4(1)         |
| 节点3(10)   | 新节点4(1)      | 新节点2(11)        |
| 节点4(1)    | None           | 新节点0(7)         |

最终返回 `新节点0(7)`，它就是深拷贝链表的头节点，整条新链表的结构和原链表完全一致，但所有节点都是全新创建的。

---

## 七、复杂度分析

### 时间复杂度：O(n)

两次遍历原链表，每次都是线性的。哈希表的查找和插入都是 O(1)。总共 O(n)。

### 空间复杂度：O(n)

哈希表存储了 n 个旧节点到新节点的映射，加上 n 个新节点本身。额外空间为 O(n)。

---

## 八、总结

这道题的核心思想可以用一句话概括：

> **用哈希表把旧节点和新节点一一对应起来，先全部创建，再统一连线。**

之所以需要两遍遍历，是因为 `random` 指针可能指向链表中的任意位置——可能是前面的节点，也可能是后面还没创建的节点。如果试图在一遍遍历中同时创建节点和设置指针，就会遇到"目标节点还不存在"的问题。

而哈希表的作用就是**把"创建"和"连线"这两件事解耦**：

- 第一遍只管创建，保证所有新节点都存在
- 第二遍只管连线，通过哈希表 O(1) 找到任意旧节点对应的新节点

最终的代码只有十几行，没有复杂的指针操作，只用了一个字典和两次遍历：

```python
class Solution:
    def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':
        if not head:
            return None

        old_to_new = {}

        cur = head
        while cur:
            old_to_new[cur] = Node(cur.val)
            cur = cur.next

        cur = head
        while cur:
            old_to_new[cur].next = old_to_new.get(cur.next)
            old_to_new[cur].random = old_to_new.get(cur.random)
            cur = cur.next

        return old_to_new[head]
```

这道题值得记住的不是代码本身，而是背后的思维方式：**当一个结构中的引用关系是"乱序"的（比如 `random` 可以指向任意位置），先把所有对象创建出来，再统一处理引用关系，是最干净的解法。** 这个模式在图的深拷贝、序列化/反序列化等问题中也会反复出现。
