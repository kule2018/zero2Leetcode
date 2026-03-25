# LeetCode-046：全排列，回溯的本质是“做选择，再撤销选择”

> **本题在线练习**：[LeetCode 46. 全排列 - 在线练习（免费 · 无需登录 · AI 辅助）](https://onefly.top/zero2Leetcode/playground.html?id=46)
>
> 配套刷题网站 [Zero2Leetcode](https://onefly.top/zero2Leetcode/) —— 内置本地 OJ + AI 教练，零门槛开始刷 Hot 100。

## 题目概述

给定一个不含重复元素的数组 `nums`，返回所有可能的全排列。

例如 `nums = [1,2,3]`，答案包含：

- `[1,2,3]`
- `[1,3,2]`
- `[2,1,3]`
- ...

## 核心思路：回溯（DFS）把“排列”拆成逐位填充

“全排列”可以理解为：从左到右依次确定每个位置放哪个数。

在第 `k` 个位置：

- 可选的数字是“还没有用过”的数字
- 每选一个，就递归去填下一位
- 递归回来后要把选择撤销（恢复现场），继续尝试其他数字

这就是典型回溯模板：

1. 选择
2. 递归
3. 撤销

## 代码实现（Python，可直接提交）

```python
from typing import List


class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        n = len(nums)
        used = [False] * n
        path = []
        res = []

        def dfs():
            if len(path) == n:
                res.append(path[:])
                return

            for i in range(n):
                if used[i]:
                    continue
                used[i] = True
                path.append(nums[i])
                dfs()
                path.pop()
                used[i] = False

        dfs()
        return res
```

## 逐行拆解：为什么要 `path[:]` 复制？

`path` 在整个 DFS 过程中会不断变化。如果把 `path` 直接塞进 `res`，最后 `res` 里会全指向同一个列表对象。

因此到达叶子节点时必须存一份快照：`res.append(path[:])`。

## 手动模拟：`[1,2,3]` 的前几步怎么走？

初始 `path=[]`：

1. 选 1 => `path=[1]`
   - 再选 2 => `path=[1,2]`
     - 再选 3 => `path=[1,2,3]` 收集一个结果
     - 回退：撤销 3 => `path=[1,2]`
   - 回退：撤销 2 => `path=[1]`
   - 再选 3 => `path=[1,3]`
     - 再选 2 => `path=[1,3,2]` 收集一个结果
2. 回退到根，换第一个位置选 2、选 3，流程同理

全排列的“树”就是把每一层的选择列出来。

## 复杂度分析

- 时间复杂度：`O(n * n!)`
  - 一共有 `n!` 个排列
  - 每个排列需要 `O(n)` 拷贝进结果
- 空间复杂度：`O(n)`（递归栈 + used + path，不含输出）

## 总结

全排列背下来没意义，真正要掌握的是回溯的固定模式：用 `used` 控制“哪些数还可选”，用 `path` 表示“当前已经选了什么”，每次递归回来一定撤销选择，让下一条分支不受影响。

