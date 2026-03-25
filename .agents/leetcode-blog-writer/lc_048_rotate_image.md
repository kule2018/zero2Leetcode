# LeetCode-048：旋转图像，原地旋转的关键是“先转置再翻转”

> **本题在线练习**：LeetCode 48. 旋转图像 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=48)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定一个 `n x n` 的二维矩阵 `matrix`，将其 **顺时针旋转 90 度**，要求 **原地修改**（不使用额外的 `n x n` 矩阵）。

这题最容易卡在“原地”两个字上：如果允许新建矩阵，很容易；原地则需要找到等价的分解步骤。

## 核心思路：顺时针 90 度 = 转置 + 每行反转

把坐标变化写出来更清楚：

顺时针旋转 90 度后：

```
(i, j) -> (j, n-1-i)
```

这个变换可以分两步完成：

1. **转置（transpose）**：`(i, j) -> (j, i)`
2. **每一行反转（reverse row）**：`(j, i) -> (j, n-1-i)`

两步叠加，正好得到顺时针 90 度。

## 代码实现（原地：转置 + 反转行）

```python
class Solution:
    def rotate(self, matrix: list[list[int]]) -> None:
        n = len(matrix)

        # 1) transpose
        for i in range(n):
            for j in range(i + 1, n):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]

        # 2) reverse each row
        for i in range(n):
            matrix[i].reverse()
```

## 逐行拆解：为什么 j 从 i+1 开始

转置时，只需要交换对角线以上（或以下）的元素：

- 如果 `j` 从 0 开始，会把 `(i, j)` 和 `(j, i)` 交换两次，等于没做。
- 让 `j` 从 `i+1` 开始，保证每对元素只交换一次。

## 手动模拟：3x3 示例

原矩阵：

```
1 2 3
4 5 6
7 8 9
```

转置后：

```
1 4 7
2 5 8
3 6 9
```

每行反转后：

```
7 4 1
8 5 2
9 6 3
```

这就是顺时针旋转 90 度的结果。

## 复杂度分析

- 时间：`O(n^2)`
- 空间：`O(1)`（原地交换）

## 总结

这题最值得记住的不是代码，而是等价分解：

> 顺时针旋转 90 度 = 先转置，再把每行反转。

很多“原地矩阵变换”题，都是先把坐标映射写清楚，再拆成可原地实现的两步或三步。

