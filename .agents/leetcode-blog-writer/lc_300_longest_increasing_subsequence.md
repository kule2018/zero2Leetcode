# LeetCode-300：最长递增子序列，从 O(n^2) 到 O(n log n) 的关键一步

> **本题在线练习**：LeetCode 300. 最长递增子序列 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=300)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) - 内置本地 OJ + AI 教练，零门槛开刷 Hot 100。

## 题目概述

给定整数数组 `nums`，返回其中**最长严格递增子序列**（LIS）的长度。

子序列不要求连续，只要求保持原有相对顺序。

例如：

- 输入：`nums = [10,9,2,5,3,7,101,18]`
- 输出：`4`（最长递增子序列为 `[2,3,7,101]`）


## 核心思路一：经典 DP（O(n^2)）

最直观的想法是：以每个位置结尾的 LIS 有多长？

定义：

- `dp[i]`：以 `nums[i]` 结尾的最长递增子序列长度

初始化：`dp[i] = 1`（至少包含自己）

转移：

枚举 `j < i`，如果 `nums[j] < nums[i]`，那么可以把 `nums[i]` 接到以 `j` 结尾的序列后面：

```
dp[i] = max(dp[i], dp[j] + 1)
```

答案是 `max(dp)`。

### 代码实现（DP 版）

```python
from typing import List


class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        n = len(nums)
        if n == 0:
            return 0

        dp = [1] * n
        ans = 1

        for i in range(n):
            for j in range(i):
                if nums[j] < nums[i]:
                    dp[i] = max(dp[i], dp[j] + 1)
            ans = max(ans, dp[i])

        return ans
```

## 核心思路二：贪心 + 二分（O(n log n)）

更高效的写法不再直接维护“每个 i 的答案”，而是维护一个数组 `tails`：

- `tails[len-1]` 表示：**长度为 len 的递增子序列**中，结尾元素能取得的最小值

为什么存“最小结尾”有意义？

- 结尾越小，越容易在后面接上更大的数，未来的扩展空间越大

处理每个数 `x` 时：

- 在 `tails` 里找到第一个 `>= x` 的位置 `pos`（二分）
- 用 `x` 去更新 `tails[pos]`（把结尾变小，给未来留空间）
- 如果 `x` 比所有结尾都大，则 `tails` 追加 `x`，LIS 长度 +1

### 代码实现（贪心 + 二分）

```python
from bisect import bisect_left
from typing import List


class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        tails: List[int] = []
        for x in nums:
            pos = bisect_left(tails, x)
            if pos == len(tails):
                tails.append(x)
            else:
                tails[pos] = x
        return len(tails)
```

## 逐行拆解（二分版）

```python
pos = bisect_left(tails, x)
```

`bisect_left` 找到第一个 `>= x` 的下标，这样替换后仍然保持 `tails` 有序。

- 替换：不改变“长度”，但让某个长度的结尾更小
- 追加：说明 `x` 可以接在当前最长序列后面，让长度变长

## 手动模拟

以 `nums = [10, 9, 2, 5, 3, 7, 101, 18]` 为例，`tails` 变化：

1. 10 -> [10]
2. 9  -> [9]       (替换 10)
3. 2  -> [2]
4. 5  -> [2, 5]
5. 3  -> [2, 3]    (替换 5)
6. 7  -> [2, 3, 7]
7. 101-> [2, 3, 7, 101]
8. 18 -> [2, 3, 7, 18] (替换 101)

最终长度是 4。

## 复杂度分析

- DP 版：时间 `O(n^2)`，空间 `O(n)`
- 二分版：时间 `O(n log n)`，空间 `O(n)`

## 总结

LIS 的两套主流解法都值得掌握：

- `dp[i]` 思路最直观，适合入门和衍生问题
- `tails + 二分` 的本质是“用最小结尾保留最大扩展空间”，把复杂度降到 `O(n log n)`

理解 `tails[len-1]` 表示“长度为 len 的递增子序列最小结尾”，就能真正掌握这题的进阶写法。

