# LeetCode-347：前 K 个高频元素，两种主流做法：堆 or 桶

> **本题在线练习**：LeetCode 347. 前 K 个高频元素 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=347)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) - 内置本地 OJ + AI 教练，零门槛开刷 Hot 100。

## 题目概述

给定整数数组 `nums` 和整数 `k`，返回出现频率前 `k` 高的元素。返回顺序不做要求。

题目通常要求优于 `O(n log n)` 的排序解法。

## 核心思路：先计数，再“按频率取前 K”

第一步永远是计数：

- `cnt[x]`：元素 `x` 出现次数

第二步才是“取前 K”，主流有两种：

1. **小根堆**：维护大小为 `k` 的堆，复杂度 `O(n log k)`
2. **桶排序思想**：按频率分桶，从高频往低频扫，复杂度 `O(n)`

这里给出更直观、也更快的桶做法。

## 代码实现（桶：O(n)）

```python
from collections import Counter
from typing import List


class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        counter = Counter(nums)
        # 频率最大不超过 len(nums)
        buckets: List[List[int]] = [[] for _ in range(len(nums) + 1)]

        for x, freq in counter.items():
            buckets[freq].append(x)

        res: List[int] = []
        for freq in range(len(nums), 0, -1):
            for x in buckets[freq]:
                res.append(x)
                if len(res) == k:
                    return res

        return res
```

## 逐行拆解

1. `Counter(nums)` 得到每个元素的频率。
2. 建立 `buckets`：
   - 下标是频率 `freq`
   - `buckets[freq]` 存所有出现 `freq` 次的元素
3. 从高频到低频遍历桶，把元素加入结果，直到凑够 `k` 个。

## 备选：小根堆（O(n log k)）

当不方便建桶或数据规模较大、想更节省内存时，也可以用小根堆：

- 维护堆中存 `(freq, x)`，堆大小最多 `k`
- 新元素入堆后若超过 `k`，弹出最小频率

这部分实现略长，但思路非常固定。

## 手动模拟

`nums = [1,1,1,2,2,3]`, `k = 2`

- 计数：`1->3, 2->2, 3->1`
- 桶：
  - `buckets[3] = [1]`
  - `buckets[2] = [2]`
  - `buckets[1] = [3]`
- 从频率 6..1 扫：
  - 先拿到 `1`，再拿到 `2`，结果 `[1,2]`

## 复杂度分析

桶做法：

- 时间复杂度：`O(n)`
- 空间复杂度：`O(n)`

堆做法：

- 时间复杂度：`O(n log k)`
- 空间复杂度：`O(n)`（计数）+ `O(k)`（堆）

## 总结

这题的核心套路非常稳定：

1. 先计数（`Counter` 或哈希表）
2. 再按频率取前 `k`

如果希望严格线性时间，可以用“桶”按频率分组；如果更偏好通用方案或 `k` 很小，用堆也很好写、也很稳。

