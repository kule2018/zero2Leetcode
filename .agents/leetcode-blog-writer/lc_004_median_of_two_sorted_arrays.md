# LeetCode-004：两个正序数组的中位数，把“切一刀”想清楚就只剩二分

> **本题在线练习**：LeetCode 4. 寻找两个正序数组的中位数 — 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=4)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) — 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定两个已排序数组 `nums1` 和 `nums2`，返回它们合并后的中位数。要求时间复杂度 `O(log(m+n))`。

如果直接合并再取中位数是 `O(m+n)`，不满足要求。

## 核心思路：在两个数组上“切一刀”，让左半部分都不大于右半部分

设：

- `A = nums1`，长度 `m`
- `B = nums2`，长度 `n`

目标是找一个划分，使得合并后的“左半部分”元素个数为：

```
half = (m + n + 1) // 2
```

并且满足：

- `A_left_max <= B_right_min`
- `B_left_max <= A_right_min`

这意味着：左半部分所有元素都不大于右半部分所有元素，且左半部分包含了合并后前 `half` 个元素。

一旦满足条件：

- 若总长度为奇数，中位数就是左半部分最大值 `max(A_left_max, B_left_max)`
- 若总长度为偶数，中位数是 `([左半最大] + [右半最小]) / 2`

## 为什么可以二分？

只需要在较短的数组 `A` 上选择切点 `i`（`A` 左边取 `i` 个），那么 `B` 的切点 `j` 就被强制确定：

```
i + j = half  =>  j = half - i
```

当 `i` 变化时，`A_left_max`、`A_right_min` 单调变化，从而可以用二分逼近正确切点。

## 代码实现（Python，可直接提交）

```python
from typing import List


class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        A, B = nums1, nums2
        m, n = len(A), len(B)
        if m > n:
            A, B, m, n = B, A, n, m  # 保证 A 更短，二分范围更小

        half = (m + n + 1) // 2
        left, right = 0, m  # i 的取值范围 [0, m]

        while left <= right:
            i = (left + right) // 2
            j = half - i

            A_left_max = A[i - 1] if i > 0 else float("-inf")
            A_right_min = A[i] if i < m else float("inf")
            B_left_max = B[j - 1] if j > 0 else float("-inf")
            B_right_min = B[j] if j < n else float("inf")

            if A_left_max <= B_right_min and B_left_max <= A_right_min:
                # 找到正确划分
                if (m + n) % 2 == 1:
                    return float(max(A_left_max, B_left_max))
                left_max = max(A_left_max, B_left_max)
                right_min = min(A_right_min, B_right_min)
                return (left_max + right_min) / 2.0

            # i 太大：A_left_max 太大，需要左移
            if A_left_max > B_right_min:
                right = i - 1
            else:
                left = i + 1

        # 理论上不会到这里（输入保证可求中位数）
        return 0.0
```

## 逐行拆解：四个边界值是怎么来的？

`i` 把数组 `A` 切成两段：

- 左段：`A[0 .. i-1]`，最大值是 `A[i-1]`（如果 `i==0`，左段为空，最大值记为 `-inf`）
- 右段：`A[i .. m-1]`，最小值是 `A[i]`（如果 `i==m`，右段为空，最小值记为 `+inf`）

对 `B` 同理，用 `j` 计算出 `B_left_max`、`B_right_min`。

用 `inf/-inf` 的好处是：边界条件统一进同一套判断式，不需要单独写很多 if。

## 手动模拟（A=[1,3], B=[2]）

先保证 A 更短：A=[2], B=[1,3]

- m=1,n=2, half=(1+2+1)//2=2
- i 的范围 [0,1]

尝试 i=0 => j=2：

- A_left_max=-inf, A_right_min=2
- B_left_max=3, B_right_min=inf
- B_left_max <= A_right_min 不成立（3<=2 false），说明 i 太小，需要右移

尝试 i=1 => j=1：

- A_left_max=2, A_right_min=inf
- B_left_max=1, B_right_min=3
- 两个不等式都成立，长度为奇数，中位数 = max(2,1)=2

## 复杂度分析

- 时间复杂度：`O(log(min(m,n)))`，只在更短的数组上二分
- 空间复杂度：`O(1)`

## 总结

这题看起来很难，真正的关键只有两点：

- 把“中位数”转成“左半部分个数固定 + 左最大不大于右最小”的划分条件
- 在短数组上二分切点 `i`，另一边切点 `j` 由 `half-i` 唯一确定

把四个边界值 `A_left_max/A_right_min/B_left_max/B_right_min` 写清楚，剩下就只是标准二分模板。

