---
layout: default
title: 滑动窗口
description: 滑动窗口通用模板与解题框架
eyebrow: 核心算法 / 04
---

# 滑动窗口

**通用模板：**
```python
def sliding_window(s):
    window = {}
    left = 0
    result = 0

    for right in range(len(s)):
        # 1. 扩大窗口
        c = s[right]
        window[c] = window.get(c, 0) + 1

        # 2. 收缩窗口
        while need_shrink:
            d = s[left]
            window[d] -= 1
            left += 1

        # 3. 更新结果
        result = max(result, right - left + 1)

    return result
```
