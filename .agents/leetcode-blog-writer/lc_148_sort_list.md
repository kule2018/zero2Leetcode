# LeetCode-148：排序链表，归并排序天然适配链表，找中点、断开、分别排、合并四步走

## 一、题目概述

给定链表的头节点 `head`，请将其按**升序**排列并返回排序后的链表。

要求时间复杂度为 O(n log n)。

例如：

### 示例 1

```
4 -> 2 -> 1 -> 3
```

输出：

```
1 -> 2 -> 3 -> 4
```

---

### 示例 2

```
-1 -> 5 -> 3 -> 4 -> 0
```

输出：

```
-1 -> 0 -> 3 -> 4 -> 5
```

---

### 示例 3

```
（空链表）
```

输出：

```
（空链表）
```

---

## 二、核心思路

题目要求 O(n log n) 的时间复杂度，能达到这个级别的排序算法有快排、堆排和归并排序。对于链表来说，**归并排序**是最自然的选择，原因有两个：

1. 链表不支持随机访问，快排的 partition 操作在链表上很别扭
2. 归并排序的合并操作在链表上非常高效——只需要调整指针，不需要额外数组

归并排序在链表上的流程就四步：

> 1. **找中点**：用快慢指针找到链表的中间节点
> 2. **断开**：从中点处把链表一分为二
> 3. **递归排序**：分别对左半部分和右半部分递归排序
> 4. **合并**：把两个已排序的链表合并成一个有序链表

这就是经典的"分治"思想——把大问题拆成小问题，小问题解决后再合起来。

---

## 三、代码实现

```python
class Solution:
    def sortList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if not head or not head.next:
            return head

        # 快慢指针找中点
        slow, fast = head, head.next
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next

        # 从中点断开
        mid = slow.next
        slow.next = None

        # 递归排序左右两半
        left = self.sortList(head)
        right = self.sortList(mid)

        # 合并两个有序链表
        dummy = ListNode(0)
        cur = dummy
        while left and right:
            if left.val <= right.val:
                cur.next = left
                left = left.next
            else:
                cur.next = right
                right = right.next
            cur = cur.next

        cur.next = left if left else right
        return dummy.next
```

---

## 四、逐行拆解

### 1. 递归终止条件

```python
if not head or not head.next:
    return head
```

如果链表为空或者只有一个节点，它本身就是有序的，直接返回。这是递归的 base case。

---

### 2. 快慢指针找中点

```python
slow, fast = head, head.next
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
```

慢指针每次走一步，快指针每次走两步。当快指针走到末尾时，慢指针正好在中间位置。

这里有个细节：`fast` 的起点是 `head.next` 而不是 `head`。这是为了让 `slow` 最终停在**中点偏左**的位置。如果链表有偶数个节点（比如 4 个），`slow` 会停在第 2 个节点而不是第 3 个，这样断开后左半部分是前 2 个节点，右半部分是后 2 个节点，分得比较均匀。

如果 `fast` 也从 `head` 出发，偶数长度时 `slow` 会停在靠右的中点，导致左半部分比右半部分多一个节点。虽然不影响正确性，但 `fast = head.next` 是更常见的写法。

---

### 3. 从中点断开链表

```python
mid = slow.next
slow.next = None
```

`slow.next` 就是右半部分的起点，先存下来。然后把 `slow.next` 设为 `None`，这样左半部分以 `head` 开头、到 `slow` 为止，右半部分以 `mid` 开头。

这一步是链表归并排序和数组归并排序最大的区别——数组用索引就能划分，链表必须**物理断开**。

---

### 4. 递归排序左右两半

```python
left = self.sortList(head)
right = self.sortList(mid)
```

对左半部分和右半部分分别递归调用 `sortList`。递归会一直拆分，直到每段链表只剩一个节点（触发 base case），然后开始逐层合并。

---

### 5. 合并两个有序链表

```python
dummy = ListNode(0)
cur = dummy
while left and right:
    if left.val <= right.val:
        cur.next = left
        left = left.next
    else:
        cur.next = right
        right = right.next
    cur = cur.next
```

这是经典的"合并两个有序链表"操作（和 LeetCode 21 一样）：

- 创建一个哑节点 `dummy` 作为合并后链表的起点
- 用 `cur` 指针追踪合并链表的尾部
- 每次比较 `left` 和 `right` 的当前节点，把较小的接到 `cur` 后面
- 被选中的那个链表的指针往前移一步

---

### 6. 接上剩余部分

```python
cur.next = left if left else right
```

`while` 循环结束时，`left` 和 `right` 中至多还有一个没遍历完。剩下的部分本身已经有序，直接接到合并链表的尾部即可。

---

### 7. 返回合并后的头节点

```python
return dummy.next
```

`dummy` 是哑节点，真正的头节点是 `dummy.next`。

---

## 五、手动模拟

用 `4 -> 2 -> 1 -> 3` 走一遍完整流程。

### 第一层递归：拆分

```text
原始链表：4 -> 2 -> 1 -> 3

快慢指针找中点：
  slow 从 4 出发，fast 从 2 出发
  第 1 步：slow = 2, fast = 3
  fast.next 为 None，循环结束
  slow 停在 2，mid = slow.next = 1

断开：
  左半：4 -> 2
  右半：1 -> 3
```

### 第二层递归（左半 `4 -> 2`）

```text
快慢指针：slow 从 4 出发，fast 从 2 出发
  fast.next 为 None，循环不进入
  slow 停在 4，mid = 2

断开：
  左半：4
  右半：2

两个都只有一个节点，触发 base case，直接返回。

合并 4 和 2：
  比较 4 和 2，2 更小 → cur.next = 2
  比较 4 和 None，left 剩余 → cur.next = 4
  结果：2 -> 4
```

### 第二层递归（右半 `1 -> 3`）

```text
同理断开成 1 和 3，合并后得到 1 -> 3
```

### 回到第一层：合并 `2 -> 4` 和 `1 -> 3`

```text
| 步骤 | left | right | 选择 | 合并链表 |
|------|------|-------|------|---------|
| 1 | 2 | 1 | 1 | 1 |
| 2 | 2 | 3 | 2 | 1 -> 2 |
| 3 | 4 | 3 | 3 | 1 -> 2 -> 3 |
| 4 | 4 | None | 剩余接上 | 1 -> 2 -> 3 -> 4 |
```

最终结果：`1 -> 2 -> 3 -> 4`，符合预期。

---

## 六、复杂度分析

**时间复杂度：O(n log n)**

- 每一层递归都要遍历所有 n 个节点来做合并操作，花费 O(n)
- 链表每次对半拆分，一共拆分 log n 层
- 总计 O(n log n)

**空间复杂度：O(log n)**

- 这里没有用额外数组，合并操作是在原链表节点上调整指针完成的
- 唯一的空间开销来自递归调用栈，递归深度为 log n
- 所以空间复杂度是 O(log n)

---

## 七、总结

这道题的核心洞察就一句话：

> 归并排序天然适合链表——找中点用快慢指针，断开只需一步，合并只需调指针，不需要额外数组。

整个解法分四步：

1. 快慢指针找到链表中点（`fast` 从 `head.next` 出发，保证偶数长度时左右均分）
2. 从中点断开链表（`slow.next = None`）
3. 递归排序左右两半
4. 合并两个有序链表（和 LeetCode 21 完全一样的套路）

这道题综合了三个链表基本功：快慢指针找中点、断开链表、合并有序链表。如果你之前做过 LeetCode 876（链表的中间节点）和 LeetCode 21（合并两个有序链表），这道题就是把它们拼在一起，再加上递归的分治框架。

把这个"分治 + 链表操作"的模式吃透，后面遇到合并 K 个排序链表（LeetCode 23）等进阶题会轻松很多。
