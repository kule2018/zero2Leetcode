# LeetCode-207：课程表，判断能否学完的关键是“有没有环”

> **本题在线练习**：[LeetCode 207. 课程表 - 在线练习（免费 · 无需登录 · AI 辅助）](https://onefly.top/zero2Leetcode/playground.html?id=207)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定课程总数 `numCourses`，以及先修关系 `prerequisites`，其中每条关系形如 `[a, b]`，表示要学课程 `a` 之前必须先学 `b`。

问题：是否能修完所有课程？本质就是问先修关系构成的有向图里，是否存在环。

## 核心思路：把“先修关系”看成有向图，能拓扑排序就说明无环

把每门课当成一个点：

- `[a, b]` 表示 `b -> a`（先学 b，才能学 a）
- 如果图中存在环，例如 `0 -> 1 -> 0`，就会出现“互相依赖”，无法完成
- 如果图无环（DAG），一定存在拓扑序，也就能按顺序学完

最经典的判环方式之一是 **Kahn 拓扑排序（BFS + 入度）**：

1. 统计每个点的入度 `indegree[i]`（有多少门课指向它）
2. 把入度为 0 的点入队（这些课可以直接学）
3. 不断弹出队头，把它指向的邻居入度减 1；邻居入度变 0 就入队
4. 最后如果弹出的点数 == `numCourses`，说明无环；否则有环

## 先从最自然的想法讲起：为什么“入度为 0”代表可以学习？

入度为 0 的课，意味着没有任何“必须先学的前置课”，它可以作为学习起点。

如果每次都能找到新的入度为 0 的课并学习下去，说明依赖关系能被逐步消解；反之，如果剩下的课全部入度 > 0，就意味着剩余部分互相依赖，形成了环。

## 代码实现（拓扑排序 / BFS）

```python
from collections import deque
from typing import List


class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        graph = [[] for _ in range(numCourses)]
        indegree = [0] * numCourses

        # [a, b] means b -> a
        for a, b in prerequisites:
            graph[b].append(a)
            indegree[a] += 1

        q = deque([i for i in range(numCourses) if indegree[i] == 0])
        taken = 0

        while q:
            cur = q.popleft()
            taken += 1
            for nxt in graph[cur]:
                indegree[nxt] -= 1
                if indegree[nxt] == 0:
                    q.append(nxt)

        return taken == numCourses
```

## 逐行拆解：这段代码到底在维护什么？

- `graph[b].append(a)`：把“先修 b 才能学 a”变成边 `b -> a`
- `indegree[a] += 1`：a 课程多了一个前置依赖
- 队列 `q`：始终保存“当前可以学习”的课程（入度为 0）
- 每弹出一个课程 `cur`：
  - 视为已经学完，计数 `taken += 1`
  - 对它的后继课程 `nxt`：减少一个依赖 `indegree[nxt] -= 1`
  - 依赖清零则入队，表示现在可以学
- 最终 `taken == numCourses`：所有点都被“学完”，说明无环

## 手动模拟一个例子

假设：

```text
numCourses = 4
prerequisites = [[1,0],[2,0],[3,1],[3,2]]
```

边为：`0->1, 0->2, 1->3, 2->3`

- 初始入度：`indegree = [0,1,1,2]`
- 队列初始：`[0]`
- 学 0：让 1、2 入度各减 1 => `indegree = [0,0,0,2]`，队列变 `[1,2]`
- 学 1：让 3 入度减 1 => `indegree[3]=1`
- 学 2：让 3 入度再减 1 => `indegree[3]=0`，队列加入 `[3]`
- 学 3：结束，taken = 4，等于 numCourses，能学完

如果存在环，比如 `[[0,1],[1,0]]`：

- 入度都为 1，队列一开始就是空的
- taken = 0 != 2，无法学完

## 复杂度分析

- 时间复杂度：`O(numCourses + len(prerequisites))`，建图一次、每条边最多处理一次
- 空间复杂度：`O(numCourses + len(prerequisites))`，邻接表和入度数组

## 进阶：用 DFS “染色”也能判环（可选）

另一条常用思路是 DFS + 状态标记：

- `0` 未访问
- `1` 正在访问（递归栈内）
- `2` 已完成

当 DFS 遇到 `1`，说明从当前点走回了递归栈上的某个点，存在环。

## 总结

这题真正要学会的是：把“先修关系”抽象为有向图，问题就变成了“图里有没有环”。拓扑排序（入度为 0 的点不断出队）之所以可靠，是因为它在模拟“依赖被逐步消解”的过程：如果最后还有课程消解不了，背后一定是环。

