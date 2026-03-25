# LeetCode-208：实现 Trie（前缀树），把“前缀匹配”变成走一条路

> **本题在线练习**：[LeetCode 208. 实现 Trie (前缀树) - 在线练习（免费 · 无需登录 · AI 辅助）](https://onefly.top/zero2Leetcode/playground.html?id=208)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

设计一个数据结构 `Trie`，支持三种操作：

- `insert(word)`：插入字符串
- `search(word)`：查询完整单词是否存在
- `startsWith(prefix)`：查询是否存在以 `prefix` 为前缀的单词

关键区别：`startsWith("app")` 只要求“走得到 app 这条路径”，不要求 app 是一个完整单词；而 `search("app")` 要求 app 对应节点被标记为“单词结尾”。

## 核心思路：树不是按“长度”分层，而是按“字符”分叉

Trie（前缀树）的直觉是：

- 每个节点代表一个前缀
- 从根出发，沿着字符边走，走到哪就代表当前前缀是什么
- 每个节点保存：
  - `children`：下一层字符到子节点的映射
  - `is_end`：是否有单词在此结束

这样一来：

- 插入：沿字符走，缺节点就创建，最后标记 `is_end = True`
- 搜索：沿字符走，走得通且最后 `is_end` 为真
- 前缀：沿字符走，走得通就行

## 先从最自然的想法讲起：为什么哈希表不够？

如果只做 `search(word)`，哈希表当然可以。

但 `startsWith(prefix)` 如果用哈希表，直觉上会变成：

- 遍历所有单词，检查是否以 `prefix` 开头（慢）
- 或者把所有前缀都存起来（占用巨大空间，且插入复杂）

Trie 把“前缀共享”天然编码进结构里：相同前缀的单词共享同一条路径。

## 代码实现（Python，可直接提交）

下面用 `dict` 存孩子节点，字符集假设是小写字母（LeetCode 原题如此）：

```python
class Trie:
    def __init__(self):
        self.children = {}
        self.is_end = False

    def insert(self, word: str) -> None:
        node = self
        for ch in word:
            if ch not in node.children:
                node.children[ch] = Trie()
            node = node.children[ch]
        node.is_end = True

    def search(self, word: str) -> bool:
        node = self._walk(word)
        return node is not None and node.is_end

    def startsWith(self, prefix: str) -> bool:
        return self._walk(prefix) is not None

    def _walk(self, s: str):
        node = self
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node
```

## 逐行拆解：`_walk` 是整题的“公共底座”

- `_walk(s)` 做的事：从根开始，按顺序走 `s` 的每个字符
  - 某步走不通：返回 `None`
  - 全部走完：返回走到的节点
- `startsWith(prefix)`：只要 `_walk(prefix)` 不为 `None` 就成立
- `search(word)`：走得通还不够，还必须 `node.is_end == True`

这就是“前缀存在”和“完整单词存在”的本质区别。

## 手动模拟：插入与查询在结构上发生了什么？

插入 `"apple"` 后，根到节点依次有：

```text
root -a-> -p-> -p-> -l-> -e(end)
```

此时：

- `startsWith("app")`：走 `a,p,p` 都能走通，返回 True
- `search("app")`：虽然走得通，但 `app` 节点未必是 `is_end=True`（除非插入过 `"app"`），所以可能返回 False

## 复杂度分析

设单词长度为 `L`：

- 时间复杂度：
  - `insert/search/startsWith` 都是 `O(L)`
- 空间复杂度：
  - 与插入字符总量相关，最坏情况下接近所有字符都不共享：`O(总字符数)`

## 总结

Trie 的价值在于把“前缀共享”变成结构本身：所有以同一前缀开头的单词共享一条路径。实现时只要抓住两个点就够了：`children` 用来走路，`is_end` 用来区分“前缀”与“完整单词”。

