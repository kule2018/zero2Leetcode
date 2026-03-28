---
layout: default
title: 树与二叉树
description: TreeNode 定义与前中后序遍历模板
eyebrow: 数据结构 / 05
---

# 树与二叉树

**Python 节点定义：**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

**三种遍历模板：**
```python
# 前序遍历：根 -> 左 -> 右
def preorder(root):
    if not root: return
    print(root.val)
    preorder(root.left)
    preorder(root.right)

# 中序遍历：左 -> 根 -> 右
def inorder(root):
    if not root: return
    inorder(root.left)
    print(root.val)
    inorder(root.right)

# 后序遍历：左 -> 右 -> 根
def postorder(root):
    if not root: return
    postorder(root.left)
    postorder(root.right)
    print(root.val)
```
