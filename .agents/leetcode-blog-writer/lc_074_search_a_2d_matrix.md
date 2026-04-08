# LeetCode-074：搜索二维矩阵，把它当成一维有序数组就够了

> **本题在线练习**：LeetCode 74. 搜索二维矩阵 — 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=74)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) — 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定一个 `m x n` 的二维矩阵 `matrix`，满足：

- 每行从左到右递增
- 每行的第一个元素大于前一行的最后一个元素

判断目标值 `target` 是否在矩阵中。

例如：

- 输入：`matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]]`，`target = 3`
- 输出：`true`


## 核心思路：矩阵整体就是严格递增的“一维数组”

由于行与行之间也有严格的衔接关系，整个矩阵按行展开后是严格递增的：

```
matrix[0][0], matrix[0][1], ..., matrix[0][n-1],
matrix[1][0], ..., matrix[1][n-1],
...
```

因此可以对下标区间 `[0, m*n-1]` 做一次二分查找。

关键映射：

- 一维下标 `idx` 对应二维坐标：
  - `row = idx // n`
  - `col = idx % n`

## 代码实现（Python，可直接提交）

```python
from typing import List


class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        if not matrix or not matrix[0]:
            return False

        m, n = len(matrix), len(matrix[0])
        left, right = 0, m * n - 1

        while left <= right:
            mid = (left + right) // 2
            r, c = divmod(mid, n)
            x = matrix[r][c]

            if x == target:
                return True
            if x < target:
                left = mid + 1
            else:
                right = mid - 1

        return False
```

## 逐行拆解：`divmod(mid, n)` 的意义

`divmod(mid, n)` 同时返回商和余数：

- 商是行号 `mid // n`
- 余数是列号 `mid % n`

这样二分的每一步都能定位到矩阵中的真实元素。

## 手动模拟（示例）

```
matrix =
[
  [1, 3, 5, 7],
  [10, 11, 16, 20],
  [23, 30, 34, 60]
]
target = 16
```

展开后的一维数组是 `[1,3,5,7,10,11,16,20,23,30,34,60]`，二分很快命中 `16`。

## 复杂度分析

- 时间复杂度：`O(log(m*n))`
- 空间复杂度：`O(1)`

## 总结

只要认清题目给的两个递增条件意味着“整体严格递增”，就不需要先定位行再定位列，直接把二维当一维二分，代码更短也更不容易错。

