# LeetCode-240：搜索二维矩阵 II，从右上角开始，一步排除一行或一列

> **本题在线练习**：LeetCode 240. 搜索二维矩阵 II - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=240)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定一个 `m x n` 矩阵 `matrix`，每一行从左到右递增，每一列从上到下递增。给定目标值 `target`，判断是否存在于矩阵中。

这题最重要的是利用“行列都递增”的性质，每一步都能排除一整行或一整列。

## 核心思路：从右上角（或左下角）出发

选择右上角 `(0, n-1)` 作为起点，设当前元素为 `x`：

- 如果 `x == target`，返回 True
- 如果 `x > target`，说明 `target` 不可能在当前列的更下方（更大），所以 **左移**（`col -= 1`）
- 如果 `x < target`，说明 `target` 不可能在当前行的更左侧（更小），所以 **下移**（`row += 1`）

每一步都会让行或列缩小一格，因此最多走 `m + n` 步。

## 代码实现（右上角走楼梯）

```python
class Solution:
    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:
        if not matrix or not matrix[0]:
            return False

        m, n = len(matrix), len(matrix[0])
        r, c = 0, n - 1

        while r < m and c >= 0:
            x = matrix[r][c]
            if x == target:
                return True
            if x > target:
                c -= 1
            else:
                r += 1

        return False
```

## 逐行拆解：为什么“左移/下移”一定安全

站在右上角，当前行在左边更小，当前列在下边更大：

- `x > target`：这一列下面全都 `>= x`，更大，不可能是 `target`，所以整列可以排除，左移。
- `x < target`：这一行左边全都 `<= x`，更小，不可能是 `target`，所以整行可以排除，下移。

这就是每步排除一行/列的依据。

## 手动模拟

矩阵：

```
1  4  7 11 15
2  5  8 12 19
3  6  9 16 22
10 13 14 17 24
18 21 23 26 30
```

目标 `target=5`：

- 右上角 15 > 5，左移到 11
- 11 > 5，左移到 7
- 7 > 5，左移到 4
- 4 < 5，下移到 5
- 命中

## 复杂度分析

- 时间：`O(m + n)`
- 空间：`O(1)`

## 总结

搜索二维矩阵 II 的精髓是“走楼梯”：

> 从右上角（或左下角）出发，比较一次就能排除一整行或一整列。

这类题遇到“行列都有序”，优先想“选一个角作为起点”。

