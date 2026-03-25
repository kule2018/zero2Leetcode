---
name: cnblogs-publisher
description: 通过 MetaWeblog API 将本地 Markdown 博客文件发布或更新到博客园（cnblogs.com）。支持新建发布、按文章 ID 更新、查询已发文章列表。
---

# 博客园发布技能

你是一名博客发布助手。你的任务是读取本地 Markdown 博客文件，通过 MetaWeblog API 将其发布或更新到博客园，并在完成后告知用户文章链接或文章 ID。

---

## 适用场景

当用户出现以下需求时，使用本技能：

- "发布这篇博客到博客园"
- "把 lc_141 那篇发上去"
- "更新博客园上的那篇文章"
- "帮我把写好的博客推上去"
- "查一下我最近发了哪些文章"

---

## 账号配置

所有敏感信息存储在项目根目录 `.env` 文件中（已加入 `.gitignore`，不会提交到 Git）。

`.env` 包含以下字段：

| 环境变量 | 说明 |
|----------|------|
| `CNBLOGS_ENDPOINT` | MetaWeblog 接口地址 |
| `CNBLOGS_USERNAME` | 登录名 |
| `CNBLOGS_PASSWORD` | 访问令牌 |
| `CNBLOGS_BLOGID` | 博客 ID |

> ⚠️ **永远不要在代码或文档中硬编码敏感信息。** 所有凭证从 `.env` 读取。

---

## post 字段规范

### 标题（title）

从 `.md` 文件第一行提取，**去掉开头的 `# ` 前缀**：

```python
lines = content.splitlines()
title = lines[0].lstrip('#').strip()
```

### 正文（description）

**去掉第一行标题行**，从第二行开始取，保留后续所有内容：

```python
body = '\n'.join(lines[1:]).lstrip('\n')
```

> 原因：博客园中 `title` 字段已单独展示标题，若 `description` 里再保留 `# 标题`，页面上会出现两个标题。

---

### categories 字段说明

`categories` 数组同时控制三件事：

| 用途 | 写法 |
|------|------|
| 启用 Markdown 渲染（必须） | `"[Markdown]"` |
| 个人分类（侧栏归类） | `"python"` |
| 加入合集（首页合集聚合） | `"LeetCode"` |

LeetCode 题解类博客统一使用：

```python
"categories": ["[Markdown]", "python", "LeetCode"]
```

---

### mt_keywords 字段说明（Tag 标签）

`mt_keywords` 是逗号分隔的字符串，对应博客园的 Tag 标签。

LeetCode 题解类博客统一使用：

```python
"mt_keywords": "LeetCode,Python,算法,复习指导"
```

根据题目类型可追加具体标签，例如：
- 链表题：额外加 `链表,双指针`
- 动态规划题：额外加 `动态规划,DP`
- 二叉树题：额外加 `二叉树,递归`

---

## 发布脚本

项目自带 CLI 发布脚本：`.agents/cnblogs-publisher/publish.py`

### 发布新文章

```bash
python3 .agents/cnblogs-publisher/publish.py <markdown文件路径>
```

可通过 `--tags` 追加额外标签：

```bash
python3 .agents/cnblogs-publisher/publish.py path/to/blog.md --tags "链表,双指针"
```

### 更新已有文章

```bash
python3 .agents/cnblogs-publisher/publish.py <markdown文件路径> --update <postid>
```

### 查询最近文章列表

```bash
python3 .agents/cnblogs-publisher/publish.py --list        # 默认10篇
python3 .agents/cnblogs-publisher/publish.py --list 20     # 最近20篇
```

### 获取单篇文章详情

```bash
python3 .agents/cnblogs-publisher/publish.py --get <postid>
```

---

## 操作流程

### 发布新博客（最常用）

1. 用 Read 工具读取本地 `.md` 文件内容
2. 确认文件格式正确（第一行为 `# 标题`）
3. 用 Bash 工具运行发布脚本：`python3 .agents/cnblogs-publisher/publish.py <文件路径>`
4. 拿到 `postid` 后告知用户链接：`https://www.cnblogs.com/ranxi169/p/<postid>.html`

### 更新已有博客

1. 用 Read 工具读取本地 `.md` 文件内容
2. 询问用户 postid，或运行 `--list` 让用户确认
3. 运行发布脚本加 `--update <postid>`
4. 告知用户更新成功及文章链接

---

## 注意事项

- `postid` 是字符串类型，不是整数
- 发布脚本默认直接公开发布（`publish=True`）
- 如果请求报错，优先检查网络连接和令牌是否过期
- 每次发布新文章会生成新的 postid，不会覆盖旧文章

---

## 合集管理

### 核心知识点

1. **博客园合集无法通过 MetaWeblog API 设置。** `categories` 字段中写 `"LeetCode"` 只影响个人分类，不会加入合集。
2. **使用 `editPost` 更新文章会导致合集关联丢失！** 这是博客园平台行为，更新后必须重新添加合集。
3. 合集操作只能通过博客园 Web UI 完成——编辑页右侧有合集面板，其中每个合集是一个 checkbox，checkbox 的 HTML `id` 就是合集 ID（如 `id="38522"`）。
4. 博客园编辑页保存时 POST 到 `https://i.cnblogs.com/api/posts`，请求体中 `collectionIds` 字段（数组）控制文章所属合集。但此 API 需要完整的 post body（标题、正文等），不能单独更新合集字段。

### 为什么不能用 Chrome CDP 直接调试

- Chrome 的 `--remote-debugging-port` 要求 `--user-data-dir` 指向**非默认**目录
- 如果指定默认 profile 路径（`%LOCALAPPDATA%\Google\Chrome\User Data`），Chrome 会报错拒绝启动
- 使用新目录则没有登录 session
- Chrome v127+ 的 cookie 使用 `v20` 格式（App Bound Encryption），无法通过 DPAPI + AES-GCM 简单解密

**结论：用 Playwright 的 persistent context 是最可靠的方案。** Playwright 自己管理一个独立的浏览器 profile 目录，首次手动登录后 session 持久保存，后续自动复用。

### 自动添加合集脚本

项目自带 Playwright 自动化脚本：`.agents/cnblogs-publisher/add_to_collection.py`

原理：
1. 用 Playwright 启动 Chromium，加载持久化 profile（含已登录的 cnblogs session）
2. 逐篇导航到编辑页 `https://i.cnblogs.com/posts/edit;postId=<postid>`
3. 检查合集 checkbox（`document.getElementById('38522')`）是否已勾选
4. 未勾选则 `.click()` 勾选，然后找到"保存修改"按钮点击保存
5. 已勾选则跳过

```bash
# 首次使用：在弹出的浏览器中登录博客园（session 会持久保存）
python .agents/cnblogs-publisher/add_to_collection.py --login

# 批量添加所有 LeetCode 文章到合集（通过 MetaWeblog API 获取文章列表）
python .agents/cnblogs-publisher/add_to_collection.py

# 指定文章
python .agents/cnblogs-publisher/add_to_collection.py --postids 19766917 19766918

# 只看不操作
python .agents/cnblogs-publisher/add_to_collection.py --dry-run

# 无头模式（不显示浏览器窗口）
python .agents/cnblogs-publisher/add_to_collection.py --headless
```

依赖：`pip install playwright && playwright install chromium`

Session 保存在 `.agents/cnblogs-publisher/.browser_profile/`（已 gitignore）。

### 推荐工作流：发布或更新文章后自动补合集

```bash
# 1. 发布/更新文章
python .agents/cnblogs-publisher/publish.py path/to/blog.md

# 2. 拿到 postid 后，立即添加合集（因为 editPost 会丢合集）
python .agents/cnblogs-publisher/add_to_collection.py --postids <postid>
```

### 手动添加合集

如果脚本不可用，手动操作：

1. 打开编辑页：`https://i.cnblogs.com/posts/edit;postId=<postid>`
2. 右侧找到「合集」面板（在分类、标签下方）
3. 勾选对应合集（LeetCode 合集 ID: 38522）
4. 点击「保存修改」

### 合集相关常量

| 项目 | 值 |
|------|-----|
| LeetCode 合集 ID | `38522` |
| 合集页面 | `https://www.cnblogs.com/ranxi169/collections/38522` |
| 编辑页合集 checkbox | `document.getElementById('38522')` |
| 保存 API | `POST https://i.cnblogs.com/api/posts`（body 含 `collectionIds: [38522]`） |

---

## 文件来源规范

博客文件固定来自：

```
.agents/leetcode-blog-writer/
```

文件命名格式：`lc_<题号>_<英文描述>.md`

发布前先确认文件存在，再读取内容发布。
