# LeetCode-114：二叉树展开为链表，用“前序遍历顺序”原地重连指针

> **本题在线练习**：LeetCode 114. 二叉树展开为链表 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=114)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定二叉树根节点 `root`，将其“原地”展开为一个单链表：

- 链表使用树的 `right` 指针作为 `next`
- 每个节点的 `left` 指针必须置为 `None`
- 链表顺序与二叉树的前序遍历一致（根 -> 左 -> 右）

## 核心思路：前序遍历时维护 `prev`，把 `prev.right` 指向当前节点

如果把前序遍历的节点顺序写出来，目标链表就是把这些节点“按顺序串起来”。

因此可以在遍历时维护一个 `prev`：

- 第一次访问到节点 `cur` 时，把 `prev.right = cur`，并把 `prev.left = None`
- 然后更新 `prev = cur`

问题在于：展开过程中会修改指针，不能依赖原来的 `cur.left/cur.right` 继续走。最稳的做法是用栈显式模拟前序遍历。

## 代码实现（Python）：栈模拟前序遍历（原地修改）

```python
from typing import Optional


# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right


class Solution:
    def flatten(self, root: Optional["TreeNode"]) -> None:
        if root is None:
            return

        stack = [root]
        prev = None

        while stack:
            cur = stack.pop()

            if prev is not None:
                prev.left = None
                prev.right = cur

            # 前序遍历：先根再左再右
            # 栈是后进先出，所以先压右再压左
            if cur.right is not None:
                stack.append(cur.right)
            if cur.left is not None:
                stack.append(cur.left)

            prev = cur
```

## 逐行拆解

```python
stack = [root]
prev = None
```

`stack` 用来保存“接下来要访问的节点”，`prev` 记录“链表中的上一个节点”。

```python
cur = stack.pop()
if prev is not None:
    prev.left = None
    prev.right = cur
```

每访问到一个新节点，就把上一个节点的 `right` 指向它，同时把 `left` 清空，保证最终是单链表结构。

```python
if cur.right is not None: stack.append(cur.right)
if cur.left is not None: stack.append(cur.left)
```

为了保证弹出顺序是“根、左、右”，入栈顺序必须是“右、左”。

## 手动模拟 / 举例说明

树：

```
    1
   / \
  2   5
 / \   \
3   4   6
```

前序遍历顺序：`1,2,3,4,5,6`

展开后链表（只看 right 指针）：`1 -> 2 -> 3 -> 4 -> 5 -> 6`，并且所有 `left` 都是 `None`。

## 复杂度分析

- 时间复杂度：`O(n)`，每个节点进栈/出栈一次
- 空间复杂度：`O(n)`（最坏退化链表时栈可到 `n`），平均情况下约 `O(h)`

## 进阶：O(1) 额外空间的思路（了解即可）

可以用类似 Morris 遍历的方式，把当前节点左子树的最右节点（前驱）连接到当前节点的右子树上，然后把左子树搬到右边，反复推进。

写法更绕，面试中只要能把栈版讲清楚并写对，通常就足够稳。

## 总结

这题最核心的是把目标链表与“前序遍历序列”对齐：

- 遍历顺序决定链表顺序
- `prev.right = cur` 串起来
- `prev.left = None` 保证单链表

用栈模拟前序遍历是最不容易出错的一版。

