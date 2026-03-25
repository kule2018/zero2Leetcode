# LeetCode-073：矩阵置零，用第一行/第一列做标记，O(1) 额外空间

> **本题在线练习**：[LeetCode 73. 矩阵置零 - 在线练习（免费 · 无需登录 · AI 辅助）](https://onefly.top/zero2Leetcode/playground.html?id=73)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定一个 `m x n` 的矩阵 `matrix`，如果某个元素为 0，则将其所在行和列的所有元素都置为 0。要求原地修改。

## 核心思路：用第一行和第一列记录“哪些行/列需要清零”

最自然的写法是先找出所有 0 的位置，再统一置零。难点在于：

> 如果在扫描过程中就直接置零，会污染后续判断（新产生的 0 不是原始 0）。

因此需要“标记后再统一修改”。进阶要求是 O(1) 额外空间，可以把标记存在矩阵自身：

- 用第一行 `matrix[0][j]` 作为“第 j 列是否需要清零”的标记
- 用第一列 `matrix[i][0]` 作为“第 i 行是否需要清零”的标记

但第一行、第一列本身是否需要清零也要单独记录，否则会被标记覆盖。

## 代码实现（O(1) 额外空间，Python 可提交）

```python
from typing import List


class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        m, n = len(matrix), len(matrix[0])

        first_row_zero = any(matrix[0][j] == 0 for j in range(n))
        first_col_zero = any(matrix[i][0] == 0 for i in range(m))

        # use first row/col as markers
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][j] == 0:
                    matrix[i][0] = 0
                    matrix[0][j] = 0

        # zero rows based on markers
        for i in range(1, m):
            if matrix[i][0] == 0:
                for j in range(1, n):
                    matrix[i][j] = 0

        # zero cols based on markers
        for j in range(1, n):
            if matrix[0][j] == 0:
                for i in range(1, m):
                    matrix[i][j] = 0

        if first_row_zero:
            for j in range(n):
                matrix[0][j] = 0

        if first_col_zero:
            for i in range(m):
                matrix[i][0] = 0
```

## 逐行拆解：为什么要先记 `first_row_zero / first_col_zero`？

因为后续会拿第一行/第一列当标记位：

- 一旦遇到某个内部元素 `matrix[i][j]==0`，会把 `matrix[i][0]`、`matrix[0][j]` 置 0
- 这会改变第一行/第一列的值，导致无法区分“原本就该清零”还是“后续标记出来的”

所以必须在做标记前，先把第一行/第一列是否含 0 记录下来，最后统一处理它们本身的清零。

## 手动模拟一个例子

```
matrix =
[
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1]
]
```

标记阶段：

- 发现 `(1,1)==0`，于是 `matrix[1][0]=0`（标记第 1 行要清零）
- `matrix[0][1]=0`（标记第 1 列要清零）

然后根据标记清零：

- 第 1 行清零 => `[0,0,0]`
- 第 1 列清零 => `(0,1)`、`(2,1)` 变 0

得到正确结果。

## 复杂度分析

- 时间复杂度：`O(m*n)`，扫描与清零都是线性
- 空间复杂度：`O(1)`（只用了常数额外变量）

## 总结

矩阵置零的坑在于“污染”：边扫描边改会把原始信息冲掉。正确做法是先标记后处理；O(1) 空间版的核心技巧是借用第一行/第一列做标记位，并单独记录它们自身是否需要清零。

