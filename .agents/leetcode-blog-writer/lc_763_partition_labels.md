# LeetCode-763：划分字母区间，贪心地“把区间右端点推到最远”

> **本题在线练习**：LeetCode 763. 划分字母区间 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=763)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) - 内置本地 OJ + AI 教练，零门槛开刷 Hot 100。

## 题目概述

给定字符串 `s`，把它划分成尽可能多的片段，使得同一个字母最多出现在一个片段里。返回每个片段的长度。

例如：`s = "ababcbacadefegdehijhklij"` -> `[9, 7, 8]`

## 核心思路：先记录每个字符最后出现的位置

要求“同一个字母只能在一个片段里”，意味着：

如果某个片段里出现了字母 `c`，那么这个片段的右端点至少要延伸到 `c` 的最后出现位置，否则 `c` 会跑到下一段去，违规。

因此先预处理：

- `last[ch]`：字符 `ch` 在字符串中最后一次出现的下标

然后贪心扫描维护当前片段的右端点：

- `end`：当前片段必须覆盖到的最远右端点
- 扫描到位置 `i` 时，更新 `end = max(end, last[s[i]])`
- 当 `i == end`，说明当前片段内所有字符的最后出现位置都被覆盖到了，可以切一刀

## 代码实现

```python
from typing import List


class Solution:
    def partitionLabels(self, s: str) -> List[int]:
        last = {}
        for i, ch in enumerate(s):
            last[ch] = i

        res: List[int] = []
        start = 0
        end = 0

        for i, ch in enumerate(s):
            end = max(end, last[ch])
            if i == end:
                res.append(end - start + 1)
                start = i + 1

        return res
```

## 逐行拆解

- `last[ch] = i`：记录字符最后出现位置
- `end = max(end, last[ch])`：
  - 当前段出现了字符 `ch`，段的右端点必须至少到 `last[ch]`
  - 用 `max` 把所有出现过的字符需求合并起来
- `i == end`：
  - 表示段内所有字符的“最后一次出现”都不超过 `end`
  - 当前段闭合，可以输出长度

## 手动模拟（关键片段）

以示例 `"ababcbaca..."` 开头为例：

- `a` 最后出现位置在 8
- `b` 最后出现位置在 5
- `c` 最后出现位置在 7

扫描过程中 `end` 会被不断推到更远：

- i=0 'a' -> end=8
- i=1 'b' -> end=max(8,5)=8
- ...
- 当 i=8 时，i==end，第一段长度是 9

## 复杂度分析

- 时间复杂度：`O(n)`
- 空间复杂度：`O(1)`（字符集固定为小写字母时），一般写法按 `O(n)` 也可接受

## 总结

这题的贪心非常“干净”：

1. 预处理每个字符最后出现位置
2. 扫描时把当前段的右端点推到最远
3. 扫到右端点就切段

本质是在做区间合并：每个字符产生一个覆盖区间 `[first, last]`，最终切分点就是这些区间合并后的边界。

