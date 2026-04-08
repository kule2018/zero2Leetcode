# LeetCode-034：查找区间端点，二分的“左边界/右边界”要分开写

> **本题在线练习**：LeetCode 34. 在排序数组中查找元素的第一个和最后一个位置 — 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=34)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) — 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定一个非递减排序数组 `nums` 和目标值 `target`，返回 `target` 在数组中的起始位置和结束位置。如果不存在返回 `[-1, -1]`。

要求 `O(log n)`，所以不能线性扫。

例如：

- 输入：`nums = [5,7,7,8,8,10]`，`target = 8`
- 输出：`[3,4]`


## 核心思路：两次二分，分别找“第一个 >= target”和“第一个 > target”

在排序数组里，区间端点最好用“边界二分”的形式写：

- `lower_bound(target)`：返回第一个 `>= target` 的位置
- `lower_bound(target+ε)` 等价于 `lower_bound_gt(target)`：返回第一个 `> target` 的位置

那么：

- 左端点 `L = lower_bound(target)`
- 右端点 `R = lower_bound_gt(target) - 1`

如果 `L` 越界或 `nums[L] != target`，说明不存在。

## 代码实现（Python，可直接提交）

```python
from typing import List


class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        def lower_bound(x: int) -> int:
            left, right = 0, len(nums)  # 搜索区间 [left, right)
            while left < right:
                mid = (left + right) // 2
                if nums[mid] >= x:
                    right = mid
                else:
                    left = mid + 1
            return left

        L = lower_bound(target)
        if L == len(nums) or nums[L] != target:
            return [-1, -1]

        R = lower_bound(target + 1) - 1
        return [L, R]
```

## 逐行拆解：为什么右边界用 `target + 1`？

这里利用了题目的值域是整数。第一个 `>= target+1` 的位置，就是第一个 `> target` 的位置。

如果题目值不是整数或 `target` 可能溢出，也可以写一个专门的 `upper_bound(target)`（第一个 `> target`）。

## 手动模拟

`nums=[5,7,7,8,8,10]`, `target=8`：

- `lower_bound(8)` 返回 3（第一个 8）
- `lower_bound(9)` 返回 5（第一个 >=9 的位置，其实是 10）
- 所以右端点是 `5-1=4`

答案 `[3,4]`。

## 复杂度分析

- 时间复杂度：`O(log n)`，两次二分
- 空间复杂度：`O(1)`

## 总结

找区间端点时，把“找某个值”拆成“找边界”会更稳：

- 左端点是第一个 `>= target`
- 右端点是第一个 `> target` 再减一

二分写成 `[left, right)` 模板，边界条件更不容易错。

