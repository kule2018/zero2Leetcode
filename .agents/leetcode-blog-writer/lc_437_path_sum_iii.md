# LeetCode-437：路径总和 III，用“前缀和”把树上路径计数降到 O(n)

> **本题在线练习**：LeetCode 437. 路径总和 III - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=437)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定二叉树 `root` 和整数 `targetSum`，统计路径和等于 `targetSum` 的路径数量。

路径定义：

- 必须沿着父 -> 子方向向下
- 可以从任意节点开始，到任意节点结束
- 不要求从根开始，也不要求到叶子结束

例如：

- 输入：`root = [10,5,-3,3,2,null,11,3,-2,null,1]`，`targetSum = 8`
- 输出：`3`（路径：5→3、5→2→1、-3→11）


## 核心思路：树上“从某点到某点”的和，用前缀和差值表示

在数组里，统计“和为 K 的子数组”常用前缀和：

- `prefix[j] - prefix[i] = K` 说明 `(i, j]` 这一段和为 K

树上路径虽然不是线性的，但只要限定“向下走”，从根到当前节点这条路径就是一条线。于是同样可以用前缀和思想：

- 设 `cur_sum` 是从根到当前节点的路径和
- 如果之前某个祖先位置出现过前缀和 `cur_sum - targetSum`
- 那么从那个祖先的下一节点到当前节点的这段路径和就是 `targetSum`

只需要在 DFS 过程中维护一个哈希表 `cnt[prefix_sum] = 出现次数`。

## 代码实现（Python）：DFS + 前缀和计数（带回溯）

```python
from collections import defaultdict
from typing import Optional


# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right


class Solution:
    def pathSum(self, root: Optional["TreeNode"], targetSum: int) -> int:
        cnt = defaultdict(int)
        cnt[0] = 1  # 空前缀：从根开始的一段路径也能被统计到

        def dfs(node: Optional["TreeNode"], cur_sum: int) -> int:
            if node is None:
                return 0

            cur_sum += node.val

            # 以当前节点为“路径终点”，满足条件的路径条数
            res = cnt[cur_sum - targetSum]

            cnt[cur_sum] += 1
            res += dfs(node.left, cur_sum)
            res += dfs(node.right, cur_sum)
            cnt[cur_sum] -= 1  # 回溯：退出当前节点路径

            return res

        return dfs(root, 0)
```

## 逐行拆解

```python
cnt[0] = 1
```

表示“前缀和为 0 出现过一次”。这样当某条从根开始的路径和刚好等于 `targetSum` 时：

- `cur_sum - targetSum == 0`
- 能正确计数到一条路径

```python
res = cnt[cur_sum - targetSum]
```

把“路径和等于 targetSum”转化为“找之前出现过多少个前缀和等于 `cur_sum - targetSum`”。

```python
cnt[cur_sum] += 1
... dfs ...
cnt[cur_sum] -= 1
```

回溯非常关键：`cnt` 表示的是“当前 DFS 路径（根到当前节点）上的前缀和出现次数”，离开节点时必须撤销，否则会把别的分支的前缀和混进来。

## 手动模拟 / 举例说明

假设 DFS 路径从根到当前节点的前缀和依次是：

`0 -> 10 -> 15 -> 18`

此时 `cur_sum = 18`，如果 `targetSum = 8`：

- 需要找 `cur_sum - targetSum = 10`
- `10` 在 `cnt` 里出现过一次，说明存在一条从“前缀和为 10 的节点后面”到当前节点的路径和为 8

这条路径不要求从根开始，正好符合题意。

## 复杂度分析

- 时间复杂度：`O(n)`，每个节点仅做常数次哈希表操作
- 空间复杂度：`O(h)` 到 `O(n)`，`cnt` 里存的是当前路径上的前缀和，最坏树退化为链表时为 `O(n)`

## 总结

这题的突破点是把“任意起点的向下路径”变成“根到当前节点路径上的前缀和差值”：

- `cur_sum` 表示根到当前
- `cnt[cur_sum - target]` 表示有多少条以前缀和为起点的路径能凑出目标
- 回溯保证计数只发生在同一条 DFS 路径上

掌握这套写法，树上的很多“路径和计数”题都会明显简化。

