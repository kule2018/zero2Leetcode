# LeetCode-101：对称二叉树，镜像比较的关键是左左配右右

## 题目概述

给你一棵二叉树的根节点 `root`，判断这棵树是否**轴对称**——也就是说，它是不是自身的镜像。

举两个例子：

```
输入：[1,2,2,3,4,4,3]

        1
       / \
      2   2
     / \ / \
    3  4 4  3

输出：True（左右完全镜像）
```

```
输入：[1,2,2,null,3,null,3]

        1
       / \
      2   2
       \   \
        3   3

输出：False（右边都挂在右孩子上，不是镜像）
```

---

## 核心思路：镜像 = 交叉比较

很多初学者第一反应是"左子树和右子树长得一样就行"。**错！** 对称不是相同，而是**镜像**。

那镜像到底意味着什么？把一棵树沿中轴翻折之后，左右能完全重合。翻译成递归语言就是：

> **左子树的左孩子 要和 右子树的右孩子 相同；**
> **左子树的右孩子 要和 右子树的左孩子 相同。**

这就是"交叉比较"——外侧配外侧，内侧配内侧。

所以策略是：

1. 写一个辅助函数 `check(left, right)`，同时接收两个节点
2. 两个都为空 → 对称，返回 `True`
3. 只有一个为空，或者值不相等 → 不对称，返回 `False`
4. 递归比较：`check(left.left, right.right)` **且** `check(left.right, right.left)`

一句话记忆：**"外侧比外侧，内侧比内侧"**。

---

## 代码实现

```python
class Solution:
    def isSymmetric(self, root):
        def check(left, right):
            if not left and not right:
                return True
            if not left or not right:
                return False
            if left.val != right.val:
                return False
            return check(left.left, right.right) and check(left.right, right.left)
        return check(root.left, root.right)
```

---

## 逐行拆解

### 1. 入口：`check(root.left, root.right)`

从根节点出发，把左子树和右子树分别交给辅助函数做镜像比较。根节点本身不需要比——它是对称轴。

### 2. 终止条件一：`if not left and not right: return True`

两个指针都走到了空节点，说明这一路上结构和值都匹配，返回 `True`。

### 3. 终止条件二：`if not left or not right: return False`

一个为空一个不为空，结构都不一样，直接返回 `False`。

### 4. 值比较：`if left.val != right.val: return False`

结构一样（都不为空），但值不同，不是镜像。

### 5. 递归——交叉比较

```python
return check(left.left, right.right) and check(left.right, right.left)
```

这是整道题的精髓：

- `check(left.left, right.right)`：外侧比外侧（左边的左孩子 vs 右边的右孩子）
- `check(left.right, right.left)`：内侧比内侧（左边的右孩子 vs 右边的左孩子）

两个方向都通过，才算对称。`and` 短路求值——只要外侧不通过，内侧就不用比了。

---

## 手动模拟

以 `[1,2,2,3,4,4,3]` 为例，画出完整树：

```
        1
       / \
      2   2
     / \ / \
    3  4 4  3
```

递归过程：

```
check(左2, 右2)
  值相同：2 == 2 ✓
  ├── 外侧：check(左2的左孩子3, 右2的右孩子3)
  │     值相同：3 == 3 ✓
  │     ├── 外侧：check(None, None) → True ✓
  │     └── 内侧：check(None, None) → True ✓
  │     → True
  │
  └── 内侧：check(左2的右孩子4, 右2的左孩子4)
        值相同：4 == 4 ✓
        ├── 外侧：check(None, None) → True ✓
        └── 内侧：check(None, None) → True ✓
        → True

最终：True and True → True ✓
```

再看反例 `[1,2,2,null,3,null,3]`：

```
        1
       / \
      2   2
       \   \
        3   3
```

```
check(左2, 右2)
  值相同：2 == 2 ✓
  ├── 外侧：check(左2的左孩子None, 右2的右孩子3)
  │     一个为空一个不为空 → False ✗
  │
  └──（短路，内侧不再比较）

最终：False
```

外侧交叉比较立刻发现了问题：左边没有左孩子，右边却有右孩子，结构不镜像。

---

## 复杂度分析

| | 复杂度 | 说明 |
|---|---|---|
| 时间 | O(n) | 最坏情况下每个节点恰好被访问一次 |
| 空间 | O(h) | 递归栈深度等于树的高度 h；最坏情况（链状树）为 O(n)，平衡树为 O(log n) |

---

## 总结

| 要点 | 内容 |
|------|------|
| 核心思路 | 对称 = 镜像 = 交叉比较，外侧配外侧，内侧配内侧 |
| 递归函数 | `check(left, right)` 同时传入两个节点 |
| 递归三要素 | 参数 = 一对镜像位置的节点，终止 = 都空或结构/值不匹配，返回 = 布尔值 |
| 易错点 | 对称不是"左右子树相同"，而是"左右子树互为镜像" |

这题是**递归思维**的经典入门题。它教会我们一个重要技巧：递归函数不一定只接收一个参数，当需要同时比较两个东西时，大胆地传两个参数进去。把"外侧比外侧、内侧比内侧"这个交叉比较模式记住，以后遇到镜像、回文相关的树题都能快速上手。
