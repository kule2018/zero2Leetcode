---
layout: default
title: DFS / BFS
description: 深度优先搜索与广度优先搜索模板
eyebrow: 核心算法 / 06
---

# DFS / BFS

**DFS 模板：**
```python
def dfs(node, visited):
    if node in visited:
        return
    visited.add(node)
    for neighbor in graph[node]:
        dfs(neighbor, visited)
```

**BFS 模板：**
```python
from collections import deque

def bfs(start):
    queue = deque([start])
    visited = {start}
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```
