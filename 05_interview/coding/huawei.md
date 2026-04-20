---
layout: default
title: 华为面试手撕高频题与备考规划
description: 华为2026校招/暑期实习面试手撕代码高频题Top20、完整题单(25/26届)、10天备考速通规划、ACM模式模板、AI岗ML手撕专题
eyebrow: 面试手撕 / 华为
permalink: /05_interview/coding/huawei/
---

# 华为面试手撕高频题与备考规划

> 华为面试手撕 = 80% LeetCode 原题（Hot 100 为主）+ 20% 基础算法/ML手撕。每位考生通常有一次换题机会。

---

## 面试流程概览

### 轮次说明

| 类型 | 轮次 |
|------|------|
| 暑期实习 | 技术一面 + 主管面（共 2 轮） |
| 秋招 | 技术一面 + 技术二面 + 主管面（共 3 轮） |

### 技术面考察内容

| 环节 | 说明 |
|------|------|
| 自我介绍 & 项目 | 简短自我介绍 + 追问简历中的实习/项目经历 |
| 八股文 | 数据结构、操作系统、网络、数据库等基础知识 |
| 手撕代码 | 现场编码，ACM 模式，详见下文 |
| 机试复盘 | 一面可能出现，代码重复率高时必定出现 |

> 考察顺序不固定，有些面试官会一开始就让你写代码。

### 手撕代码形式

**线上面试**：

| 形式 | 占比 | 流程 |
|------|------|------|
| 发送文字题目 | 50% | 面试官通过聊天框发题 → 本地 IDE 编写 → 面试官浏览代码问思路 |
| LeetCode 题号 | 45% | 登录自己的 LeetCode 账号，报题号现场做 |
| 机考复查 | 5% | 挑一道机考没满分的题当场重做 |

**线下面试**：白板编程，在白纸上写代码，面试官肉眼观察。

### 主管面

- 80% 聊天：生活、价值观、为人处世
- 20% 继续问技术

---

## 各岗位手撕考察方向

### AI 算法岗

| 概率 | 内容 |
|------|------|
| 70% | LeetCode Easy~Mid 原题（90% 来自 Hot 100） |
| 30% | 机器学习/深度学习手撕（KMeans、注意力机制等） |

影响因素：简历项目方向 + 面试官个人偏好，随机性大。

### 非 AI 岗（通软/嵌软/数据开发/测试等）

| 概率 | 内容 |
|------|------|
| 80% | LeetCode 原题 |
| 20% | 基础算法手撕（优先队列、快排/归并排序等） |

---

## 最新高频手撕题 Top 20

> 统计于 25、26 届面经数据

| # | 题目 | 考察知识点 | 频次 |
|---|------|-----------|------|
| 1 | [LC 20. 有效的括号](https://leetcode.cn/problems/valid-parentheses/) | 栈、字符串 | 5 |
| 2 | [LC 200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/) | DFS、BFS、网格搜索 | 5 |
| 3 | [LC 1. 两数之和](https://leetcode.cn/problems/two-sum/) | 哈希表 | 4 |
| 4 | [LC 3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/) | 滑动窗口、哈希集合 | 3 |
| 5 | [LC 46. 全排列](https://leetcode.cn/problems/permutations/) | 回溯、DFS | 3 |
| 6 | [LC 994. 腐烂的橘子](https://leetcode.cn/problems/rotting-oranges/) | BFS、网格搜索 | 3 |
| 7 | [LC 394. 字符串解码](https://leetcode.cn/problems/decode-string/) | 栈、递归、字符串 | 2 |
| 8 | [LC 739. 每日温度](https://leetcode.cn/problems/daily-temperatures/) | 单调栈 | 2 |
| 9 | [LC 56. 合并区间](https://leetcode.cn/problems/merge-intervals/) | 排序、区间合并 | 2 |
| 10 | [LC 64. 最小路径和](https://leetcode.cn/problems/minimum-path-sum/) | 动态规划 | 2 |
| 11 | [LC 102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/) | 二叉树、BFS | 2 |
| 12 | [LC 1423. 可获得的最大点数](https://leetcode.cn/problems/maximum-points-you-can-obtain-from-cards/) | 滑动窗口、前缀和 | 2 |
| 13 | [LC 155. 最小栈](https://leetcode.cn/problems/min-stack/) | 栈、设计题 | 1 |
| 14 | [LC 986. 区间列表的交集](https://leetcode.cn/problems/interval-list-intersections/) | 双指针、区间问题 | 1 |
| 15 | [LC 456. 132 模式](https://leetcode.cn/problems/132-pattern/) | 单调栈 | 1 |
| 16 | [LC 11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/) | 双指针、贪心 | 1 |
| 17 | [LC 49. 字母异位词分组](https://leetcode.cn/problems/group-anagrams/) | 哈希表、字符串 | 1 |
| 18 | [LC 71. 简化路径](https://leetcode.cn/problems/simplify-path/) | 栈、字符串模拟 | 1 |
| 19 | [LC 217. 存在重复元素](https://leetcode.cn/problems/contains-duplicate/) | 哈希表、集合 | 1 |
| 20 | [LC 21. 合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/) | 链表、双指针 | 1 |

---

## 完整手撕题单

### 26 届实习 + 秋招

#### AI 算法方向

| 时间 | 面试轮次 | 题目 |
|------|----------|------|
| 9月底 | AI工程师一面 | [480. 滑动窗口中位数](https://leetcode.cn/problems/sliding-window-median/) |
| 9月底 | AI相关岗位一面 | [20. 有效的括号](https://leetcode.cn/problems/valid-parentheses/) |
| 9月底 | 海思AI工程师一面 | [986. 区间列表的交集](https://leetcode.cn/problems/interval-list-intersections/) |
| 10月初 | AI工程师一面 | [46. 全排列](https://leetcode.cn/problems/permutations/) |
| 10月初 | AI一面 | [46. 全排列](https://leetcode.cn/problems/permutations/) |
| 10月初 | 计算机视觉一面 | [155. 最小栈](https://leetcode.cn/problems/min-stack/) |
| 10月初 | AI一面 | 搜索二维矩阵 |
| 10月初 | AI工程师一面 | 字符串前缀后缀子串提取（自定义题） |
| 10月初 | AI计算一面 | 实现 L2 loss 梯度下降算法 |
| 10月中 | 终端云AI一面 | PyTorch 实现 XGBoost 调用、反向传播、NN |
| 10月中 | 媒体算法一面 | 两个矩形相交面积 |
| 10月中 | 推荐算法一面 | [456. 132 模式](https://leetcode.cn/problems/132-pattern/) |
| 10月底 | AI工程师一面 | 字符串前缀后缀子串提取（自定义题） |

#### 通软方向

| 时间 | 面试轮次 | 题目 |
|------|----------|------|
| 9月底 | 通软一面 | 数组中对数字和字母分别排序 |
| 9月底 | 一面 | [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/) |
| 10月初 | 一面 | [2. 两数相加](https://leetcode.cn/problems/add-two-numbers/)（需自己写 ListNode） |
| 10月初 | 通软一面 | 类似爬楼梯的 DP + 求区间权值第 k 大 |
| 10月中 | 通软一面 | 数字字符串插入使新数值最大 |
| 10月中 | AI软件开发一面 | 按 BMI 排序结构体数组 |
| 10月底 | 通软一面 | [1. 两数之和](https://leetcode.cn/problems/two-sum/) |
| 10月底 | 2012通软一面 | [200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/) |
| 10月中 | 通软一面 | [1. 两数之和](https://leetcode.cn/problems/two-sum/) + [3. 最长无重复子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/) |

#### 其他方向

| 时间 | 面试轮次 | 题目 |
|------|----------|------|
| 9月底 | 智能终端一面 | 找出 8bit 数组中最大的 8 个 |
| 9月初 | 通信算法一面 | 背包问题 |
| 9月底 | 无线一面 | [200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/) |
| 9月初 | 车BU一面 | [240. 搜索二维矩阵 II](https://leetcode.cn/problems/search-a-2d-matrix-ii/) |
| 9月初 | 终端BG一面 | [394. 字符串解码](https://leetcode.cn/problems/decode-string/) |

### 25 届秋招

#### AI 算法方向

| 时间 | 面试轮次 | 题目 |
|------|----------|------|
| 10月中 | AI算法工程师一面 | LC 位运算原题（Mid） |
| 10月中 | AI算法工程师二面 | 排序模拟题（Easy~Mid） |
| 11月初 | 通信算法一面 | [394. 字符串解码](https://leetcode.cn/problems/decode-string/) |
| 11月初 | 通信算法二面 | 哈希表 + 取模判断分组 |
| 9月底 | 算法工程师二面 | [739. 每日温度](https://leetcode.cn/problems/daily-temperatures/) |

#### 通软方向

| 时间 | 面试轮次 | 题目 |
|------|----------|------|
| 10月中 | 终端一面 | [104. 最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/) + [102. 层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/) + [139. 单词拆分](https://leetcode.cn/problems/word-break/) + [20. 有效的括号](https://leetcode.cn/problems/valid-parentheses/) |
| 10月中 | 终端二面 | [200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/) |
| 10月中 | 海思通软一面 | [11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/) |
| 10月下 | 微服务一面 | [1624. 两个相同字符之间的最长子串](https://leetcode.cn/problems/largest-substring-between-two-equal-characters/) |
| 10月下 | 微服务二面 | [71. 简化路径](https://leetcode.cn/problems/simplify-path/) |
| 10月中 | 通软一面 | [49. 字母异位词分组](https://leetcode.cn/problems/group-anagrams/) |
| 10月中 | 通软二面 | [LCR 020. 回文子串](https://leetcode.cn/problems/a7VOhD/) |
| 10月中 | 通软一面 | [面试题 02.02. 倒数第k个节点](https://leetcode.cn/problems/kth-node-from-end-of-list-lcci/) |
| 10月中 | 通软二面 | [1302. 层数最深叶子节点的和](https://leetcode.cn/problems/deepest-leaves-sum/) |
| 9月下 | 通软一面 | [20. 有效的括号](https://leetcode.cn/problems/valid-parentheses/) |
| 9月下 | 通软二面 | [152. 乘积最大子数组](https://leetcode.cn/problems/maximum-product-subarray/) |
| 9月下 | 终端通软一面 | [LCR 007. 三数之和](https://leetcode.cn/problems/1fGaJU/) |
| 9月 | 计算产品线一面 | [1011. 在D天内送达包裹的能力](https://leetcode.cn/problems/capacity-to-ship-packages-within-d-days/) |
| 9月 | 计算产品线二面 | [LCR 021. 删除链表的倒数第N个结点](https://leetcode.cn/problems/SLwz0R/) |
| 9月下 | 通软一面 | [718. 最长重复子数组](https://leetcode.cn/problems/maximum-length-of-repeated-subarray/) |
| 9月下 | 通软二面 | [20. 有效的括号](https://leetcode.cn/problems/valid-parentheses/) |
| 9月下 | 通软一面 | [113. 路径总和 II](https://leetcode.cn/problems/path-sum-ii/) + [690. 员工的重要性](https://leetcode.cn/problems/employee-importance/) |
| 9月下 | 通软二面 | 1到n的最小公倍数 + 英文平均单词长度 |
| 9月下 | 终端BG二面 | [64. 最小路径和](https://leetcode.cn/problems/minimum-path-sum/) |
| 9月下 | 光产品线一面 | [1423. 可获得的最大点数](https://leetcode.cn/problems/maximum-points-you-can-obtain-from-cards/) |
| 9月 | 车BU座舱一面 | [56. 合并区间](https://leetcode.cn/problems/merge-intervals/) + [151. 反转字符串中的单词](https://leetcode.cn/problems/reverse-words-in-a-string/) |
| 9月 | ICT一面 | [LCR 008. 长度最小的子数组](https://leetcode.cn/problems/2VG8Kg/) |
| 9月 | ICT二面 | [17. 电话号码的字母组合](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/) |
| 9月初 | ICT光产品线一面 | [102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/) |
| 9月 | 通软一面 | [LCR 078. 合并K个升序链表](https://leetcode.cn/problems/vvXgSW/) + [994. 腐烂的橘子](https://leetcode.cn/problems/rotting-oranges/) + [46. 全排列](https://leetcode.cn/problems/permutations/) + [1423. 最大点数](https://leetcode.cn/problems/maximum-points-you-can-obtain-from-cards/) + [42. 接雨水](https://leetcode.cn/problems/trapping-rain-water/) |
| 9月 | 通软三面 | [204. 计数质数](https://leetcode.cn/problems/count-primes/) |
| 9月 | 通软一面 | [LCR 029. 循环有序列表的插入](https://leetcode.cn/problems/4ueAj6/) |
| 9月 | 通软二面 | [692. 前K个高频单词](https://leetcode.cn/problems/top-k-frequent-words/) |
| 9月底 | 服务与软件一面 | [582. 杀掉进程](https://leetcode.cn/problems/kill-process/) |
| 9月底 | 服务与软件二面 | [735. 小行星碰撞](https://leetcode.cn/problems/asteroid-collision/) |
| 9月底 | 服务与软件三面 | [679. 24 点游戏](https://leetcode.cn/problems/24-game/) |
| 9月中 | 终端二面 | [739. 每日温度](https://leetcode.cn/problems/daily-temperatures/) |
| 9月中 | 终端BG通软一面 | [LCR 078. 合并K个升序链表](https://leetcode.cn/problems/vvXgSW/) |
| 9月中 | 终端BG通软二面 | [994. 腐烂的橘子](https://leetcode.cn/problems/rotting-oranges/) |
| 9月下 | 终端一面 | [134. 加油站](https://leetcode.cn/problems/gas-station/) |
| 9月下 | 终端二面 | [5. 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/) |
| 9月中 | 华为云一面 | [217. 存在重复元素](https://leetcode.cn/problems/contains-duplicate/) |
| 9月中 | 华为云二面 | 二进制补码数组转十进制 |
| 9月初 | 后端通软一面 | [面试题 17.24. 最大子矩阵](https://leetcode.cn/problems/max-submatrix-lcci/) |
| 9月初 | 流程IT一面 | [14. 最长公共前缀](https://leetcode.cn/problems/longest-common-prefix/) |
| 9月初 | 终端一面 | [56. 合并区间](https://leetcode.cn/problems/merge-intervals/) + [200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/) |
| 9月初 | 终端通软一面 | [415. 字符串相加](https://leetcode.cn/problems/add-strings/) |
| 9月 | 终端BG一面 | [1985. 找出数组中的第K大整数](https://leetcode.cn/problems/find-the-kth-largest-integer-in-the-array/) |
| 9月 | 终端BG二面 | [64. 最小路径和](https://leetcode.cn/problems/minimum-path-sum/) |
| 9月底 | 终端软件部二面 | [LCR 138. 有效数字](https://leetcode.cn/problems/biao-shi-shu-zhi-de-zi-fu-chuan-lcof/) |
| 9月初 | ICT计算产品线 | [994. 腐烂的橘子](https://leetcode.cn/problems/rotting-oranges/) + [91. 解码方法](https://leetcode.cn/problems/decode-ways/) + [678. 有效的括号字符串](https://leetcode.cn/problems/valid-parenthesis-string/) + [316. 去除重复字母](https://leetcode.cn/problems/remove-duplicate-letters/) |
| 9月中 | ICT光产品线二面 | 十进制小数转任意 m 进制 |

#### 其他方向

| 时间 | 面试轮次 | 题目 |
|------|----------|------|
| 9月下 | 嵌入式一面 | 提取合法 MAC 地址并计数 |
| 9月下 | 嵌入式二面 | [2094. 找出3位偶数](https://leetcode.cn/problems/finding-3-digit-even-numbers/) |
| 10月中 | 一面 | [704. 二分查找](https://leetcode.cn/problems/binary-search/) |
| 10月中 | 二面 | [21. 合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/) |
| 9月初 | ICT光产品线一面 | [223. 矩形面积](https://leetcode.cn/problems/rectangle-area/) |
| 9月初 | ICT光产品线二面 | [134. 加油站](https://leetcode.cn/problems/gas-station/) |

---

## 10 天备考速通规划

> 刷题顺序按手撕高频考点从高到低排列。AI 岗与非 AI 岗共用 Day 1~9，AI 岗额外完成 Day 10。刷题注重质量，一定自己写一遍代码。刷得快可以一天多个 Day，刷得慢适当抛弃 Hard 题。

### Day 1：哈希 + 数组技巧 + 矩阵

| 知识点 | 题解/教程 |
|--------|----------|
| 哈希 | [Hot 100 哈希专题](https://codefun2000.com/codenote/hot100/P0017) |
| 普通数组 - 数组技巧 | [Hot 100 数组技巧](https://codefun2000.com/codenote/hot100/P0019) |
| 矩阵四题 | [Hot 100 矩阵专题](https://codefun2000.com/codenote/hot100/P0021) |

### Day 2：栈与双指针

| 知识点 | 题解/教程 |
|--------|----------|
| 栈 - 基础题 | [Hot 100 栈基础](https://codefun2000.com/codenote/hot100/P0030) |
| 单调栈 | [Hot 100 单调栈](https://codefun2000.com/codenote/hot100/P0032) |
| 双指针 - 快慢指针 | [Hot 100 快慢指针](https://codefun2000.com/codenote/hot100/P0015) |
| 双指针 - 同向双指针 | [Hot 100 同向双指针](https://codefun2000.com/codenote/hot100/P0016) |
| 双指针 - 相向双指针 | [Hot 100 相向双指针](https://codefun2000.com/codenote/hot100/P0013) |

### Day 3：回溯

| 知识点 | 题解/教程 |
|--------|----------|
| 组合型回溯 | [Hot 100 组合回溯](https://codefun2000.com/codenote/hot100/P0022) |
| 排列型回溯 | [Hot 100 排列回溯](https://codefun2000.com/codenote/hot100/P0024#leetcode-46.-%E5%85%A8%E6%8E%92%E5%88%97) |

### Day 4：BFS + 动态规划基础

| 知识点 | 题解/教程 |
|--------|----------|
| 图论基础 | [Hot 100 图论基础](https://codefun2000.com/codenote/hot100/P0034) |
| BFS 入门 | [Hot 100 BFS 入门](https://codefun2000.com/codenote/hot100/P0035) |
| 动态规划入门 | [Hot 100 DP 入门](https://codefun2000.com/codenote/hot100/P0025) |

### Day 5：动态规划进阶

| 知识点 | 题解/教程 |
|--------|----------|
| 背包模型 | [Hot 100 背包模型](https://codefun2000.com/codenote/hot100/P0027) |
| 多维动态规划 | [Hot 100 多维 DP](https://codefun2000.com/codenote/hot100/P0028) |

### Day 6：贪心 + 二叉树基础

| 题目 | 链接 |
|------|------|
| LC 121. 买卖股票的最佳时机 | [LeetCode](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/) |
| LC 55. 跳跃游戏 | [LeetCode](https://leetcode.cn/problems/jump-game/) |
| LC 45. 跳跃游戏 II | [LeetCode](https://leetcode.cn/problems/jump-game-ii/) |
| LC 763. 划分字母区间 | [LeetCode](https://leetcode.cn/problems/partition-labels/) |
| LC 94. 二叉树的中序遍历 | [LeetCode](https://leetcode.cn/problems/binary-tree-inorder-traversal/) |
| LC 104. 二叉树的最大深度 | [LeetCode](https://leetcode.cn/problems/maximum-depth-of-binary-tree/) |
| LC 102. 二叉树的层序遍历 | [LeetCode](https://leetcode.cn/problems/binary-tree-level-order-traversal/) |

### Day 7：二分查找与堆

| 题目 | 链接 |
|------|------|
| LC 704. 二分查找 | [LeetCode](https://leetcode.cn/problems/binary-search/) |
| LC 35. 搜索插入位置 | [LeetCode](https://leetcode.cn/problems/search-insert-position/) |
| LC 34. 排序数组中查找元素的首尾位置 | [LeetCode](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/) |
| LC 33. 搜索旋转排序数组 | [LeetCode](https://leetcode.cn/problems/search-in-rotated-sorted-array/) |
| LC 153. 旋转排序数组的最小值 | [LeetCode](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/) |
| LC 215. 数组中的第K个最大元素 | [LeetCode](https://leetcode.cn/problems/kth-largest-element-in-an-array/) |
| LC 347. 前K个高频元素 | [LeetCode](https://leetcode.cn/problems/top-k-frequent-elements/) |
| LC 703. 数据流中的第K大元素 | [LeetCode](https://leetcode.cn/problems/kth-largest-element-in-a-stream/) |

### Day 8：技巧 + 数学

| 题目 | 链接 |
|------|------|
| LC 136. 只出现一次的数字 | [LeetCode](https://leetcode.cn/problems/single-number/) |
| LC 169. 多数元素 | [LeetCode](https://leetcode.cn/problems/majority-element/) |
| LC 287. 寻找重复数 | [LeetCode](https://leetcode.cn/problems/find-the-duplicate-number/) |
| LC 238. 除自身以外数组的乘积 | [LeetCode](https://leetcode.cn/problems/product-of-array-except-self/) |
| LC 75. 颜色分类 | [LeetCode](https://leetcode.cn/problems/sort-colors/) |

### Day 9：链表

| 题目 | 链接 |
|------|------|
| LC 206. 反转链表 | [LeetCode](https://leetcode.cn/problems/reverse-linked-list/) |
| LC 141. 环形链表 | [LeetCode](https://leetcode.cn/problems/linked-list-cycle/) |
| LC 142. 环形链表 II | [LeetCode](https://leetcode.cn/problems/linked-list-cycle-ii/) |
| LC 21. 合并两个有序链表 | [LeetCode](https://leetcode.cn/problems/merge-two-sorted-lists/) |
| LC 2. 两数相加 | [LeetCode](https://leetcode.cn/problems/add-two-numbers/) |
| LC 19. 删除链表的倒数第N个结点 | [LeetCode](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/) |
| LC 234. 回文链表 | [LeetCode](https://leetcode.cn/problems/palindrome-linked-list/) |
| LC 160. 相交链表 | [LeetCode](https://leetcode.cn/problems/intersection-of-two-linked-lists/) |

### Day 10：AI 岗专题（非 AI 岗跳过）

| 方向 | 题目 | 题解 |
|------|------|------|
| 机器学习 | 手撕 KMeans | [题解](https://codefun2000.com/codenote/coding/P4483) |
| 机器学习 | 手撕 KNN | [题解](https://codefun2000.com/codenote/coding/P4499) |
| 机器学习 | 手撕线性回归 | [题解](https://codefun2000.com/codenote/coding/P4484) |
| 深度学习 | 手撕反向传播 | [题解](https://codefun2000.com/codenote/coding/P4486) |
| 深度学习 | SoftMax 计算 | [题解](https://codefun2000.com/codenote/coding/P4501) |
| Transformer | Self-Attention 机制 | [题解](https://codefun2000.com/codenote/coding/P4489) |
| Transformer | 多头注意力机制 (MHA) | [题解](https://codefun2000.com/codenote/coding/P4496) |

### 必备前置知识

| 主题 | 链接 |
|------|------|
| 华为面试基本流程 | [流程详解](https://codefun2000.com/codenote/hw_note/P4512) |
| 面试手撕刷题方法论 | [方法论](https://codefun2000.com/codenote/hw_note/P5103) |
| Hot 100 速通笔记（完整） | [Hot 100 笔记](https://codefun2000.com/codenote/hot100/P0026) |

---

## 手撕代码模板（ACM 模式）

华为面试手撕是 ACM 模式，需要自己处理输入输出。面试官看重**解耦 + 抽象 + 规范命名**。

```python
import sys
input = sys.stdin.readline


class Solution:
    def solve(self, arr):
        """核心逻辑函数，与输入输出解耦"""
        # 实现算法逻辑
        return result


if __name__ == "__main__":
    sol = Solution()
    # 处理输入
    n = int(input())
    arr = list(map(int, input().split()))
    # 调用解法并输出
    print(sol.solve(arr))
```

**要点**：
- 逻辑函数与 I/O 分离，体现解耦思想
- 变量命名规范，不用单字母（除循环变量 `i, j`）
- 面试时先和面试官确认输入格式，再动手写

---

## 常见问题

| 问题 | 回答 |
|------|------|
| 撕不出来会直接挂吗？ | 综合评估。BG好+项目对口会放宽；通常有一次换题机会（换为更简单的 Easy 题） |
| 手撕是 ACM 还是核心代码模式？ | 线上是 ACM 模式（自行写+跑样例）；线下白板编程相对宽松 |
| 代码规范重要吗？ | 重要！面试官看重解耦+命名规范，代码不规范容易被 diss |
| 机试复盘是什么？ | 一面面试官拿到你机考代码，交流思路和设计。代码重复率高时必定出现 |

---

## 小结

1. **Top 3 必刷**：有效的括号、岛屿数量、两数之和 — 出现频次最高
2. **BFS/DFS 是华为最爱**：岛屿数量、腐烂的橘子、层序遍历反复出现
3. **栈类题高频**：有效的括号、字符串解码、每日温度、简化路径
4. **AI 岗额外准备 ML 手撕**：Self-Attention、反向传播、KMeans 是必备项
5. **ACM 模式 + 规范命名**：面试官看重代码质量，提前练好模板
