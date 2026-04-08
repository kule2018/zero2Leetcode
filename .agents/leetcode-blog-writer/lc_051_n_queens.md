# LeetCode-051：N 皇后，用列/对角线约束把搜索空间砍到可控

> **本题在线练习**：[LeetCode 51. N 皇后 - 在线练习（免费 · 无需登录 · AI 辅助）](https://onefly.top/zero2Leetcode/playground.html?id=51)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

在 `n x n` 的棋盘上放置 `n` 个皇后，使得任意两个皇后都不能互相攻击（同一行、同一列、同一对角线都不行）。返回所有不同的解决方案。

输出形式是棋盘字符串数组：`'Q'` 表示皇后，`'.'` 表示空格。

例如：

- 输入：`n = 4`
- 输出：`[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]`


## 核心思路：按行放皇后，每一行只放一个

如果一行能放多个皇后，状态会非常乱。正确的观察是：

> 每行必须且只需要放一个皇后。

因此可以按行回溯：

- 第 `row` 行尝试把皇后放在所有合法列 `col`
- 放下后递归 `row+1`
- 回退，撤销占用的列与对角线

要快速判断“是否冲突”，维护三个集合：

- `cols`：哪些列已经有皇后
- `diag1`：主对角线 `row - col`（值相同表示同一条主对角线）
- `diag2`：副对角线 `row + col`（值相同表示同一条副对角线）

## 代码实现（Python，可直接提交）

```python
from typing import List


class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        cols = set()
        diag1 = set()  # row - col
        diag2 = set()  # row + col
        board = [["."] * n for _ in range(n)]
        res = []

        def dfs(row: int) -> None:
            if row == n:
                res.append(["".join(r) for r in board])
                return

            for col in range(n):
                if col in cols:
                    continue
                d1 = row - col
                d2 = row + col
                if d1 in diag1 or d2 in diag2:
                    continue

                cols.add(col)
                diag1.add(d1)
                diag2.add(d2)
                board[row][col] = "Q"

                dfs(row + 1)

                board[row][col] = "."
                diag2.remove(d2)
                diag1.remove(d1)
                cols.remove(col)

        dfs(0)
        return res
```

## 逐行拆解：对角线为什么用 `row-col` 和 `row+col`？

以主对角线为例（从左上到右下）：

- 同一条主对角线上的格子，`row - col` 是相同的
  - 例如 `(0,0)、(1,1)、(2,2)` 都有 `row-col=0`

副对角线（从右上到左下）：

- 同一条副对角线上的格子，`row + col` 是相同的
  - 例如 `(0,2)、(1,1)、(2,0)` 都有 `row+col=2`

因此用这两个值就能 O(1) 判断对角线冲突。

## 手动模拟：`n=4` 时第一步为何能剪枝很多？

第 0 行随便放一个皇后后：

- 某一列被占用
- 两条对角线被占用

第 1 行可选的列会立刻减少，很多位置被快速排除。随着行数增加，冲突约束越来越多，搜索树就被剪得很小，这也是 N 皇后能用回溯做的原因。

## 复杂度分析

- 时间复杂度：最坏接近 `O(n!)` 级别（每行选择一个列，且剪枝很强）
- 空间复杂度：`O(n)`（递归深度 + 三个集合，不含输出）

## 总结

N 皇后的关键不在“多聪明”，而在于建模：按行放置，把“行约束”直接消掉；再用列与对角线的集合实现 O(1) 冲突检测，回溯才会高效且不易写错。

