# LeetCode-153：寻找旋转排序数组最小值，用右端点做参照最稳

> **本题在线练习**：LeetCode 153. 寻找旋转排序数组中的最小值 — 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=153)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) — 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

一个升序数组被旋转一次（元素互不相同），返回数组中的最小元素。

例如 `[3,4,5,1,2]` 的最小值是 `1`。

要求 `O(log n)`。

## 核心思路：最小值一定在“断点”附近，二分时用 `nums[right]` 判断在哪边

对旋转数组来说：

- 如果 `nums[mid] > nums[right]`，说明 `mid` 落在“左侧较大的一段”，最小值在右边
- 否则 `nums[mid] <= nums[right]`，说明 `mid` 落在“右侧有序的一段”（包含最小值），最小值在左边或就是 `mid`

用这个条件可以把搜索区间不断缩小，最终 `left==right` 即最小值位置。

## 代码实现（Python，可直接提交）

```python
from typing import List


class Solution:
    def findMin(self, nums: List[int]) -> int:
        left, right = 0, len(nums) - 1

        while left < right:
            mid = (left + right) // 2
            if nums[mid] > nums[right]:
                left = mid + 1
            else:
                right = mid

        return nums[left]
```

## 逐行拆解：为什么 `right = mid` 而不是 `mid - 1`？

当 `nums[mid] <= nums[right]` 时，`mid` 有可能就是最小值（比如 `[2,3,4,5,1]` 在某一步会把 `mid` 指到 1 的位置）。

因此必须保留 `mid`，写成 `right = mid` 才不会错过答案。

## 手动模拟

`nums=[4,5,6,7,0,1,2]`：

- mid=3, nums[mid]=7 > nums[right]=2，最小值在右边，left=4
- mid=5, nums[mid]=1 <= 2，right=5
- mid=4, nums[mid]=0 <= 1，right=4
- left==right==4，返回 0

## 复杂度分析

- 时间复杂度：`O(log n)`
- 空间复杂度：`O(1)`

## 总结

这题的稳定写法是“用右端点做参照”：

- `nums[mid] > nums[right]`：最小值在右侧
- 否则：最小值在左侧（含 mid）

配合 `left < right` 的二分模板，边界非常干净。

