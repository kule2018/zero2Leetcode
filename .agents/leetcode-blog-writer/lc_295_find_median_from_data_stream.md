# LeetCode-295：数据流的中位数，用两个堆把“左右两半”分开

> **本题在线练习**：LeetCode 295. 数据流的中位数 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=295)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

设计一个数据结构，支持：

- `addNum(num)`：加入一个数
- `findMedian()`：返回当前所有数的中位数

中位数定义：

- 奇数个元素：排序后中间那个
- 偶数个元素：排序后中间两个的平均值

关键要求是：不能每次都把所有元素排序，那会太慢。

## 核心思路：把数据分成“左半部分”和“右半部分”

中位数本质上只和“中间位置”有关。只要维护：

- 左半部分：所有较小的数
- 右半部分：所有较大的数

并且让两边的元素数量平衡（差不超过 1），就能在 `O(1)` 取到中位数。

用堆实现最自然：

- `small`：最大堆，保存左半部分（Python 用负号实现）
- `large`：最小堆，保存右半部分

维护不变量：

1. `len(small) == len(large)` 或 `len(small) == len(large) + 1`
2. 左半部分的最大值 `<=` 右半部分的最小值

这样：

- 如果左边多一个，中位数就是左边的最大值
- 否则，中位数是两边堆顶平均

## 代码实现（双堆）

```python
import heapq


class MedianFinder:
    def __init__(self):
        self.small = []  # max-heap via negative numbers
        self.large = []  # min-heap

    def addNum(self, num: int) -> None:
        # 1) 先放到 small（左半部分）
        heapq.heappush(self.small, -num)

        # 2) 让 small 的最大值 <= large 的最小值
        if self.large and (-self.small[0] > self.large[0]):
            x = -heapq.heappop(self.small)
            heapq.heappush(self.large, x)

        # 3) 平衡元素个数：small 可以比 large 多 1
        if len(self.small) > len(self.large) + 1:
            x = -heapq.heappop(self.small)
            heapq.heappush(self.large, x)
        elif len(self.large) > len(self.small):
            x = heapq.heappop(self.large)
            heapq.heappush(self.small, -x)

    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return float(-self.small[0])
        return (-self.small[0] + self.large[0]) / 2.0
```

## 逐行拆解：为什么要“先放 small 再修正”

把新数先放到 `small`，然后用两步修正不变量：

1. 如果 `small` 的最大值大于 `large` 的最小值，说明左右分区乱了，把 `small` 的堆顶挪到 `large`。
2. 再调整两边数量，使得 `small` 至多比 `large` 多一个。

这样每次 `addNum` 都是 `O(log n)`，但 `findMedian` 直接看堆顶就是 `O(1)`。

## 手动模拟：依次加入 [1, 2, 3, 4]

1. 加 1：
   - small=[1]，large=[]
   - median=1
2. 加 2：
   - small=[1]，large=[2]
   - median=(1+2)/2=1.5
3. 加 3：
   - small=[2,1]，large=[3]
   - median=2
4. 加 4：
   - small=[2,1]，large=[3,4]
   - median=(2+3)/2=2.5

## 复杂度分析

- `addNum`：`O(log n)`（堆操作）
- `findMedian`：`O(1)`
- 空间：`O(n)`

## 总结

这题最重要的点是：中位数只关心“中间”，不需要维护全排序。

把数据流拆成“左边最大堆 + 右边最小堆”，并保持数量平衡，就能稳定、快速地得到中位数。这也是很多“实时统计”题的通用套路。

