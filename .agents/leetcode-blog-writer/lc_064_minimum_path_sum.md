# LeetCode-064：最小路径和，网格 DP 的“最小值版模板”

> **本题在线练习**：LeetCode 64. 最小路径和 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=64)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定一个 `m x n` 的非负整数网格 `grid`，从左上角走到右下角，每次只能向右或向下。求路径上数字之和的 **最小值**（通常包含起点和终点）。

这题和“不同路径”非常像，只是把“计数”换成了“取最小和”。

例如：

- 输入：`grid = [[1,3,1],[1,5,1],[4,2,1]]`
- 输出：`7`（路径 1→3→1→1→1）


## 核心思路：到达 (i, j) 的最小代价

设 `dp[i][j]` 表示到达 `(i, j)` 的最小路径和。

最后一步同样只有两种来源：

- 从上方 `(i-1, j)` 走下来
- 从左方 `(i, j-1)` 走过来

所以转移：

```
dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
```

边界：

- `dp[0][0] = grid[0][0]`
- 第一行只能从左边来（累加）
- 第一列只能从上边来（累加）

## 先从最自然的二维 DP 讲起

### 代码实现（二维 dp）

```python
class Solution:
    def minPathSum(self, grid: list[list[int]]) -> int:
        m, n = len(grid), len(grid[0])
        dp = [[0] * n for _ in range(m)]
        dp[0][0] = grid[0][0]

        for j in range(1, n):
            dp[0][j] = dp[0][j - 1] + grid[0][j]
        for i in range(1, m):
            dp[i][0] = dp[i - 1][0] + grid[i][0]

        for i in range(1, m):
            for j in range(1, n):
                dp[i][j] = min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j]
        return dp[m - 1][n - 1]
```

## 逐行拆解：边界为什么要“累加”

第一行 `(0, j)` 只能从 `(0, j-1)` 来，因此最小和就是一路加过来。

第一列 `(i, 0)` 同理，只能从 `(i-1, 0)` 来。

从 `(1,1)` 起，每个格子才真正存在“从上或从左二选一”的分叉。

## 手动模拟：用例 grid = [[1,3,1],[1,5,1],[4,2,1]]

初始化：

- `dp[0][0] = 1`
- 第一行：`1, 4, 5`
- 第一列：`1, 2, 6`

继续填：

- `dp[1][1] = min(4, 2) + 5 = 7`
- `dp[1][2] = min(5, 7) + 1 = 6`
- `dp[2][1] = min(7, 6) + 2 = 8`
- `dp[2][2] = min(6, 8) + 1 = 7`

答案 `7`，对应路径 `1 -> 3 -> 1 -> 1 -> 1`。

## 进阶：一维 DP 空间优化

同样的观察：`dp[i][j]` 只依赖上方和左方。用一维数组 `dp[j]` 表示“当前行到 j 的最小和”：

- 更新前 `dp[j]` 是上方的值
- `dp[j-1]` 已经更新为当前行的左方值

### 代码实现（一维 dp）

```python
class Solution:
    def minPathSum(self, grid: list[list[int]]) -> int:
        m, n = len(grid), len(grid[0])
        dp = [0] * n
        dp[0] = grid[0][0]

        for j in range(1, n):
            dp[j] = dp[j - 1] + grid[0][j]

        for i in range(1, m):
            dp[0] = dp[0] + grid[i][0]
            for j in range(1, n):
                dp[j] = min(dp[j], dp[j - 1]) + grid[i][j]
        return dp[-1]
```

## 复杂度分析

- 时间：`O(mn)`
- 空间：二维 `O(mn)`，一维优化后 `O(n)`

## 总结

这题的关键不是“记住公式”，而是把 `dp[i][j]` 的含义说清楚：

> `dp[i][j]` 是“到达当前格子的最小代价”，它来自上方或左方两条路里更便宜的那条。

只要这句话成立，代码就自然。

