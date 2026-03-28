---
layout: default
title: 堆
description: heapq 实现最小堆与最大堆
eyebrow: 数据结构 / 06
---

# 堆

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
