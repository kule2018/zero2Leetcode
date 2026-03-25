# LeetCode-042：接雨水，双指针不是“拍脑袋”，而是在维护两侧挡板

> **本题在线练习**：LeetCode 42. 接雨水 — 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=42)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) — 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定一个非负整数数组 `height`，每个元素表示宽度为 1 的柱子高度。下雨后，柱子之间能接多少单位的雨水？

关键点是：水能否存在于某个位置，取决于它左边和右边是否都有更高的“挡板”。

## 核心思路：每个位置的水位 = min(左侧最高, 右侧最高)

对下标 `i` 来说：

- 左侧最高挡板高度 `left_max[i] = max(height[0..i])`
- 右侧最高挡板高度 `right_max[i] = max(height[i..n-1])`
- 该位置水位高度 = `min(left_max[i], right_max[i])`
- 该位置雨水量 = `max(0, min(left_max[i], right_max[i]) - height[i])`

可以用前后缀数组做，但更推荐双指针，空间从 `O(n)` 降到 `O(1)`。

## 先从最自然的思路讲起：前后缀最大值

这版很好理解：先把每个位置的左最高、右最高算出来，再逐个位置累加即可。缺点是需要额外数组。

双指针的要点是：不显式存整张表，只在走动中维护“当前左最高”和“当前右最高”。

## 进阶解法：双指针一次扫完（推荐）

### 为什么可以只看较低的一侧？

当 `left_max <= right_max` 时，位置 `left` 的可接水高度只由 `left_max` 决定：

- 右侧最高 `right_max` 至少和 `left_max` 一样高，右边挡板“肯定够用”
- 所以 `left` 位置的水位 = `left_max`
- 雨水量 = `left_max - height[left]`（若为负则 0）

对称地，当 `right_max < left_max` 时，处理右侧指针即可。

### 代码实现（Python，可直接提交）

```python
from typing import List


class Solution:
    def trap(self, height: List[int]) -> int:
        n = len(height)
        if n <= 2:
            return 0

        left, right = 0, n - 1
        left_max, right_max = height[left], height[right]
        ans = 0

        while left < right:
            if left_max <= right_max:
                left += 1
                left_max = max(left_max, height[left])
                ans += left_max - height[left]
            else:
                right -= 1
                right_max = max(right_max, height[right])
                ans += right_max - height[right]

        return ans
```

## 逐行拆解关键逻辑

- `left_max`：从左往右见过的最高柱子
- `right_max`：从右往左见过的最高柱子
- 每次移动“挡板更低的一侧”，因为低的一侧才是当前水位上限
- 累加 `当前水位 - 当前柱高`，并且这里天然不会出现负值（因为先更新了 max）

## 手动模拟（用经典例子看清楚）

示例：`height = [0,1,0,2,1,0,1,3,2,1,2,1]`

用双指针时不会逐格画图，但可以抓住一个事实：

- 当左侧挡板低时，只要右侧挡板更高，左侧的水位就被左挡板锁死
- 当右侧挡板低时同理

最终累积结果为 `6`。

如果想更直观，也可以用“每格水位 = min(左最高, 右最高)”去复核每个位置。

## 复杂度分析

- 时间复杂度：`O(n)`，左右指针各走一遍
- 空间复杂度：`O(1)`，只用常数变量

## 总结

这题表面是“算多少水”，本质是“每个位置的有效水位由两侧较低挡板决定”。双指针的精髓不在技巧，而在不变量：

- `left_max`、`right_max` 始终是已经扫描过区域的最高挡板
- 永远优先结算较低挡板一侧，因为它的水位已经确定，不会被未来变化影响

