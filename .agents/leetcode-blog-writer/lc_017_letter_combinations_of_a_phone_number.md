# LeetCode-017：电话号码的字母组合，固定映射 + 回溯生成

> **本题在线练习**：[LeetCode 17. 电话号码的字母组合 - 在线练习（免费 · 无需登录 · AI 辅助）](https://onefly.top/zero2Leetcode/playground.html?id=17)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

电话按键把数字映射到若干字母（例如 `2 -> abc`，`3 -> def`）。给一个仅包含 `2-9` 的字符串 `digits`，返回所有可能的字母组合。

例如：

- 输入 `"23"`
- 输出 `["ad","ae","af","bd","be","bf","cd","ce","cf"]`

如果 `digits` 为空，返回空列表。

## 核心思路：每一位数字提供一个“候选字母集合”，问题就是多层循环

`digits` 长度为 `k`：

- 第 0 位有 `m0` 个选择
- 第 1 位有 `m1` 个选择
- ...

这就是把多层循环写成 DFS 回溯：

在第 `idx` 位：

- 枚举本位所有字母
- 放入 `path`
- 递归到下一位
- 回退

## 代码实现（Python，可直接提交）

```python
from typing import List


class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        if not digits:
            return []

        mp = {
            "2": "abc",
            "3": "def",
            "4": "ghi",
            "5": "jkl",
            "6": "mno",
            "7": "pqrs",
            "8": "tuv",
            "9": "wxyz",
        }

        res = []
        path = []

        def dfs(idx: int) -> None:
            if idx == len(digits):
                res.append("".join(path))
                return

            letters = mp[digits[idx]]
            for ch in letters:
                path.append(ch)
                dfs(idx + 1)
                path.pop()

        dfs(0)
        return res
```

## 逐行拆解：为什么 `idx == len(digits)` 时收集答案？

`idx` 表示当前处理到 digits 的第几位：

- 当 `idx == len(digits)`，说明每一位数字都已经选了一个字母，`path` 的长度等于 digits 长度，这时才能生成一个完整组合。

## 手动模拟：`digits="23"`

映射：`2 -> abc`，`3 -> def`

- 第一层选 a
  - 第二层选 d => "ad"
  - 第二层选 e => "ae"
  - 第二层选 f => "af"
- 第一层选 b
  - 得到 "bd","be","bf"
- 第一层选 c
  - 得到 "cd","ce","cf"

## 复杂度分析

设 digits 长度为 `k`。每位最多 4 个字母（7 和 9），因此：

- 时间复杂度：`O(4^k * k)`（生成组合 + 拼接）
- 空间复杂度：`O(k)`（递归栈 + path，不含输出）

## 总结

这题不是“神奇技巧”，而是把“每一位提供一个候选集合”写成 DFS。写回溯时只需要把握两件事：当前处理到哪一位 `idx`，以及当前已选择的字符序列 `path`。

