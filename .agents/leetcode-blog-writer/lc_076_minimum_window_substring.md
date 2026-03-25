# LeetCode-076：最小覆盖子串，滑动窗口的本质是“欠账表”

> **本题在线练习**：LeetCode 76. 最小覆盖子串 — 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=76)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) — 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定字符串 `s` 和 `t`，在 `s` 中找一个最短的子串，使它包含 `t` 中的全部字符（包含次数也要满足）。若不存在，返回空串。

典型例子：`s = "ADOBECODEBANC"`, `t = "ABC"`，答案是 `"BANC"`。

## 核心思路：用 need 记录“还欠多少”

把 `t` 看成一张“欠账表”：

- `need[c]` 表示字符 `c` 还需要多少个
- 窗口右扩时把字符拿进来，欠账减少
- 当所有欠账都还清，就尝试左缩，缩到不能再缩为止

关键是如何判断“已覆盖”：

- 用 `missing` 记录还欠的字符总数（按次数）
- `missing == 0` 说明窗口已经覆盖了 `t`

## 代码实现（Python，可直接提交）

```python
from collections import Counter


class Solution:
    def minWindow(self, s: str, t: str) -> str:
        if not t or not s:
            return ""

        need = Counter(t)
        missing = len(t)

        left = 0
        best_len = float("inf")
        best_l = 0

        for right, ch in enumerate(s):
            if need[ch] > 0:
                missing -= 1
            need[ch] -= 1

            if missing != 0:
                continue

            # 现在窗口 [left, right] 已覆盖，尝试尽量左缩
            while left <= right and need[s[left]] < 0:
                need[s[left]] += 1
                left += 1

            # 更新最优
            cur_len = right - left + 1
            if cur_len < best_len:
                best_len = cur_len
                best_l = left

            # 继续找下一个可行窗口：让窗口失效（丢掉一个必须字符）
            need[s[left]] += 1
            missing += 1
            left += 1

        return "" if best_len == float("inf") else s[best_l : best_l + best_len]
```

## 逐行拆解：为什么 `need` 可以为负？

- `need[ch] > 0`：说明这个字符是“必须的”，拿到一个就把 `missing` 减 1
- `need[ch] -= 1`：不管是否必须，统一减，表示窗口里有了这个字符
- 当某字符在窗口里“多拿了”，`need[ch]` 就会变成负数
- 左缩时，只要 `need[s[left]] < 0`，说明左端这个字符是多余的，可以丢掉

这种写法的好处是：不需要额外维护窗口计数 `window`，只用一张表就能同时表达“欠”和“多余”。

## 手动模拟（抓住两个阶段）

以 `s="ADOBECODEBANC"`, `t="ABC"` 为例：

1. 右扩直到 `missing==0`：窗口第一次覆盖 `ABC` 时大概在 `"ADOBEC"`
2. 左缩去掉多余字符：缩不动时得到一个“当前最短可行窗口”
3. 再让窗口失效（丢掉一个必需字符），继续右扩寻找下一次覆盖

最终会在 `"BANC"` 处得到更短解。

## 复杂度分析

- 时间复杂度：`O(n)`，左右指针总共移动不超过 `2n`
- 空间复杂度：`O(|alphabet|)`，主要是 `Counter(t)`

## 总结

最小覆盖子串最容易写乱的点是“什么时候算覆盖、什么时候能缩”。把 `t` 当成欠账表，用 `missing` 作为总欠款，就能把判断条件压缩为一句 `missing==0`，逻辑会稳定很多。

