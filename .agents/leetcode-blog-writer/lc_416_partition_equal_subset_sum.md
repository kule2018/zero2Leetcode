# LeetCode-416：分割等和子集，把问题变成“能否凑出一半”

> **本题在线练习**：LeetCode 416. 分割等和子集 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=416)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) - 内置本地 OJ + AI 教练，零门槛开刷 Hot 100。

## 题目概述

给定一个只包含正整数的数组 `nums`，判断是否能把它分成两个子集，使得两个子集的元素和相等。

例如：

- 输入：`nums = [1,5,11,5]` → 输出：`true`（可分为 `[1,5,5]` 和 `[11]`）
- 输入：`nums = [1,2,3,5]` → 输出：`false`


## 核心思路：总和为偶数才有机会，目标是凑出 sum/2

设数组总和为 `S`。

- 如果 `S` 是奇数，不可能分成两个和相等的子集，直接返回 `False`
- 如果能分成两半，那么一定存在一个子集的和为 `S/2`

于是原题变成：

> 是否能从 `nums` 中选一些数，使得它们的和恰好等于 `target = S/2`？

这就是典型的 0/1 背包（每个数只能用一次），做“可达性”判断。

## DP 定义与转移（1 维布尔背包）

- `dp[t]`：是否能凑出和为 `t`

初始化：

- `dp[0] = True`（什么都不选就能凑出 0）

对于每个数字 `x`，更新：

```
dp[t] = dp[t] or dp[t - x]   (t 从 target 递减到 x)
```

必须从大到小遍历 `t`，避免一个数字在同一轮被重复使用（否则就变成完全背包了）。

## 代码实现

```python
from typing import List


class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        total = sum(nums)
        if total % 2 == 1:
            return False
        target = total // 2

        dp = [False] * (target + 1)
        dp[0] = True

        for x in nums:
            for t in range(target, x - 1, -1):
                dp[t] = dp[t] or dp[t - x]
            if dp[target]:
                return True

        return dp[target]
```

## 逐行拆解

- `target = total // 2`：只要能凑出一半，另一半自然也成立
- `dp[0] = True`：空集合可达 0
- 外层枚举每个 `x`：
  - 内层 `t` 从 `target` 递减：
    - `dp[t - x]` 为真表示“之前能凑出 t-x”，那么加上当前 `x` 就能凑出 `t`
  - 递减遍历保证 `x` 只用一次
- 提前返回：一旦 `dp[target]` 为真，答案就确定了

## 手动模拟

`nums = [1, 5, 11, 5]`

总和 `S = 22`，`target = 11`。

- 处理 `1` 后：可以凑出 `1`
- 处理 `5` 后：可以凑出 `5, 6`
- 处理 `11` 后：直接可以凑出 `11`（取单个 11）

因此返回 `True`。

## 复杂度分析

- 时间复杂度：`O(n * target)`
- 空间复杂度：`O(target)`

## 总结

这题的关键是把“分成两份相等”翻译成一个更具体的目标：

> 只要能凑出总和的一半，就能分割成功。

然后用 0/1 背包的布尔 DP，配合“从大到小遍历”这一条规则，就能稳定写对。

