# LeetCode-022：括号生成，合法性不是最后检查，而是过程里约束

> **本题在线练习**：[LeetCode 22. 括号生成 - 在线练习（免费 · 无需登录 · AI 辅助）](https://onefly.top/zero2Leetcode/playground.html?id=22)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定 `n` 对括号，生成所有有效的括号组合。

例如 `n=3`，部分答案：

- `"((()))"`
- `"(()())"`
- `"(())()"`
- `"()(())"`
- `"()()()"`

## 核心思路：回溯时维护“还剩多少左括号/右括号可用”

有效括号串的核心约束只有两条：

1. 左括号总数 = 右括号总数 = n
2. 任意前缀中，右括号数量不能超过左括号数量（否则会出现先关后开）

用回溯生成时，可以维护两个计数：

- `open_used`：已经放了多少个 `'('`
- `close_used`：已经放了多少个 `')'`

可放 `'('` 的条件：`open_used < n`  
可放 `')'` 的条件：`close_used < open_used`

注意：合法性不是在生成完后再过滤，而是在生成过程中就把非法分支剪掉。

## 代码实现（Python，可直接提交）

```python
from typing import List


class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        res = []
        path = []

        def dfs(open_used: int, close_used: int) -> None:
            if open_used == n and close_used == n:
                res.append("".join(path))
                return

            if open_used < n:
                path.append("(")
                dfs(open_used + 1, close_used)
                path.pop()

            if close_used < open_used:
                path.append(")")
                dfs(open_used, close_used + 1)
                path.pop()

        dfs(0, 0)
        return res
```

## 逐行拆解：为什么 `close_used < open_used` 是关键？

`close_used < open_used` 等价于：

> 当前前缀里，右括号数量严格少于左括号数量

这样追加一个右括号后，前缀仍然满足“右括号不超过左括号”的约束。

如果允许 `close_used >= open_used` 再放 `')'`，就会生成像 `")("` 这种明显非法的前缀，后面无论怎么补都不可能变合法，应该提前剪枝。

## 手动模拟：`n=2`

从空串开始：

- 放 '(' => "("
  - 放 '(' => "(("
    - 只能放 ')' => "(()"
      - 只能放 ')' => "(())" 收集
  - 放 ')' => "()"
    - 只能放 '(' => "()("
      - 只能放 ')' => "()()" 收集

答案正好两种：`"(())"`、`"()()"`

## 复杂度分析

- 时间复杂度：与有效括号串数量一致，为第 n 个卡特兰数 `C_n` 级别
- 空间复杂度：`O(n)`（递归深度与 path 长度，不含输出）

## 总结

括号生成的精髓是“过程约束”：任何时候都不能让右括号比左括号多。把约束写成两个 if 分支，回溯就会只走有效路径，既正确又高效。

