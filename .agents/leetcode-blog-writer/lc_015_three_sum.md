# LeetCode-015：三数之和，排序之后用双指针，难的不是找答案，而是跳过重复

## 一、题目概述

给定一个整数数组 `nums`，找出所有满足以下条件的三元组 `[nums[i], nums[j], nums[k]]`：

- `i != j`、`i != k`、`j != k`
- `nums[i] + nums[j] + nums[k] == 0`

返回所有不重复的三元组。注意，答案中不可以包含重复的三元组。

### 示例 1

```python
nums = [-1, 0, 1, 2, -1, -4]
```

输出：

```python
[[-1, -1, 2], [-1, 0, 1]]
```

---

### 示例 2

```python
nums = [0, 1, 1]
```

输出：

```python
[]
```

---

### 示例 3

```python
nums = [0, 0, 0]
```

输出：

```python
[[0, 0, 0]]
```

---

## 二、核心思路

这道题如果用暴力三重循环，时间复杂度是 O(n^3)，而且去重逻辑非常麻烦。

更好的思路是：**先排序，再固定一个数，对剩下的部分用双指针**。

具体来说：

1. 先对数组排序
2. 用一个指针 `i` 从左到右遍历，固定第一个数 `nums[i]`
3. 在 `i` 右边的区间里，用左指针 `left` 和右指针 `right` 从两端向中间逼近，寻找满足 `nums[i] + nums[left] + nums[right] == 0` 的组合

排序带来两个好处：

- 双指针可以根据当前三数之和与 0 的大小关系，决定移动哪边的指针
- 相同的值会挨在一起，方便跳过重复

---

## 三、这题最容易出错的地方：去重

这道题真正的难点不是"找到三个数加起来等于零"，而是**怎么保证结果里没有重复的三元组**。

去重发生在三个地方：

### 1. 固定数 `i` 的去重

如果 `nums[i] == nums[i - 1]`，说明当前这个值在上一轮已经作为固定数处理过了，再处理一遍只会产生重复结果，直接跳过。

```python
if i > 0 and nums[i] == nums[i - 1]:
    continue
```

### 2. 左指针 `left` 的去重

找到一组解之后，如果 `nums[left] == nums[left + 1]`，继续右移 `left`，跳过相同的值。

### 3. 右指针 `right` 的去重

找到一组解之后，如果 `nums[right] == nums[right - 1]`，继续左移 `right`，跳过相同的值。

这三处去重缺一不可，漏掉任何一个都会导致结果里出现重复三元组。

---

## 四、代码实现

```python
class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        result = []

        for i in range(len(nums) - 2):
            # 固定数去重
            if i > 0 and nums[i] == nums[i - 1]:
                continue

            # 固定数大于 0，后面不可能凑出和为 0
            if nums[i] > 0:
                break

            left = i + 1
            right = len(nums) - 1

            while left < right:
                total = nums[i] + nums[left] + nums[right]

                if total < 0:
                    left += 1
                elif total > 0:
                    right -= 1
                else:
                    result.append([nums[i], nums[left], nums[right]])

                    # 左指针去重
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    # 右指针去重
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1

                    left += 1
                    right -= 1

        return result
```

---

## 五、逐行拆解

### 1. 排序

```python
nums.sort()
```

排序是整个算法的前提。排序之后：

- 相同的数紧挨在一起，方便去重
- 双指针可以根据 `total` 的大小关系决定移动方向

---

### 2. 遍历固定数

```python
for i in range(len(nums) - 2):
```

`i` 最多到 `len(nums) - 3`，因为后面还需要至少两个位置给 `left` 和 `right`。

---

### 3. 固定数去重

```python
if i > 0 and nums[i] == nums[i - 1]:
    continue
```

如果当前固定数和上一个一样，跳过。注意条件 `i > 0` 是为了防止越界（`i == 0` 时没有上一个元素可比较）。

---

### 4. 提前终止

```python
if nums[i] > 0:
    break
```

数组已经排好序了。如果固定数 `nums[i]` 已经大于 0，那它后面的数一定也大于 0，三个正数加起来不可能等于 0，直接终止整个循环。

---

### 5. 初始化双指针

```python
left = i + 1
right = len(nums) - 1
```

`left` 从固定数的下一个位置开始，`right` 从数组末尾开始，两端向中间逼近。

---

### 6. 计算三数之和并移动指针

```python
total = nums[i] + nums[left] + nums[right]

if total < 0:
    left += 1
elif total > 0:
    right -= 1
```

- 和太小了，说明需要更大的数，左指针右移
- 和太大了，说明需要更小的数，右指针左移

这就是排序的好处：指针移动的方向和大小变化的方向完全一致。

---

### 7. 找到一组解，记录并去重

```python
else:
    result.append([nums[i], nums[left], nums[right]])

    while left < right and nums[left] == nums[left + 1]:
        left += 1
    while left < right and nums[right] == nums[right - 1]:
        right -= 1

    left += 1
    right -= 1
```

找到一组解之后：

1. 先把结果加入 `result`
2. 跳过 `left` 右边所有和当前 `left` 值相同的元素
3. 跳过 `right` 左边所有和当前 `right` 值相同的元素
4. 最后再各移动一步，进入新的一轮搜索

去重的 `while` 循环只是跳到"最后一个相同值"的位置，最后的 `left += 1` 和 `right -= 1` 才是真正移动到下一个不同值。

---

## 六、手动模拟

以 `nums = [-1, 0, 1, 2, -1, -4]` 为例。

### 第一步：排序

```
排序后：[-4, -1, -1, 0, 1, 2]
```

---

### i = 0，固定数 = -4

```
left = 1, right = 5
total = -4 + (-1) + 2 = -3 < 0 → left 右移
left = 2, right = 5
total = -4 + (-1) + 2 = -3 < 0 → left 右移
left = 3, right = 5
total = -4 + 0 + 2 = -2 < 0 → left 右移
left = 4, right = 5
total = -4 + 1 + 2 = -1 < 0 → left 右移
left = 5, left >= right，结束
```

没有找到解。

---

### i = 1，固定数 = -1

```
left = 2, right = 5
total = -1 + (-1) + 2 = 0 → 找到解 [-1, -1, 2]

去重：nums[left+1] = 0 ≠ nums[left] = -1，不跳
      nums[right-1] = 1 ≠ nums[right] = 2，不跳
left = 3, right = 4

total = -1 + 0 + 1 = 0 → 找到解 [-1, 0, 1]

去重后 left = 4, right = 3, left >= right，结束
```

---

### i = 2，固定数 = -1

`nums[2] == nums[1]`（都是 -1），触发固定数去重，跳过。

---

### i = 3，固定数 = 0

`nums[3] = 0`，不大于 0，继续。

```
left = 4, right = 5
total = 0 + 1 + 2 = 3 > 0 → right 左移
left = 4, right = 4, left >= right，结束
```

没有找到解。

---

### 最终结果

```python
[[-1, -1, 2], [-1, 0, 1]]
```

---

## 七、复杂度分析

**时间复杂度：O(n^2)**

- 排序需要 O(n log n)
- 外层循环 O(n)，内层双指针 O(n)，合计 O(n^2)
- 总体是 O(n^2)，远好于暴力的 O(n^3)

**空间复杂度：O(1)**

- 排序可以原地进行（不算输出结果占用的空间）
- 双指针只用了常数个变量

---

## 八、总结

三数之和这道题的核心套路是：**排序 + 固定一个数 + 双指针**。

排序解决了两个问题：

1. 双指针能根据和的大小关系决定移动方向
2. 相同的值紧挨在一起，方便去重

去重是这道题真正的难点，需要在三个地方分别处理：

- 固定数 `i` 和上一轮相同时跳过
- 找到解后，左指针跳过相同值
- 找到解后，右指针跳过相同值

这道题是双指针在数组问题中非常经典的应用。把"排序 + 固定一个 + 双指针扫剩余"这个模式掌握之后，后续的四数之和（LeetCode 18）等题目都可以用类似的思路扩展。
