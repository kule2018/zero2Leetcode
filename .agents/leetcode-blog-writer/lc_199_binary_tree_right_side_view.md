# LeetCode-199：二叉树的右视图，每一层最后一个节点就是答案

> **本题在线练习**：LeetCode 199. 二叉树的右视图 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=199)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

从二叉树的右侧看过去，返回能看到的节点值（从上到下）。

更“算法化”的表述是：

- 对每一层，只取最右边的那个节点

例如：

- 输入：`root = [1,2,3,null,5,null,4]`
- 输出：`[1,3,4]`


## 核心思路：层序遍历（BFS）按层取最后一个

既然答案是“每一层的最右节点”，那么最自然的办法就是按层遍历：

1. BFS 得到每一层的节点列表
2. 取每层的最后一个值加入结果

## 代码实现（Python）：BFS

```python
from collections import deque
from typing import List, Optional


# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right


class Solution:
    def rightSideView(self, root: Optional["TreeNode"]) -> List[int]:
        if root is None:
            return []

        res: List[int] = []
        q = deque([root])

        while q:
            level_size = len(q)
            last_val = None
            for _ in range(level_size):
                node = q.popleft()
                last_val = node.val
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            res.append(last_val)

        return res
```

## 逐行拆解

```python
level_size = len(q)
last_val = None
for _ in range(level_size):
    node = q.popleft()
    last_val = node.val
```

这一层弹出 `level_size` 个节点，`last_val` 会被不断覆盖，最终保留下来的就是这一层的最后一个节点值，也就是最右边的节点（因为队列入队顺序是从左到右）。

## 手动模拟 / 举例说明

```
    1
   / \
  2   3
   \   \
    5   4
```

按层：

- 第 1 层：[1] -> 取 1
- 第 2 层：[2,3] -> 取 3
- 第 3 层：[5,4] -> 取 4

输出 `[1,3,4]`。

## 复杂度分析

- 时间复杂度：`O(n)`，每个节点进出队一次
- 空间复杂度：`O(w)`，`w` 为最大层宽

## 进阶思路：DFS 也能做（先右后左）

如果用 DFS（先访问右子树，再访问左子树），并记录“第一次到达某个深度”的节点值，那么那个值就是右视图的节点。

本题更推荐先掌握 BFS 版本：逻辑更直观，也更接近题目“按层取最右”的描述。

## 总结

右视图本质是“每层最后一个”：

- 用 BFS 按层遍历
- 每层处理时记住最后一次弹出的节点值

把这题和“层序遍历”放在一起练，会发现它们只差一行：每层取什么作为输出。

