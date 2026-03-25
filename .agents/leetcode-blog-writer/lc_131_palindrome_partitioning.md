# LeetCode-131：分割回文串，回溯枚举切分点，回文判断可用 DP 加速

> **本题在线练习**：[LeetCode 131. 分割回文串 - 在线练习（免费 · 无需登录 · AI 辅助）](https://onefly.top/zero2Leetcode/playground.html?id=131)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定字符串 `s`，将 `s` 分割成若干子串，要求每个子串都是回文串。返回所有可能的分割方案。

例如 `s="aab"`，答案为：

- `["a","a","b"]`
- `["aa","b"]`

## 核心思路：回溯枚举“下一刀切在哪”

把字符串从左到右切分：

- 当前位置是 `start`
- 枚举切到 `end`（`s[start:end+1]`）
- 如果这一段是回文，就把它加入 path，递归处理后面的部分

回溯能保证穷举所有切法，而“回文判断”决定分支是否继续扩展。

## 基础版代码：直接判断回文

```python
from typing import List


class Solution:
    def partition(self, s: str) -> List[List[str]]:
        res = []
        path = []

        def is_pal(l: int, r: int) -> bool:
            while l < r:
                if s[l] != s[r]:
                    return False
                l += 1
                r -= 1
            return True

        def dfs(start: int) -> None:
            if start == len(s):
                res.append(path[:])
                return

            for end in range(start, len(s)):
                if not is_pal(start, end):
                    continue
                path.append(s[start:end + 1])
                dfs(end + 1)
                path.pop()

        dfs(0)
        return res
```

## 手动模拟：`s="aab"`

- start=0：
  - end=0："a" 是回文 => path=["a"]，递归 start=1
    - end=1："a" 是回文 => path=["a","a"]，递归 start=2
      - end=2："b" 是回文 => path=["a","a","b"]，start=3 收集
    - end=2："ab" 不是回文，跳过
  - end=1："aa" 是回文 => path=["aa"]，递归 start=2
    - end=2："b" 是回文 => path=["aa","b"]，收集
  - end=2："aab" 不是回文，跳过

## 复杂度分析（基础版）

- 时间复杂度：回溯本身是指数级；同时每次判断回文最坏 `O(n)`，会额外放大常数
- 空间复杂度：`O(n)`（递归深度 + path，不含输出）

## 进阶：用 DP 预处理回文表，把回文判断降到 O(1)

可以预先计算 `pal[i][j]` 表示 `s[i:j+1]` 是否是回文：

状态转移：

- `s[i] == s[j]` 且（`j-i<=2` 或 `pal[i+1][j-1]` 为真）则 `pal[i][j]=True`

预处理 `O(n^2)`，回溯时判断回文就变成 O(1) 查表。

## 进阶版代码（DP + 回溯）

```python
from typing import List


class Solution:
    def partition(self, s: str) -> List[List[str]]:
        n = len(s)
        pal = [[False] * n for _ in range(n)]

        for i in range(n - 1, -1, -1):
            for j in range(i, n):
                if s[i] == s[j] and (j - i <= 2 or pal[i + 1][j - 1]):
                    pal[i][j] = True

        res = []
        path = []

        def dfs(start: int) -> None:
            if start == n:
                res.append(path[:])
                return
            for end in range(start, n):
                if not pal[start][end]:
                    continue
                path.append(s[start:end + 1])
                dfs(end + 1)
                path.pop()

        dfs(0)
        return res
```

## 总结

分割回文串这题的框架是“回溯枚举切分点”，难点在于回文判断的性能。基础版用双指针判断即可过大多数数据；想更稳更快，就用 `O(n^2)` 的 DP 预处理回文表，让回溯过程只专注于“怎么切”。

