# LeetCode-994：腐烂的橘子，多源 BFS 一层一层“扩散”时间

> **本题在线练习**：LeetCode 994. 腐烂的橘子 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=994)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

网格 `grid` 取值含义：

- `0`：空格
- `1`：新鲜橘子
- `2`：腐烂橘子

每分钟，腐烂橘子会让上下左右相邻的新鲜橘子变腐烂。求让所有新鲜橘子腐烂的最少分钟数；如果不可能，返回 `-1`。

## 核心思路：把所有腐烂橘子同时入队，做“多源 BFS”

如果只有一个腐烂橘子，最短扩散时间就是标准 BFS 的层数。

现在有多个腐烂橘子，它们会同时扩散，所以应当把所有初始腐烂点都作为 BFS 的起点一起入队，这就是“多源 BFS”。

算法步骤：

1. 扫描网格：把所有 `2` 入队，统计新鲜橘子数 `fresh`
2. BFS 按层扩散：每处理完一层，时间 `minutes += 1`
3. 每当一个 `1` 被感染变成 `2`，`fresh -= 1`
4. BFS 结束后：
   - 如果 `fresh == 0`，返回 `minutes`
   - 否则返回 `-1`

## 代码实现（Python）：多源 BFS

```python
from collections import deque
from typing import List


class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        if not grid or not grid[0]:
            return 0

        m, n = len(grid), len(grid[0])
        q = deque()
        fresh = 0

        for i in range(m):
            for j in range(n):
                if grid[i][j] == 2:
                    q.append((i, j))
                elif grid[i][j] == 1:
                    fresh += 1

        if fresh == 0:
            return 0

        minutes = 0
        dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]

        while q and fresh > 0:
            level_size = len(q)
            for _ in range(level_size):
                r, c = q.popleft()
                for dr, dc in dirs:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:
                        grid[nr][nc] = 2
                        fresh -= 1
                        q.append((nr, nc))
            minutes += 1

        return minutes if fresh == 0 else -1
```

## 逐行拆解

```python
for i in range(m):
    for j in range(n):
        if grid[i][j] == 2: q.append((i,j))
        elif grid[i][j] == 1: fresh += 1
```

一次扫描完成两件事：确定 BFS 的所有起点，并统计需要被感染的新鲜数量。

```python
while q and fresh > 0:
    level_size = len(q)
    ...
    minutes += 1
```

按层推进：一层代表“一分钟内能扩散到的所有位置”。`fresh > 0` 用来避免无意义多加一分钟。

## 手动模拟 / 举例说明

```
2 1 1
1 1 0
0 1 1
```

- t=0：队列里有所有 `2` 的位置（这里是左上角），fresh=6
- t=1：感染一圈相邻新鲜，fresh 减少
- t=2：继续感染下一圈

最终如果能把 fresh 减到 0，t 就是最少分钟数，因为 BFS 的层序扩散天然是最短时间。

## 复杂度分析

- 时间复杂度：`O(mn)`，每个格子最多入队一次
- 空间复杂度：`O(mn)`，队列最坏可装下整层

## 总结

这题是“多源 BFS”的标准模板：

- 把所有起点一起入队
- BFS 每一层代表一单位时间
- 用 `fresh` 计数判断是否还有目标未被覆盖

掌握这个模板后，“最短传播时间”“最少步数扩散”等题会变得非常统一。

