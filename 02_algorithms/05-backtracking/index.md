---
layout: default
title: 递归与回溯
description: 回溯通用模板与解题框架
eyebrow: 核心算法 / 05
---

# 递归与回溯

**回溯模板：**
```python
def backtrack(path, choices):
    if 满足结束条件:
        result.append(path[:])
        return

    for choice in choices:
        path.append(choice)      # 做选择
        backtrack(path, new_choices)  # 递归
        path.pop()               # 撤销选择
```
