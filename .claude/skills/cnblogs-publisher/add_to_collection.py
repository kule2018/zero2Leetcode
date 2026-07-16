#!/usr/bin/env python3
"""Add CNBlogs posts to a collection through the authenticated web editor."""

from __future__ import annotations

import argparse
import os
import re
import sys
import time
import xmlrpc.client
from pathlib import Path

try:
    from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
    from playwright.sync_api import sync_playwright
except ImportError:
    PlaywrightTimeoutError = TimeoutError
    sync_playwright = None


REQUIRED_API_ENV = (
    "CNBLOGS_ENDPOINT",
    "CNBLOGS_USERNAME",
    "CNBLOGS_PASSWORD",
    "CNBLOGS_BLOGID",
)
NAV_TIMEOUT_MS = 60_000
NAV_RETRIES = 3


def find_env_file() -> Path | None:
    """Find the nearest .env from the working tree or the script location."""

    seen: set[Path] = set()
    for origin in (Path.cwd().resolve(), Path(__file__).resolve().parent):
        for directory in (origin, *origin.parents):
            if directory in seen:
                continue
            seen.add(directory)
            candidate = directory / ".env"
            if candidate.is_file():
                return candidate
    return None


def load_env() -> Path | None:
    """Load a simple KEY=VALUE .env file without replacing exported values."""

    env_path = find_env_file()
    if env_path is None:
        return None

    with env_path.open("r", encoding="utf-8") as env_file:
        for raw_line in env_file:
            line = raw_line.strip()
            if not line or line.startswith("#"):
                continue
            if line.startswith("export "):
                line = line[7:].lstrip()
            key, separator, value = line.partition("=")
            if not separator:
                continue
            key = key.strip()
            value = value.strip()
            if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
                value = value[1:-1]
            if key:
                os.environ.setdefault(key, value)
    return env_path


def get_api_config() -> dict[str, str]:
    missing = [name for name in REQUIRED_API_ENV if not os.environ.get(name)]
    if missing:
        names = ", ".join(missing)
        raise SystemExit(f"Missing required environment variable(s): {names}")
    return {
        "endpoint": os.environ["CNBLOGS_ENDPOINT"],
        "username": os.environ["CNBLOGS_USERNAME"],
        "password": os.environ["CNBLOGS_PASSWORD"],
        "blogid": os.environ["CNBLOGS_BLOGID"],
    }


def profile_directory() -> Path:
    configured = os.environ.get("CNBLOGS_PROFILE_DIR")
    if configured:
        return Path(configured).expanduser().resolve()
    return Path(__file__).resolve().parent / ".browser_profile"


def get_recent_posts(limit: int, title_pattern: re.Pattern[str]) -> list[dict[str, str]]:
    """Fetch recent posts whose titles match an explicit regular expression."""

    config = get_api_config()
    client = xmlrpc.client.ServerProxy(config["endpoint"])
    posts = client.metaWeblog.getRecentPosts(
        config["blogid"],
        config["username"],
        config["password"],
        limit,
    )
    return [
        {"postid": str(post["postid"]), "title": str(post["title"])}
        for post in posts
        if title_pattern.search(str(post["title"]))
    ]


def require_playwright() -> None:
    if sync_playwright is None:
        raise SystemExit(
            "Playwright is required: python3 -m pip install playwright && "
            "python3 -m playwright install chromium"
        )


def create_browser(profile_dir: Path, headless: bool = False):
    require_playwright()
    playwright = sync_playwright().start()
    browser = playwright.chromium.launch_persistent_context(
        user_data_dir=str(profile_dir),
        headless=headless,
        args=["--disable-blink-features=AutomationControlled"],
    )
    return playwright, browser


def do_login(profile_dir: Path) -> None:
    print("Opening browser for login...")
    playwright, browser = create_browser(profile_dir, headless=False)
    try:
        page = browser.pages[0] if browser.pages else browser.new_page()
        page.goto(
            "https://account.cnblogs.com/signin",
            wait_until="networkidle",
            timeout=30_000,
        )
        print("Log in, then navigate to i.cnblogs.com.")
        try:
            page.wait_for_url("**/i.cnblogs.com/**", timeout=300_000)
            print("Login detected.")
        except PlaywrightTimeoutError:
            print("Login wait timed out; preserving the browser profile.")
    finally:
        browser.close()
        playwright.stop()
    print(f"Session saved to {profile_dir}")


def open_edit_page(page, edit_url: str) -> None:
    """Open an editor page with bounded retries for intermittent timeouts."""

    last_error: Exception | None = None
    for attempt in range(1, NAV_RETRIES + 1):
        try:
            page.goto(edit_url, wait_until="domcontentloaded", timeout=NAV_TIMEOUT_MS)
            try:
                page.wait_for_load_state("networkidle", timeout=5_000)
            except PlaywrightTimeoutError:
                pass
            return
        except PlaywrightTimeoutError as error:
            last_error = error
            print(f"  editor timeout ({attempt}/{NAV_RETRIES})")
            try:
                page.goto("about:blank", wait_until="load", timeout=10_000)
            except PlaywrightTimeoutError:
                pass
            time.sleep(2 * attempt)
    if last_error is not None:
        raise last_error


def add_to_collection(page, post_id: str, collection_id: int) -> str:
    edit_url = f"https://i.cnblogs.com/posts/edit;postId={post_id}"
    open_edit_page(page, edit_url)
    time.sleep(2)

    status = page.evaluate(
        """collectionId => {
            const checkbox = document.getElementById(String(collectionId));
            if (!checkbox) return "not_found";
            return checkbox.checked ? "already_checked" : "unchecked";
        }""",
        collection_id,
    )
    if status == "already_checked":
        return "already_in_collection"
    if status == "not_found":
        return "checkbox_not_found"

    checked = page.evaluate(
        """collectionId => {
            const checkbox = document.getElementById(String(collectionId));
            checkbox.click();
            return checkbox.checked;
        }""",
        collection_id,
    )
    if not checked:
        return "click_failed"

    save_result = page.evaluate(
        """async () => {
            const buttons = document.querySelectorAll("button");
            for (const button of buttons) {
                if (button.textContent?.trim()?.includes("保存修改")) {
                    button.click();
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    return "saved";
                }
            }
            return "no_save_button";
        }"""
    )
    time.sleep(2)
    return save_result


def resolve_collection_id(args: argparse.Namespace, parser: argparse.ArgumentParser) -> int:
    raw_value = args.collection
    if raw_value is None:
        raw_value = os.environ.get("CNBLOGS_COLLECTION_ID")
    if raw_value is None:
        parser.error("provide --collection or CNBLOGS_COLLECTION_ID")
    try:
        collection_id = int(raw_value)
    except (TypeError, ValueError):
        parser.error("collection ID must be an integer")
    if collection_id <= 0:
        parser.error("collection ID must be positive")
    return collection_id


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--login", action="store_true", help="open a browser for manual login")
    parser.add_argument("--postids", nargs="+", metavar="POST_ID", help="specific post IDs")
    parser.add_argument("--dry-run", action="store_true", help="list selected posts only")
    parser.add_argument("--collection", type=int, help="collection ID")
    parser.add_argument("--headless", action="store_true", help="run without a browser window")
    parser.add_argument(
        "--title-pattern",
        help="regex selecting recent post titles for a bulk operation",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=50,
        help="number of recent posts to inspect in bulk mode (default: 50)",
    )
    args = parser.parse_args()

    load_env()
    profile_dir = profile_directory()
    if args.login:
        do_login(profile_dir)
        return

    collection_id = resolve_collection_id(args, parser)
    if args.limit <= 0:
        parser.error("--limit must be positive")

    if args.postids:
        posts = [
            {"postid": post_id, "title": f"postid={post_id}"}
            for post_id in args.postids
        ]
    else:
        pattern_text = args.title_pattern or os.environ.get("CNBLOGS_TITLE_PATTERN")
        if not pattern_text:
            parser.error(
                "bulk mode requires --title-pattern or CNBLOGS_TITLE_PATTERN; "
                "use --postids for explicit posts"
            )
        try:
            title_pattern = re.compile(pattern_text)
        except re.error as error:
            parser.error(f"invalid title pattern: {error}")
        posts = get_recent_posts(args.limit, title_pattern)

    print(f"Selected {len(posts)} post(s) for collection {collection_id}")
    for post in posts:
        print(f"[{post['postid']}] {post['title']}")
    if args.dry_run or not posts:
        return

    if not profile_dir.exists():
        raise SystemExit(
            f"No saved browser session at {profile_dir}. Run with --login first."
        )

    print(f"Adding {len(posts)} post(s) to collection {collection_id}...")
    playwright, browser = create_browser(profile_dir, headless=args.headless)
    success = 0
    skipped = 0
    failed = 0
    try:
        page = browser.pages[0] if browser.pages else browser.new_page()
        for index, post in enumerate(posts, 1):
            print(f"[{index}/{len(posts)}] {post['title']}")
            try:
                result = add_to_collection(page, post["postid"], collection_id)
            except Exception as error:
                print(f"  failed with exception: {error}")
                result = "exception"

            if result == "saved":
                print("  added")
                success += 1
            elif result == "already_in_collection":
                print("  already in collection")
                skipped += 1
            else:
                print(f"  failed: {result}")
                failed += 1
            time.sleep(1)
    finally:
        browser.close()
        playwright.stop()

    print(f"Done: {success} added, {skipped} already, {failed} failed")


if __name__ == "__main__":
    main()
