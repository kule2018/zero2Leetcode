# LeetCode-054：螺旋矩阵，按“边界收缩”模拟一圈一圈走

> **本题在线练习**：LeetCode 54. 螺旋矩阵 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=54)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定一个 `m x n` 矩阵，按螺旋顺序（从左到右、从上到下、从右到左、从下到上循环）返回所有元素。

这题不需要复杂算法，本质是“模拟”，关键是避免重复访问和越界。

例如：

- 输入：`matrix = [[1,2,3],[4,5,6],[7,8,9]]`
- 输出：`[1,2,3,6,9,8,7,4,5]`


## 核心思路：维护四个边界并不断收缩

用四个变量表示当前还未遍历区域的边界：

- `top`：上边界行
- `bottom`：下边界行
- `left`：左边界列
- `right`：右边界列

每走完一条边，就把对应边界向内收缩。顺序固定为：

1. 从左到右走 `top` 行，然后 `top += 1`
2. 从上到下走 `right` 列，然后 `right -= 1`
3. 从右到左走 `bottom` 行，然后 `bottom -= 1`
4. 从下到上走 `left` 列，然后 `left += 1`

中间每一步都要判断边界是否交错，避免重复。

## 代码实现（边界收缩模拟）

```python
class Solution:
    def spiralOrder(self, matrix: list[list[int]]) -> list[int]:
        if not matrix or not matrix[0]:
            return []

        m, n = len(matrix), len(matrix[0])
        top, bottom = 0, m - 1
        left, right = 0, n - 1
        ans = []

        while top <= bottom and left <= right:
            # top row: left -> right
            for j in range(left, right + 1):
                ans.append(matrix[top][j])
            top += 1
            if top > bottom:
                break

            # right col: top -> bottom
            for i in range(top, bottom + 1):
                ans.append(matrix[i][right])
            right -= 1
            if left > right:
                break

            # bottom row: right -> left
            for j in range(right, left - 1, -1):
                ans.append(matrix[bottom][j])
            bottom -= 1
            if top > bottom:
                break

            # left col: bottom -> top
            for i in range(bottom, top - 1, -1):
                ans.append(matrix[i][left])
            left += 1

        return ans
```

## 逐行拆解：为什么每段后面都要检查边界

当矩阵只有一行/一列，或者走到最后剩下一个“细长区域”时：

- 走完 `top` 行后，可能 `top` 已经超过 `bottom`，此时继续走右列会重复访问。
- 走完 `right` 列后，可能 `left` 已经超过 `right`，继续走底行也会重复访问。

所以每收缩一次边界，都要用 `if` 及时 `break`。

## 手动模拟：matrix = [[1,2,3],[4,5,6],[7,8,9]]

一圈：

- top 行：`1 2 3`
- right 列：`6 9`
- bottom 行：`8 7`
- left 列：`4`

边界收缩后只剩中间 `(1,1)`：

再走 top 行得到 `5`，结束。

结果：`[1,2,3,6,9,8,7,4,5]`。

## 复杂度分析

- 时间：`O(mn)`（每个元素只访问一次）
- 空间：`O(1)`（除输出数组外）

## 总结

螺旋矩阵的正确打开方式是“边界收缩模拟”。把四条边走完就缩一圈，每段走完检查边界是否交错，就能稳定覆盖所有形状的矩阵。

