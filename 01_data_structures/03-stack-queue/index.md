---
layout: default
title: 栈与队列
description: LIFO/FIFO 原理与 deque 使用
eyebrow: 数据结构 / 03
---

# 栈与队列

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
