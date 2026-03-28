---
layout: default
title: 链表
description: 单链表与双链表的核心操作
eyebrow: 数据结构 / 02
---

# 链表

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
