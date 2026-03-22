## 一、题目概述

给定两个单链表的头节点 `headA` 和 `headB`，要求找出并返回它们**相交的起始节点**。如果两条链表不相交，则返回 `None`。

例如：

### 示例 1

```python
listA = [4,1,8,4,5]
listB = [5,6,1,8,4,5]
```

输出：

```python
8
```

因为两条链表从值为 `8` 的那个节点开始，共享同一段尾部。

------

### 示例 2

```python
listA = [1,9,1,2,4]
listB = [3,2,4]
```

输出：

```python
2
```

------

### 示例 3

```python
listA = [2,6,4]
listB = [1,5]
```

输出：

```python
None
```

因为这两条链表没有相交部分。

------

## 二、这题最容易误解的地方

这道题最容易误解的一点是：

> 相交，判断的不是“值相等”，而是“节点是不是同一个”。

比如两条链表里都出现了值为 `8` 的节点，并不代表它们相交。
只有当两条链表在某个位置开始，后面真正共享同一串节点时，才叫相交。

也就是说，这题判断的是：

```python
pA == pB
```

而不是：

```python
pA.val == pB.val
```

这是做对这题的前提。

------

## 三、最朴素的想法：先算长度差，再对齐

这题如果从“长度”角度想，其实并不难。

假设：

- 链表 A 长度是 `m`
- 链表 B 长度是 `n`

如果两条链表相交，那么问题的关键在于：

> 它们前面不相交的部分长度可能不同，但后面公共尾部长度一定一样。

所以很自然会想到：

1. 先分别求出两条链表长度
2. 让更长的那条先走几步
3. 这样两边距离尾部的长度就一样了
4. 再一起往后走，第一次相遇就是交点

这个思路其实完全正确。

------

## 四、长度对齐法

### 代码实现

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def get_intersection_node(headA, headB):
    def get_length(head):
        length = 0
        while head:
            length += 1
            head = head.next
        return length

    lenA = get_length(headA)
    lenB = get_length(headB)

    pA = headA
    pB = headB

    if lenA > lenB:
        for _ in range(lenA - lenB):
            pA = pA.next
    else:
        for _ in range(lenB - lenA):
            pB = pB.next

    while pA != pB:
        pA = pA.next
        pB = pB.next

    return pA
```

------

## 五、为什么长度对齐法是对的

假设：

- A 的独有部分长度是 `a`
- B 的独有部分长度是 `b`
- 公共尾部长度是 `c`

那么：

- A 总长度是 `a + c`
- B 总长度是 `b + c`

如果 `a > b`，那么 A 比 B 多出来 `a - b` 个节点。
先让 A 走掉这几步后，A 和 B 就离公共尾部一样远了。

接下来两边同步前进：

- 如果有交点，就会在交点第一次相遇
- 如果没有交点，就会同时走到 `None`

------

## 六、这题真正更巧妙的地方：不用手算长度，也能自动对齐

上面的“长度对齐法”已经很好了，但这题还有一个更巧妙的解法。

它的精髓就在于：

> 不必真的把长度算出来，也能让两个指针最终走成一样长。

这个方法就是双指针换头法。

------

## 七、双指针换头法：本质上也是在“补齐长度差”

### 代码实现

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def get_intersection_node(headA, headB):
    pA = headA
    pB = headB

    while pA != pB:
        pA = headB if pA is None else pA.next
        pB = headA if pB is None else pB.next

    return pA
```

------

## 八、这段代码为什么这么巧

初看这段代码会觉得有点神奇：

- 为什么走到头了要切到另一条链表？
- 为什么这样就能找到交点？

其实本质还是“长度对齐”，只是它不是显式计算长度差，而是通过路径切换，**自动把长度差走平**。

------

## 九、从长度角度理解双指针换头法

还是设：

- A 的独有部分长度是 `a`
- B 的独有部分长度是 `b`
- 公共尾部长度是 `c`

那么：

- A 的总长度是 `a + c`
- B 的总长度是 `b + c`

现在：

- 指针 `pA` 先走 A，再走 B
- 指针 `pB` 先走 B，再走 A

那它们总共都会走：

```text
a + c + b
b + c + a
```

也就是：

```text
a + b + c
```

长度完全相同。

因此：

- 如果两条链表有公共尾部，它们最终一定会在交点相遇
- 如果没有公共尾部，它们最终会一起走到 `None`

这就是这题最漂亮的地方。

------

## 十、手动模拟一下会更直观

以示例 1 为例：

- A: `4 -> 1 -> 8 -> 4 -> 5`
- B: `5 -> 6 -> 1 -> 8 -> 4 -> 5`

其中公共部分是：

```python
8 -> 4 -> 5
```

如果只看前半段：

- A 比 B 少一段 `5 -> 6 -> 1`
- B 比 A 多一段 `4 -> 1`

它们一开始站的位置离交点不一样远。

但当：

- `pA` 走完 A 后改走 B
- `pB` 走完 B 后改走 A

两个人都相当于把“对方前面那段独有部分”也补走了一遍。
于是长度差被抵消，最终会在交点 `8` 相遇。

------

## 十一、如果不相交会怎样

如果两条链表根本不相交，那么它们没有公共尾部。

此时：

- `pA` 会走完 A，再走完 B
- `pB` 会走完 B，再走完 A

最终两个人都会变成 `None`

因为循环条件是：

```python
while pA != pB:
```

所以当两者都为 `None` 时，循环结束，函数返回 `None`。

这也正好符合题意。

------

## 十二、为什么这题返回的是节点，不是值

这题要求返回的是：

> 相交的起始节点

不是“相交节点的值”。

例如：

```python
return pA
```

是对的。

而：

```python
return pA.val
```

不对。

虽然平台展示输出时可能显示为 `8`、`2` 这样的值，但那只是把返回的节点用值展示出来而已。
本质上应该返回的是**节点对象本身**。

------

## 十三、为什么这题最适合从“长度差”去理解

很多题解直接上双指针换头法，代码虽然短，但初学者常常会觉得跳跃大。

这题真正的理解顺序更适合这样走：

### 第一步：先想到长度对齐法

因为它最符合直觉：

- 长链表先走几步
- 两边同步
- 第一次相遇就是交点

### 第二步：再理解双指针换头法

这时候会发现：

> 原来换头法，本质上就是一种“不显式求长度的自动对齐”。

这样理解起来会顺得多。

------

## 十四、两种解法对比

### 1. 长度对齐法

```python
def get_intersection_node(headA, headB):
    def get_length(head):
        length = 0
        while head:
            length += 1
            head = head.next
        return length

    lenA = get_length(headA)
    lenB = get_length(headB)

    pA = headA
    pB = headB

    if lenA > lenB:
        for _ in range(lenA - lenB):
            pA = pA.next
    else:
        for _ in range(lenB - lenA):
            pB = pB.next

    while pA != pB:
        pA = pA.next
        pB = pB.next

    return pA
```

特点：

- 非常直观
- 容易从“长度差”角度理解
- 时间复杂度 `O(m+n)`
- 空间复杂度 `O(1)`

------

### 2. 双指针换头法

```python
def get_intersection_node(headA, headB):
    pA = headA
    pB = headB

    while pA != pB:
        pA = headB if pA is None else pA.next
        pB = headA if pB is None else pB.next

    return pA
```

特点：

- 更精炼
- 不用显式计算长度
- 本质上还是在补齐长度差
- 时间复杂度 `O(m+n)`
- 空间复杂度 `O(1)`

------

## 十五、这题真正训练的是什么

这道题表面上是在找相交节点，实际上训练的是三件事。

### 1. 学会区分“节点相同”和“值相同”

链表题里这一点非常关键。

### 2. 学会从“长度差”角度看链表问题

链表很多双指针题，核心都和路径长度、对齐有关。

### 3. 学会接受“代码短，但背后是长度思想”

双指针换头法之所以优美，不是因为它神奇，而是因为它把“补齐长度差”这件事写得非常自然。

------

## 十六、小结

“相交链表”这道题最推荐掌握的思路其实有两层。

### 第一层：长度对齐法

先算长度差，让长链表先走几步，然后同步前进。

### 第二层：双指针换头法

不显式算长度，但通过“走完一条再走另一条”，自动把两条路径走成一样长。

最经典的代码是：

```python
def get_intersection_node(headA, headB):
    pA = headA
    pB = headB

    while pA != pB:
        pA = headB if pA is None else pA.next
        pB = headA if pB is None else pB.next

    return pA
```

这段代码真正值得记住的，不只是写法，而是背后的那句话：

> 让两个指针都走完 A+B 这两段路，长度差自然就被补齐了。

------

## 十七、结尾

这道题是链表题里非常有代表性的一道。

它会让人第一次真正体会到：

- 指针不只是“往后走”
- 双指针也不只是“快慢指针”
- 有时候最巧妙的做法，本质上只是把长度差处理得更聪明

如果把这题的“长度对齐”思想真正吃透，后面很多链表双指针题都会更顺。