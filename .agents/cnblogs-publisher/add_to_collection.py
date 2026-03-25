#!/usr/bin/env python3
"""通过 Playwright 批量将博客文章添加到博客园合集

用法:
  python add_to_collection.py --login          # 首次运行，手动登录博客园
  python add_to_collection.py                  # 自动处理所有 LeetCode 文章
  python add_to_collection.py --postids 19766917 19766918  # 指定文章
  python add_to_collection.py --dry-run        # 只列出文章不操作

原理: 导航到每篇文章的编辑页，勾选合集 checkbox，点击"保存修改"。
首次使用前需运行 --login 在弹出的浏览器中登录博客园。
合集 ID 默认为 38522（LeetCode 合集）。
"""

import argparse
import re
import sys
import os
import time
import xmlrpc.client
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("Need: pip install playwright && playwright install chromium")
    sys.exit(1)

COLLECTION_ID = 38522
PROFILE_DIR = Path(__file__).resolve().parent / ".browser_profile"


def load_env():
    env_path = Path(__file__).resolve().parents[2] / ".env"
    if not env_path.exists():
        print(f"Cannot find .env: {env_path}")
        sys.exit(1)
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            key, _, value = line.partition("=")
            os.environ.setdefault(key.strip(), value.strip())


def get_all_postids():
    """Get all LeetCode post IDs via MetaWeblog API"""
    load_env()
    endpoint = os.environ["CNBLOGS_ENDPOINT"]
    username = os.environ["CNBLOGS_USERNAME"]
    password = os.environ["CNBLOGS_PASSWORD"]
    blogid = os.environ["CNBLOGS_BLOGID"]

    client = xmlrpc.client.ServerProxy(endpoint)
    posts = client.metaWeblog.getRecentPosts(blogid, username, password, 50)

    lc_posts = []
    for p in posts:
        if re.search(r"LeetCode-\d+", p["title"]):
            lc_posts.append({"postid": str(p["postid"]), "title": p["title"]})
    return lc_posts


def create_browser(headless=False):
    pw = sync_playwright().start()
    browser = pw.chromium.launch_persistent_context(
        user_data_dir=str(PROFILE_DIR),
        headless=headless,
        args=["--disable-blink-features=AutomationControlled"],
    )
    return pw, browser


def do_login():
    print("Opening browser for login...")
    pw, browser = create_browser(headless=False)
    page = browser.pages[0] if browser.pages else browser.new_page()
    page.goto("https://account.cnblogs.com/signin", wait_until="networkidle", timeout=30000)
    print("Please log in, then navigate to i.cnblogs.com ...")
    try:
        page.wait_for_url("**/i.cnblogs.com/**", timeout=300000)
        print("Login detected!")
    except Exception:
        pass
    page.goto("https://i.cnblogs.com/", wait_until="networkidle", timeout=15000)
    print(f"Page: {page.title()}")
    browser.close()
    pw.stop()
    print(f"Session saved to {PROFILE_DIR}")


def add_to_collection(page, postid, collection_id):
    """Navigate to edit page, check collection checkbox, save."""
    edit_url = f"https://i.cnblogs.com/posts/edit;postId={postid}"
    page.goto(edit_url, wait_until="networkidle", timeout=20000)
    time.sleep(2)

    # Check if collection checkbox exists and its state
    status = page.evaluate(f'''() => {{
        const cb = document.getElementById('{collection_id}');
        if (!cb) return 'not_found';
        return cb.checked ? 'already_checked' : 'unchecked';
    }}''')

    if status == "already_checked":
        return "already_in_collection"

    if status == "not_found":
        return "checkbox_not_found"

    # Click the checkbox
    page.evaluate(f'''() => {{ document.getElementById('{collection_id}').click(); }}''')
    time.sleep(0.5)

    # Verify it's now checked
    checked = page.evaluate(f'''() => document.getElementById('{collection_id}').checked''')
    if not checked:
        return "click_failed"

    # Click "保存修改" button
    save_result = page.evaluate('''async () => {
        const buttons = document.querySelectorAll('button');
        for (const b of buttons) {
            if (b.textContent?.trim()?.includes('保存修改')) {
                b.click();
                await new Promise(r => setTimeout(r, 3000));
                return 'saved';
            }
        }
        return 'no_save_button';
    }''')
    time.sleep(2)

    return save_result


def main():
    parser = argparse.ArgumentParser(description="Batch add cnblogs posts to collection")
    parser.add_argument("--login", action="store_true", help="Open browser for manual login")
    parser.add_argument("--postids", nargs="*", help="Specific post IDs")
    parser.add_argument("--dry-run", action="store_true", help="List posts only")
    parser.add_argument("--collection", type=int, default=COLLECTION_ID, help="Collection ID")
    parser.add_argument("--headless", action="store_true", help="Run without browser UI")
    args = parser.parse_args()

    collection_id = args.collection

    if args.login:
        do_login()
        return

    if not PROFILE_DIR.exists():
        print("No saved session. Run with --login first.")
        sys.exit(1)

    # Get post list
    if args.postids:
        posts = [{"postid": pid, "title": f"(postid={pid})"} for pid in args.postids]
    else:
        print("Fetching post list...")
        posts = get_all_postids()
        print(f"Found {len(posts)} LeetCode posts")

    if args.dry_run:
        for p in posts:
            print(f"  [{p['postid']}] {p['title']}")
        return

    # Process posts
    print(f"Adding {len(posts)} posts to collection {collection_id}...")
    pw, browser = create_browser(headless=args.headless)
    page = browser.pages[0] if browser.pages else browser.new_page()

    success = 0
    skip = 0
    fail = 0
    for i, p in enumerate(posts):
        print(f"[{i+1}/{len(posts)}] {p['title']}")
        result = add_to_collection(page, p["postid"], collection_id)
        if result == "saved":
            print(f"  + Added to collection")
            success += 1
        elif result == "already_in_collection":
            print(f"  = Already in collection")
            skip += 1
        else:
            print(f"  ! {result}")
            fail += 1
        time.sleep(1)

    print(f"\nDone: {success} added, {skip} already, {fail} failed")
    browser.close()
    pw.stop()


if __name__ == "__main__":
    main()
