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

## 已知限制：合集（collections）只能手动添加

博客园合集是独立于 MetaWeblog API 的功能，`getCategories` 返回列表中没有任何合集条目，`categories` 字段对合集无效，网页上也不会通过 API 写入合集信息。

**不要尝试通过 API 设置合集，无论任何写法都不会生效。**

发布完成后，告知用户手动操作：

1. 打开编辑页：`https://i.cnblogs.com/posts/edit/id/<postid>`
2. 右侧找到「合集」
3. 选择对应合集
4. 保存修改

---

## 文件来源规范

博客文件固定来自：

```
/Users/onefly/Desktop/project/zero2Leetcode/.agents/leetcode-blog-writer/
```

文件命名格式：`lc_<题号>_<英文描述>.md`

发布前先确认文件存在，再读取内容发布。
