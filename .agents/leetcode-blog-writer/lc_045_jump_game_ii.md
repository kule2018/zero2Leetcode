# LeetCode-045：跳跃游戏 II，用分层贪心求最少步数

> **本题在线练习**：LeetCode 45. 跳跃游戏 II - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=45)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) - 内置本地 OJ + AI 教练，零门槛开刷 Hot 100。

## 题目概述

给定数组 `nums`，`nums[i]` 表示从下标 `i` 最多能向右跳多少步。保证一定能到达最后一个下标，求到达末尾的**最少跳跃次数**。

## 核心思路：按“步数层”推进（类似 BFS 的层序）

和 LeetCode-055 不同，这题要最少步数。

一个很有用的视角是：把所有能在 1 步内到达的位置看作第一层，2 步内到达的位置看作第二层……这就像 BFS 的层序遍历。

在一维数组里，可以用贪心把“层”压缩成两个边界：

- `cur_end`：当前这一步能覆盖到的最远边界（当前层的右边界）
- `next_far`：在当前层内扫描时，能为下一步带来的最远可达
- `steps`：用了多少步

遍历 `i` 从 0 到 `n-2`：

- 更新 `next_far = max(next_far, i + nums[i])`
- 当 `i == cur_end`，说明当前层扫描完了，必须跳一步进入下一层：
  - `steps += 1`
  - `cur_end = next_far`

## 代码实现

```python
from typing import List


class Solution:
    def jump(self, nums: List[int]) -> int:
        n = len(nums)
        steps = 0
        cur_end = 0
        next_far = 0

        for i in range(n - 1):
            next_far = max(next_far, i + nums[i])
            if i == cur_end:
                steps += 1
                cur_end = next_far

        return steps
```

## 逐行拆解

### 1）为什么遍历到 `n-2`

最后一个位置不需要再“跳出去”，所以遍历到 `n-2` 即可。

### 2）为什么 `i == cur_end` 时要加一步

`cur_end` 表示“当前已用 steps 步能够覆盖到的最远右边界”。当 `i` 走到这个边界，说明当前步数能到达的所有位置都扫描完了，下一步必须开始。

此时用 `next_far` 把下一层的边界确定下来。

## 手动模拟

`nums = [2,3,1,1,4]`

- 初始：steps=0, cur_end=0, next_far=0
- i=0: next_far=max(0,0+2)=2；i==cur_end -> steps=1, cur_end=2
- i=1: next_far=max(2,1+3)=4
- i=2: next_far=max(4,2+1)=4；i==cur_end -> steps=2, cur_end=4
- 结束，steps=2

## 复杂度分析

- 时间复杂度：`O(n)`
- 空间复杂度：`O(1)`

## 总结

“跳跃游戏 II”的贪心要点是把数组按步数分层：

> 在当前层内尽量计算下一层的最远覆盖 `next_far`，当走到当前层边界 `cur_end` 时，步数 +1 并把边界推进到 `next_far`。

这套“层推进”思路本质上是把 BFS 的层序思想写成了 O(1) 额外空间的扫描算法。

