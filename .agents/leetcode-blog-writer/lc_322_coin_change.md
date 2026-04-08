# LeetCode-322：零钱兑换，不要贪心，最稳的是完全背包 DP

> **本题在线练习**：LeetCode 322. 零钱兑换 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=322)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) - 内置本地 OJ + AI 教练，零门槛开刷 Hot 100。

## 题目概述

给定硬币面额数组 `coins`（每种硬币数量无限）和目标金额 `amount`，要求用最少硬币数凑出 `amount`。

- 能凑出：返回最少硬币数
- 凑不出：返回 `-1`

例如：

- 输入：`coins = [1,2,5]`，`amount = 11`
- 输出：`3`（5 + 5 + 1 = 11）


## 核心思路：dp[x] = 凑出 x 的最少硬币数

这题最常见的误区是直接贪心（先拿最大面额），但贪心在一般硬币系统下并不保证最优。

稳妥做法是 DP：

- `dp[x]`：凑出金额 `x` 的最少硬币数

初始化：

- `dp[0] = 0`
- 其他设为无穷大（表示暂时不可达）

转移（完全背包思想）：

对每个金额 `x`，尝试“最后一枚硬币选 coins 中的某个面额 c”：

```
dp[x] = min(dp[x], dp[x - c] + 1)   (x >= c)
```

## 代码实现（一维 DP）

```python
from typing import List


class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        INF = 10**9
        dp = [INF] * (amount + 1)
        dp[0] = 0

        for x in range(1, amount + 1):
            for c in coins:
                if x >= c:
                    dp[x] = min(dp[x], dp[x - c] + 1)

        return -1 if dp[amount] >= INF else dp[amount]
```

## 逐行拆解

- `dp[0] = 0`：凑出 0 元不需要硬币
- 对每个 `x`：
  - 枚举一枚硬币 `c`
  - 如果 `x - c` 可达，则 `dp[x - c] + 1` 是一种方案
  - 取最小硬币数
- 最后如果 `dp[amount]` 仍是 `INF`，说明凑不出

## 手动模拟（coins = [1,2,5], amount = 11）

`dp` 从小到大推：

- `dp[1] = dp[0]+1 = 1`
- `dp[2] = min(dp[1]+1, dp[0]+1) = 1`（用 2）
- `dp[5] = 1`（用 5）
- `dp[10] = 2`（5+5）
- `dp[11] = dp[10]+1 = 3`（5+5+1）

答案为 3。

## 复杂度分析

- 时间复杂度：`O(amount * len(coins))`
- 空间复杂度：`O(amount)`

## 总结

“零钱兑换”要牢牢记住两点：

1. **一般情况下贪心不可靠**（除非题目保证硬币体系满足某些性质）
2. 用 DP 写成“最少步数”模型最稳：`dp[x] = min(dp[x - c] + 1)`

这就是一类非常经典、可复用的完全背包模板题。

