# LeetCode-078：子集，把“选或不选”写成一棵二叉决策树

> **本题在线练习**：[LeetCode 78. 子集 - 在线练习（免费 · 无需登录 · AI 辅助）](https://onefly.top/zero2Leetcode/playground.html?id=78)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定一个不含重复元素的整数数组 `nums`，返回该数组所有可能的子集（幂集）。解集不能包含重复子集。

例如 `nums = [1,2]`，子集为：`[]，[1]，[2]，[1,2]`。

## 核心思路 1：回溯，把子集看成“从左到右选一些数”

对子集来说，每个元素只有两种状态：要或不要。把它写成回溯，会非常自然：

- 走到第 i 个元素时，决定是否把它加入当前子集
- 每走到一个位置，都可以把当前 `path` 作为一个子集加入答案

## 代码实现 1（回溯）

```python
from typing import List


class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        res = []
        path = []

        def dfs(start: int) -> None:
            res.append(path[:])
            for i in range(start, len(nums)):
                path.append(nums[i])
                dfs(i + 1)
                path.pop()

        dfs(0)
        return res
```

### 这段代码的关键点

- `start` 表示下一次从哪里开始选，保证子集不会出现“同一元素重复选择”
- 每次进入 `dfs`，先把当前 `path` 收集起来，表示“当前选择集合就是一个子集”

## 核心思路 2：位运算枚举（进阶，思路很直接）

对长度为 `n` 的数组，每个元素选或不选，可以用 `n` 位二进制表示：

- 第 i 位为 1：选 `nums[i]`
- 第 i 位为 0：不选

共有 `2^n` 种状态。

## 代码实现 2（位运算）

```python
from typing import List


class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        n = len(nums)
        res = []
        for mask in range(1 << n):
            cur = []
            for i in range(n):
                if (mask >> i) & 1:
                    cur.append(nums[i])
            res.append(cur)
        return res
```

## 手动模拟：`nums=[1,2,3]` 的回溯收集顺序

从 `start=0` 开始：

- 收集 `[]`
  - 选 1，收集 `[1]`
    - 选 2，收集 `[1,2]`
      - 选 3，收集 `[1,2,3]`
    - 回退，再选 3，收集 `[1,3]`
  - 回退，选 2，收集 `[2]`
    - 选 3，收集 `[2,3]`
  - 回退，选 3，收集 `[3]`

最终一共 `2^3=8` 个子集。

## 复杂度分析

设 `n = len(nums)`：

- 时间复杂度：`O(n * 2^n)`（输出规模决定了下限）
- 空间复杂度：`O(n)`（递归栈 + path，不含输出）

## 总结

子集题的本质是“选或不选”。回溯写法的关键是用 `start` 保证组合不回头；位运算写法则把“选或不选”直接编码成二进制状态。两种写法都值得掌握。

