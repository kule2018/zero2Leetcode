---
layout: default
title: 字节跳动面试高频手撕 2026.8
description: 字节跳动 27 届秋招面试手撕高频题翻新版，覆盖 87 道 LeetCode 高频题的六大分类、最新频次、Hot 100 盲区、ACM 模式要求与优先刷题路线
keywords: 字节跳动, 面试手撕, 27届秋招, LeetCode高频题, ACM模式, 刷题路线
eyebrow: 面试手撕 / 字节跳动
permalink: /05_interview/coding/bytedance-202604/
---

# 字节跳动面试高频手撕【27 届秋招翻新版】

> 本次更新收录 163 道记录：87 道 LeetCode 高频题、35 道算法岗专项题，以及另行整理的 ACM 入门题和面试官原创题。本文聚焦适用于所有技术岗的 87 道 LeetCode 高频题。频次表示当前样本中的出现次数，不等同于真实出题概率。本文出现的题目链接均直达本站力扣模拟练习场。

## 一、六大分类总览

| 分类 | 题数 | 样本总频次 |
|------|------|------------|
| 二叉树 + 搜索与图论 | 21 | 390 |
| 栈 / 队列 / 哈希 / 贪心 / 设计 | 16 | 373 |
| 链表 | 14 | 349 |
| 滑动窗口 + 双指针 + 字符串 | 9 | 337 |
| 二分查找 + 排序 / 数组 | 14 | 325 |
| 动态规划 | 13 | 277 |

这版数据最值得注意的不是动态规划，而是链表与二叉树：两类共 35 道，约占题单的 40%。手撕环节通常只有 20～30 分钟，面试官更容易用代码短、边界多的题检查实现稳定性。

---

## 二、全榜优先级最高的十道题

| 排名 | 题目 | 样本频次 | 核心方法 |
|------|------|----------|----------|
| 1 | [LC 3 无重复字符的最长子串](https://onefly.top/zero2Leetcode/playground.html?id=3) | **174** | 滑动窗口 + 哈希表 |
| 2 | [LC 146 LRU 缓存](https://onefly.top/zero2Leetcode/playground.html?id=146) | **72** | 哈希表 + 双向链表 |
| 3 | [LC 215 数组中的第 K 个最大元素](https://onefly.top/zero2Leetcode/playground.html?id=215) | **64** | 快速选择 / 堆 |
| 4 | [LC 206 反转链表](https://onefly.top/zero2Leetcode/playground.html?id=206) | **55** | 迭代 / 递归 |
| 5 | [LC 25 K 个一组翻转链表](https://onefly.top/zero2Leetcode/playground.html?id=25) | **55** | 分组 + 区间反转 |
| 6 | [LC 200 岛屿数量](https://onefly.top/zero2Leetcode/playground.html?id=200) | **50** | DFS / BFS |
| 7 | [LC 5 最长回文子串](https://onefly.top/zero2Leetcode/playground.html?id=5) | **46** | 中心扩展 / DP |
| 8 | [LC 15 三数之和](https://onefly.top/zero2Leetcode/playground.html?id=15) | **44** | 排序 + 双指针 |
| 9 | [LC 19 删除链表的倒数第 N 个结点](https://onefly.top/zero2Leetcode/playground.html?id=19) | **43** | 快慢指针 |
| 10 | [LC 300 最长递增子序列](https://onefly.top/zero2Leetcode/playground.html?id=300) | **43** | DP / 贪心 + 二分 |

[LC 3](https://onefly.top/zero2Leetcode/playground.html?id=3) 的频次明显领先，应该练到 10 分钟内稳定写完。[LC 146](https://onefly.top/zero2Leetcode/playground.html?id=146) 要手写双向链表与哈希表；[LC 215](https://onefly.top/zero2Leetcode/playground.html?id=215) 应同时准备快速选择和堆；[LC 200](https://onefly.top/zero2Leetcode/playground.html?id=200) 应能在 DFS 与 BFS 之间切换。

---

## 三、按分类准备

### 1. 链表（14 道 · 349 次）

| 题目 | 样本频次 |
|------|----------|
| [LC 206 反转链表](https://onefly.top/zero2Leetcode/playground.html?id=206) | 55 |
| [LC 25 K 个一组翻转链表](https://onefly.top/zero2Leetcode/playground.html?id=25) | 55 |
| [LC 19 删除链表的倒数第 N 个结点](https://onefly.top/zero2Leetcode/playground.html?id=19) | 43 |
| [LC 23 合并 K 个升序链表](https://onefly.top/zero2Leetcode/playground.html?id=23) | 36 |
| [LC 21 合并两个有序链表](https://onefly.top/zero2Leetcode/playground.html?id=21) | 29 |

反转系列 [LC 206](https://onefly.top/zero2Leetcode/playground.html?id=206)、[LC 25](https://onefly.top/zero2Leetcode/playground.html?id=25)、[LC 92](https://onefly.top/zero2Leetcode/playground.html?id=92) 合计出现 125 次。训练重点不是背答案，而是固定哨兵节点、区间反转和前后分组重连的写法。

### 2. 二叉树与搜索图论（21 道 · 390 次）

| 题目 | 样本频次 |
|------|----------|
| [LC 200 岛屿数量](https://onefly.top/zero2Leetcode/playground.html?id=200) | 50 |
| [LC 236 二叉树的最近公共祖先](https://onefly.top/zero2Leetcode/playground.html?id=236) | 41 |
| [LC 103 二叉树的锯齿形层序遍历](https://onefly.top/zero2Leetcode/playground.html?id=103) | 28 |
| [LC 102 二叉树的层序遍历](https://onefly.top/zero2Leetcode/playground.html?id=102) | 27 |
| [LC 199 二叉树的右视图](https://onefly.top/zero2Leetcode/playground.html?id=199) | 26 |
| [LC 572 另一棵树的子树](https://onefly.top/zero2Leetcode/playground.html?id=572) | 17 |

[LC 102](https://onefly.top/zero2Leetcode/playground.html?id=102)、[LC 103](https://onefly.top/zero2Leetcode/playground.html?id=103)、[LC 199](https://onefly.top/zero2Leetcode/playground.html?id=199) 共用同一个按层 BFS 框架，区别主要在每层结果的收集方式。[LC 200](https://onefly.top/zero2Leetcode/playground.html?id=200) 建议同时掌握 DFS 与 BFS，并连带练习 [LC 695 岛屿的最大面积](https://onefly.top/zero2Leetcode/playground.html?id=695)。

### 3. 动态规划（13 道 · 277 次）

| 题目 | 样本频次 |
|------|----------|
| [LC 5 最长回文子串](https://onefly.top/zero2Leetcode/playground.html?id=5) | 46 |
| [LC 300 最长递增子序列](https://onefly.top/zero2Leetcode/playground.html?id=300) | 43 |
| [LC 72 编辑距离](https://onefly.top/zero2Leetcode/playground.html?id=72) | 34 |
| [LC 1143 最长公共子序列](https://onefly.top/zero2Leetcode/playground.html?id=1143) | 23 |

子串、子序列是这一类的重点。[LC 300](https://onefly.top/zero2Leetcode/playground.html?id=300) 除了 $O(n^2)$ 动态规划，还要准备 $O(n\log n)$ 的贪心加二分写法。

### 4. 双指针、滑动窗口与字符串（9 道 · 337 次）

| 题目 | 样本频次 |
|------|----------|
| [LC 3 无重复字符的最长子串](https://onefly.top/zero2Leetcode/playground.html?id=3) | 174 |
| [LC 15 三数之和](https://onefly.top/zero2Leetcode/playground.html?id=15) | 44 |
| [LC 42 接雨水](https://onefly.top/zero2Leetcode/playground.html?id=42) | 38 |

[LC 3](https://onefly.top/zero2Leetcode/playground.html?id=3) 一题就占该分类样本频次的一半以上。[LC 15](https://onefly.top/zero2Leetcode/playground.html?id=15) 重点检查排序后的去重，[LC 42](https://onefly.top/zero2Leetcode/playground.html?id=42) 应至少熟练掌握双指针或单调栈中的一种，并能解释另一种思路。

### 5. 栈、队列、哈希、贪心与设计（16 道 · 373 次）

| 题目 | 样本频次 |
|------|----------|
| [LC 146 LRU 缓存](https://onefly.top/zero2Leetcode/playground.html?id=146) | 72 |
| [LC 215 数组中的第 K 个最大元素](https://onefly.top/zero2Leetcode/playground.html?id=215) | 64 |
| [LC 20 有效的括号](https://onefly.top/zero2Leetcode/playground.html?id=20) | 36 |

[LC 146](https://onefly.top/zero2Leetcode/playground.html?id=146) 主要考代码组织与指针边界；[LC 215](https://onefly.top/zero2Leetcode/playground.html?id=215) 的快速选择容易在 `partition` 边界处出错，建议固定一套经过测试的模板。

### 6. 二分查找、排序与数组（14 道 · 325 次）

这类题除常规二分外，还要特别准备手写排序与字符串模拟。高频题单中有一批不在 Hot 100 内，例如：

- [LC 902 最大为 N 的数字组合](https://onefly.top/zero2Leetcode/playground.html?id=902)
- [LC 912 排序数组](https://onefly.top/zero2Leetcode/playground.html?id=912)
- [LC 415 字符串相加](https://onefly.top/zero2Leetcode/playground.html?id=415)
- [LC 165 比较版本号](https://onefly.top/zero2Leetcode/playground.html?id=165)

---

## 四、只刷 Hot 100 不够

字节高频 Top 50 中有 14 道不属于 Hot 100，约占 28%。因此更稳妥的顺序是：

1. 先刷本页 Top 10，建立最核心的题型模板。
2. 再按链表、树与图、滑动窗口三个高频方向补齐。
3. 最后专项补 [LC 902](https://onefly.top/zero2Leetcode/playground.html?id=902)、[LC 912](https://onefly.top/zero2Leetcode/playground.html?id=912)、[LC 415](https://onefly.top/zero2Leetcode/playground.html?id=415)、[LC 165](https://onefly.top/zero2Leetcode/playground.html?id=165) 等 Hot 100 之外的题。

算法岗还需要额外准备 35 道专项手撕，包括 Multi-Head Attention、交叉熵损失和 LLM 常见损失函数等；本文的通用题单只是基础部分。

---

## 五、按 ACM 模式训练

字节手撕通常要求自行处理输入输出，不是只补全函数体。日常练习至少覆盖：

- 一维数组、二维矩阵和字符串的读取。
- 多组测试数据与空行处理。
- 链表、二叉树等结构的构造与结果序列化。
- 按题意输出，避免多余提示文字。

建议每道高频题先用 LeetCode 函数模式确认算法，再独立写一遍 ACM 包装，并进行空输入、单元素、重复值和极值测试。

---

## 六、最短执行路线

- **时间只够十道**：按本页 Top 10 完成，每题至少独立写两遍。
- **有两周**：Top 10 → 链表全部重点题 → 二叉树层序系列 → 岛屿系列 → DP 子串/子序列。
- **时间充裕**：完成 87 道通用题，并补齐 Hot 100 之外的字节特色题；算法岗再进入 35 道专项题。

完成标准不是“看过题解”，而是能在 10～20 分钟内独立编码、覆盖边界、说明复杂度，并在追问时给出替代解法或优化方向。
