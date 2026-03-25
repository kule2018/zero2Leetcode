# LeetCode-139：单词拆分，dp[i] 代表“前缀能否被拼出来”

> **本题在线练习**：LeetCode 139. 单词拆分 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=139)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) - 内置本地 OJ + AI 教练，零门槛开刷 Hot 100。

## 题目概述

给定字符串 `s` 和一个单词字典 `wordDict`，判断 `s` 是否能被拆分成若干个字典中的单词（单词可重复使用）。

例如：

- `s = "leetcode"`, `wordDict = ["leet","code"]` -> `True`

## 核心思路：前缀 DP（能不能拆）

这题看似是在“找一条拆分路径”，但问题只问 `True/False`，所以可以用布尔 DP。

定义：

- `dp[i]`：`s[:i]`（前 `i` 个字符）能否被字典拆分出来

那么 `dp[0] = True`（空串可以被“拆分成功”）。

转移：

要让 `dp[i] = True`，只需要找到一个切分点 `j`：

- `dp[j]` 为真（前缀可拆）
- `s[j:i]` 在字典里

也就是：

```
dp[i] = any(dp[j] and s[j:i] in wordSet for j in [0..i))
```

## 代码实现（标准写法）

```python
from typing import List


class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        word_set = set(wordDict)
        n = len(s)
        dp = [False] * (n + 1)
        dp[0] = True

        for i in range(1, n + 1):
            for j in range(i):
                if dp[j] and s[j:i] in word_set:
                    dp[i] = True
                    break

        return dp[n]
```

## 进阶：用“最长单词长度”剪枝

字典里单词长度通常有限，可以把内层循环缩小到最近的 `max_len` 范围。

```python
from typing import List


class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        word_set = set(wordDict)
        max_len = max((len(w) for w in wordDict), default=0)

        n = len(s)
        dp = [False] * (n + 1)
        dp[0] = True

        for i in range(1, n + 1):
            start = max(0, i - max_len)
            for j in range(start, i):
                if dp[j] and s[j:i] in word_set:
                    dp[i] = True
                    break

        return dp[n]
```

## 逐行拆解（剪枝版）

- `dp[0] = True`：空前缀可拆，后续才能从这里“接上”
- 对每个 `i`，只枚举 `j` 在 `[i-max_len, i)`：
  - 因为再往前的 `j` 会让 `s[j:i]` 长度超过字典里任何单词，不可能命中
- 一旦找到某个 `j` 让条件成立，就可以提前 `break`

## 手动模拟

`s = "leetcode"`, `wordDict = ["leet", "code"]`

- `dp[0]=True`
- 当 `i=4`，`s[0:4]="leet"` 在字典里且 `dp[0]=True`，所以 `dp[4]=True`
- 当 `i=8`，`s[4:8]="code"` 在字典里且 `dp[4]=True`，所以 `dp[8]=True`

最终 `dp[n]=True`。

## 复杂度分析

不剪枝版本：

- 时间复杂度：`O(n^2)`（子串查找在 set 中平均 `O(1)`，但切片会产生子串，实际常数较大）
- 空间复杂度：`O(n)`（dp 数组）

剪枝后：

- 时间复杂度：`O(n * max_len)`（更接近实际表现）

## 总结

这题的关键不是“怎么拼出一条路径”，而是把它变成一句前缀判断：

> `dp[i]` 只关心 `s[:i]` 能不能被拆出来；最后一个单词来自某个切分点 `j`。

掌握这个前缀 DP 模板后，很多字符串切分/拼接类题都能用同一套路解决。

