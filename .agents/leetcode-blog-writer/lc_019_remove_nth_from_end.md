# LeetCode-019：删除链表的倒数第 N 个结点，快指针先走 N 步不是"技巧"，而是让两指针之间恰好隔出一个"倒数窗口"

## 一、题目概述

给定一个链表的头节点 `head` 和一个整数 `n`，删除链表的**倒数第 n 个节点**，并返回链表的头节点。

例如：

### 示例 1

```
输入：head = [1, 2, 3, 4, 5], n = 2
```

```
1 -> 2 -> 3 -> 4 -> 5
                     ↑
               倒数第 2 个是 4，删掉它
```

输出：

```python
[1, 2, 3, 5]
```

---

### 示例 2

```
输入：head = [1], n = 1
```

输出：

```python
[]
```

---

### 示例 3

```
输入：head = [1, 2], n = 1
```

输出：

```python
[1]
```

---

## 二、核心思路

这题的难点在于：链表没有下标，你不能像数组一样直接跳到"倒数第 n 个"位置。

但有一个办法可以**不用先数长度**就找到目标节点——**快慢指针**。

核心思想是：

- 让快指针先走 **n 步**
- 然后快慢指针**一起走**，每次各走一步
- 当快指针走到链表末尾（`None`）时，慢指针正好停在**要删除节点的前一个位置**

为什么这样可行？

> 因为快指针比慢指针多走了 n 步，当快指针到达末尾时，慢指针距离末尾正好还有 n 个节点。此时慢指针指向的是倒数第 n+1 个节点，也就是目标节点的前驱——正好方便我们做删除操作。

另外还有一个细节：如果要删除的恰好是**头节点**（比如 `[1,2]`, n=2），那慢指针没有"前一个节点"可以停。为了统一处理这种边界，我们在链表头部加一个 **dummy 哨兵节点**。

---

## 三、代码实现

```python
class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        fast = dummy
        slow = dummy

        for _ in range(n):
            fast = fast.next

        while fast.next:
            fast = fast.next
            slow = slow.next

        slow.next = slow.next.next

        return dummy.next
```

---

## 四、逐行拆解代码

### 1. 创建 dummy 哨兵节点

```python
dummy = ListNode(0, head)
```

在链表最前面加一个虚拟节点，它的 `next` 指向真正的 `head`。

这样做的好处是：即使要删的是第一个节点，慢指针也有地方停（停在 dummy 上），不用单独处理边界。

---

### 2. 快慢指针都从 dummy 出发

```python
fast = dummy
slow = dummy
```

两个指针都从 dummy 开始，确保后续的"间距"计算是准确的。

---

### 3. 快指针先走 n 步

```python
for _ in range(n):
    fast = fast.next
```

让快指针先往前走 n 步。走完之后，快指针和慢指针之间隔了 n 个节点。

---

### 4. 快慢指针一起走，直到快指针到达最后一个节点

```python
while fast.next:
    fast = fast.next
    slow = slow.next
```

注意循环条件是 `fast.next`，而不是 `fast`。

因为我们需要慢指针停在**目标节点的前一个位置**，这样才能执行删除。当 `fast.next` 为 `None` 时，`fast` 指向最后一个节点，`slow` 指向的就是倒数第 n+1 个节点。

---

### 5. 删除目标节点

```python
slow.next = slow.next.next
```

经典的链表删除操作：把慢指针的 `next` 直接跳过目标节点，指向目标节点的下一个。

---

### 6. 返回真正的头节点

```python
return dummy.next
```

不能直接返回 `head`，因为 `head` 可能已经被删了。返回 `dummy.next` 才是删除后链表的真正头节点。

---

## 五、手动模拟

### 输入：`[1, 2, 3, 4, 5]`，n = 2

初始状态（加了 dummy）：

```
dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> None
```

**第一阶段：快指针先走 2 步**

| 步骤 | fast 指向 | slow 指向 |
|------|-----------|-----------|
| 初始 | dummy     | dummy     |
| 第 1 步 | 1      | dummy     |
| 第 2 步 | 2      | dummy     |

此时 fast 和 slow 之间隔了 2 个节点。

---

**第二阶段：一起走，直到 fast.next 为 None**

| 步骤 | fast 指向 | slow 指向 |
|------|-----------|-----------|
| 第 3 步 | 3      | 1         |
| 第 4 步 | 4      | 2         |
| 第 5 步 | 5      | 3         |

此时 `fast.next` 为 `None`，循环结束。

`slow` 指向 3，它的下一个节点是 4（倒数第 2 个），正是我们要删除的。

---

**执行删除：**

```
slow.next = slow.next.next
```

把 3 的 `next` 从 4 改为 5：

```
dummy -> 1 -> 2 -> 3 -> 5 -> None
```

返回 `dummy.next`，即 `[1, 2, 3, 5]`。

---

## 六、复杂度分析

**时间复杂度：O(n)**

- 快指针先走 n 步，然后快慢指针一起走到末尾，总共遍历链表一次
- 只需要一趟扫描，不需要先算长度再回头找

**空间复杂度：O(1)**

- 只用了两个指针和一个 dummy 节点，额外空间不随链表长度增长

---

## 七、总结

这道题的标准解法是：

```python
class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        fast = dummy
        slow = dummy

        for _ in range(n):
            fast = fast.next

        while fast.next:
            fast = fast.next
            slow = slow.next

        slow.next = slow.next.next

        return dummy.next
```

有三个细节最值得记住：

- **dummy 哨兵节点**统一了"删除头节点"的边界情况，不需要 `if` 特判
- 快指针先走 n 步后，两指针之间的**固定间距**就是倒数的"尺子"——快指针到末尾时，慢指针自然停在目标前驱
- 循环条件是 `while fast.next` 而不是 `while fast`，因为我们要慢指针停在目标节点**前面**，而不是停在目标节点上

这题是快慢指针在链表中的经典应用。把"先走 n 步拉开间距，再同步推进"这个模式吃透，后面遇到链表中间节点（LC 876）、旋转链表（LC 61）等题时会非常顺手。
