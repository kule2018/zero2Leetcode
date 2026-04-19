---
layout: default
title: 字节跳动面试高频手撕 2026.4
description: 字节跳动 2026 暑期实习面试手撕代码高频题汇总，基于5414篇面经统计，覆盖滑动窗口、动态规划、链表、栈/哈希/设计、二分排序、二叉树BFS六大分类及算法岗ML手撕专题，含ACM模式题解
eyebrow: 面试手撕 / 字节跳动
permalink: /05_interview/coding/bytedance-202604/
---

# 字节跳动面试高频手撕【27届暑期实习版】

> 数据来源：4350 篇牛客 + 1064 篇小红书面经，共 5414 篇（v2，2026年4月更新）

## 数据概览

字节面试手撕分为三大类，不同岗位考察侧重不同：

| 类别 | 出现次数 | 题目数 | 适用岗位 |
|------|---------|--------|----------|
| LeetCode 原题 | 1678 次 | 261 道 | 所有技术岗 |
| 算法岗 ML 手撕 | 212 次 | 28 类 | 算法岗 / 大模型岗 |
| 原创算法题 | 320+ 道 | — | 所有技术岗 |

- 后端 / 前端 / 客户端岗：主考 LeetCode 原题，不考 ML 手撕
- 算法岗 / 大模型岗：三类全要准备

---

## 六大分类 · 出题频次总览

基于 5414 篇面经，按总频次排序：

| 分类 | 题数 | 总频次 |
|------|------|--------|
| 滑动窗口 + 双指针 | 6 道 | 230 次 |
| 动态规划 | 10 道 | 200 次 |
| 链表 | 9 道 | 189 次 |
| 栈 / 队列 / 哈希 / 设计 | 8 道 | 155 次 |
| 二分查找 + 排序 / 数组 | 8 道 | 145 次 |
| 二叉树 + BFS | 7 道 | 130 次 |

本次最大变化：LRU 缓存从 38 次暴涨到 55 次，跃升全榜第 2。

---

## 滑动窗口 + 双指针（6 道 · 230 次）

| 排名 | 题目 | 频次 |
|------|------|------|
| 1 | [LeetCode 3 无重复字符最长子串](playground.html?id=3) | 129 次 |
| 2 | LeetCode 88 合并两个有序数组 | 29 次 |
| 3 | [LeetCode 15 三数之和](playground.html?id=15) | 27 次 |
| 4 | [LeetCode 42 接雨水](playground.html?id=42) | 25 次 |
| 5 | LeetCode 209 长度最小的子数组 | 12 次 |
| 6 | [LeetCode 239 滑动窗口最大值](playground.html?id=239) | 9 次 |

- LC3 出现 129 次，是第二名的 4 倍以上，字节脸面题，必须 10 分钟内 bug-free 写完
- 接雨水（双指针 / 单调栈）两种解法都要会

---

## 动态规划（10 道 · 200 次）

| 排名 | 题目 | 频次 |
|------|------|------|
| 1 | [LeetCode 5 最长回文子串](playground.html?id=5) | 33 次 |
| 2 | [LeetCode 53 最大子数组和](playground.html?id=53) | 30 次 |
| 3 | [LeetCode 300 最长递增子序列](playground.html?id=300) | 24 次 |
| 4 | [LeetCode 121 买卖股票的最佳时机](playground.html?id=121) | 23 次 |
| 5 | [LeetCode 72 编辑距离（Hard）](playground.html?id=72) | 20 次 |
| 6 | [LeetCode 322 零钱兑换](playground.html?id=322) | 14 次 |
| 7 | [LeetCode 1143 最长公共子序列](playground.html?id=1143) | 12 次 |
| 8 | LeetCode 122 买卖股票 II | 12 次 |
| 9 | [LeetCode 198 打家劫舍](playground.html?id=198) | 8 次 |
| 10 | [LeetCode 70 爬楼梯](playground.html?id=70) | 7 次 |

- 子串 / 子序列类 DP（LC5 / 300 / 1143）是重点
- 编辑距离 Hard 题出了 20 次，字节面试官最爱
- 写完必被追问：能否把 O(mn) 优化到 O(n)？

---

## 链表（9 道 · 189 次）

| 排名 | 题目 | 频次 |
|------|------|------|
| 1 | [LeetCode 206 翻转链表](playground.html?id=206) | 40 次 |
| 2 | [LeetCode 25 K 个一组翻转链表](playground.html?id=25) | 38 次 |
| 3 | [LeetCode 19 删除倒数第 N 个节点](playground.html?id=19) | 27 次 |
| 4 | [LeetCode 23 合并 K 个升序链表](playground.html?id=23) | 20 次 |
| 5 | [LeetCode 21 合并两个有序链表](playground.html?id=21) | 14 次 |
| 6 | [LeetCode 141 环形链表](playground.html?id=141) | 14 次 |
| 7 | [LeetCode 148 排序链表](playground.html?id=148) | 13 次 |
| 8 | LeetCode 92 反转链表 II | 12 次 |
| 9 | [LeetCode 2 两数相加](playground.html?id=2) | 11 次 |

- 反转链表系列（206 / 25 / 92）三道合计 90 次，字节最爱考
- 难度从入门到 Hard 都有，建议从简到难刷
- 链表题数最多（9 道），必须全部熟练掌握

---

## 栈 / 队列 / 哈希 / 设计（8 道 · 155 次）

| 排名 | 题目 | 频次 |
|------|------|------|
| 1 | [LeetCode 146 LRU 缓存](playground.html?id=146) | 55 次 |
| 2 | [LeetCode 20 有效的括号](playground.html?id=20) | 27 次 |
| 3 | [LeetCode 1 两数之和](playground.html?id=1) | 17 次 |
| 4 | [LeetCode 46 全排列](playground.html?id=46) | 16 次 |
| 5 | LeetCode 165 比较版本号 | 16 次 |
| 6 | LeetCode 232 用栈实现队列 | 14 次 |
| 7 | LeetCode 415 字符串相加 | 13 次 |
| 8 | [LeetCode 22 括号生成](playground.html?id=22) | 7 次 |

- LRU 缓存：38 次暴涨到 55 次，全榜第 2
- 面试官要求手写双向链表 + 哈希表，禁用 LinkedHashMap / OrderedDict
- 写完必被追问：并发场景下淘汰逻辑有没有问题？

---

## 二分查找 + 排序 / 数组（8 道 · 145 次）

| 排名 | 题目 | 频次 |
|------|------|------|
| 1 | [LeetCode 215 数组中的第K大元素](playground.html?id=215) | 39 次 |
| 2 | [LeetCode 200 岛屿数量](playground.html?id=200) | 32 次 |
| 3 | [LeetCode 56 合并区间](playground.html?id=56) | 18 次 |
| 4 | [LeetCode 33 搜索旋转排序数组](playground.html?id=33) | 15 次 |
| 5 | [LeetCode 34 排序数组中查找首尾位置](playground.html?id=34) | 12 次 |
| 6 | LeetCode 912 排序数组 | 11 次 |
| 7 | [LeetCode 4 寻找两个正序数组的中位数](playground.html?id=4) | 10 次 |
| 8 | [LeetCode 75 颜色分类](playground.html?id=75) | 8 次 |

- LC215 快速选择算法是重点，面试常要求手写 partition
- 二分查找变体（旋转数组、首尾位置）是经典考点

---

## 二叉树 + BFS（7 道 · 130 次）

| 排名 | 题目 | 频次 |
|------|------|------|
| 1 | [LeetCode 102 二叉树的层序遍历](playground.html?id=102) | 28 次 |
| 2 | [LeetCode 236 二叉树的最近公共祖先](playground.html?id=236) | 25 次 |
| 3 | [LeetCode 104 二叉树的最大深度](playground.html?id=104) | 22 次 |
| 4 | [LeetCode 94 二叉树的中序遍历](playground.html?id=94) | 18 次 |
| 5 | [LeetCode 124 二叉树中的最大路径和](playground.html?id=124) | 15 次 |
| 6 | [LeetCode 199 二叉树的右视图](playground.html?id=199) | 12 次 |
| 7 | [LeetCode 226 翻转二叉树](playground.html?id=226) | 10 次 |

- 层序遍历和 LCA 是面试最爱考的二叉树题
- LC124 最大路径和是 Hard 题，出现 15 次，需要熟练掌握后序遍历思路

---

## 算法岗 ML 手撕 TOP8（共 212 次）

仅算法岗 / 大模型岗考察，研发 / 前端不考。

| 排名 | 题目 | 频次 |
|------|------|------|
| 1 | 多头注意力 MHA | 59 次 |
| 2 | 交叉熵损失 Cross-Entropy | 28 次 |
| 3 | Self-Attention / Attention | 24 次 |
| 4 | RMSNorm / LayerNorm / BN | 11 次 |
| 5 | 梯度下降（含变种） | 7 次 |
| 6 | AUC 计算（含 GAUC） | 7 次 |
| 7 | Transformer 完整结构 | 6 次 |
| 8 | MLP 全连接层 forward/backward | 6 次 |

- Self-Attention 从 9 次飙到 24 次，涨幅最大
- 每题必须：手写代码 + 口述推导 + 分析复杂度
- 不再只考"会不会写"，开始问"为什么除以 $$\sqrt{d}$$？"

---

## 全榜 TOP10 · 优先刷题顺序

时间紧先刷这 10 道，覆盖约 40% 的字节手撕考察概率：

| 优先级 | 题目 | 频次 |
|--------|------|------|
| 1 | [LeetCode 3 无重复字符最长子串](playground.html?id=3) | 129 次 |
| 2 | [LeetCode 146 LRU 缓存](playground.html?id=146) | 55 次 |
| 3 | [LeetCode 206 翻转链表](playground.html?id=206) | 40 次 |
| 4 | [LeetCode 215 数组中的第K大元素](playground.html?id=215) | 39 次 |
| 5 | [LeetCode 25 K个一组翻转链表](playground.html?id=25) | 38 次 |
| 6 | [LeetCode 5 最长回文子串](playground.html?id=5) | 33 次 |
| 7 | [LeetCode 200 岛屿数量](playground.html?id=200) | 32 次 |
| 8 | [LeetCode 53 最大子数组和](playground.html?id=53) | 30 次 |
| 9 | LeetCode 88 合并两个有序数组 | 29 次 |
| 10 | [LeetCode 19 删除倒数第N个节点](playground.html?id=19) | 27 次 |

---

## 三周刷题计划

**第一周**：TOP10 + 每个分类最高频那道

**第二周**：补齐 6 大分类，重点练链表和 DP

**第三周**：全量复盘，每道至少做两遍

---

## 字节手撕 = ACM 模式

字节面试手撕使用飞书 IDE + 字节在线环境，采用 **ACM 模式**——需要自己处理输入输出，不是 LeetCode 那种只写核心代码的模式。

很多人算法会写，但栽在 ACM 模式上。平时练习务必用 ACM 模式！

本站所有题解均采用 ACM 模式（标准输入输出），可直接作为面试手撕的练习素材。
