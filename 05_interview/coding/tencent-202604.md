---
layout: default
title: 腾讯面试高频手撕 2026.4
description: 腾讯 2026 暑期实习面试手撕代码高频题汇总，基于3784篇面经统计，覆盖LeetCode原题TOP10、原创场景题、算法岗ML手撕，含腾讯vs字节核心区别分析与ACM模式题解
eyebrow: 面试手撕 / 腾讯
permalink: /05_interview/coding/tencent-202604/
---

# 腾讯面试高频手撕【27届暑期实习版】

> 数据来源：3114 篇牛客 + 670 篇小红书面经，共 3784 篇，2524 条手撕记录（2026年4月更新）

## 数据概览

腾讯面试手撕分为三大类，按题目类型和频次统计：

| 类别 | 出现次数 | 题目数 | 占比 | 适用岗位 |
|------|---------|--------|------|----------|
| LeetCode 原题 | 1833 次 | 253 道 | 73% | 所有技术岗 |
| 原创 / 场景算法题 | 633 次 | 375 道 | 25% | 所有技术岗 |
| 算法岗 ML/DL 手撕 | 58 次 | 19 类 | 2% | 算法岗 / 大模型岗 |

- 后端 / 前端 / 客户端岗：主考 LeetCode 原题 + 原创场景题，不考 ML 手撕
- 算法岗 / 大模型岗：三类全要准备，但 ML 手撕压力比字节小

---

## 腾讯 vs 字节：3 个核心区别

面腾讯和面字节的准备策略不一样。基于两家公司的面经数据对比，有三个核心区别：

**区别一：模式一样，都以 ACM 模式为主。** 字节强制 ACM 模式，腾讯同样以 ACM 模式为主。平时练习一定要用 ACM 模式写，不能只用 LeetCode 的核心代码模式。

**区别二：非 LeetCode 题占比差距巨大。** 字节的非 LC 题只占 7%，但腾讯高达 **25%**——四分之一的手撕题不是 LeetCode 原题。只刷 LeetCode 在腾讯面试时更容易遇到没见过的题。

**区别三：LRU 是腾讯的绝对霸主。** LRU 缓存在腾讯出现了 **123 次**（第 1 名），字节为 72 次（第 2 名），腾讯对 LRU 的考察强度接近字节的 **2 倍**。面腾讯，必须能手写 LRU（双向链表 + 哈希表）。

---

## LeetCode 原题 TOP10（1833 次 · 253 道 · 占 73%）

LeetCode 原题是所有技术岗的绝对主力，仅 TOP 10 就贡献了 596 次，占 LC 总频次的 33%。

| 排名 | 题目 | 频次 |
|------|------|------|
| 1 | [LeetCode 146 LRU 缓存](https://onefly.top/zero2Leetcode/playground.html?id=146) | **123 次** |
| 2 | [LeetCode 912 排序数组（手写快排）](https://onefly.top/zero2Leetcode/playground.html?id=912) | **85 次** |
| 3 | [LeetCode 3 无重复字符最长子串](https://onefly.top/zero2Leetcode/playground.html?id=3) | 76 次 |
| 4 | [LeetCode 53 最大子数组和](https://onefly.top/zero2Leetcode/playground.html?id=53) | 60 次 |
| 5 | [LeetCode 215 第 K 个最大元素](https://onefly.top/zero2Leetcode/playground.html?id=215) | 60 次 |
| 6 | [LeetCode 300 最长递增子序列](https://onefly.top/zero2Leetcode/playground.html?id=300) | 44 次 |
| 7 | [LeetCode 206 反转链表](https://onefly.top/zero2Leetcode/playground.html?id=206) | 41 次 |
| 8 | [LeetCode 20 有效的括号](https://onefly.top/zero2Leetcode/playground.html?id=20) | 41 次 |
| 9 | [LeetCode 415 字符串相加](https://onefly.top/zero2Leetcode/playground.html?id=415) | 36 次 |
| 10 | [LeetCode 21 合并两个有序链表](https://onefly.top/zero2Leetcode/playground.html?id=21) | 30 次 |

### 腾讯 vs 字节 TOP10 频次对比

| 题目 | 腾讯频次 | 字节频次 | 说明 |
|------|---------|---------|------|
| LC 146 LRU 缓存 | **123** | 72 | 腾讯考察强度接近字节 2 倍 |
| LC 912 排序数组 | **85** | 15 | 腾讯特别喜欢考手写快排 |
| LC 3 无重复字符最长子串 | 76 | **129** | 字节的脸面题 |
| LC 415 字符串相加 | **36** | 14 | 腾讯 TOP10，字节不算高频 |
| LC 206 反转链表 | 41 | 40 | 两家都是链表基本功 |

几个值得注意的点：

- **LRU 123 次**，断层领先，是腾讯的标志性题目。面试官要求手写双向链表 + 哈希表，禁用 OrderedDict
- **排序数组 85 次**，腾讯特别喜欢考手写快排（不是调 sort），字节这道题只有 15 次
- **字符串相加 36 次**，这道题在字节不算高频（14 次），但在腾讯是 TOP 10
- 链表题密度极高，TOP 50 里有 **10 道链表题**

---

## 原创 / 场景算法题（633 次 · 375 道 · 占 25%）

这是腾讯手撕和字节最大的不同。字节的非 LC 题只占 7%，而腾讯高达 25%。这 375 道题不是 LeetCode 原题，包括面试官自己出的原创题、经典算法实现、场景编程题等。

### 代表题 1：带优先级的括号匹配（8 次）

括号有优先级：`{` > `[` > `(`。`{[()]}` 合法，`[{}]` 不合法。考察**栈 + 优先级判断**。这道题 LeetCode 上没有对应原题，纯属腾讯面试官的偏好。

### 代表题 2：等概率随机抽样（9 次）

30 万员工用 `rand16()` 抽 1 万人，要求每个人中奖概率相等。考察**蓄水池采样**或扩展随机数范围。这个系列有多个变体，都是围绕「如何用有限范围的随机数生成器实现大范围均匀采样」。

### 代表题 3：消消乐（4 次）

长度为 $n$ 的 1-9 数字串，相邻两数之和为 10 则消除，求最短串长度。考察**栈模拟**。

### 其他高频原创题

| 题目 | 考点 |
|------|------|
| 敏感词过滤 | Trie + KMP |
| 视频字幕快速查找 | TreeMap 二分 |
| 微信红包算法 | 二倍均值法 |
| 10 亿整数排序去重 | 位图 BitMap |

这类题没法刷原题，但题型有规律——核心考察的是能不能把**实际场景抽象成算法问题**。准备方式：熟练掌握栈、Trie、二分、采样等基础算法后，重点练习「从场景到算法」的转化能力。

---

## 算法岗 ML/DL 手撕（58 次 · 19 类 · 占 2%）

仅算法岗 / 大模型算法岗考，后端 / 前端 / 客户端不考。

| 排名 | 题目 | 频次 |
|------|------|------|
| 1 | Multi-Head Attention | **21 次** |
| 2 | Grouped Query Attention | 5 次 |
| 3 | Self-Attention | 5 次 |
| 4 | Cross-Attention | 4 次 |
| 5 | MLP / 全连接网络 | 3 次 |
| 6 | InfoNCE Loss | 3 次 |

- MHA 一题就占 ML 总频次的 36%，大模型方向几乎必考
- 腾讯 ML 手撕总频次（58 次）远低于字节（277 次），ML 手撕压力比字节小
- 但不能因此不准备——GQA / Cross-Attention / InfoNCE 等新题在上升

---

## 不同岗位备考重点

### 后端 / 前端 / 客户端

- 主要考 LeetCode 原题（占 73%），TOP10 必须全部熟练
- 原创 / 场景题也会遇到（占 25%），需要注意场景抽象能力
- 不考 ML/DL 手撕
- **LRU + 手写快排**是两道基本功，必须熟练

### 算法岗 / 大模型算法岗

- LeetCode + ML/DL 手撕 + 原创题，三类都要准备
- MHA 出现 21 次，大模型方向几乎必考
- LeetCode 也不能放松，LC 原题仍然是主力
- GQA / Cross-Attention / InfoNCE 等新题也在上升

---

## 全榜 TOP10 · 优先刷题顺序

时间紧先刷这 10 道，覆盖约 33% 的腾讯 LC 手撕考察概率：

| 优先级 | 题目 | 频次 |
|--------|------|------|
| 1 | [LeetCode 146 LRU 缓存](https://onefly.top/zero2Leetcode/playground.html?id=146) | 123 次 |
| 2 | [LeetCode 912 排序数组](https://onefly.top/zero2Leetcode/playground.html?id=912) | 85 次 |
| 3 | [LeetCode 3 无重复字符最长子串](https://onefly.top/zero2Leetcode/playground.html?id=3) | 76 次 |
| 4 | [LeetCode 53 最大子数组和](https://onefly.top/zero2Leetcode/playground.html?id=53) | 60 次 |
| 5 | [LeetCode 215 第K个最大元素](https://onefly.top/zero2Leetcode/playground.html?id=215) | 60 次 |
| 6 | [LeetCode 300 最长递增子序列](https://onefly.top/zero2Leetcode/playground.html?id=300) | 44 次 |
| 7 | [LeetCode 206 反转链表](https://onefly.top/zero2Leetcode/playground.html?id=206) | 41 次 |
| 8 | [LeetCode 20 有效的括号](https://onefly.top/zero2Leetcode/playground.html?id=20) | 41 次 |
| 9 | [LeetCode 415 字符串相加](https://onefly.top/zero2Leetcode/playground.html?id=415) | 36 次 |
| 10 | [LeetCode 21 合并两个有序链表](https://onefly.top/zero2Leetcode/playground.html?id=21) | 30 次 |

---

## 三周刷题计划

**第一周**：TOP10 全部刷完，每道至少写两遍，LRU 和快排要做到闭眼写

**第二周**：补齐链表专题（TOP 50 有 10 道链表题）+ 练 2-3 道原创场景题

**第三周**：全量复盘 + 限时模拟，每道 15 分钟内 bug-free

---

## 腾讯手撕 = ACM 模式

腾讯面试手撕同样以 **ACM 模式**为主——需要自己处理输入输出，不是 LeetCode 那种只写核心代码的模式。

很多人算法会写，但栽在 ACM 模式上。平时练习务必用 ACM 模式！

本站所有题解均采用 ACM 模式（标准输入输出），可直接作为面试手撕的练习素材。
