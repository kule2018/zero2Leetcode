# LeetCode-025：K 个一组翻转链表，难点不在反转，而在“分组边界”

> **本题在线练习**：LeetCode 25. K 个一组翻转链表 — 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=25)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) — 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定链表 `head` 和整数 `k`，每 `k` 个节点为一组进行翻转，并返回翻转后的链表。

- 只能用常数额外空间
- 如果最后剩下的节点数量不足 `k`，保持原样不翻转

例如：

- 输入：`head = [1,2,3,4,5]`，`k = 2`
- 输出：`[2,1,4,3,5]`


## 核心思路：每次只做一件事，翻转 `[a, b)` 这一段

最稳定的写法是把问题拆成可复用的模块：

1. 用指针找到当前组的起点 `a` 和终点 `b`（注意 `b` 是“下一组起点”，也就是区间右开）
2. 如果不足 `k` 个节点，直接结束
3. 反转区间 `[a, b)`，得到新的头 `new_head` 和尾 `new_tail=a`
4. 把上一组的尾巴接到 `new_head`，再把 `new_tail` 接到下一段 `b`

这里真正容易错的是第 1 步：如何正确地定位 `b`，以及如何安全地拼接指针。

## 代码实现（Python，可直接提交）

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next


class Solution:
    def reverseKGroup(self, head, k: int):
        if k <= 1 or head is None:
            return head

        dummy = ListNode(0, head)
        group_prev = dummy

        while True:
            # 1) 找到本组的第 k 个节点（组尾）
            kth = group_prev
            for _ in range(k):
                kth = kth.next
                if kth is None:
                    return dummy.next

            group_next = kth.next  # 下一组起点

            # 2) 反转本组 [group_prev.next, group_next)
            prev = group_next
            curr = group_prev.next
            while curr != group_next:
                nxt = curr.next
                curr.next = prev
                prev = curr
                curr = nxt

            # 3) 拼接：group_prev -> kth(新头)，原组头变为尾
            new_group_head = kth
            new_group_tail = group_prev.next
            group_prev.next = new_group_head
            group_prev = new_group_tail
```

## 逐行拆解关键点

### 1) 为什么要用 `dummy`？

第一组翻转后会改变链表头。如果没有 `dummy`，需要额外分支处理“更新 head”。`dummy` 把所有组都统一成“前面总有一个节点可接”的形式。

### 2) `kth` 的定位为什么从 `group_prev` 开始？

`group_prev.next` 是本组起点。让 `kth` 从 `group_prev` 出发走 `k` 步，走到的正好是本组第 `k` 个节点，也就是翻转后新的组头。

### 3) 反转时为什么令 `prev = group_next`？

这是一种“边反转边接回去”的技巧：

- 反转区间内节点时，最终区间尾节点（原区间起点）需要指向 `group_next`
- 直接把 `prev` 初始化为 `group_next`，反转完成后区间就天然连上了后半段

## 手动模拟（1->2->3->4->5，k=2）

分组为 `(1,2) (3,4) (5)`：

- 翻转 `(1,2)` 得到 `2->1`，链表变为 `2->1->3->4->5`
- 翻转 `(3,4)` 得到 `4->3`，链表变为 `2->1->4->3->5`
- 最后只剩 `5` 不足 2 个，不翻转

## 复杂度分析

- 时间复杂度：`O(n)`，每个节点被访问常数次
- 空间复杂度：`O(1)`，只用若干指针

## 总结

这题的技术点不是“如何反转链表”，而是“如何把反转当成一个可控的区间操作”：

- 先用指针确定边界 `[a, b)`
- 再在边界内做标准反转
- 最后把三段（前一段、反转段、后一段）正确拼接

把边界想清楚，代码就会非常稳定。

