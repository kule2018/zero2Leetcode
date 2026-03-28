---
layout: default
title: 双指针
description: 对撞指针与快慢指针两种经典模式
eyebrow: 核心算法 / 03
---

# 双指针

**两种模式：**
1. **对撞指针**：左右向中间移动
2. **快慢指针**：同向不同速

```python
def two_pointers(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        if condition:
            left += 1
        else:
            right -= 1
```
