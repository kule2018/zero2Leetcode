# LeetCode-226：翻转二叉树，递归的本质就是"把同一件事交给每个节点去做"

> **本题在线练习**：[LeetCode 226. 翻转二叉树 — 在线练习（免费 · 无需登录 · AI 辅助）](https://onefly.top/zero2Leetcode/playground.html?id=226)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开刷 Hot 100。

## 题目概述

给你一棵二叉树的根节点 `root`，把整棵树**左右翻转**（镜像），然后返回翻转后的根节点。

所谓翻转，就是**每个节点的左孩子和右孩子互换**。不只是根节点换一次，而是树中的每一个节点都要换。

示例：

```
输入：
        4
       / \
      2    7
     / \  / \
    1   3 6   9

输出：
        4
       / \
      7    2
     / \  / \
    9   6 3   1
```

输入：`[4, 2, 7, 1, 3, 6, 9]`，输出：`[4, 7, 2, 9, 6, 3, 1]`。

---

## 核心思路：每个节点做一件事——交换左右孩子

这道题最关键的观察是：

> **翻转整棵树 = 每个节点都把自己的左右孩子交换一次。**

不需要想"怎么把整棵左子树搬到右边"——只要你在每个节点上执行一次交换，递归会帮你把剩下的事全部做完。

具体策略：

1. 如果当前节点为空，直接返回 `None`
2. 递归翻转左子树
3. 递归翻转右子树
4. 把当前节点的左右孩子交换
5. 返回当前节点

一句话记忆：**"先翻孩子，再换位置"**——当然，先换位置再翻孩子也完全可以，顺序不影响结果。

---

## 代码实现

### 方法一：递归

```python
class Solution:
    def invertTree(self, root):
        if not root:
            return None
        root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)
        return root
```

这段代码非常简洁：先递归翻转左右子树，再把返回的结果交叉赋值给 `root.left` 和 `root.right`，一行完成交换。

---

### 方法二：迭代（BFS，层序遍历）

```python
from collections import deque

class Solution:
    def invertTree(self, root):
        if not root:
            return None
        queue = deque([root])
        while queue:
            node = queue.popleft()
            node.left, node.right = node.right, node.left
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        return root
```

迭代版本的思路一样：**逐个访问每个节点，交换它的左右孩子**。只是用队列代替了递归栈来遍历整棵树。

---

## 逐行拆解

### 递归版本

#### 1. 终止条件：`if not root: return None`

如果当前节点为空，没有什么好翻转的，返回 `None`。这也是递归的出口。

#### 2. 递归 + 交换：`root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)`

这一行做了三件事：

- `self.invertTree(root.right)`：先递归翻转右子树，得到翻转后的子树
- `self.invertTree(root.left)`：再递归翻转左子树，得到翻转后的子树
- 赋值时交叉：翻转后的右子树赋给 `root.left`，翻转后的左子树赋给 `root.right`

Python 的元组赋值是同时进行的，所以不需要临时变量。

#### 3. 返回当前节点：`return root`

把翻转完成的子树根节点返回给上一层，让父节点接上。

---

### 迭代版本

#### 1. 特判空树：`if not root: return None`

和递归版一样，空树直接返回。

#### 2. 初始化队列：`queue = deque([root])`

把根节点放入队列，准备层序遍历。

#### 3. 逐个出队处理：`node = queue.popleft()`

每次从队列头部取出一个节点。

#### 4. 交换左右孩子：`node.left, node.right = node.right, node.left`

这就是翻转的核心操作——把当前节点的左右孩子互换。

#### 5. 把非空子节点入队

```python
if node.left:
    queue.append(node.left)
if node.right:
    queue.append(node.right)
```

交换之后，把新的左右孩子（如果存在）加入队列，等待后续处理。

---

## 手动模拟

以输入 `[4, 2, 7, 1, 3, 6, 9]` 为例，用递归版本模拟：

```
原始树：
        4
       / \
      2    7
     / \  / \
    1   3 6   9
```

### 递归调用过程

```
invertTree(4)
├── invertTree(7)          ← 先递归右子树
│   ├── invertTree(9)      ← 递归 7 的右子树
│   │   ├── invertTree(None) → None
│   │   └── invertTree(None) → None
│   │   交换后：9（左右都是 None，不变）
│   │   返回 9
│   └── invertTree(6)      ← 递归 7 的左子树
│       ├── invertTree(None) → None
│       └── invertTree(None) → None
│       交换后：6（左右都是 None，不变）
│       返回 6
│   交换后：7 的左孩子 = 9，右孩子 = 6
│   返回 7
├── invertTree(2)          ← 再递归左子树
│   ├── invertTree(3)      ← 递归 2 的右子树
│   │   返回 3
│   └── invertTree(1)      ← 递归 2 的左子树
│       返回 1
│   交换后：2 的左孩子 = 3，右孩子 = 1
│   返回 2
交换后：4 的左孩子 = 7，右孩子 = 2
返回 4
```

### 最终结果

```
        4
       / \
      7    2
     / \  / \
    9   6 3   1
```

输出：`[4, 7, 2, 9, 6, 3, 1]`，与预期一致。

---

## 复杂度分析

### 递归版本

| | 复杂度 | 说明 |
|---|---|---|
| 时间 | O(n) | 每个节点恰好被访问一次 |
| 空间 | O(h) | 递归栈深度等于树的高度 h；最坏情况（链状树）为 O(n)，平衡树为 O(log n) |

### 迭代版本

| | 复杂度 | 说明 |
|---|---|---|
| 时间 | O(n) | 每个节点恰好被访问一次 |
| 空间 | O(n) | 队列最多存储一层的所有节点，最宽的一层最多 n/2 个节点 |

两种方法时间复杂度相同，空间复杂度在平衡树下递归更优（O(log n) vs O(n)），在极端不平衡树下两者都是 O(n)。

---

## 总结

| 要点 | 内容 |
|------|------|
| 核心操作 | 每个节点交换左右孩子 |
| 递归思路 | 先递归翻转左右子树，再交换（或先交换再递归，顺序无所谓） |
| 迭代思路 | 用队列层序遍历，逐个节点交换左右孩子 |
| 递归三要素 | 参数 = 当前节点，终止 = 空节点返回 None，操作 = 交换左右 |
| 时间复杂度 | O(n)，每个节点访问一次 |

这道题是递归操作二叉树的入门经典。它的价值不在于难度，而在于帮你建立一个重要的直觉：**递归处理树的问题，就是让每个节点做同一件简单的事**。翻转整棵树听起来复杂，但拆到每个节点上，不过就是"交换左右孩子"这一个动作。把这个思维模式吃透，后面遇到对称二叉树（LeetCode-101）、合并二叉树（LeetCode-617）等题时会非常自然。
