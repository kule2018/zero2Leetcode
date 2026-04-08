# LeetCode-152：乘积最大子数组，为什么要同时维护“最大”和“最小”

> **本题在线练习**：LeetCode 152. 乘积最大子数组 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=152)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) - 内置本地 OJ + AI 教练，零门槛开刷 Hot 100。

## 题目概述

给定整数数组 `nums`，返回**乘积最大**的连续子数组的乘积。

这题和“最大子数组和”类似，但乘法会遇到一个关键点：**负数会翻转大小关系**。

例如：

- 输入：`nums = [2,3,-2,4]`
- 输出：`6`（子数组 `[2,3]` 的乘积最大）


## 核心思路：同时维护以 i 结尾的最大乘积和最小乘积

如果只维护“最大乘积”，会漏掉这样的情况：

- 当前数是负数，乘上“之前最小的负数”反而变成最大正数

因此需要两个状态：

- `max_end`：以当前位置结尾的最大乘积
- `min_end`：以当前位置结尾的最小乘积

当处理当前值 `x` 时，有三种可能的“以当前位置结尾”的子数组：

1. 只取自己：`x`
2. 接在之前最大后：`max_end * x`
3. 接在之前最小后：`min_end * x`

于是：

```
new_max = max(x, max_end * x, min_end * x)
new_min = min(x, max_end * x, min_end * x)
```

答案是过程中的 `max_end` 最大值。

## 代码实现（滚动 DP）

```python
from typing import List


class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        max_end = nums[0]
        min_end = nums[0]
        ans = nums[0]

        for i in range(1, len(nums)):
            x = nums[i]
            a = max_end * x
            b = min_end * x

            max_end = max(x, a, b)
            min_end = min(x, a, b)
            ans = max(ans, max_end)

        return ans
```

## 逐行拆解

```python
a = max_end * x
b = min_end * x
max_end = max(x, a, b)
min_end = min(x, a, b)
```

- `a` 表示“把 x 接到之前最大乘积子数组后面”
- `b` 表示“把 x 接到之前最小乘积子数组后面”
- 对于最大乘积来说，`b` 也可能成为最大（当 `x` 为负数且 `min_end` 为负数）
- 对于最小乘积来说，`a` 也可能成为最小（同理）

## 手动模拟

以 `nums = [2, 3, -2, 4]`：

- 初始：`max_end=min_end=ans=2`
- `x=3`：
  - `a=6, b=6`
  - `max_end=6, min_end=3, ans=6`
- `x=-2`：
  - `a=-12, b=-6`
  - `max_end=-2, min_end=-12, ans=6`
- `x=4`：
  - `a=-8, b=-48`
  - `max_end=4, min_end=-48, ans=6`

答案是 6（子数组 `[2,3]`）。

再看一个容易翻车的例子 `nums = [-2, 3, -4]`：

- 初始：`max_end=min_end=-2`
- `x=3`：`max_end=3, min_end=-6`
- `x=-4`：`max_end = max(-4, 3*-4=-12, -6*-4=24) = 24`

最大乘积来自“负负得正”的翻转。

## 复杂度分析

- 时间复杂度：`O(n)`
- 空间复杂度：`O(1)`

## 总结

这题的精髓只有一句话：

> 乘法遇到负数会翻转大小，所以必须同时维护“最大积”和“最小积”。

掌握 `max_end/min_end` 这对状态后，乘积类的 DP 题会变得非常套路化，不容易被符号变化绕晕。

