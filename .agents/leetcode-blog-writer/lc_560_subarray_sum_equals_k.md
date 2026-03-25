# LeetCode-560：和为 K 的子数组，前缀和 + 哈希表，把"连续子数组求和"变成"两数之差"

> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开刷 Hot 100。

## 一、题目概述

给定一个整数数组 `nums` 和一个整数 `k`，请你统计并返回该数组中**和为 `k` 的连续子数组的个数**。

### 示例 1

```python
输入：nums = [1, 1, 1], k = 2
输出：2
```

解释：和为 2 的连续子数组有 `[1, 1]`（下标 0~1）和 `[1, 1]`（下标 1~2），共 2 个。

---

### 示例 2

```python
输入：nums = [1, 2, 3], k = 3
输出：2
```

解释：和为 3 的连续子数组有 `[1, 2]` 和 `[3]`，共 2 个。

---

## 二、为什么暴力枚举不够好

最直接的想法是：枚举所有子数组，算出每个子数组的和，看是否等于 `k`。

枚举起点和终点需要 O(n^2)，再加上求和需要 O(n)，总共 O(n^3)。

即使用前缀和优化掉求和那一步，也还是 O(n^2)。

这道题的数据规模是 `n <= 20000`，O(n^2) 勉强能过，但面试中面试官一定会追问：**能不能做到 O(n)？**

答案是可以的，关键在于换一个角度看问题。

---

## 三、核心思路：前缀和 + 哈希表

### 什么是前缀和

前缀和 `prefix[i]` 表示数组前 `i` 个元素的累加和：

```text
prefix[0] = 0
prefix[1] = nums[0]
prefix[2] = nums[0] + nums[1]
prefix[3] = nums[0] + nums[1] + nums[2]
...
```

有了前缀和，任意一段连续子数组 `nums[i..j]` 的和就可以用一次减法表示：

```text
sum(nums[i..j]) = prefix[j+1] - prefix[i]
```

### 关键转化

题目要求的是：有多少对 `(i, j)` 满足 `prefix[j] - prefix[i] = k`（其中 `i < j`）。

换一下形式：

```text
prefix[i] = prefix[j] - k
```

也就是说，当我们算到 `prefix[j]` 的时候，只需要看看前面有多少个前缀和等于 `prefix[j] - k`，就知道以 `j` 结尾的、和为 `k` 的子数组有多少个。

这不就是**"两数之差"**的问题吗？用一个哈希表记录每个前缀和出现过几次，边走边查，一次遍历就能搞定。

---

## 四、代码实现

```python
class Solution:
    def subarraySum(self, nums: list[int], k: int) -> int:
        prefix_count = {0: 1}
        prefix_sum = 0
        count = 0

        for num in nums:
            prefix_sum += num
            count += prefix_count.get(prefix_sum - k, 0)
            prefix_count[prefix_sum] = prefix_count.get(prefix_sum, 0) + 1

        return count
```

---

## 五、逐行拆解

### 1. 初始化哈希表

```python
prefix_count = {0: 1}
```

`prefix_count` 用来记录每个前缀和出现的次数。

为什么一开始要放 `{0: 1}`？因为前缀和为 0 代表"还没有取任何元素"，这本身就是一个合法的起点。

举个例子：如果 `nums = [3]`，`k = 3`，那么 `prefix_sum` 走到第一个元素时变成 3。此时 `prefix_sum - k = 0`，如果哈希表里没有 0，就会漏掉 `[3]` 这个子数组。

所以 `{0: 1}` 是必须的。

---

### 2. 初始化前缀和与计数器

```python
prefix_sum = 0
count = 0
```

`prefix_sum` 是当前的累加前缀和，`count` 是满足条件的子数组总数。

---

### 3. 遍历数组

```python
for num in nums:
```

逐个处理数组中的元素。

---

### 4. 累加前缀和

```python
prefix_sum += num
```

把当前元素加到前缀和上。此时 `prefix_sum` 就等于 `nums[0] + nums[1] + ... + nums[当前下标]`。

---

### 5. 查哈希表，看有多少个合法起点

```python
count += prefix_count.get(prefix_sum - k, 0)
```

这是整道题最核心的一行。

`prefix_sum - k` 就是我们需要的"前面某个前缀和的值"。如果这个值在哈希表里出现过 `n` 次，就说明有 `n` 个不同的起点，使得从那个起点到当前位置的子数组和恰好等于 `k`。

---

### 6. 把当前前缀和记入哈希表

```python
prefix_count[prefix_sum] = prefix_count.get(prefix_sum, 0) + 1
```

当前的前缀和以后可能被后面的元素用到，所以要记录下来。

注意：这行必须放在查表之后。如果先记录再查表，就可能把"自己和自己配对"算进去，导致结果错误。

---

### 7. 返回结果

```python
return count
```

---

## 六、手动模拟

以 `nums = [1, 1, 1]`，`k = 2` 为例。

初始状态：

```text
prefix_count = {0: 1}
prefix_sum = 0
count = 0
```

### 第 1 步：处理 nums[0] = 1

```text
prefix_sum = 0 + 1 = 1
查表：prefix_sum - k = 1 - 2 = -1，哈希表里没有 -1 → count += 0
记录：prefix_count = {0: 1, 1: 1}
```

### 第 2 步：处理 nums[1] = 1

```text
prefix_sum = 1 + 1 = 2
查表：prefix_sum - k = 2 - 2 = 0，哈希表里 0 出现 1 次 → count += 1
记录：prefix_count = {0: 1, 1: 1, 2: 1}
```

此时 `count = 1`，对应子数组 `[1, 1]`（下标 0~1）。

### 第 3 步：处理 nums[2] = 1

```text
prefix_sum = 2 + 1 = 3
查表：prefix_sum - k = 3 - 2 = 1，哈希表里 1 出现 1 次 → count += 1
记录：prefix_count = {0: 1, 1: 1, 2: 1, 3: 1}
```

此时 `count = 2`，新增的子数组是 `[1, 1]`（下标 1~2）。

### 最终结果

| 步骤 | num | prefix_sum | prefix_sum - k | 查表结果 | count | prefix_count |
|------|-----|-----------|----------------|---------|-------|--------------|
| 1    | 1   | 1         | -1             | 0       | 0     | {0:1, 1:1} |
| 2    | 1   | 2         | 0              | 1       | 1     | {0:1, 1:1, 2:1} |
| 3    | 1   | 3         | 1              | 1       | 2     | {0:1, 1:1, 2:1, 3:1} |

返回 `count = 2`，与预期一致。

---

## 七、复杂度分析

### 时间复杂度：O(n)

只需要遍历数组一次。每一步做的事情都是 O(1)：累加、查哈希表、写哈希表。

总时间严格线性。

### 空间复杂度：O(n)

哈希表最多存 `n + 1` 个不同的前缀和（包括初始的 0）。

---

## 八、总结

这道题的核心思想可以用一句话概括：

> **把"连续子数组的和等于 k"转化成"两个前缀和的差等于 k"，然后用哈希表在一次遍历中完成配对。**

整个解题过程有三个关键点：

1. **前缀和的定义**：`prefix[j] - prefix[i] = sum(nums[i..j-1])`，这让"区间求和"变成了"两数之差"。

2. **哈希表的作用**：记录每个前缀和出现的次数，这样当我们走到位置 `j` 时，能 O(1) 查到前面有多少个位置 `i` 满足 `prefix[i] = prefix[j] - k`。

3. **初始值 `{0: 1}` 不能忘**：它代表"空前缀"，保证从数组开头开始的子数组也能被统计到。

最终的代码只有几行：

```python
class Solution:
    def subarraySum(self, nums: list[int], k: int) -> int:
        prefix_count = {0: 1}
        prefix_sum = 0
        count = 0

        for num in nums:
            prefix_sum += num
            count += prefix_count.get(prefix_sum - k, 0)
            prefix_count[prefix_sum] = prefix_count.get(prefix_sum, 0) + 1

        return count
```

"前缀和 + 哈希表"是一个非常经典的组合技巧。除了这道题之外，很多涉及"连续子数组"和"区间求和"的问题都可以用类似的思路来解。把这个模式真正理解透，以后遇到同类题会非常从容。
