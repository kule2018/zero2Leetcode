# LeetCode-155：最小栈，O(1) 取最小值的秘密是"每一层都记住当前的最小值"

> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开刷 Hot 100。

## 题目概述

设计一个支持以下操作的栈，并且每个操作的时间复杂度都是 **O(1)**：

- `push(val)`：将元素 val 压入栈
- `pop()`：移除栈顶元素
- `top()`：获取栈顶元素
- `getMin()`：获取栈中的最小元素

示例：

```
输入：
["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]

输出：
[null,null,null,null,-3,null,0,-2]
```

解释：

```python
minStack = MinStack()
minStack.push(-2)
minStack.push(0)
minStack.push(-3)
minStack.getMin()   # 返回 -3
minStack.pop()
minStack.top()      # 返回 0
minStack.getMin()   # 返回 -2
```

关键约束：**`getMin` 必须在 O(1) 时间内完成**。这意味着你不能在调用 `getMin` 时遍历整个栈去找最小值。

---

## 核心思路：用一个辅助栈，同步记录每一层的最小值

最直接的想法是：每次调 `getMin` 时遍历一遍栈找最小值。但这样 `getMin` 的时间复杂度是 O(n)，不满足题目要求。

正确思路是**用空间换时间**——维护一个辅助栈 `min_stack`，它和主栈 `stack` 同步操作：

> **每次 push 时，不只往主栈压入元素，还往辅助栈压入"当前的最小值"。**

这样一来：

- `getMin()` 只需要看辅助栈的栈顶，就是当前栈中所有元素的最小值
- `pop()` 时主栈和辅助栈同时弹出，最小值信息自动回退到上一层的状态
- 所有操作都是 O(1)

一句话记忆：**"主栈存数据，辅助栈存历史最小值，两个栈始终同进同出。"**

---

## 代码实现

```python
class MinStack:

    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        if self.min_stack:
            self.min_stack.append(min(val, self.min_stack[-1]))
        else:
            self.min_stack.append(val)

    def pop(self) -> None:
        self.stack.pop()
        self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]
```

---

## 逐行拆解

### 1. 初始化：两个空栈

```python
def __init__(self):
    self.stack = []
    self.min_stack = []
```

`stack` 是主栈，负责正常的 push/pop/top 操作。`min_stack` 是辅助栈，它的每个位置存的是"主栈从底部到当前位置的所有元素中的最小值"。

---

### 2. push：同时维护最小值

```python
def push(self, val: int) -> None:
    self.stack.append(val)
    if self.min_stack:
        self.min_stack.append(min(val, self.min_stack[-1]))
    else:
        self.min_stack.append(val)
```

主栈直接压入 `val`。辅助栈需要判断：

- 如果辅助栈为空（说明这是第一个元素），直接压入 `val`
- 如果辅助栈不为空，比较 `val` 和辅助栈当前栈顶（即之前的最小值），取更小的那个压入

这样辅助栈的栈顶永远是"当前栈中所有元素的最小值"。

---

### 3. pop：两个栈同步弹出

```python
def pop(self) -> None:
    self.stack.pop()
    self.min_stack.pop()
```

主栈弹出栈顶元素，辅助栈也弹出栈顶。因为辅助栈的每一层对应主栈的每一层，弹出之后辅助栈的新栈顶自然就是剩余元素的最小值。

---

### 4. top：返回主栈栈顶

```python
def top(self) -> int:
    return self.stack[-1]
```

标准操作，没有额外逻辑。

---

### 5. getMin：返回辅助栈栈顶

```python
def getMin(self) -> int:
    return self.min_stack[-1]
```

辅助栈的栈顶就是答案，直接返回，O(1)。

---

## 手动模拟

以题目示例的操作序列为例，逐步展示两个栈的状态变化：

### 操作序列

```
push(-2) → push(0) → push(-3) → getMin → pop → top → getMin
```

### 逐步状态

| 操作 | stack | min_stack | 返回值 | 说明 |
|------|-------|-----------|--------|------|
| push(-2) | [-2] | [-2] | — | 第一个元素，最小值就是 -2 |
| push(0) | [-2, 0] | [-2, -2] | — | min(0, -2) = -2，辅助栈压入 -2 |
| push(-3) | [-2, 0, -3] | [-2, -2, -3] | — | min(-3, -2) = -3，辅助栈压入 -3 |
| getMin() | [-2, 0, -3] | [-2, -2, -3] | **-3** | 辅助栈栈顶是 -3 |
| pop() | [-2, 0] | [-2, -2] | — | 两个栈同时弹出，-3 被移除 |
| top() | [-2, 0] | [-2, -2] | **0** | 主栈栈顶是 0 |
| getMin() | [-2, 0] | [-2, -2] | **-2** | 辅助栈栈顶回退到 -2 |

注意 `pop()` 之后的 `getMin()`：虽然 -3 已经被弹出了，但辅助栈自动回退到上一层的最小值 -2，不需要重新遍历。这就是辅助栈的精妙之处。

---

## 复杂度分析

| | 复杂度 | 说明 |
|---|---|---|
| 时间 | O(1)（每个操作） | push、pop、top、getMin 都只涉及栈顶操作，没有循环或遍历 |
| 空间 | O(n) | 辅助栈和主栈大小相同，额外使用了 n 的空间 |

这是一个典型的**用空间换时间**的策略：多用一个栈的空间，换来 `getMin` 从 O(n) 降到 O(1)。

---

## 总结

| 要点 | 内容 |
|------|------|
| 核心思想 | 辅助栈同步记录每一层的最小值 |
| push 逻辑 | 主栈压入原值，辅助栈压入 min(新值, 当前最小值) |
| pop 逻辑 | 两个栈同时弹出，最小值信息自动回退 |
| getMin | 直接返回辅助栈栈顶，O(1) |
| 空间代价 | 额外 O(n)，用空间换时间 |

这道题的价值在于训练"用辅助数据结构维护额外信息"的思维方式。栈本身只支持后进先出，但通过一个同步的辅助栈，我们让它具备了"随时查询最小值"的能力。这种"给数据结构加一个影子"的技巧，在很多设计类题目中都会用到——比如用辅助栈实现队列（LeetCode-232）、用单调栈解决下一个更大元素（LeetCode-496）等。把"两个栈同进同出"的模式记住，遇到类似的"增强型数据结构"题目时会很有帮助。
