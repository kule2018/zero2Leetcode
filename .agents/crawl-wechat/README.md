# wechat-article-crawler

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill for crawling WeChat public account (微信公众号) articles into structured data and clean markdown — with images downloaded locally to bypass hotlink protection.

## Features

- Spoofs WeChat in-app browser User-Agent to get full article content
- Fixes lazy-loaded images (`data-src` → `src`)
- Extracts structured metadata: title, author, publish time, account description
- Generates clean markdown with inline images (SVG placeholders removed)
- Downloads images locally with correct `Referer` header to bypass CDN hotlink protection
- Concurrent downloads with rate limiting (semaphore)

## Quick Start

### As a Claude Code Skill

Copy this directory to `.claude/skills/crawl-wechat` in your project:

```bash
# Clone into your project's skills directory
git clone https://github.com/gxcsoccer/wechat-article-crawler.git .claude/skills/crawl-wechat
```

Then in Claude Code, just paste a WeChat article URL or say "抓取这篇微信文章".

### As a Standalone Script

```bash
# Install dependencies
pip install crawl4ai aiohttp && crawl4ai-setup

# Crawl an article with images
python scripts/crawl_wechat.py "https://mp.weixin.qq.com/s/xxx" \
  --download-images \
  --save-markdown \
  --save-html \
  --output-dir ./output
```

### As a Python Library

```python
import asyncio
from scripts.crawl_wechat import crawl_wechat_article

article = asyncio.run(crawl_wechat_article(
    "https://mp.weixin.qq.com/s/xxx",
    images_dir="./output/images",
))

print(article["title"])
print(article["markdown"])  # images reference local paths
```

## Output

| Field          | Description                   |
|----------------|-------------------------------|
| `title`        | Article title                 |
| `author`       | Public account name           |
| `publish_time` | Publication timestamp         |
| `account_desc` | Account description/bio       |
| `markdown`     | Clean markdown with images    |
| `html`         | Raw HTML of article body      |
| `url`          | Final URL after redirects     |

## CLI Options

```
usage: crawl_wechat.py [-h] [--save-html] [--save-markdown] [--download-images] [--output-dir DIR] url

positional arguments:
  url                WeChat article URL (mp.weixin.qq.com/s/...)

options:
  --save-html        Save HTML to file
  --save-markdown    Save markdown to file
  --download-images  Download images locally to bypass hotlink protection
  --output-dir DIR   Directory for saved files (default: .)
```

## How It Works

1. **User-Agent spoofing** — Sets `MicroMessenger/8.0.43` so WeChat serves the full article
2. **Dynamic wait** — `wait_for="css:#js_content"` ensures the body is rendered
3. **Lazy-image JS injection** — Copies `data-src` → `src` on all `<img>` tags before scraping
4. **Structured extraction** — `JsonCssExtractionStrategy` targets WeChat's DOM (`#activity-name`, `#js_name`, `#publish_time`, `#js_content`)
5. **Markdown cleanup** — Removes 1x1 SVG placeholders and URL-encoded data-URI fragments
6. **Image download** — Fetches from `mmbiz.qpic.cn` with `Referer: https://mp.weixin.qq.com/`, replaces URLs in output

## Limitations

- Requires a valid, non-expired WeChat article URL — cannot search or list articles
- High-frequency crawling may trigger anti-bot measures (CAPTCHAs, IP blocks)
- Some temporary share links expire after a period

## License

[MIT](LICENSE)
