# LeetCode-198：打家劫舍，把“选或不选”变成一条最稳的状态转移

> **本题在线练习**：LeetCode 198. 打家劫舍 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=198)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) - 内置本地 OJ + AI 教练，零门槛开刷 Hot 100。

## 题目概述

一条街上有一排房子，第 `i` 间房子里有 `nums[i]` 的现金。规则是：相邻的两间房不能在同一晚上都被偷（会触发报警）。

要求返回在不触发报警的前提下，最多能偷到多少钱。

## 核心思路：一维 DP 的“选或不选”

这道题的限制只有一句话：**不能同时选相邻元素**。这类问题最自然的模型就是 DP：

- 到了第 `i` 间房时，要么不偷它，那么最优值就是“前 `i-1` 间的最优”
- 要么偷它，那么 `i-1` 间不能偷，最优值就是“前 `i-2` 间最优 + nums[i]”

把这句话翻成状态定义：

- `dp[i]`：考虑 `nums[0..i]` 这些房子，能偷到的最大金额

状态转移：

```
dp[i] = max(dp[i-1], dp[i-2] + nums[i])
```

边界：

- `dp[0] = nums[0]`
- `dp[1] = max(nums[0], nums[1])`

## 先写出最直观版本（数组 DP）

```python
from typing import List


class Solution:
    def rob(self, nums: List[int]) -> int:
        n = len(nums)
        if n == 0:
            return 0
        if n == 1:
            return nums[0]

        dp = [0] * n
        dp[0] = nums[0]
        dp[1] = max(nums[0], nums[1])

        for i in range(2, n):
            dp[i] = max(dp[i - 1], dp[i - 2] + nums[i])

        return dp[-1]
```

## 进阶：把空间优化到 O(1)

观察转移式只依赖 `dp[i-1]` 和 `dp[i-2]`，所以不用保存整个数组，只要滚动保存两项即可。

```python
from typing import List


class Solution:
    def rob(self, nums: List[int]) -> int:
        prev2 = 0  # dp[i-2]
        prev1 = 0  # dp[i-1]

        for money in nums:
            cur = max(prev1, prev2 + money)
            prev2, prev1 = prev1, cur

        return prev1
```

## 逐行拆解（空间优化版）

核心循环：

```python
for money in nums:
    cur = max(prev1, prev2 + money)
    prev2, prev1 = prev1, cur
```

- `prev1` 表示“到上一间房为止的最优”
- `prev2` 表示“到上上间房为止的最优”
- 当前房 `money`：
  - 不偷：收益 `prev1`
  - 偷：收益 `prev2 + money`
  - 取最大就是当前最优 `cur`
- 更新滚动变量，继续处理下一间

## 手动模拟

以 `nums = [2, 7, 9, 3, 1]` 为例：

| 当前房金额 money | prev2(到 i-2) | prev1(到 i-1) | cur = max(prev1, prev2+money) |
|---|---:|---:|---:|
| 2 | 0 | 0 | 2 |
| 7 | 0 | 2 | 7 |
| 9 | 2 | 7 | 11 |
| 3 | 7 | 11 | 11 |
| 1 | 11 | 11 | 12 |

最终答案 `12`，对应偷 `2 + 9 + 1`。

## 复杂度分析

- 时间复杂度：`O(n)`，只遍历一次数组
- 空间复杂度：`O(1)`（使用滚动变量）

## 总结

“打家劫舍”最关键的是把限制翻译成一句明确的选择：

> 到第 `i` 个位置，只存在“偷或不偷”两种，并且“偷”会强制跳过相邻的 `i-1`。

一旦写出 `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`，这题就从“看起来像贪心”变成了非常稳定的一维 DP 模板题。

