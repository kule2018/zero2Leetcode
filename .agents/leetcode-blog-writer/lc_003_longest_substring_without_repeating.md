# LeetCode-003：无重复字符的最长子串，滑动窗口的第一课——用两个指针"圈"出一段合法区间

> **本题在线练习**：[LeetCode 3. 无重复字符的最长子串 — 在线练习（免费 · 无需登录 · AI 辅助）](https://onefly.top/zero2Leetcode/playground.html?id=3)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开刷 Hot 100。

## 一、题目概述

给定一个字符串 `s`，请你找出其中**不含有重复字符的最长子串**的长度。

例如：

### 示例 1

```
输入：s = "abcabcbb"
输出：3
解释：最长无重复子串是 "abc"，长度为 3。
```

---

### 示例 2

```
输入：s = "bbbbb"
输出：1
解释：最长无重复子串是 "b"，长度为 1。
```

---

### 示例 3

```
输入：s = "pwwkew"
输出：3
解释：最长无重复子串是 "wke"，长度为 3。
注意：答案必须是子串，"pwke" 是子序列，不是子串。
```

---

## 二、核心思路

这道题是**滑动窗口**的经典入门题。

所谓"滑动窗口"，你可以把它想象成一个弹性窗口在字符串上从左往右滑动：

- **右指针**负责**扩张**窗口——每次往右移一步，把新字符纳入窗口
- **左指针**负责**收缩**窗口——当窗口里出现了重复字符，就把左边界往右缩，直到窗口重新合法

在整个过程中，我们用一个集合（`set`）记录当前窗口里有哪些字符。每次窗口合法时，更新一下"最大长度"。

核心逻辑用一句话概括：

> 右指针不断扩张，遇到重复就收缩左指针，全程记录最大窗口长度。

---

## 三、代码实现

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_set = set()
        left = 0
        max_len = 0

        for right in range(len(s)):
            while s[right] in char_set:
                char_set.remove(s[left])
                left += 1
            char_set.add(s[right])
            max_len = max(max_len, right - left + 1)

        return max_len
```

---

## 四、逐行拆解

### 1. 初始化三个变量

```python
char_set = set()
left = 0
max_len = 0
```

- `char_set`：一个集合，记录当前窗口内有哪些字符。集合的特点是查找和删除都是 O(1)，非常适合"判断是否重复"这件事。
- `left`：窗口的左边界，初始指向字符串开头。
- `max_len`：记录目前为止遇到的最长无重复子串的长度。

---

### 2. 右指针遍历整个字符串

```python
for right in range(len(s)):
```

`right` 是窗口的右边界。这个 for 循环让右指针从头走到尾，每次右移一步。

---

### 3. 如果新字符已在窗口内，收缩左边界

```python
while s[right] in char_set:
    char_set.remove(s[left])
    left += 1
```

这是整个算法最关键的一步。

当 `s[right]` 已经存在于 `char_set` 中，说明窗口内出现了重复字符。此时不能直接把新字符加进来，必须先把左边的字符一个一个移出去，直到窗口里不再包含 `s[right]`。

注意这里用的是 `while`，不是 `if`。因为重复的那个字符可能不在窗口的最左边，需要一直缩到那个字符被移除为止。

---

### 4. 把新字符加入窗口

```python
char_set.add(s[right])
```

经过上面的 `while` 之后，窗口内已经不包含 `s[right]` 了，可以安全地加入。

---

### 5. 更新最大长度

```python
max_len = max(max_len, right - left + 1)
```

当前窗口的长度是 `right - left + 1`。每次窗口合法时都和 `max_len` 比一下，保留更大的那个。

---

### 6. 返回结果

```python
return max_len
```

---

## 五、手动模拟

以 `s = "abcabcbb"` 为例，走一遍完整流程。

| 步骤 | right | s[right] | 操作 | char_set | left | 窗口内容 | max_len |
|------|-------|----------|------|----------|------|---------|---------|
| 1 | 0 | a | 加入 a | {a} | 0 | "a" | 1 |
| 2 | 1 | b | 加入 b | {a,b} | 0 | "ab" | 2 |
| 3 | 2 | c | 加入 c | {a,b,c} | 0 | "abc" | 3 |
| 4 | 3 | a | a 重复！移除 s[0]=a，left→1；加入 a | {b,c,a} | 1 | "bca" | 3 |
| 5 | 4 | b | b 重复！移除 s[1]=b，left→2；加入 b | {c,a,b} | 2 | "cab" | 3 |
| 6 | 5 | c | c 重复！移除 s[2]=c，left→3；加入 c | {a,b,c} | 3 | "abc" | 3 |
| 7 | 6 | b | b 重复！移除 s[3]=a，left→4；b 还在！移除 s[4]=b，left→5；加入 b | {c,b} | 5 | "cb" | 3 |
| 8 | 7 | b | b 重复！移除 s[5]=c，left→6；b 还在！移除 s[6]=b，left→7；加入 b | {b} | 7 | "b" | 3 |

最终返回 `3`，对应最长无重复子串 `"abc"`。

---

再看一个更短的例子：`s = "pwwkew"`

| 步骤 | right | s[right] | 操作 | char_set | left | 窗口内容 | max_len |
|------|-------|----------|------|----------|------|---------|---------|
| 1 | 0 | p | 加入 p | {p} | 0 | "p" | 1 |
| 2 | 1 | w | 加入 w | {p,w} | 0 | "pw" | 2 |
| 3 | 2 | w | w 重复！移除 p，left→1；w 还在！移除 w，left→2；加入 w | {w} | 2 | "w" | 2 |
| 4 | 3 | k | 加入 k | {w,k} | 2 | "wk" | 2 |
| 5 | 4 | e | 加入 e | {w,k,e} | 2 | "wke" | 3 |
| 6 | 5 | w | w 重复！移除 w，left→3；加入 w | {k,e,w} | 3 | "kew" | 3 |

最终返回 `3`，对应 `"wke"` 或 `"kew"`。

---

## 六、复杂度分析

**时间复杂度：O(n)**

虽然代码里有 `for` 循环套 `while` 循环，看起来像是 O(n^2)，但实际上：

- `right` 指针从头到尾走了 n 步
- `left` 指针也是从头到尾走，**最多**走 n 步

两个指针加起来总共最多走 2n 步，所以时间复杂度是 O(n)，不是 O(n^2)。

这是滑动窗口类题目的一个非常重要的分析技巧：**不要看循环嵌套的层数，要看每个指针总共走了多少步。**

**空间复杂度：O(min(m, n))**

- `m` 是字符集的大小（比如英文小写字母是 26，ASCII 是 128）
- `n` 是字符串长度

集合里最多存 min(m, n) 个字符。对于常见场景，可以认为是 O(1)（固定大小的字符集）。

---

## 七、总结

这道题的标准解法是：

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_set = set()
        left = 0
        max_len = 0

        for right in range(len(s)):
            while s[right] in char_set:
                char_set.remove(s[left])
                left += 1
            char_set.add(s[right])
            max_len = max(max_len, right - left + 1)

        return max_len
```

这道题真正训练的是滑动窗口的基本模式，有三件事值得记住：

### 1. 滑动窗口的基本框架

右指针扩张、左指针收缩、全程维护一个"窗口合法"的不变量。这个框架在后续很多题里会反复出现，比如"最小覆盖子串"、"字母异位词"等。

### 2. 用集合维护窗口内容

集合的 `in` / `add` / `remove` 都是 O(1) 操作，天然适合做"窗口内是否有重复"的判断工具。

### 3. 时间复杂度不是看循环嵌套层数

`for` 里套了一个 `while`，但两个指针各自最多走 n 步，总时间是 O(n)。这种"双指针摊销分析"是理解滑动窗口效率的关键。

这道题是滑动窗口的第一课。把"右扩左缩 + 集合判重 + 更新最大值"这个模式吃透，后面遇到更复杂的窗口类题目时，只需要换掉"窗口合法"的条件就行了，框架是一样的。
