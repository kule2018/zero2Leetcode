# LeetCode-072：编辑距离，把“最后一步做了什么”写成转移方程

> **本题在线练习**：LeetCode 72. 编辑距离 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=72)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定两个字符串 `word1` 和 `word2`，每次操作可以：

- 插入一个字符
- 删除一个字符
- 替换一个字符

求把 `word1` 变成 `word2` 的最少操作数，这就是经典的编辑距离（Levenshtein distance）。

## 核心思路：dp[i][j] 表示把前缀变成前缀的最小代价

设 `dp[i][j]` 表示把 `word1[:i]` 变成 `word2[:j]` 的最小编辑距离。

边界：

- `dp[0][j] = j`：空串变成长度为 `j` 的串，只能插入 `j` 次
- `dp[i][0] = i`：长度为 `i` 的串变成空串，只能删除 `i` 次

转移看“最后一步”：

1. 如果 `word1[i-1] == word2[j-1]`，最后一个字符不用动：

```
dp[i][j] = dp[i-1][j-1]
```

2. 如果不相等，最后一步可能是三种操作之一：

- 替换：把 `word1[i-1]` 替换成 `word2[j-1]`，代价 `dp[i-1][j-1] + 1`
- 删除：删除 `word1[i-1]`，代价 `dp[i-1][j] + 1`
- 插入：在 `word1` 末尾插入 `word2[j-1]`，代价 `dp[i][j-1] + 1`

取最小：

```
dp[i][j] = 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])
```

## 代码实现（二维 dp）

```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]

        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j

        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if word1[i - 1] == word2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    dp[i][j] = 1 + min(
                        dp[i - 1][j - 1],  # 替换
                        dp[i - 1][j],      # 删除
                        dp[i][j - 1],      # 插入
                    )

        return dp[m][n]
```

## 逐行拆解：三种操作为什么对应这三个格子

把 `word1[:i]` 变成 `word2[:j]`：

- 替换：先把 `word1[:i-1]` 变成 `word2[:j-1]`，再替换最后一个字符
- 删除：先把 `word1[:i-1]` 变成 `word2[:j]`，再删除 `word1` 的最后一个字符
- 插入：先把 `word1[:i]` 变成 `word2[:j-1]`，再插入 `word2` 的最后一个字符

对应的就是 `dp[i-1][j-1]`、`dp[i-1][j]`、`dp[i][j-1]` 三个位置。

## 手动模拟：word1="horse", word2="ros"

最终答案为 3，一条可能的最优路径：

1. `horse` -> `rorse`（把 `h` 替换成 `r`）
2. `rorse` -> `rose`（删除一个 `r`）
3. `rose` -> `ros`（删除 `e`）

DP 表的作用是：不需要手工找路径，直接计算出最小代价。

## 复杂度分析

- 时间：`O(mn)`
- 空间：`O(mn)`（如果需要，可以滚动数组优化到 `O(n)`）

## 总结

编辑距离的转移看似复杂，但只要抓住一句话就稳了：

> `dp[i][j]` 的来源，就是“最后一步”可能做了替换/删除/插入三种操作之一。

把这三种操作对应到三个相邻格子，转移方程就不需要背。

