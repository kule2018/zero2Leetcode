# LeetCode-200：岛屿数量，把访问过的陆地“淹掉”就行

> **本题在线练习**：LeetCode 200. 岛屿数量 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=200)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定一个由 `'1'`（陆地）和 `'0'`（水）组成的二维网格 `grid`，计算岛屿数量。

岛屿定义：

- 相邻（上下左右）连在一起的 `'1'` 组成一个岛

## 核心思路：遍历网格，遇到一块新陆地就把整个岛“染色/淹掉”

算法流程非常固定：

1. 扫描每个格子
2. 如果遇到 `'1'`，说明发现了一座新岛，答案 `+1`
3. 从这个格子出发做 DFS/BFS，把与它连通的所有 `'1'` 都标记为已访问（比如直接改成 `'0'`）

这样每座岛只会被计数一次。

## 代码实现（Python）：DFS（原地修改 grid）

```python
from typing import List


class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        if not grid or not grid[0]:
            return 0

        m, n = len(grid), len(grid[0])

        def dfs(r: int, c: int) -> None:
            if r < 0 or r >= m or c < 0 or c >= n:
                return
            if grid[r][c] != "1":
                return

            grid[r][c] = "0"  # 标记为访问过（淹掉）
            dfs(r + 1, c)
            dfs(r - 1, c)
            dfs(r, c + 1)
            dfs(r, c - 1)

        ans = 0
        for i in range(m):
            for j in range(n):
                if grid[i][j] == "1":
                    ans += 1
                    dfs(i, j)
        return ans
```

## 逐行拆解

```python
if grid[i][j] == "1":
    ans += 1
    dfs(i, j)
```

一旦发现新陆地，立刻计数并把整座岛的陆地全部淹掉。之后扫描再遇到这座岛的其它格子时，它们已经被改成 `'0'`，不会重复计数。

```python
grid[r][c] = "0"
```

这是最省事的“visited”写法，不用额外开一个同尺寸数组。题目允许修改输入时，这是首选。

## 手动模拟 / 举例说明

```
1 1 0 0
1 0 0 1
0 0 1 1
```

从左上角扫描：

- (0,0) 是 '1'：ans=1，DFS 淹掉连通块 {(0,0),(0,1),(1,0)}
- 继续扫描到 (1,3) 是 '1'：ans=2，DFS 淹掉 {(1,3),(2,3),(2,2)}

最终 ans=2。

## 复杂度分析

- 时间复杂度：`O(mn)`，每个格子最多被访问一次
- 空间复杂度：`O(mn)` 最坏（递归栈），平均视形状而定；也可用 BFS 改成显式队列避免递归深度问题

## 总结

“岛屿数量”本质是连通块计数：

- 扫描网格
- 遇到新陆地就 `+1`
- 把整块连通陆地标记为访问过

这套模板同样适用于“省份数量”“图的连通块数量”等很多题。

