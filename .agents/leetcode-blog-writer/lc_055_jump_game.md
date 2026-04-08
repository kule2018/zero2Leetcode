# LeetCode-055：跳跃游戏，贪心的本质是维护“最远可达”

> **本题在线练习**：LeetCode 55. 跳跃游戏 - 在线练习（免费 · 无需登录 · AI 辅助）(https://onefly.top/zero2Leetcode/playground.html?id=55)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) - 内置本地 OJ + AI 教练，零门槛开刷 Hot 100。

## 题目概述

给定数组 `nums`，`nums[i]` 表示从下标 `i` 最多能向右跳多少步。初始在 `0` 位置，问能否到达最后一个下标。

例如：

- 输入：`nums = [2,3,1,1,4]` → 输出：`true`
- 输入：`nums = [3,2,1,0,4]` → 输出：`false`


## 核心思路：一趟扫描维护最远可达位置

这题不需要 DP，贪心就够用。原因是：

只要知道“当前最远能到哪”，就能判断后面的位置是否可进入。

维护变量：

- `far`：扫描到当前位置之前，能到达的最远下标

遍历 `i`：

- 如果 `i > far`，说明当前位置根本到不了，后面更不可能到，直接 `False`
- 否则更新 `far = max(far, i + nums[i])`
- 如果 `far` 已经覆盖最后下标，返回 `True`

## 代码实现

```python
from typing import List


class Solution:
    def canJump(self, nums: List[int]) -> bool:
        far = 0
        n = len(nums)

        for i, step in enumerate(nums):
            if i > far:
                return False
            far = max(far, i + step)
            if far >= n - 1:
                return True

        return True
```

## 逐行拆解

- `if i > far: return False`
  - 这句是整题的“断点”：一旦出现不可达位置，后面全部不可达
- `far = max(far, i + step)`
  - 把“从当前位置跳出去能到的最远”并入全局最远可达

## 手动模拟

`nums = [2,3,1,1,4]`

- i=0: far=max(0,0+2)=2
- i=1: far=max(2,1+3)=4（已覆盖末尾）-> True

`nums = [3,2,1,0,4]`

- i=0: far=3
- i=1: far=max(3,3)=3
- i=2: far=max(3,3)=3
- i=3: far=max(3,3)=3
- i=4: i(4) > far(3) -> False

## 复杂度分析

- 时间复杂度：`O(n)`
- 空间复杂度：`O(1)`

## 总结

跳跃游戏的贪心并不是“随便跳”，而是把问题压缩成一个单变量：

> 扫描过程中持续维护 `far`，一旦出现 `i > far` 就失败，否则只要 `far` 覆盖末尾就成功。

这个“最远可达”模型在很多区间覆盖/可达性题目里都非常常见。

