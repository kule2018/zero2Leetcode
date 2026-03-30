---
name: crawl-wechat
description: >
  抓取并提取微信公众号文章，输出结构化数据和干净的 Markdown 格式。
  当用户想要抓取、爬取、阅读、提取微信文章内容时触发此技能（URL 包含 mp.weixin.qq.com）。
  也可通过关键词触发：微信公众号文章、抓取微信文章、爬取公众号、读取公众号文章等。
  此技能处理以下难点：伪造微信内置浏览器 User-Agent、等待动态内容加载、
  修复懒加载图片、提取结构化元数据（标题、作者、发布时间）、
  生成带内联图片的干净 Markdown，以及本地下载图片绕过防盗链。
---

# 抓取微信公众号文章

本技能使用 `crawl4ai` 库提取微信公众号文章内容。微信文章需要特殊处理，因为它会检查 User-Agent 请求头、动态渲染内容，并对图片使用懒加载。

## 使用场景

- 用户提供 `mp.weixin.qq.com/s/...` 链接并想获取其内容
- 用户要求抓取/爬取/提取/阅读微信公众号文章
- 用户想批量处理多个微信文章链接
- 用户需要将文章转换为 Markdown 或结构化格式

## 环境准备（首次使用前运行一次）

运行脚本前，确保已安装依赖：

```bash
pip install crawl4ai aiohttp && crawl4ai-setup
```

如果 `crawl4ai` 已可导入且浏览器后端已就绪，可跳过此步骤。当脚本报 `ModuleNotFoundError` 或浏览器相关错误时，运行上述命令修复。

## 工作原理

运行内置脚本抓取微信文章：

```bash
python <skill-dir>/scripts/crawl_wechat.py <URL> [--download-images] [--save-html] [--save-markdown] [--output-dir DIR]
```

脚本将 JSON 摘要输出到标准输出，并可选择将完整 HTML 和/或 Markdown 保存到文件。

### 关键技术细节

1. **User-Agent 伪造**：脚本在 UA 字符串中设置 `MicroMessenger/8.0.43`，使微信返回完整文章内容，而非"请在微信中打开"的提示页。

2. **动态等待**：使用 `wait_for="css:#js_content"` 确保文章正文完全渲染后再抓取。

3. **懒加载图片修复**：微信使用 `data-src` 实现图片懒加载。脚本注入 JS 将 `data-src` 复制到 `src`，使 Markdown 生成器能获取到真实图片 URL。

4. **结构化提取**：使用 `JsonCssExtractionStrategy`，配合针对微信 DOM 结构的 schema（`#activity-name` 获取标题、`#js_name` 获取作者、`#publish_time` 获取日期、`#js_content` 获取正文）。

5. **带图片的干净 Markdown**：使用 `DefaultMarkdownGenerator` 生成可读的 Markdown。SVG 占位图和 data-URI 残留会被清除，仅保留正文中的真实图片。

6. **图片防盗链处理**：微信图片托管在 `mmbiz.qpic.cn`，会拦截非 QQ 来源的请求。使用 `--download-images` 可通过正确的 Referer 头将所有图片下载到本地，并自动替换 HTML 和 Markdown 中的远程 URL 为本地路径。

## 提取字段

| 字段           | 说明                     |
|----------------|--------------------------|
| `title`        | 文章标题                 |
| `author`       | 公众号名称               |
| `publish_time` | 发布时间                 |
| `account_desc` | 公众号简介               |
| `markdown`     | 文章正文的干净 Markdown  |
| `html`         | 文章正文的原始 HTML      |
| `url`          | 重定向后的最终 URL       |

## 使用示例

抓取单篇文章并下载图片到本地：
```bash
python <skill-dir>/scripts/crawl_wechat.py "https://mp.weixin.qq.com/s/xxx" --download-images --save-markdown --output-dir ./output
```

在 Python 中编程调用：
```python
from crawl_wechat import crawl_wechat_article
import asyncio

article = asyncio.run(crawl_wechat_article(
    "https://mp.weixin.qq.com/s/...",
    images_dir="./output/images",  # 下载图片到本地
))
print(article["title"])
print(article["markdown"])  # 图片引用本地路径
```

## 限制

- 需要有效且未过期的微信文章 URL——无法搜索或列出某公众号的文章列表
- 高频抓取可能触发微信的反爬机制（验证码、IP 封禁）
- 部分临时分享链接会在一段时间后过期
