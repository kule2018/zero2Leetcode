---
layout: default
title: 数据结构
---

# 第二阶段：数据结构

> 🎯 目标：掌握面试高频数据结构的实现与应用
> ⏱️ 预计时间：2-3 周

## 学习模块

### 01. 数组与字符串
**核心知识点：**
- 数组遍历与原地操作
- 双指针技巧（对撞指针、快慢指针）
- 字符串处理

**LeetCode 高频题：**
- [283. 移动零](https://leetcode.cn/problems/move-zeroes/)
- [11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)
- [15. 三数之和](https://leetcode.cn/problems/3sum/)

---

### 02. 链表
**核心知识点：**
- 单链表 vs 双链表
- 虚拟头节点（dummy node）
- 快慢指针找环、找中点
- 链表反转

**Python 链表节点定义：**
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
```

---

### 03. 栈与队列
**核心知识点：**
- 栈：LIFO（后进先出）
- 队列：FIFO（先进先出）
- 单调栈：维护单调性
- 优先队列（堆）

**Python 实现：**
```python
# 栈 - 使用 list
stack = []
stack.append(x)  # 入栈
stack.pop()      # 出栈

# 队列 - 使用 deque
from collections import deque
queue = deque()
queue.append(x)    # 入队
queue.popleft()    # 出队
```

---

### 04. 哈希表
**核心知识点：**
- O(1) 查找
- 计数与去重
- 两数之和模式

**Python 实现：**
```python
# Counter 快速计数
from collections import Counter
count = Counter(arr)

# defaultdict 默认值
from collections import defaultdict
graph = defaultdict(list)
```

---

### 05. 树与二叉树
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

---

### 06. 堆
**Python 实现（默认最小堆）：**
```python
import heapq

min_heap = []
heapq.heappush(min_heap, 3)
heapq.heappop(min_heap)

# 最大堆（取负）
max_heap = []
heapq.heappush(max_heap, -3)
-heapq.heappop(max_heap)
```

---

## 学习建议

1. **先理解概念**：每个数据结构先理解其特点和适用场景
2. **手写实现**：尝试从零实现链表、栈、二叉树等
3. **刷题巩固**：每个模块配套 3-5 道 LeetCode 题目
4. **画图辅助**：链表、树的题目一定要画图

---

[← 上一章：Python 基础]({{ '/00_python_basics/' | relative_url }}) | [下一章：核心算法 →]({{ '/02_algorithms/' | relative_url }})
