# LeetCode-049：字母异位词分组，排序后长一样的字符串，本质上就是同一组

> **本题在线练习**：[LeetCode 49. 字母异位词分组 — 在线练习（免费 · 无需登录 · AI 辅助）](https://onefly.top/zero2Leetcode/playground.html?id=49)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开刷 Hot 100。

## 一、题目概述

给定一个字符串数组 `strs`，要求把所有**字母异位词**归到同一组中，以任意顺序返回分组结果。

什么是字母异位词？就是两个单词由完全相同的字母组成，只是字母的排列顺序不同。比如 `"eat"` 和 `"tea"`，字母都是 `e`、`a`、`t`，只是顺序不一样。

例如：

### 示例 1

```python
strs = ["eat","tea","tan","ate","nat","bat"]
```

输出：

```python
[["bat"],["nat","tan"],["ate","eat","tea"]]
```

`"eat"`、`"tea"`、`"ate"` 这三个词的字母完全一样，归为一组。`"tan"` 和 `"nat"` 字母一样，归为一组。`"bat"` 没有异位词伙伴，自己一组。

---

### 示例 2

```python
strs = [""]
```

输出：

```python
[[""]]
```

---

### 示例 3

```python
strs = ["a"]
```

输出：

```python
[["a"]]
```

---

## 二、这题的核心思路

这道题的关键问题是：怎么快速判断两个字符串是不是字母异位词？

最直接的办法：**把它们各自排序**。

如果两个字符串是字母异位词，那么排序之后，它们一定变成同一个字符串。

```text
"eat" → 排序 → "aet"
"tea" → 排序 → "aet"
"ate" → 排序 → "aet"
```

三个词排序后都是 `"aet"`，所以它们属于同一组。

```text
"tan" → 排序 → "ant"
"nat" → 排序 → "ant"
```

排序后都是 `"ant"`，属于同一组。

```text
"bat" → 排序 → "abt"
```

只有自己，单独一组。

有了这个发现，思路就很清晰了：

> 用一个哈希表（字典），以排序后的字符串作为 key，把排序结果相同的原始字符串放进同一个列表里。

最后把字典里所有的值取出来，就是分组结果。

---

## 三、代码实现

```python
class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        groups = {}

        for s in strs:
            key = ''.join(sorted(s))

            if key not in groups:
                groups[key] = []

            groups[key].append(s)

        return list(groups.values())
```

---

## 四、逐行拆解代码

### 1. 创建一个空字典，用来存分组结果

```python
groups = {}
```

这个字典的结构是：

- key：排序后的字符串，比如 `"aet"`
- value：一个列表，存放所有排序后等于这个 key 的原始字符串

---

### 2. 遍历每一个字符串

```python
for s in strs:
```

逐个拿出输入数组中的字符串来处理。

---

### 3. 对当前字符串排序，作为分组的 key

```python
key = ''.join(sorted(s))
```

`sorted(s)` 会把字符串 `s` 拆成字符列表，并按字母顺序排好。比如 `sorted("eat")` 返回 `['a', 'e', 't']`。

`''.join(...)` 再把排序后的字符列表拼回字符串，得到 `"aet"`。

这一步就是整道题的核心：**排序后相同的字符串，一定是字母异位词。**

---

### 4. 如果这个 key 还没出现过，先创建一个空列表

```python
if key not in groups:
    groups[key] = []
```

第一次遇到某个排序结果时，需要在字典中为它初始化一个空列表。

---

### 5. 把原始字符串加入对应的分组

```python
groups[key].append(s)
```

不管是不是第一次遇到这个 key，都把当前字符串追加进去。

---

### 6. 返回所有分组

```python
return list(groups.values())
```

`groups.values()` 返回字典中所有的 value（每个 value 都是一个列表），用 `list()` 包一下变成列表的列表，就是最终结果。

---

## 五、手动模拟

用示例 `["eat","tea","tan","ate","nat","bat"]` 走一遍：

| 步骤 | 当前字符串 | 排序后（key） | 字典状态 |
|------|-----------|-------------|---------|
| 1 | `"eat"` | `"aet"` | `{"aet": ["eat"]}` |
| 2 | `"tea"` | `"aet"` | `{"aet": ["eat","tea"]}` |
| 3 | `"tan"` | `"ant"` | `{"aet": ["eat","tea"], "ant": ["tan"]}` |
| 4 | `"ate"` | `"aet"` | `{"aet": ["eat","tea","ate"], "ant": ["tan"]}` |
| 5 | `"nat"` | `"ant"` | `{"aet": ["eat","tea","ate"], "ant": ["tan","nat"]}` |
| 6 | `"bat"` | `"abt"` | `{"aet": ["eat","tea","ate"], "ant": ["tan","nat"], "abt": ["bat"]}` |

最终返回：

```python
[["eat","tea","ate"], ["tan","nat"], ["bat"]]
```

和预期一致。

---

## 六、复杂度分析

**时间复杂度：O(n * k * log k)**

- `n` 是字符串数组的长度（有多少个字符串）
- `k` 是字符串的最大长度
- 对每个字符串做排序需要 `O(k log k)`，一共有 `n` 个字符串

**空间复杂度：O(n * k)**

- 字典中存了所有字符串，总共占用 `O(n * k)` 的空间

---

## 七、用 defaultdict 简化代码

上面代码中 `if key not in groups` 那一段可以用 Python 的 `defaultdict` 来省掉：

```python
from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        groups = defaultdict(list)

        for s in strs:
            key = ''.join(sorted(s))
            groups[key].append(s)

        return list(groups.values())
```

`defaultdict(list)` 的意思是：当你访问一个不存在的 key 时，它会自动创建一个空列表作为默认值。这样就不需要手动判断 key 是否存在了。

功能完全一样，只是写法更简洁。

---

## 八、总结

这道题的核心洞察就一句话：

> 字母异位词排序后一定相同，所以可以用排序后的字符串作为哈希表的 key 来分组。

整个解法只有三步：

1. 遍历每个字符串
2. 对它排序，得到分组的 key
3. 把原始字符串存进对应 key 的列表里

这题是哈希表分组的经典入门题。它训练的是一个非常重要的思维模式：

> 当你需要把一堆东西分组时，先想清楚"什么样的东西算同一组"，然后找一个能代表这一组的特征值（也就是哈希表的 key）。

在这道题里，"同一组"的定义是字母组成相同，而排序后的字符串就是那个特征值。把这个思路吃透，后面遇到类似的分组题会顺很多。
