#!/usr/bin/env python3
"""
Crawl a WeChat public account article and extract structured data + clean markdown.

Usage:
    python crawl_wechat.py <url> [--download-images] [--save-html] [--save-markdown] [--output-dir DIR]

Outputs one JSON summary to stdout. Progress and previews are written to stderr.
"""
from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
import posixpath
import re
import sys
from pathlib import Path
from urllib.parse import urljoin, urlsplit

try:
    import aiohttp
except ImportError:
    aiohttp = None

try:
    from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
    from crawl4ai.extraction_strategy import JsonCssExtractionStrategy
    from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator
except ImportError:
    AsyncWebCrawler = None
    BrowserConfig = None
    CrawlerRunConfig = None
    JsonCssExtractionStrategy = None
    DefaultMarkdownGenerator = None


WECHAT_ARTICLE_HOST = "mp.weixin.qq.com"
WECHAT_IMAGE_HOSTS = frozenset({"mmbiz.qpic.cn", "mmbiz.qlogo.cn"})
MAX_IMAGE_BYTES = 20 * 1024 * 1024
MAX_IMAGE_REDIRECTS = 5
IMAGE_CONTENT_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
}
REDIRECT_STATUSES = frozenset({301, 302, 303, 307, 308})

WECHAT_SCHEMA = {
    "name": "wechat_article",
    "baseSelector": "#js_article",
    "fields": [
        {"name": "title",        "selector": "#activity-name, h1.rich_media_title", "type": "text"},
        {"name": "author",       "selector": "#js_name",                             "type": "text"},
        {"name": "publish_time", "selector": "#publish_time",                        "type": "text"},
        {"name": "content_html", "selector": "#js_content",                          "type": "html"},
        {"name": "account_desc", "selector": "#js_profile_desc",                     "type": "text"},
    ],
}

WECHAT_USER_AGENT = (
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) "
    "AppleWebKit/605.1.15 (KHTML, like Gecko) "
    "Mobile/15E148 MicroMessenger/8.0.43"
)


def _require_dependencies(*required: str) -> None:
    missing = []
    if "aiohttp" in required and aiohttp is None:
        missing.append("aiohttp")
    if "crawl4ai" in required and AsyncWebCrawler is None:
        missing.append("crawl4ai")
    if missing:
        packages = " ".join(missing)
        raise RuntimeError(
            f"Missing dependencies: {', '.join(missing)}. "
            f"Install them with: pip install {packages}"
        )


def _validate_https_url(url: str, allowed_hosts: frozenset[str], label: str) -> str:
    try:
        parsed = urlsplit(url)
        port = parsed.port
    except ValueError as exc:
        raise ValueError(f"Invalid {label} URL: {url}") from exc

    hostname = (parsed.hostname or "").lower()
    if (
        parsed.scheme.lower() != "https"
        or hostname not in allowed_hosts
        or parsed.username is not None
        or parsed.password is not None
        or port not in (None, 443)
    ):
        raise ValueError(f"Invalid {label} URL: {url}")
    return url


def validate_wechat_url(url: str) -> str:
    """Validate a public HTTPS WeChat article URL."""
    _validate_https_url(url, frozenset({WECHAT_ARTICLE_HOST}), "WeChat article")
    path = urlsplit(url).path.rstrip("/")
    if path != "/s" and not path.startswith("/s/"):
        raise ValueError(f"Invalid WeChat article path: {url}")
    return url


def _validate_image_url(url: str) -> str:
    return _validate_https_url(url, WECHAT_IMAGE_HOSTS, "WeChat image")


def _image_reference(prefix: str, filename: str) -> str:
    """Build a relative POSIX URL without exposing a local filesystem path."""
    posix_prefix = prefix.replace("\\", "/")
    parsed = urlsplit(posix_prefix)
    normalized = posix_prefix.strip("/")
    parts = [part for part in normalized.split("/") if part]
    if (
        posix_prefix.startswith("/")
        or parsed.scheme
        or parsed.netloc
        or any(part in (".", "..") for part in parts)
    ):
        raise ValueError("Image URL prefix must be a relative POSIX path")
    return posixpath.join(*parts, filename) if parts else filename


def _extract_image_urls(text: str) -> list[str]:
    """Extract all WeChat CDN image URLs from HTML or markdown text."""
    pattern = r'https://mmbiz\.(?:qpic|qlogo)\.cn/[^\s"\'<>\)]+'
    urls = list(dict.fromkeys(re.findall(pattern, text)))  # deduplicate, preserve order
    return urls


def _clean_markdown(md: str) -> str:
    """Clean raw markdown: remove data-URI placeholder images and excessive blank lines.

    WeChat articles contain 1x1 SVG placeholder images as data URIs. These appear
    in two forms in the raw markdown:
    1. Complete:  ![alt](data:image/svg+xml,...)
    2. Broken across lines — the regex doesn't capture the closing ), leaving
       orphan lines like:  '%20fill='%23FFFFFF'...%3C/svg%3E)
    """
    # Remove complete markdown images with data: URIs
    md = re.sub(r'!\[[^\]]*\]\(data:[^\)]+\)', '', md)
    # Remove orphan URL-encoded SVG tail lines (from broken data-URI images)
    md = re.sub(r"^['\"]?%[0-9A-Fa-f]{2}.*%3C/svg%3E\)?['\"]?\s*$", '', md, flags=re.MULTILINE)
    # Remove lines that are just leftover encoded SVG fragments
    md = re.sub(r"^.*%3Csvg%20.*%3C/svg%3E.*$", '', md, flags=re.MULTILINE)
    # Remove javascript:void links
    md = re.sub(r'\[([^\]]*)\]\(javascript:void\\\(0\\\);\)', r'\1', md)
    # Collapse 3+ consecutive blank lines into 2
    md = re.sub(r'\n{3,}', '\n\n', md)
    return md.strip()


async def download_images(
    urls: list[str],
    images_dir: str | Path,
    image_url_prefix: str = "images",
) -> dict[str, str]:
    """Download images and map source URLs to relative POSIX references.

    ``images_dir`` is the filesystem destination. ``image_url_prefix`` is the
    separate relative path embedded in HTML and Markdown.
    """
    _require_dependencies("aiohttp")
    _image_reference(image_url_prefix, "image")
    target_dir = Path(images_dir)
    target_dir.mkdir(parents=True, exist_ok=True)
    url_to_reference: dict[str, str] = {}

    headers = {
        "User-Agent": WECHAT_USER_AGENT,
        "Referer": "https://mp.weixin.qq.com/",
    }

    # Limit concurrency to avoid hammering the CDN and getting rate-limited
    semaphore = asyncio.Semaphore(8)

    async def _limited(url):
        async with semaphore:
            return await _download_one(session, url, target_dir)

    timeout = aiohttp.ClientTimeout(total=30, connect=10, sock_read=20)
    async with aiohttp.ClientSession(headers=headers, timeout=timeout) as session:
        tasks = [_limited(url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)

    for url, result in zip(urls, results):
        if isinstance(result, str):
            url_to_reference[url] = _image_reference(image_url_prefix, result)
        else:
            print(f"Warning: failed to download {url}: {result}", file=sys.stderr)

    return url_to_reference


async def _download_one(
    session: aiohttp.ClientSession,
    url: str,
    images_dir: str | Path,
) -> str:
    """Download one bounded image and return only its generated filename."""
    original_url = _validate_image_url(url)
    current_url = original_url

    for _ in range(MAX_IMAGE_REDIRECTS + 1):
        _validate_image_url(current_url)
        response = await session.get(current_url, allow_redirects=False)
        try:
            if response.status in REDIRECT_STATUSES:
                if _ >= MAX_IMAGE_REDIRECTS:
                    raise RuntimeError(f"Image exceeded {MAX_IMAGE_REDIRECTS} redirects")
                location = response.headers.get("Location")
                if not location:
                    raise RuntimeError("Image redirect is missing a Location header")
                current_url = urljoin(current_url, location)
                _validate_image_url(current_url)
                continue

            response.raise_for_status()
            _validate_image_url(str(response.url))

            content_type = response.headers.get("Content-Type", "").split(";", 1)[0].strip().lower()
            if content_type not in IMAGE_CONTENT_TYPES:
                raise RuntimeError(f"Unsupported image Content-Type: {content_type or 'missing'}")

            content_length = response.headers.get("Content-Length")
            if content_length:
                try:
                    declared_size = int(content_length)
                except ValueError as exc:
                    raise RuntimeError("Invalid image Content-Length") from exc
                if declared_size < 0 or declared_size > MAX_IMAGE_BYTES:
                    raise RuntimeError(f"Image exceeds {MAX_IMAGE_BYTES} bytes")

            content = bytearray()
            async for chunk in response.content.iter_chunked(64 * 1024):
                content.extend(chunk)
                if len(content) > MAX_IMAGE_BYTES:
                    raise RuntimeError(f"Image exceeds {MAX_IMAGE_BYTES} bytes")

            extension = IMAGE_CONTENT_TYPES[content_type]
            filename = hashlib.sha256(original_url.encode()).hexdigest()[:16] + extension
            local_path = Path(images_dir) / filename
            local_path.write_bytes(content)
            return filename
        finally:
            response.release()

    raise RuntimeError(f"Image exceeded {MAX_IMAGE_REDIRECTS} redirects")


def replace_urls(text: str, url_map: dict[str, str]) -> str:
    """Replace all remote URLs in text with local paths."""
    for remote_url, local_path in url_map.items():
        text = text.replace(remote_url, local_path)
    return text


async def crawl_wechat_article(
    url: str,
    images_dir: str | Path | None = None,
    image_url_prefix: str = "images",
) -> dict:
    """Crawl a WeChat article.

    Args:
        url: WeChat article URL.
        images_dir: If provided, download all images to this directory and
                    replace remote URLs with local paths in HTML and markdown.
                    If None, images are left as remote URLs.
        image_url_prefix: Relative POSIX path embedded in HTML and Markdown for
                          downloaded images. It is independent of images_dir.
    """
    _require_dependencies("crawl4ai")
    validate_wechat_url(url)

    browser_config = BrowserConfig(
        user_agent=WECHAT_USER_AGENT,
        headers={
            "Referer": "https://mp.weixin.qq.com/",
            "Accept-Language": "zh-CN,zh;q=0.9",
        },
    )

    # WeChat uses data-src for lazy-loaded images. This JS copies data-src -> src
    # so that the markdown generator can pick up the real image URLs.
    js_fix_lazy_images = """
    document.querySelectorAll('img[data-src]').forEach(img => {
        if (!img.src || img.src.startsWith('data:')) {
            img.src = img.getAttribute('data-src');
        }
    });
    """

    config = CrawlerRunConfig(
        wait_for="css:#js_content",
        js_code=js_fix_lazy_images,
        extraction_strategy=JsonCssExtractionStrategy(WECHAT_SCHEMA),
        # Use raw markdown (no PruningContentFilter) to preserve inline images.
        # We clean up placeholder data-URIs ourselves in _clean_markdown().
        markdown_generator=DefaultMarkdownGenerator(
            options={"ignore_links": False},
        ),
        word_count_threshold=10,
        remove_overlay_elements=True,
    )

    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(url, config=config)

    if not getattr(result, "success", False):
        detail = getattr(result, "error_message", "") or "unknown crawler error"
        raise RuntimeError(f"Failed to crawl WeChat article: {detail}")

    final_url = str(getattr(result, "url", "") or "")
    try:
        validate_wechat_url(final_url)
    except ValueError as exc:
        raise RuntimeError(f"WeChat article redirected outside the allowed origin: {final_url}") from exc

    try:
        meta = json.loads(result.extracted_content or "[]")
    except (TypeError, json.JSONDecodeError) as exc:
        raise RuntimeError("Crawler returned invalid structured article data") from exc

    if isinstance(meta, list):
        article = meta[0] if meta and isinstance(meta[0], dict) else {}
    elif isinstance(meta, dict):
        article = meta
    else:
        article = {}
    if not article:
        raise RuntimeError("WeChat article metadata or body could not be extracted")

    raw_html = article.get("content_html", "")
    markdown_result = getattr(result, "markdown", None)
    if isinstance(markdown_result, str):
        markdown_text = markdown_result
    else:
        markdown_text = getattr(markdown_result, "raw_markdown", "") if markdown_result else ""
    raw_md = _clean_markdown(markdown_text)
    if not raw_html and not raw_md:
        raise RuntimeError("WeChat article body is empty")

    # Download images and replace URLs if images_dir is specified
    if images_dir:
        all_urls = _extract_image_urls(raw_html) + _extract_image_urls(raw_md)
        all_urls = list(dict.fromkeys(all_urls))  # deduplicate
        if all_urls:
            print(f"Downloading {len(all_urls)} images...", file=sys.stderr)
            url_map = await download_images(all_urls, images_dir, image_url_prefix)
            raw_html = replace_urls(raw_html, url_map)
            raw_md = replace_urls(raw_md, url_map)
            print(f"Downloaded {len(url_map)}/{len(all_urls)} images to {images_dir}", file=sys.stderr)

    return {
        "title":        article.get("title", "").strip(),
        "author":       article.get("author", "").strip(),
        "publish_time": article.get("publish_time", "").strip(),
        "account_desc": article.get("account_desc", "").strip(),
        "markdown":     raw_md,
        "html":         raw_html,
        "url":          final_url,
    }


def _safe_slug(title: str) -> str:
    slug = re.sub(r'[^\w]+', '_', title or "wechat_article").strip("_")[:60]
    return slug or "wechat_article"


def _unique_output_stem(output_dir: str | Path, stem: str, suffixes: list[str]) -> str:
    """Return a stem for which none of the requested output files exists."""
    directory = Path(output_dir)
    candidate = stem
    index = 2
    while any((directory / f"{candidate}{suffix}").exists() for suffix in suffixes):
        candidate = f"{stem}_{index}"
        index += 1
    return candidate


def main():
    parser = argparse.ArgumentParser(description="Crawl a WeChat article")
    parser.add_argument("url", help="WeChat article URL (mp.weixin.qq.com/s/...)")
    parser.add_argument("--save-html", action="store_true", help="Save HTML to file")
    parser.add_argument("--save-markdown", action="store_true", help="Save markdown to file")
    parser.add_argument("--download-images", action="store_true",
                        help="Download approved WeChat CDN images locally")
    parser.add_argument("--output-dir", default=".", help="Directory for saved files")
    args = parser.parse_args()

    try:
        validate_wechat_url(args.url)
        output_dir = Path(args.output_dir).expanduser()
        if args.save_html or args.save_markdown or args.download_images:
            output_dir.mkdir(parents=True, exist_ok=True)
        images_dir = output_dir / "images" if args.download_images else None
        article = asyncio.run(crawl_wechat_article(
            args.url,
            images_dir=images_dir,
            image_url_prefix="images",
        ))

        suffixes = []
        if args.save_html and article["html"]:
            suffixes.append(".html")
        if args.save_markdown and article["markdown"]:
            suffixes.append(".md")
        stem = _unique_output_stem(output_dir, _safe_slug(article["title"]), suffixes)

        if ".html" in suffixes:
            path = output_dir / f"{stem}.html"
            with path.open("x", encoding="utf-8") as file:
                file.write(article["html"])
            print(f"HTML saved to: {path}", file=sys.stderr)

        if ".md" in suffixes:
            path = output_dir / f"{stem}.md"
            with path.open("x", encoding="utf-8") as file:
                file.write(article["markdown"])
            print(f"Markdown saved to: {path}", file=sys.stderr)
    except Exception as exc:
        parser.exit(1, f"Error: {exc}\n")

    # Keep stdout machine-readable: emit exactly one JSON document.
    summary = {k: v for k, v in article.items() if k not in ("html", "markdown")}
    summary["markdown_length"] = len(article["markdown"])
    summary["html_length"] = len(article["html"])
    print(json.dumps(summary, ensure_ascii=False, indent=2))

    # Human-readable diagnostics belong on stderr.
    print(f"\n{'='*60}", file=sys.stderr)
    print(f"Title:   {article['title']}", file=sys.stderr)
    print(f"Author:  {article['author']}", file=sys.stderr)
    print(f"Time:    {article['publish_time']}", file=sys.stderr)
    print(f"Account: {article['account_desc']}", file=sys.stderr)
    print(f"{'='*60}", file=sys.stderr)
    print("Content preview (first 500 chars):\n", file=sys.stderr)
    print(article["markdown"][:500], file=sys.stderr)


if __name__ == "__main__":
    main()
