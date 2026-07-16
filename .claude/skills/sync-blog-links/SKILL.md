---
name: sync-blog-links
description: 将博客园 LeetCode 合集中的文章链接同步到 Zero2Leetcode 题目数据。适用于补充或校正 `assets/js/problems-data.js`、`assets/js/playground.js` 和 `assets/js/playground-extra/batch-*.js` 中的 `blogUrl`，并验证冲突、语法和幂等性。
---

# 同步博客园链接

将博客园合集中的 LeetCode 文章链接同步到项目已有题目。只修改 `blogUrl`，不要新增、删除或重排题目。

## 数据源

默认使用项目合集：

```text
https://www.cnblogs.com/ranxi169/collections/38522
```

用户提供其他合集地址时，以用户地址为准。使用当前环境可用的浏览器、HTTP 客户端或抓取工具读取页面；优先使用 DOM/HTML 解析器，不要用正则解析整页 HTML。合集存在分页时，跟随分页直到没有下一页。

仅接受 `https://www.cnblogs.com/` 下的文章链接。保留页面返回的有效文章 URL，不自行猜测 post ID。

## 构建映射

1. 提取每篇文章的标题和 URL。
2. 使用 `LeetCode-0*(\d+)`（忽略大小写）从标题提取题号。
3. 将题号规范化为十进制整数，构建 `{题号: URL}` 映射。
4. 记录无法解析题号的文章，不要猜测题号。
5. 同一题号出现多个不同 URL 时停止写入，列出冲突并请求用户确认；相同 URL 的重复项可去重。

## 扫描项目数据

读取以下数据源：

- `assets/js/problems-data.js`
- `assets/js/playground.js`
- 动态发现的全部 `assets/js/playground-extra/batch-*.js`

不要假定批次数量。先确认每个题号出现在哪些文件、当前是否已有 `blogUrl`，再生成三类差异：新增、更新、无需修改。

如果同一题号在不同项目文件中已有互相冲突的 `blogUrl`，先报告冲突，不要静默选择其中一个。

## 更新规则

- 只更新项目中已经存在且能按 `id` 精确匹配的题目。
- 同一题号出现在题目列表和练习详情时，更新全部对应位置。
- 保留所在文件已有的引号、缩进、字段顺序和行尾风格。
- 有 `blogUrl` 时仅替换值；没有时放在相邻的 `url` 字段之后。
- 使用精确补丁修改局部内容，不要重写整个数据文件。
- 不匹配的合集文章只进入报告，不要借此创建题目。

## 验证

修改后执行：

```bash
node --check assets/js/problems-data.js
node --check assets/js/playground.js
for file in assets/js/playground-extra/batch-*.js; do node --check "$file"; done
git diff --check
```

重新扫描所有题号并确认：

- 每个已匹配题号的 URL 与合集映射一致。
- 没有遗漏 core 或 batch 文件中的重复题目。
- 未改动 `blogUrl` 之外的题目数据。
- 再执行一次同步时不产生新差异。

## 报告

报告合集文章总数、成功解析数、新增链接、更新链接、无变化数量、项目无对应题目的文章，以及任何重复题号、URL 冲突或抓取失败。若验证失败，不要声称同步完成。
