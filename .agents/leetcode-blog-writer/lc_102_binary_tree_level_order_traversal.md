# LeetCode-102：二叉树的层序遍历，把“从上到下”写成一个标准 BFS 模板

> **本题在线练习**：LeetCode 102. 二叉树的层序遍历 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=102)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定一棵二叉树的根节点 `root`，按“层序遍历”（从上到下、从左到右）返回每一层的节点值，输出形如 `[[第1层...], [第2层...], ...]`。

## 核心思路：队列 + 按层定长

层序遍历的本质是 BFS（广度优先搜索）。关键点只有一个：

- 队列里永远存“下一批要处理的节点”
- 每次循环先记下当前队列长度 `level_size`，这就是“这一层有多少个节点”

这样就能自然地把结果按层分组。

## 先从最自然的思路讲起

如果不要求“按层分组”，BFS 只需要把节点依次出队、把左右孩子入队即可。

现在要分组，只要在每一轮 BFS 开始前“锁定这一层的数量”：

1. `level_size = len(queue)`
2. 连续弹出 `level_size` 次，收集这一层的值
3. 在弹出过程中，把下一层的节点（左右孩子）入队

## 代码实现（Python）

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
    def levelOrder(self, root: Optional["TreeNode"]) -> List[List[int]]:
        if root is None:
            return []

        res: List[List[int]] = []
        q = deque([root])

        while q:
            level_size = len(q)
            level: List[int] = []
            for _ in range(level_size):
                node = q.popleft()
                level.append(node.val)
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            res.append(level)

        return res
```

## 逐行拆解

```python
q = deque([root])
```

队列初始化为根节点，表示“第一层要处理的节点集合”。

```python
level_size = len(q)
for _ in range(level_size):
    node = q.popleft()
```

`level_size` 是这一层节点数量。循环 `level_size` 次，保证这一轮只处理当前层，不会把下一层混进来。

```python
if node.left:
    q.append(node.left)
if node.right:
    q.append(node.right)
```

把孩子入队，实际上是在准备下一层。

## 手动模拟 / 举例说明

例子：`[3,9,20,null,null,15,7]`

- 初始 `q=[3]`
- 第一轮：`level_size=1`，弹出 `3`，入队 `9,20`，得到层 `[3]`
- 第二轮：`q=[9,20]`，`level_size=2`，弹出 `9`（无孩子），弹出 `20`（入队 `15,7`），得到层 `[9,20]`
- 第三轮：`q=[15,7]`，得到层 `[15,7]`

输出 `[[3],[9,20],[15,7]]`。

## 复杂度分析

- 时间复杂度：`O(n)`，每个节点入队/出队一次
- 空间复杂度：`O(w)`，`w` 为树的最大宽度（队列峰值）

## 总结

层序遍历最推荐记住的不是某段代码，而是“按层定长”的模板：

- `level_size = len(queue)`
- 弹出 `level_size` 个节点组成一层
- 弹出时把孩子节点入队，形成下一层

这个模板不仅能做层序遍历，也能顺手解决“按层统计”“最右视图”“每层最大值”等一系列题。

