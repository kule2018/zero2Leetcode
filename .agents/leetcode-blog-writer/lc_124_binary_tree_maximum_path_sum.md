# LeetCode-124：二叉树中的最大路径和，分清“向上贡献”与“答案更新”

> **本题在线练习**：LeetCode 124. 二叉树中的最大路径和 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=124)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定一棵二叉树，路径定义为：沿着父子指针连接的一条序列，路径中至少包含一个节点，且不要求经过根。

求这棵树中的“最大路径和”。

注意：路径可以在某个节点处“拐弯”（左子树 -> 节点 -> 右子树），但拐弯只能发生一次，否则就不是一条简单路径。

## 核心思路：每个节点要算两件事

对于每个节点 `node`：

1. **向上贡献（gain）**：如果把路径继续往父节点延伸，`node` 能提供的最大和是多少？
   - 这条路径不能同时走左右两边，只能选择一边
   - 所以向上贡献是：`node.val + max(left_gain, right_gain, 0)`

2. **在当前节点更新答案**：如果路径在 `node` 这里拐弯，最大和是多少？
   - 可以同时取左右两边的贡献（负数则丢掉）
   - 所以更新值是：`node.val + max(0, left_gain) + max(0, right_gain)`

全局最大值在第二类里不断更新。

## 代码实现（Python）：后序遍历 + 全局变量

```python
from typing import Optional


# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right


class Solution:
    def maxPathSum(self, root: Optional["TreeNode"]) -> int:
        best = float("-inf")

        def gain(node: Optional["TreeNode"]) -> int:
            nonlocal best
            if node is None:
                return 0

            left = max(gain(node.left), 0)
            right = max(gain(node.right), 0)

            # 路径在 node 处拐弯（左 + node + 右）
            best = max(best, node.val + left + right)

            # 向上贡献只能选一边
            return node.val + max(left, right)

        gain(root)
        return best
```

## 逐行拆解

```python
left = max(gain(node.left), 0)
right = max(gain(node.right), 0)
```

如果某个子树贡献为负，宁愿不选（等价于选 0），因为加入负数只会让路径变小。

```python
best = max(best, node.val + left + right)
```

这一步对应“路径在当前节点拐弯”的情况。它是一个完整路径的候选答案，所以要用它更新全局最大值。

```python
return node.val + max(left, right)
```

这是“向上贡献”。因为路径要继续向上连接父节点，不能分叉，所以左右只能选一边。

## 手动模拟 / 举例说明

经典例子：

```
   -10
   /  \
  9   20
     /  \
    15   7
```

- 对节点 15：`left=0,right=0`，更新 `best=15`，向上贡献 `15`
- 对节点 7：更新 `best=max(15,7)=15`，向上贡献 `7`
- 对节点 20：`left=15,right=7`，更新候选路径和 `20+15+7=42`，向上贡献 `20+max(15,7)=35`
- 对节点 -10：`left=9,right=35`，更新候选路径和 `-10+9+35=34`，全局最优仍为 42

答案 42 对应路径 `15 -> 20 -> 7`，不经过根，符合题意。

## 复杂度分析

- 时间复杂度：`O(n)`，每个节点只处理一次
- 空间复杂度：`O(h)`，递归栈深度

## 总结

这题最容易卡在“到底返回什么”。记住两个关键词就不乱：

- 返回给父节点的是“向上贡献”（只能选一边）
- 用来更新答案的是“拐弯路径”（可以左右都取）

把这两件事分开写，代码就会非常清晰。

