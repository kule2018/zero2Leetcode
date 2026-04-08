# LeetCode-236：二叉树的最近公共祖先，递归返回“在不在子树里”就够了

> **本题在线练习**：LeetCode 236. 二叉树的最近公共祖先 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=236)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定一棵二叉树 `root`，以及两个节点 `p`、`q`，返回它们的最近公共祖先（LCA）。

“最近”指的是：离 `p` 和 `q` 都最近、同时是它们祖先的那个节点。

例如：

- 输入：`root = [3,5,1,6,2,0,8,null,null,7,4]`，`p = 5`，`q = 1`
- 输出：`3`


## 核心思路：递归函数返回“在当前子树里找到的节点”

对任意节点 `node`：

- 如果 `node` 的左子树能找到 `p` 或 `q`，递归返回那个节点
- 如果 `node` 的右子树能找到 `p` 或 `q`，递归返回那个节点

那么：

- 如果左右都不为空，说明 `p`、`q` 分居两侧，`node` 就是 LCA
- 如果只有一侧不为空，说明 LCA 在那一侧（或当前节点本身就是 p/q）
- 如果两侧都为空，返回空

## 代码实现（Python）：后序递归

```python
from typing import Optional


# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None


class Solution:
    def lowestCommonAncestor(
        self,
        root: Optional["TreeNode"],
        p: "TreeNode",
        q: "TreeNode",
    ) -> Optional["TreeNode"]:
        if root is None:
            return None
        if root is p or root is q:
            return root

        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)

        if left is not None and right is not None:
            return root
        return left if left is not None else right
```

## 逐行拆解

```python
if root is p or root is q:
    return root
```

如果当前节点就是 `p` 或 `q`，直接返回当前节点。注意这里比较的是“节点对象”，不是值。

```python
left = ...
right = ...
```

分别去左右子树找 `p/q`，返回值要么是 `p`、要么是 `q`、要么是某个 LCA、要么为空。

```python
if left is not None and right is not None:
    return root
```

左右都找到了，说明一个在左一个在右，当前节点就是它们第一次汇合的位置，也就是最近公共祖先。

## 手动模拟 / 举例说明

```
      3
     / \
    5   1
   / \ / \
  6  2 0  8
    / \
   7   4
```

若 `p=5`，`q=1`：

- 在根节点 3 的左子树能找到 5
- 在根节点 3 的右子树能找到 1
- 左右都非空，返回 3

若 `p=5`，`q=4`：

- 4 在 5 的子树里
- 在节点 5 处，左/右递归会出现左右一侧非空，最终返回 5

## 复杂度分析

- 时间复杂度：`O(n)`，最坏需要遍历整棵树
- 空间复杂度：`O(h)`，递归栈深度 `h`

## 总结

LCA 的经典写法并不需要显式记录父指针或路径：

- 递归返回“在这棵子树里找到的关键节点”
- 左右都有返回值时，当前节点就是答案

这是一类非常值得背下来的“树递归定义法”模板。

