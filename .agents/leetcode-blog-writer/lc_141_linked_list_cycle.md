# LeetCode-141：环形链表，快慢指针能检测到环的关键不是"两个指针"，而是"它们怎么出发"

> **本题在线练习**：[LeetCode 141. 环形链表 — 在线练习（免费 · 无需登录 · AI 辅助）](https://onefly.top/zero2Leetcode/playground.html?id=141)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开刷 Hot 100。

## 一、题目概述

给定一个链表的头节点 `head`，判断这条链表中是否存在环。

如果链表中某个节点的 `next` 指针重新指向了链表中之前出现过的某个节点，则说明链表有环。

例如：

### 示例 1

```
3 -> 2 -> 0 -> -4
     ^           |
     |___________|
pos = 1（尾节点指向索引为 1 的节点）
```

输出：

```python
True
```

---

### 示例 2

```
1 -> 2
^    |
|____|
pos = 0
```

输出：

```python
True
```

---

### 示例 3

```
1
pos = -1（没有环）
```

输出：

```python
False
```

---

## 二、这题最容易踩的两个坑

### 坑一：指针初始相等，循环一次都不进

很多人第一次写这题，会写出这样的结构：

```python
slow = head
fast = head

while fast != slow:
    slow = slow.next
    fast = fast.next.next

return True
```

看起来有快慢指针，逻辑好像也说得通——但这段代码几乎对所有输入都会返回 `True`。

原因是：

> 一开始 `slow == fast == head`，所以 `while fast != slow` 这个条件在第一次判断时就是 `False`，循环根本不会执行，直接走到 `return True`。

这就是为什么无环链表比如 `[1]` 也会被误判成有环。

---

### 坑二：用 `-1` 判断链表结尾

另一个常见错误是：

```python
if fast.next != -1:
    fast = fast.next.next
```

这里的 `-1` 来自题目输入描述中的 `pos = -1`，表示"链表尾节点不指向任何节点，即无环"。

但这只是输入格式的一种描述，不是链表运行时真的会出现 `-1` 节点。链表里"没有下一个节点"在代码里的实际状态是：

```python
node.next is None
```

所以判断快指针还能不能继续走，正确写法是：

```python
while fast and fast.next:
```

而不是和 `-1` 比较。

---

## 三、这题的核心思路

这题用的是**快慢指针**，也叫 Floyd 判圈算法。

核心思想是：

- 慢指针每次走 **1 步**
- 快指针每次走 **2 步**

可以把它想象成两个人在跑道上跑步：

- 如果跑道有环（是个圆形跑道），跑得快的人迟早会从后面追上跑得慢的人
- 如果跑道是直线（没有环），跑得快的人会先跑到终点（`None`），然后游戏结束

---

## 四、标准快慢指针写法

```python
class Solution:
    def hasCycle(self, head: ListNode) -> bool:
        slow = head
        fast = head

        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next

            if slow == fast:
                return True

        return False
```

---

## 五、逐行拆解代码

### 1. 两个指针都从头出发

```python
slow = head
fast = head
```

慢指针和快指针都从 `head` 开始。

---

### 2. 循环条件：快指针还能继续走

```python
while fast and fast.next:
```

快指针每次要走两步，所以需要保证：

- `fast` 本身不是空
- `fast.next` 也不是空，否则 `fast.next.next` 会报错

只要这两个条件有一个不满足，就说明链表走到头了，不可能成环，退出循环。

---

### 3. 两个指针各自推进

```python
slow = slow.next
fast = fast.next.next
```

慢指针每次走一步，快指针每次走两步。

---

### 4. 在循环里判断是否相遇

```python
if slow == fast:
    return True
```

注意：这里比的是**节点对象本身**（引用），不是节点的值。

如果链表有环，快指针迟早会在环里"绕回来"追上慢指针，两者指向同一个节点时返回 `True`。

---

### 5. 循环正常结束，说明没有环

```python
return False
```

如果 `while` 条件因为 `fast` 或 `fast.next` 为 `None` 而结束，说明链表有尽头，没有环，返回 `False`。

---

## 六、为什么必须在推进之后再判断，而不是在推进之前

正确写法是先走再判断：

```python
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next

    if slow == fast:  # 走完之后判断
        return True
```

如果改成先判断再走：

```python
while fast and fast.next:
    if slow == fast:  # 走之前判断 —— 错误
        return True
    slow = slow.next
    fast = fast.next.next
```

那么初始状态 `slow == fast == head`，第一次进入循环就会直接返回 `True`，和前面说的那个坑一样。

---

## 七、手动模拟两个例子

### 有环的情况

```
3 -> 2 -> 0 -> -4
     ^           |
     |___________|
```

| 步骤 | slow | fast |
|------|------|------|
| 初始 | 3    | 3    |
| 第 1 步 | 2    | 0    |
| 第 2 步 | 0    | 2（绕回） |
| 第 3 步 | -4   | -4   |

第 3 步 `slow == fast`，返回 `True`。

---

### 无环的情况

```
1 -> 2 -> 3 -> 4 -> None
```

| 步骤 | slow | fast |
|------|------|------|
| 初始 | 1    | 1    |
| 第 1 步 | 2    | 3    |
| 第 2 步 | 3    | None（fast.next 为 None，退出） |

循环因 `fast.next is None` 而结束，返回 `False`。

---

## 八、复杂度分析

**时间复杂度：O(n)**

- 无环时，快指针最多走 n/2 轮就到终点
- 有环时，快指针进环后最多再走一圈就能追上慢指针
- 综合来看是线性时间

**空间复杂度：O(1)**

只用了两个额外的指针变量，不随链表长度增长。

---

## 九、这题真正训练的是什么

这道题表面上很简单，实际上在练三件事：

### 1. 链表判断的边界条件写法

`while fast and fast.next` 这个条件是链表快指针题的标准模板，需要同时判断当前节点和下一个节点是否为空。

### 2. 比较节点而不是比较值

`slow == fast` 比的是对象引用，是"同一个节点"，而不是 `slow.val == fast.val`。这一点在链表题里非常关键。

### 3. 快慢指针的"追及"直觉

有环链表就像环形跑道，快的人一定会追上慢的人。无环链表像直路，快的人先到终点。这个直觉在后续的环形链表进阶题（比如找环的入口、链表中点等）中会反复用到。

---

## 十、小结

这道题的标准解法是：

```python
class Solution:
    def hasCycle(self, head: ListNode) -> bool:
        slow = head
        fast = head

        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next

            if slow == fast:
                return True

        return False
```

有两个细节最值得记住：

- 循环条件是 `while fast and fast.next`，先保证快指针能走两步，不是和 `-1` 比
- 进入循环后先走再判断，不是先判断再走

这题是快慢指针在链表里的入门题。把"有环则相遇，无环则快指针先出界"这个判断逻辑吃透，后面的环形链表 II（找入口）、链表的中间节点等题都会顺很多。
