# LeetCode-098：验证二叉搜索树，别只看相邻节点，正确做法是“范围约束”

> **本题在线练习**：LeetCode 98. 验证二叉搜索树 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=98)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定二叉树根节点 `root`，判断它是否是一棵二叉搜索树（BST）。

BST 定义要点：

- 任意节点 `x` 的左子树所有节点值都严格小于 `x.val`
- 任意节点 `x` 的右子树所有节点值都严格大于 `x.val`
- 左右子树也必须分别是 BST

例如：

- 输入：`root = [2,1,3]` → 输出：`true`
- 输入：`root = [5,1,4,null,null,3,6]` → 输出：`false`（节点 4 在右子树但小于 5）


## 核心思路：递归时携带“允许的取值范围”

很多人会犯的错误是只检查：

- `node.left.val < node.val`
- `node.right.val > node.val`

这不够，因为 BST 的约束是“整棵子树”的全局约束。

正确思路是：递归到某个节点时，已经能推导出它允许出现的范围 `(low, high)`：

- 来自祖先的限制会一路传下来
- 当前节点再把范围收紧，传给左右孩子

## 先从最自然的思路讲起

如果 `root` 是 BST，那么：

- `root.left` 所有值都在 `(-inf, root.val)` 内
- `root.right` 所有值都在 `(root.val, +inf)` 内

继续递归时，这个范围会不断叠加。例如进入 `root.left.right`，它既要小于 `root.val`，也要大于 `root.left.val`，这就是范围约束的来源。

## 代码实现（Python）：范围递归

```python
from typing import Optional


# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right


class Solution:
    def isValidBST(self, root: Optional["TreeNode"]) -> bool:
        def dfs(node: Optional["TreeNode"], low: Optional[int], high: Optional[int]) -> bool:
            if node is None:
                return True

            v = node.val
            if low is not None and v <= low:
                return False
            if high is not None and v >= high:
                return False

            return dfs(node.left, low, v) and dfs(node.right, v, high)

        return dfs(root, None, None)
```

## 逐行拆解

```python
def dfs(node, low, high):
```

`low/high` 表示当前节点允许的开区间 `(low, high)`。这里用 `None` 表示无界。

```python
if low is not None and v <= low: return False
if high is not None and v >= high: return False
```

注意是“严格小于/严格大于”，所以用 `<=`、`>=` 来判违规。

```python
dfs(node.left, low, v)
dfs(node.right, v, high)
```

左子树上界变成 `v`，右子树下界变成 `v`，范围逐层收紧。

## 手动模拟 / 举例说明

考虑这棵树：

```
    5
   / \
  1   4
     / \
    3   6
```

如果只看父子关系，会觉得 `4` 的左孩子 `3 < 4`、右孩子 `6 > 4` 没问题。

但进入节点 `3` 时，它处在 `5` 的右子树里，所以必须满足 `> 5`。范围递归会把 `low=5` 传到这条路径，于是 `3 <= 5`，立刻判 False。

## 复杂度分析

- 时间复杂度：`O(n)`，每个节点检查一次
- 空间复杂度：`O(h)`，递归栈深度，`h` 为树高（最坏 `O(n)`，平衡时 `O(log n)`）

## 总结

验证 BST 最稳的记法是“范围约束”：

- 每个节点都要落在祖先传下来的 `(low, high)` 里
- 往左走就收紧上界，往右走就收紧下界

掌握这一点，就不会被“只看相邻节点”的陷阱误导。

