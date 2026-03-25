# LeetCode-438：找到字符串中所有字母异位词，滑动窗口的精髓不是"滑"，而是"定长窗口内频次的维护"

## 一、题目概述

给定两个字符串 `s` 和 `p`，找到 `s` 中所有 `p` 的**字母异位词**的子串，返回这些子串的起始索引。

所谓字母异位词，就是两个字符串包含的字母种类和数量完全相同，只是顺序不同。比如 `"abc"` 和 `"bca"` 就是一对异位词。

### 示例 1

```
输入：s = "cbaebabacd", p = "abc"
输出：[0, 6]
```

解释：

- 起始索引 0 的子串是 `"cba"`，是 `"abc"` 的异位词
- 起始索引 6 的子串是 `"bac"`，是 `"abc"` 的异位词

---

### 示例 2

```
输入：s = "abab", p = "ab"
输出：[0, 1, 2]
```

解释：

- 起始索引 0 的子串是 `"ab"`，是 `"ab"` 的异位词
- 起始索引 1 的子串是 `"ba"`，是 `"ab"` 的异位词
- 起始索引 2 的子串是 `"ab"`，是 `"ab"` 的异位词

---

## 二、核心思路

拿到这道题，最朴素的想法是：遍历 `s` 中每个长度为 `len(p)` 的子串，对每个子串排序后和排序后的 `p` 比较。但排序一次就是 O(k log k)（k = len(p)），总时间 O(n * k log k)，太慢了。

关键观察是：

> 我们要找的子串长度是固定的，恰好等于 `len(p)`。

这就是一个典型的**定长滑动窗口**问题。

具体做法：

1. 先统计 `p` 中每个字符的出现次数，记为 `p_count`
2. 维护一个长度为 `len(p)` 的窗口，在 `s` 上从左往右滑动
3. 用一个计数器 `s_count` 记录当前窗口内每个字符的出现次数
4. 每次滑动时，右边新加一个字符，左边移出一个字符，更新 `s_count`
5. 如果 `s_count == p_count`，说明当前窗口就是一个异位词，记录起始索引

整个过程只需要遍历 `s` 一次，每次滑动的更新操作都是 O(1)。

---

## 三、代码实现

```python
from collections import Counter

class Solution:
    def findAnagrams(self, s: str, p: str) -> list[int]:
        n, k = len(s), len(p)
        if n < k:
            return []

        p_count = Counter(p)
        s_count = Counter(s[:k])
        result = []

        if s_count == p_count:
            result.append(0)

        for i in range(k, n):
            # 右边新字符进入窗口
            s_count[s[i]] += 1
            # 左边旧字符离开窗口
            left_char = s[i - k]
            s_count[left_char] -= 1
            if s_count[left_char] == 0:
                del s_count[left_char]

            # 比较两个计数器
            if s_count == p_count:
                result.append(i - k + 1)

        return result
```

---

## 四、逐行拆解代码

### 1. 特判：s 比 p 还短

```python
n, k = len(s), len(p)
if n < k:
    return []
```

如果 `s` 的长度都不够放下一个 `p`，那不可能有异位词，直接返回空列表。

---

### 2. 统计 p 的字符频次

```python
p_count = Counter(p)
```

`Counter("abc")` 得到 `{'a': 1, 'b': 1, 'c': 1}`，这就是我们的"目标频次"。

---

### 3. 初始化第一个窗口

```python
s_count = Counter(s[:k])
```

把 `s` 的前 `k` 个字符作为第一个窗口，统计频次。这样后续就不需要从零开始构建窗口了。

---

### 4. 检查第一个窗口是否匹配

```python
if s_count == p_count:
    result.append(0)
```

Python 的 `Counter` 对象可以直接用 `==` 比较，只要键和对应的值完全一致就返回 `True`。

---

### 5. 窗口开始滑动

```python
for i in range(k, n):
```

从索引 `k` 开始遍历。每一步 `i` 代表新进入窗口的右端字符。

---

### 6. 新字符进窗口

```python
s_count[s[i]] += 1
```

窗口右端扩展一个字符，对应的计数 +1。

---

### 7. 旧字符出窗口

```python
left_char = s[i - k]
s_count[left_char] -= 1
if s_count[left_char] == 0:
    del s_count[left_char]
```

窗口左端移出一个字符，对应的计数 -1。如果计数降到 0，就从字典中删除这个键。

为什么要删除？因为 `Counter` 的 `==` 比较会考虑所有键。如果 `s_count` 里有个键的值是 0，而 `p_count` 里没有这个键，两者比较就会不相等。删掉计数为 0 的键才能保证比较结果正确。

---

### 8. 每一步都检查是否匹配

```python
if s_count == p_count:
    result.append(i - k + 1)
```

当前窗口的起始索引是 `i - k + 1`（窗口右端是 `i`，长度是 `k`，所以左端是 `i - k + 1`）。

---

## 五、手动模拟

以 `s = "cbaebabacd"`，`p = "abc"` 为例，`k = 3`。

目标频次 `p_count = {'a': 1, 'b': 1, 'c': 1}`。

### 初始窗口

窗口 `s[0:3] = "cba"`，`s_count = {'c': 1, 'b': 1, 'a': 1}`

`s_count == p_count`？ 是！记录索引 **0**。

---

### 滑动过程

| i | 进入字符 | 移出字符 | 窗口子串 | s_count | 匹配？ |
|---|----------|----------|----------|---------|--------|
| 3 | `e` | `c` | `"bae"` | `{'b':1, 'a':1, 'e':1}` | 否 |
| 4 | `b` | `b` | `"aeb"` | `{'a':1, 'e':1, 'b':1}` | 否 |
| 5 | `a` | `a` | `"eba"` | `{'e':1, 'b':1, 'a':1}` | 否 |
| 6 | `b` | `e` | `"bab"` | `{'b':2, 'a':1}` | 否 |
| 7 | `a` | `b` | `"aba"` | `{'b':1, 'a':2}` | 否 |
| 8 | `c` | `a` | `"bac"` | `{'b':1, 'a':1, 'c':1}` | 是！记录 **6** |
| 9 | `d` | `b` | `"acd"` | `{'a':1, 'c':1, 'd':1}` | 否 |

最终结果：`[0, 6]`。

---

## 六、复杂度分析

**时间复杂度：O(n)**

- 初始化第一个窗口需要 O(k)
- 后续每一步滑动只做常数操作（加一个字符、减一个字符、比较两个 Counter）
- Counter 比较的时间取决于字符种类数，最多 26 个小写字母，所以是 O(26) = O(1)
- 总体：O(n)

**空间复杂度：O(1)**

- `p_count` 和 `s_count` 各最多存 26 个键
- 不随输入规模增长，所以是常数空间（严格来说是 O(字符集大小)）

---

## 七、总结

这道题的标准解法是：

```python
from collections import Counter

class Solution:
    def findAnagrams(self, s: str, p: str) -> list[int]:
        n, k = len(s), len(p)
        if n < k:
            return []

        p_count = Counter(p)
        s_count = Counter(s[:k])
        result = []

        if s_count == p_count:
            result.append(0)

        for i in range(k, n):
            s_count[s[i]] += 1
            left_char = s[i - k]
            s_count[left_char] -= 1
            if s_count[left_char] == 0:
                del s_count[left_char]

            if s_count == p_count:
                result.append(i - k + 1)

        return result
```

有三个核心要点值得记住：

- **窗口长度固定为 `len(p)`**：这是和变长滑动窗口题最大的区别，定长窗口每次进一个出一个，逻辑更简单
- **用 Counter 维护频次并直接比较**：不需要每次重新统计窗口内的字符，只需要增量更新，这是滑动窗口的效率来源
- **计数为 0 时要删除键**：这是使用 Counter 比较时最容易踩的坑，不删会导致比较结果出错

这道题是定长滑动窗口的经典入门题。把"固定窗口 + 频次维护 + 增量更新"这个模式吃透，后面遇到类似的子串匹配问题（比如最小覆盖子串、字符串排列等）都会顺畅很多。
