# LeetCode-287：寻找重复数，把数组看成“指针图”，用 Floyd 判环

> **本题在线练习**：LeetCode 287. 寻找重复数 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=287)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定一个长度为 `n+1` 的数组 `nums`，数字范围是 `[1, n]`，保证至少存在一个重复数字，且只要找出任意一个重复数字即可。

要求：

- 不能修改数组（在原题约束下）
- 额外空间尽量小
- 时间尽量快

这题的最经典解法是 Floyd 判环（快慢指针），把数组当成“链表”来理解。

## 核心思路：nums 定义了一个从下标到下标的映射

因为 `nums[i]` 的取值在 `[1, n]`，可以把它当成“下一跳的下标”：

```
i -> nums[i]
```

从下标 0 出发不断跳转：

```
0 -> nums[0] -> nums[nums[0]] -> ...
```

由于可到达的节点只有 `1..n` 这 `n` 个，但路径长度是 `n+1` 的跳转过程，必然会出现重复访问，也就是形成环。

环的入口对应的值，就是重复数字。

## 代码实现（Floyd 判环）

```python
class Solution:
    def findDuplicate(self, nums: list[int]) -> int:
        # phase 1: find intersection in the cycle
        slow = nums[0]
        fast = nums[nums[0]]
        while slow != fast:
            slow = nums[slow]
            fast = nums[nums[fast]]

        # phase 2: find entrance to the cycle
        slow = 0
        while slow != fast:
            slow = nums[slow]
            fast = nums[fast]

        return slow
```

## 逐行拆解：为什么第二阶段能找到入口

Floyd 判环的结论：当快慢指针在环内相遇后，把其中一个指针放回起点，两个指针都每次走一步，它们会在环的入口相遇。

这里的“起点”用下标 0 表示，“走一步”就是 `x = nums[x]`。

环入口对应的值（也就是下标）就是重复数字。

## 手动模拟（直觉版）

例如 `nums = [1,3,4,2,2]`：

映射：

- `0 -> 1`
- `1 -> 3`
- `3 -> 2`
- `2 -> 4`
- `4 -> 2`（这里回到 2，形成环 `2 -> 4 -> 2`）

入口是 2，所以重复数是 2。

## 进阶补充：二分计数法（可选思路）

也可以对值域 `[1, n]` 二分，统计 `<= mid` 的元素个数：

- 如果 `count > mid`，重复数在 `[1, mid]`
- 否则在 `[mid+1, n]`

时间 `O(n log n)`，空间 `O(1)`，但 Floyd 是 `O(n)` 更好。

## 复杂度分析

Floyd 判环：

- 时间：`O(n)`
- 空间：`O(1)`

## 总结

这题最关键的转化是：

> 把 `nums[i]` 当作下一跳下标，数组就变成了一个带环的“指针图/链表”。

理解了这个转化，Floyd 判环就顺理成章，且满足不修改数组、常数空间的要求。

