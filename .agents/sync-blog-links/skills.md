# 同步博客园合集链接到项目数据

请执行以下步骤，将博客园合集中的文章链接同步到项目的题目数据文件中。

## 步骤 1：抓取合集页面

使用 WebFetch 工具访问博客园合集页：
- URL: `https://www.cnblogs.com/ranxi169/collections/38522`
- 提取所有博客文章的 **标题** 和 **URL**
- 博客 URL 格式为 `https://www.cnblogs.com/ranxi169/p/<postid>`

## 步骤 2：解析题号映射

从文章标题中提取 LeetCode 题号，构建映射表：
- 使用正则 `LeetCode-0*(\d+)` 从标题提取题号（如 "LeetCode-206 反转链表" → id: 206）
- 构建 `{id: blogUrl}` 的映射关系
- 列出所有解析到的映射

## 步骤 3：读取现有数据

读取以下两个文件：
- `assets/js/problems-data.js` — 题目列表数据（index.html 用）
- `assets/js/playground.js` — 在线练习数据（playground.html 用）

## 步骤 4：对比差异

找出合集中有但代码文件中缺少 `blogUrl` 的题目：
- 对比 `problems-data.js` 中各题目的 blogUrl
- 对比 `playground.js` 中各题目的 blogUrl
- 列出需要新增或更新的条目

## 步骤 5：更新文件

使用 **Edit 工具** 精确修改（不要重写整个文件）：

对于 `problems-data.js`：
- 格式示例：`{ id: 206, title: "反转链表", ..., blogUrl: "https://www.cnblogs.com/ranxi169/p/19722217" }`
- 在匹配题目的行中，在 `url: "..."` 后面添加 `, blogUrl: "<url>"`
- 如果已有 blogUrl 且不同，则更新为新值

对于 `playground.js`：
- 格式示例：`blogUrl: 'https://www.cnblogs.com/ranxi169/p/19722217',`（单独一行，单引号）
- 在匹配题目的对象中添加 `blogUrl` 字段
- 添加位置：在 `url:` 行之后

**重要**：只更新已有题目的 blogUrl，不新增题目条目。

## 步骤 6：报告结果

输出汇总：
- 合集中共有多少篇文章
- 新增了哪些 blogUrl（题号 + URL）
- 更新了哪些 blogUrl
- 哪些合集文章在项目中没有对应题目（无法匹配）
