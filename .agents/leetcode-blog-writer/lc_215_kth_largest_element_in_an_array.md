# LeetCode-215：数组中的第 K 个最大元素，用快速选择把排序省掉

> **本题在线练习**：LeetCode 215. 数组中的第K个最大元素 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=215)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定整数数组 `nums` 和整数 `k`，返回数组中第 `k` 个最大的元素。

注意：是“按大小排序后的第 k 个”，不是第 k 个不同的元素。

例如：

- 输入：`nums = [3,2,1,5,6,4]`，`k = 2`
- 输出：`5`


## 核心思路：Quickselect（快速选择）只做必要的分区

如果直接排序，时间复杂度是 `O(n log n)`，一定能过，但不是最优。

Quickselect 的思想：

- 使用“快速排序的 partition 操作”把数组分成两部分
- partition 后，某个位置 `p` 上的元素已经是最终有序数组中的正确位置
- 如果 `p` 正好是目标下标，直接返回
- 否则只在目标所在的那一边继续做 partition

平均时间复杂度 `O(n)`。

第 `k` 大转换成“第 `n-k` 小”（0-based）：

- `target = len(nums) - k`

## 代码实现（Python）：随机化 Quickselect（平均 O(n)）

```python
import random
from typing import List


class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        target = len(nums) - k  # 第 k 大 = 第 (n-k) 小（0-based）

        def partition(l: int, r: int, pivot_index: int) -> int:
            pivot = nums[pivot_index]
            nums[pivot_index], nums[r] = nums[r], nums[pivot_index]
            store = l
            for i in range(l, r):
                if nums[i] < pivot:
                    nums[store], nums[i] = nums[i], nums[store]
                    store += 1
            nums[store], nums[r] = nums[r], nums[store]
            return store

        l, r = 0, len(nums) - 1
        while True:
            pivot_index = random.randint(l, r)
            p = partition(l, r, pivot_index)
            if p == target:
                return nums[p]
            if p < target:
                l = p + 1
            else:
                r = p - 1
```

## 逐行拆解

```python
target = len(nums) - k
```

把“第 k 大”转为“第 target 小”，这样 partition 用 `< pivot` 的逻辑就很自然。

```python
if nums[i] < pivot:
    swap(...)
```

partition 的结果是：

- `[l, store-1]` 都 `< pivot`
- `store` 是 pivot 的最终位置
- `[store+1, r]` 都 `>= pivot`

```python
if p == target: return nums[p]
```

一旦 pivot 的最终位置刚好是目标下标，答案就出来了，不必再处理其它元素。

## 手动模拟 / 举例说明

`nums = [3,2,1,5,6,4]`, `k=2`

- `n=6`，`target = 6-2 = 4`，即找排序后下标 4 的元素（也就是第 2 大）
- Quickselect 会不断 partition，把正确位置逼出来，最终返回 5

## 复杂度分析

- 平均时间复杂度：`O(n)`（随机 pivot 的期望）
- 最坏时间复杂度：`O(n^2)`（极端 pivot 每次都很差），随机化能显著降低这种情况
- 空间复杂度：`O(1)` 额外空间（原地 partition）

## 备选方案：小根堆（更稳定但更慢）

如果希望复杂度更稳定，可以维护大小为 `k` 的小根堆：

- 扫描数组，把元素入堆
- 堆大小超过 `k` 就弹出最小值
- 最终堆顶就是第 `k` 大

时间 `O(n log k)`，空间 `O(k)`。

## 总结

这题最推荐掌握 Quickselect：

- 不用排序全数组
- 通过不断 partition，把答案位置直接“选出来”

把 `target = n - k` 这个转换记牢，写起来会非常顺。

