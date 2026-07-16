# wechat-article-crawler

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill for archiving public WeChat account (微信公众号) articles as structured data and Markdown, with optional local image downloads.

## Features

- Uses a WeChat-compatible browser User-Agent to load public article content
- Fixes lazy-loaded images (`data-src` → `src`)
- Extracts structured metadata: title, author, publish time, account description
- Generates clean markdown with inline images (SVG placeholders removed)
- Downloads permitted images locally with the CDN's expected `Referer` header
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

Requires Python 3.10 or newer. Installing `crawl4ai` and running `crawl4ai-setup`
also installs its browser runtime; use a virtual environment when possible.

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
    image_url_prefix="images",
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

The CLI writes exactly one JSON summary to stdout. Progress messages, saved-file
paths, and the readable content preview are written to stderr. When an output
filename already exists, a numeric suffix is added instead of overwriting it.
Downloaded image references are relative POSIX paths such as
`images/0123456789abcdef.jpg`, independent of the local output directory.

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

1. **Compatible User-Agent** — Sets `MicroMessenger/8.0.43` so WeChat serves the public article
2. **Dynamic wait** — `wait_for="css:#js_content"` ensures the body is rendered
3. **Lazy-image JS injection** — Copies `data-src` → `src` on all `<img>` tags before scraping
4. **Structured extraction** — `JsonCssExtractionStrategy` targets WeChat's DOM (`#activity-name`, `#js_name`, `#publish_time`, `#js_content`)
5. **Markdown cleanup** — Removes 1x1 SVG placeholders and URL-encoded data-URI fragments
6. **Image download** — Fetches only HTTPS images from approved WeChat CDN hosts, with bounded redirects, response size, and request time

## Limitations

- Requires a valid, non-expired WeChat article URL — cannot search or list articles
- High-frequency crawling may trigger anti-bot measures (CAPTCHAs, IP blocks)
- Some temporary share links expire after a period
- Markdown conversion can lose information represented only by complex inline SVGs; retain HTML when fidelity matters

## Responsible Use and Security

- Only public HTTPS URLs on `mp.weixin.qq.com/s/...` are accepted. Final article redirects and image redirects must remain on approved WeChat hosts.
- Crawl at a low frequency and comply with WeChat's terms, robots guidance, and applicable law. Do not use this tool to evade access controls or collect private content.
- Article text and downloaded media remain the property of their respective rights holders. The MIT license covers this tool's code only and does not grant redistribution rights for crawled content.
- Treat saved HTML and Markdown as untrusted external content before publishing or rendering it in another application.
- Image downloads accept known image content types only, use a 30-second total timeout, and are limited to 20 MiB per file.

## License

[MIT](LICENSE)
