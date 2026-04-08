# LeetCode-230：二叉搜索树中第 K 小的元素，利用“中序有序”一趟数出来

> **本题在线练习**：LeetCode 230. 二叉搜索树中第K小的元素 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=230)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定一棵二叉搜索树（BST）`root`，以及整数 `k`，返回这棵树中第 `k` 小的元素（`k` 从 1 开始计数）。

例如：

- 输入：`root = [3,1,4,null,2]`，`k = 1`
- 输出：`1`


## 核心思路：BST 的中序遍历是升序序列

BST 的一个经典性质：

- 对 BST 进行中序遍历（左 -> 根 -> 右），得到的节点值序列是严格递增的

因此第 `k` 小就是中序遍历的第 `k` 个访问到的节点。

## 先从最自然的思路讲起

最直接的想法是：

1. 中序遍历把所有节点值存到数组 `arr`
2. 返回 `arr[k-1]`

这一定正确，但会额外占用 `O(n)` 空间。实际上不需要存全量，只要在遍历过程中数到第 `k` 个就能返回。

## 代码实现（Python）：迭代中序 + 栈

```python
from typing import Optional


# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right


class Solution:
    def kthSmallest(self, root: Optional["TreeNode"], k: int) -> int:
        stack = []
        cur = root

        while cur is not None or stack:
            while cur is not None:
                stack.append(cur)
                cur = cur.left

            cur = stack.pop()
            k -= 1
            if k == 0:
                return cur.val

            cur = cur.right

        # 题目保证 k 合法，正常不会走到这里
        raise ValueError("k is out of range")
```

## 逐行拆解

```python
while cur is not None:
    stack.append(cur)
    cur = cur.left
```

这段负责“一路向左”把路径压栈，直到走到最左端。对于 BST，这相当于先找到当前子树的最小值。

```python
cur = stack.pop()
k -= 1
if k == 0: return cur.val
```

中序遍历访问到一个节点就把 `k` 减 1。减到 0 的那一刻，当前节点就是第 `k` 小。

```python
cur = cur.right
```

访问完根以后，转向右子树，继续同样的过程。

## 手动模拟 / 举例说明

BST：

```
    5
   / \
  3   6
 / \
2   4
/
1
```

中序遍历序列是 `[1,2,3,4,5,6]`。

当 `k=3` 时：

- 访问 1，k=2
- 访问 2，k=1
- 访问 3，k=0，返回 3

## 复杂度分析

- 时间复杂度：`O(h + k)`（最坏 `O(n)`），因为只需要走到第 `k` 个位置
- 空间复杂度：`O(h)`，栈最多保存一条根到叶子的路径

## 总结

这题的关键是抓住 BST 的“中序有序”：

- 不需要排序、不需要全量数组
- 用栈做迭代中序，一边遍历一边计数

一旦把“中序 = 升序”牢牢记住，BST 的很多题会变得非常顺。

