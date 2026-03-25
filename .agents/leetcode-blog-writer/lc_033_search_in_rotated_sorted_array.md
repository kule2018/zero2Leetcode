# LeetCode-033：搜索旋转排序数组，把“有序半边”找出来就能二分

> **本题在线练习**：LeetCode 33. 搜索旋转排序数组 — 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=33)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) — 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

一个升序数组在某个未知点被旋转，例如 `[0,1,2,4,5,6,7]` 旋转后可能变为 `[4,5,6,7,0,1,2]`。

给定这样的数组 `nums`（元素互不相同）和 `target`，返回下标，不存在返回 `-1`。

要求 `O(log n)`。

## 核心思路：每次二分都能确定“哪一半一定有序”

设 `mid = (left+right)//2`。

在旋转数组里，区间 `[left, right]` 总能保证至少有一边是完全有序的：

- 如果 `nums[left] <= nums[mid]`，说明左半边 `[left, mid]` 有序
- 否则右半边 `[mid, right]` 有序

然后判断 `target` 是否落在有序区间的值域内，决定缩哪一边。

## 代码实现（Python，可直接提交）

```python
from typing import List


class Solution:
    def search(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1

        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                return mid

            # 左半边有序
            if nums[left] <= nums[mid]:
                if nums[left] <= target < nums[mid]:
                    right = mid - 1
                else:
                    left = mid + 1
            # 右半边有序
            else:
                if nums[mid] < target <= nums[right]:
                    left = mid + 1
                else:
                    right = mid - 1

        return -1
```

## 逐行拆解：为什么能用 `nums[left] <= nums[mid]` 判断有序？

因为数组是“严格升序 + 旋转一次 + 无重复”。在这种条件下：

- 如果旋转点不在 `[left, mid]` 里，那么左半边就是正常升序，因此 `nums[left] <= nums[mid]`
- 如果旋转点在 `[left, mid]` 里，左半边会“断开”，导致 `nums[left] > nums[mid]`

这就是判断的依据。

## 手动模拟（nums=[4,5,6,7,0,1,2], target=0）

- left=0,right=6, mid=3, nums[mid]=7，左半边有序 `[4,5,6,7]`
- 0 不在 `[4,7)`，所以去右边：left=4
- mid=5, nums[mid]=1，左半边有序 `[0,1]`
- 0 在 `[0,1)`，缩右：right=4
- mid=4，命中 0

## 复杂度分析

- 时间复杂度：`O(log n)`
- 空间复杂度：`O(1)`

## 总结

这题的关键判断不是“找旋转点”，而是每次都先锁定“肯定有序”的半边，再用值域决定下一步。只要把区间判断写对，整体就是一套标准二分。

