# LeetCode-105：从前序与中序构造二叉树，关键是“左子树大小 = 中序分割点位置”

> **本题在线练习**：LeetCode 105. 从前序与中序遍历序列构造二叉树 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=105)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定一棵二叉树的：

- 前序遍历 `preorder`（根 -> 左 -> 右）
- 中序遍历 `inorder`（左 -> 根 -> 右）

要求重建并返回这棵二叉树的根节点。题目保证树中没有重复值。

## 核心思路：前序第一个是根，中序里根把左右子树切开

把两个遍历的性质合起来看：

1. `preorder[0]` 一定是根
2. 在 `inorder` 中找到这个根的位置 `mid`
3. `inorder` 的 `[L, mid-1]` 是左子树，`[mid+1, R]` 是右子树
4. 左子树节点数量 `left_size = mid - L`
5. 前序里根后面紧跟着的是左子树的前序，所以可以用 `left_size` 切分前序

## 代码实现（Python）：递归 + 哈希表加速查找

```python
from typing import List, Optional


# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right


class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional["TreeNode"]:
        idx = {v: i for i, v in enumerate(inorder)}  # inorder 值 -> 下标

        def build(pre_l: int, pre_r: int, in_l: int, in_r: int) -> Optional["TreeNode"]:
            if pre_l > pre_r:
                return None

            root_val = preorder[pre_l]
            root = TreeNode(root_val)

            mid = idx[root_val]
            left_size = mid - in_l

            root.left = build(pre_l + 1, pre_l + left_size, in_l, mid - 1)
            root.right = build(pre_l + left_size + 1, pre_r, mid + 1, in_r)
            return root

        return build(0, len(preorder) - 1, 0, len(inorder) - 1)
```

## 逐行拆解

```python
idx = {v: i for i, v in enumerate(inorder)}
```

把“在 inorder 里找根的位置”从 `O(n)` 降到 `O(1)`，整体复杂度从 `O(n^2)` 变成 `O(n)`。

```python
root_val = preorder[pre_l]
mid = idx[root_val]
left_size = mid - in_l
```

`left_size` 是本次递归里左子树的节点数，这个数决定了 preorder 的切分点。

```python
root.left = build(pre_l + 1, pre_l + left_size, in_l, mid - 1)
root.right = build(pre_l + left_size + 1, pre_r, mid + 1, in_r)
```

前序切分：根后面 `left_size` 个节点属于左子树，其余属于右子树。

## 手动模拟 / 举例说明

`preorder = [3,9,20,15,7]`

`inorder  = [9,3,15,20,7]`

1. 根 = 3（pre[0]）
2. 3 在 inorder 中位置 `mid=1`，左子树大小 `left_size=1`
3. 左子树：
   - preorder 取 `[9]`
   - inorder  取 `[9]`
4. 右子树：
   - preorder 取 `[20,15,7]`
   - inorder  取 `[15,20,7]`
5. 对右子树递归，根变 20，再继续切分

## 复杂度分析

- 时间复杂度：`O(n)`，每个节点只被创建一次，且 `mid` 查找是 `O(1)`
- 空间复杂度：`O(n)`，哈希表 `O(n)`，递归栈最坏 `O(n)`（平衡时 `O(log n)`）

## 总结

这题最重要的只有两句话：

- 前序的第一个元素是根
- 中序里根的位置决定了左子树大小，从而决定前序怎么切

把 `left_size = mid - in_l` 这行想清楚，整题就顺了。

