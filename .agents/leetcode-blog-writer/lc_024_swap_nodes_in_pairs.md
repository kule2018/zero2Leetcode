# LeetCode-024：两两交换链表中的节点，交换的不是"值"而是"指针指向"，一个哑节点就能统一所有情况

## 一、题目概述

给定一个链表，两两交换其中相邻的节点，并返回交换后的链表头节点。

注意：不能只是单纯地改变节点内部的值，而是需要实际进行节点交换。

### 示例 1

```
输入：1 -> 2 -> 3 -> 4
输出：2 -> 1 -> 4 -> 3
```

---

### 示例 2

```
输入：（空链表）
输出：（空链表）
```

---

### 示例 3

```
输入：1
输出：1
```

只有一个节点，凑不成一对，原样返回。

---

## 二、核心思路

这题的本质是：每次取出相邻的两个节点，把它们的前后顺序互换，然后继续处理下一对。

关键在于两点：

### 1. 用哑节点（dummy node）统一处理头节点

交换的时候，前一对的尾节点要指向下一对交换后的新头。但第一对前面没有节点，头节点交换后链表的起点就变了。

如果在链表前面加一个"假的头节点" `dummy`，让它的 `next` 指向 `head`，那么所有的交换操作都可以用同一套逻辑来处理，不用单独处理第一对。

### 2. 每次交换需要调整三根指针

假设当前指针 `prev` 指向一对节点的前一个节点，要交换的两个节点分别是 `first` 和 `second`：

```
prev -> first -> second -> (后面的节点)
```

交换后要变成：

```
prev -> second -> first -> (后面的节点)
```

需要做三步：

1. `prev.next = second` — 前驱指向第二个节点
2. `first.next = second.next` — 第一个节点指向第二个节点原来的后继
3. `second.next = first` — 第二个节点指向第一个节点

然后 `prev` 移动到 `first`（交换后它排在后面），继续处理下一对。

---

## 三、代码实现

```python
class Solution:
    def swapPairs(self, head: ListNode) -> ListNode:
        dummy = ListNode(0)
        dummy.next = head
        prev = dummy

        while prev.next and prev.next.next:
            first = prev.next
            second = prev.next.next

            prev.next = second
            first.next = second.next
            second.next = first

            prev = first

        return dummy.next
```

---

## 四、逐行拆解

### 1. 创建哑节点

```python
dummy = ListNode(0)
dummy.next = head
prev = dummy
```

`dummy` 是一个值无所谓的假节点，它的 `next` 指向真正的链表头。`prev` 从 `dummy` 出发，始终指向当前这一对节点的前一个位置。

---

### 2. 循环条件：后面还有至少两个节点

```python
while prev.next and prev.next.next:
```

交换需要两个节点。如果 `prev` 后面只剩 0 个或 1 个节点，就不够一对，停止交换。

---

### 3. 拿出要交换的两个节点

```python
first = prev.next
second = prev.next.next
```

`first` 是这一对里原本排在前面的，`second` 是排在后面的。交换后 `second` 要到前面去。

---

### 4. 三步指针调整

```python
prev.next = second
first.next = second.next
second.next = first
```

- 第一步：让 `prev` 指向 `second`，把 `second` 提到前面
- 第二步：让 `first` 接管 `second` 原来的后继（即下一对的第一个节点）
- 第三步：让 `second` 指向 `first`，完成这一对的翻转

这三步的顺序很重要。如果先执行 `second.next = first`，那 `second.next`（也就是下一对的入口）就丢了。

---

### 5. 移动 prev，处理下一对

```python
prev = first
```

交换后 `first` 排在这一对的后面，它就是下一对的"前驱"，所以 `prev` 移到 `first`。

---

### 6. 返回新的头节点

```python
return dummy.next
```

`dummy.next` 始终指向交换后的链表头。原来的 `head` 可能已经不在第一个位置了（比如 `[1,2]` 交换后头变成了 `2`），所以不能直接返回 `head`。

---

## 五、手动模拟

以 `[1, 2, 3, 4]` 为例：

初始状态：

```
dummy -> 1 -> 2 -> 3 -> 4
prev = dummy
```

### 第一轮：交换 1 和 2

```
first = 1, second = 2

prev.next = 2       → dummy -> 2
first.next = 3      → 1 -> 3
second.next = 1     → 2 -> 1

结果：dummy -> 2 -> 1 -> 3 -> 4
prev 移到 1
```

### 第二轮：交换 3 和 4

```
first = 3, second = 4

prev.next = 4       → 1 -> 4
first.next = None   → 3 -> None
second.next = 3     → 4 -> 3

结果：dummy -> 2 -> 1 -> 4 -> 3 -> None
prev 移到 3
```

### 循环结束

`prev.next = None`，不满足 `prev.next and prev.next.next`，退出。

最终返回 `dummy.next`，即 `2 -> 1 -> 4 -> 3`。

---

## 六、递归写法（附加）

这题也可以用递归来做，思路更简洁：

```python
class Solution:
    def swapPairs(self, head: ListNode) -> ListNode:
        if not head or not head.next:
            return head

        first = head
        second = head.next

        first.next = self.swapPairs(second.next)
        second.next = first

        return second
```

每次递归处理一对：把 `second` 提前，`first` 的 `next` 指向后面递归处理完的结果。递归到链表末尾（0 个或 1 个节点）时直接返回。

递归写法更短，但迭代写法在面试中更常见，因为不会有栈溢出的风险，也更容易解释指针操作的细节。

---

## 七、复杂度分析

**时间复杂度：O(n)**

链表中每个节点最多被访问一次，总共遍历 n/2 对，每对做常数次指针操作。

**空间复杂度：O(1)**（迭代写法）

只用了 `dummy`、`prev`、`first`、`second` 几个变量，不随链表长度增长。

递归写法的空间复杂度是 O(n/2) = O(n)，因为递归调用栈的深度和链表对数成正比。

---

## 八、总结

这道题的标准解法是：

```python
class Solution:
    def swapPairs(self, head: ListNode) -> ListNode:
        dummy = ListNode(0)
        dummy.next = head
        prev = dummy

        while prev.next and prev.next.next:
            first = prev.next
            second = prev.next.next

            prev.next = second
            first.next = second.next
            second.next = first

            prev = first

        return dummy.next
```

三个要点：

- **哑节点**：在链表头前面加一个 `dummy`，避免单独处理第一对交换后头节点变化的问题
- **三步指针调整的顺序**：先把 `prev` 指向 `second`，再让 `first` 接管后续节点，最后让 `second` 指向 `first`。顺序不能乱，否则会丢失节点引用
- **prev 的移动**：交换完一对后，`prev` 移到交换后排在后面的那个节点（`first`），它就是下一对的前驱

这题是链表指针操作的经典练习。哑节点 + 多指针调整的模式在很多链表题里都会用到（比如反转链表、K 个一组翻转等），把这个模式练熟，后面的链表题会顺很多。
