# LeetCode-039：组合总和，回溯时用 start 控制“可重复选同一元素”

> **本题在线练习**：[LeetCode 39. 组合总和 - 在线练习（免费 · 无需登录 · AI 辅助）](https://onefly.top/zero2Leetcode/playground.html?id=39)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定一个无重复元素的数组 `candidates` 和一个目标值 `target`，找出 `candidates` 中所有可以使数字和为 `target` 的组合。

限制：

- 每个数字可以无限次使用
- 组合内元素顺序不重要，答案不能重复

例如：

- 输入：`candidates = [2,3,6,7]`，`target = 7`
- 输出：`[[2,2,3],[7]]`


## 核心思路：回溯 + start，避免重复组合

如果不控制“下一步从哪里选”，就会出现同一个组合的不同排列：

- `[2,3,2]` 和 `[2,2,3]` 本质是同一个组合

常用办法是让组合按数组下标递增地选：

- 递归参数 `start`：下一次只能从 `start`（含）往后选
- 因为题目允许重复选当前数，所以递归时传 `i`（而不是 `i+1`）

同时可以排序并剪枝：

- 如果 `candidates[i] > remain`，后面更大也不可能，直接 break

## 代码实现（Python，可直接提交）

```python
from typing import List


class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        candidates.sort()
        res = []
        path = []

        def dfs(start: int, remain: int) -> None:
            if remain == 0:
                res.append(path[:])
                return

            for i in range(start, len(candidates)):
                x = candidates[i]
                if x > remain:
                    break
                path.append(x)
                # i (not i+1): can reuse same element
                dfs(i, remain - x)
                path.pop()

        dfs(0, target)
        return res
```

## 逐行拆解：`dfs(i, remain-x)` 为什么不是 `dfs(i+1, ...)`？

题目允许“同一个数字可以无限次使用”。

- 如果写 `dfs(i+1, ...)`，就等于“每个数字最多用一次”，那会变成另一题（组合总和 II 的味道）
- 正确做法是把 `i` 继续传下去，表示下一次仍然允许选当前元素

## 手动模拟：`candidates=[2,3,6,7], target=7`

排序后不变：

从 2 开始：

- 选 2，remain=5
  - 再选 2，remain=3
    - 再选 2，remain=1（下一个最小是 2，超过 remain，回退）
    - 选 3，remain=0 => 收集 `[2,2,3]`
  - 选 3，remain=2
    - 选 3 会超过，回退（这里不会产生 `[3,2,2]`，因为 start 控制了顺序）
- 选 7，remain=0 => 收集 `[7]`

## 复杂度分析

回溯题的复杂度通常用“搜索树规模”描述：

- 时间复杂度：与解的数量和分支剪枝强弱有关，最坏情况下指数级
- 空间复杂度：`O(target / min(candidates))`（递归深度与 path 长度）

## 总结

组合类回溯题最容易写错的是“去重”：不是用集合硬去，而是用 `start` 从结构上保证组合按下标递增生成。再配合排序 + `x > remain` 的剪枝，效率和可读性都会更好。

