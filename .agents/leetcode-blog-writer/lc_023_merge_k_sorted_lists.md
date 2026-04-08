# LeetCode-023：合并 K 个升序链表，堆维护的是“当前最小头节点”

> **本题在线练习**：LeetCode 23. 合并 K 个升序链表 — 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=23)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) — 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定 `k` 个升序链表，合并成一个升序链表并返回。

如果直接两两合并当然能做，但更通用且性能稳定的做法是用小根堆。

例如：

- 输入：`lists = [[1,4,5],[1,3,4],[2,6]]`
- 输出：`[1,1,2,3,4,4,5,6]`


## 核心思路：小根堆里只放每条链表“当前头”

想象把每条链表看作一个“供货源”，每次只能从它的头部取货。要得到整体有序输出，就应该：

1. 把所有链表的当前头节点放进小根堆
2. 每次从堆里弹出最小的那个节点接到答案尾部
3. 把它的 `next`（也就是该链表的新头）再放回堆

堆里始终最多 `k` 个元素，因此每次操作是 `O(log k)`。

## 代码实现（Python，可直接提交）

```python
import heapq
from typing import List, Optional


# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next


class Solution:
    def mergeKLists(self, lists: List[Optional["ListNode"]]) -> Optional["ListNode"]:
        h = []
        seq = 0  # 解决 val 相同导致 ListNode 不可比较的问题

        for node in lists:
            if node is not None:
                heapq.heappush(h, (node.val, seq, node))
                seq += 1

        dummy = ListNode(0)
        tail = dummy

        while h:
            _, _, node = heapq.heappop(h)
            tail.next = node
            tail = tail.next

            if node.next is not None:
                heapq.heappush(h, (node.next.val, seq, node.next))
                seq += 1

        tail.next = None
        return dummy.next
```

## 逐行拆解：为什么堆元素要放三元组 `(val, seq, node)`？

Python 的 `heapq` 在比较时会先比第一个元素 `val`。如果两个节点 `val` 相同，就会继续比较第二个元素。

直接 push `(val, node)` 时，`val` 相同会触发比较 `node`，但 `ListNode` 默认不可比较，会抛异常。

加一个递增的 `seq` 当“稳定打破平局”的键，就能保证任何情况下都可比较。

## 手动模拟（3 条链表）

假设：

- L1: 1 -> 4 -> 5
- L2: 1 -> 3 -> 4
- L3: 2 -> 6

初始堆放入 `1(L1), 1(L2), 2(L3)`：

1. 弹出 1(L1)，接到答案，推入 4(L1)
2. 弹出 1(L2)，接到答案，推入 3(L2)
3. 弹出 2(L3)，接到答案，推入 6(L3)

堆里始终只维护各链表“当前头”，最终输出就是全局升序。

## 复杂度分析

设总节点数为 `N`，链表条数为 `k`：

- 时间复杂度：`O(N log k)`，每个节点入堆出堆各一次
- 空间复杂度：`O(k)`，堆里最多 `k` 个头节点

## 总结

这题的本质是“多路归并”：

- 每路都是升序
- 堆负责在 `k` 个当前候选中快速挑出最小值

把“候选集合”压缩成每条链表的头节点，复杂度自然就变成 `O(N log k)`，这是非常通用的一类技巧。

