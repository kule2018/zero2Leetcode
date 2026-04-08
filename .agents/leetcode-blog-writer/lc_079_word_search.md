# LeetCode-079：单词搜索，网格 DFS 的关键是“访问标记 + 回溯复原”

> **本题在线练习**：[LeetCode 79. 单词搜索 - 在线练习（免费 · 无需登录 · AI 辅助）](https://onefly.top/zero2Leetcode/playground.html?id=79)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定一个 `m x n` 的字符网格 `board` 和一个字符串 `word`，判断是否存在一条路径可以拼出 `word`。

规则：

- 每次只能上下左右移动一格
- 同一个格子在同一条路径中不能重复使用

例如：

- 输入：`board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]`，`word = "ABCCED"`
- 输出：`true`


## 核心思路：从每个格子作为起点做 DFS，匹配 word 的下一个字符

这是典型的“网格回溯”：

在位置 `(r, c)`，要匹配 `word[idx]`：

1. 如果越界或字符不匹配，返回 False
2. 如果 `idx` 已经到最后一个字符并匹配成功，返回 True
3. 标记当前格子“已使用”，然后往四个方向继续 DFS 匹配 `idx+1`
4. 回溯：恢复当前格子（撤销标记）

为了节省额外空间，常用做法是直接把 `board[r][c]` 临时改成一个不可能出现的字符（如 `'#'`），回溯时再改回来。

## 代码实现（Python，可直接提交）

```python
from typing import List


class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        if not board or not board[0]:
            return False

        m, n = len(board), len(board[0])

        def dfs(r: int, c: int, idx: int) -> bool:
            if board[r][c] != word[idx]:
                return False
            if idx == len(word) - 1:
                return True

            ch = board[r][c]
            board[r][c] = "#"

            if r > 0 and dfs(r - 1, c, idx + 1):
                board[r][c] = ch
                return True
            if r + 1 < m and dfs(r + 1, c, idx + 1):
                board[r][c] = ch
                return True
            if c > 0 and dfs(r, c - 1, idx + 1):
                board[r][c] = ch
                return True
            if c + 1 < n and dfs(r, c + 1, idx + 1):
                board[r][c] = ch
                return True

            board[r][c] = ch
            return False

        for i in range(m):
            for j in range(n):
                if dfs(i, j, 0):
                    return True
        return False
```

## 逐行拆解：为什么一定要“回溯复原”？

同一个格子不能在同一路径里重复使用，但它可以作为其他路径的一部分。

因此“标记已用”必须是临时的：

- 进入 DFS：把 `board[r][c]` 改成 `'#'`
- 退出 DFS：再恢复原字符

否则会影响后续从其他起点或其他分支的搜索，造成错误。

## 手动模拟：为什么 `'#'` 标记能防止重复使用？

一旦 `(r,c)` 被标记为 `'#'`，下一步 DFS 试图再走回 `(r,c)` 时，会立刻触发：

```python
if board[r][c] != word[idx]:
    return False
```

因为 `'#'` 不可能等于 `word[idx]`，于是自动禁止“同一路径重复使用同一格子”。

## 复杂度分析

设网格大小为 `m*n`，单词长度为 `L`：

- 时间复杂度：最坏 `O(m*n*4^L)`（每个起点，最多 4 分支扩展 L 层）
  - 实际通常更小，因为字符不匹配会大量剪枝
- 空间复杂度：`O(L)`（递归深度，不含输入）

## 总结

网格 DFS 的套路非常固定：从每个点出发做回溯，匹配下一个字符；为了满足“不能重复使用格子”，要么用 visited 数组，要么就地修改并在回溯时恢复。把“标记 + 恢复”写对，这题基本就稳了。

