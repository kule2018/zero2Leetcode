---
layout: default
title: Python 基础语法
---

# 第一阶段：Python 基础语法

> 🎯 目标：掌握 Python 核心语法，为算法学习打下基础  
> ⏱️ 预计时间：1-2 周

---

## 📚 01. 变量与数据类型

### 基本数据类型

```python
# 整数 int
age = 25
negative = -10
big_number = 1_000_000  # 可用下划线分隔，提高可读性

# 浮点数 float
price = 19.99
pi = 3.14159

# 字符串 str
name = "Alice"
greeting = 'Hello, World!'
multiline = """
这是一个
多行字符串
"""

# 布尔值 bool
is_valid = True
is_empty = False

# None 类型（表示空值）
result = None
```

### 类型转换

```python
# 字符串转整数
num_str = "123"
num_int = int(num_str)

# 整数转字符串
age_str = str(25)

# 字符串转浮点数
price_float = float("19.99")

# 数值转布尔值
# 0, 0.0, "", [], {}, None 转为 False，其他转为 True
bool(0)      # False
bool(1)      # True
bool("")     # False
bool("hello") # True
```

### 字符串操作（刷题常用！）

```python
s = "hello world"

# 长度
len(s)          # 11

# 索引访问
s[0]            # 'h' 第一个字符
s[-1]           # 'd' 最后一个字符

# 切片
s[0:5]          # 'hello' 前5个字符
s[6:]           # 'world' 第6个到结尾
s[::-1]         # 'dlrow olleh' 反转字符串

# 分割与连接
words = s.split(" ")      # ['hello', 'world']
"-".join(words)           # 'hello-world'

# 替换与查找
s.replace("world", "python")  # 'hello python'
s.find("world")               # 6

# 大小写
s.upper()       # 'HELLO WORLD'
s.lower()       # 'hello world'

# 去空格
"  hello  ".strip()  # 'hello'

# 判断
"abc".isalpha()      # True
"123".isdigit()      # True
```

---

## 📚 02. 控制流

```python
# 条件语句
if x > 0:
    print("正数")
elif x < 0:
    print("负数")
else:
    print("零")

# for 循环
for i in range(5):      # 0, 1, 2, 3, 4
    print(i)

for item in [1, 2, 3]:  # 遍历列表
    print(item)

# while 循环
while condition:
    # do something
    if should_stop:
        break       # 跳出循环
    if should_skip:
        continue    # 跳过本次
```

---

## 📚 03. 函数

```python
# 基本函数
def add(a, b):
    return a + b

# 默认参数
def greet(name, msg="Hello"):
    return f"{msg}, {name}!"

# Lambda 表达式
square = lambda x: x ** 2

# 常用于排序
arr = [(1, 2), (3, 1), (2, 3)]
arr.sort(key=lambda x: x[1])  # 按第二个元素排序
```

---

## 📚 04. 集合类型

### 列表 list

```python
# 创建
nums = [1, 2, 3, 4, 5]

# 添加
nums.append(6)          # 末尾添加
nums.insert(0, 0)       # 指定位置插入

# 删除
nums.pop()              # 删除末尾
nums.pop(0)             # 删除指定索引
nums.remove(3)          # 删除指定值

# 列表推导式（非常重要！）
squares = [x**2 for x in range(5)]        # [0, 1, 4, 9, 16]
evens = [x for x in range(10) if x % 2 == 0]  # [0, 2, 4, 6, 8]
```

### 字典 dict

```python
# 创建
person = {"name": "Alice", "age": 25}

# 访问
person["name"]              # 'Alice'
person.get("city", "Unknown")  # 默认值

# 遍历
for key, value in person.items():
    print(key, value)

# 计数模式（刷题常用！）
from collections import Counter
count = Counter(['a', 'b', 'a', 'c', 'a', 'b'])
# Counter({'a': 3, 'b': 2, 'c': 1})
```

### 集合 set

```python
# 从列表创建（去重）
nums = [1, 2, 2, 3, 3, 3]
unique = set(nums)  # {1, 2, 3}

# 集合运算
a = {1, 2, 3}
b = {2, 3, 4}
a | b   # 并集 {1, 2, 3, 4}
a & b   # 交集 {2, 3}
a - b   # 差集 {1}
```

---

## 🔥 刷题必备技巧

```python
# 1. enumerate - 同时获取索引和值
for i, val in enumerate(arr):
    print(f"索引 {i}: 值 {val}")

# 2. zip - 并行遍历多个列表
for a, b in zip(list1, list2):
    print(a, b)

# 3. sorted 与 key 参数
sorted(arr, key=lambda x: x[1], reverse=True)

# 4. 字典 get 方法 - 安全访问
count = d.get(key, 0)  # 不存在返回默认值 0

# 5. collections 模块
from collections import Counter, defaultdict, deque
counter = Counter(arr)  # 计数器
dd = defaultdict(list)  # 默认值字典
dq = deque()            # 双端队列
```

---

## 📝 练习题

```python
# 练习1: 将字符串 "12345" 转换为整数并求和
s = "12345"
total = sum(int(c) for c in s)  # 15

# 练习2: 判断一个字符串是否是回文
def is_palindrome(s):
    return s == s[::-1]

is_palindrome('racecar')  # True
is_palindrome('hello')    # False

# 练习3: 统计字符串中每个字符出现的次数
s = "aabbccc"
count = {}
for c in s:
    count[c] = count.get(c, 0) + 1
# {'a': 2, 'b': 2, 'c': 3}
```

---

[← 返回首页]({{ '/' | relative_url }}) | [下一章：数据结构 →]({{ '/01_data_structures/' | relative_url }})
