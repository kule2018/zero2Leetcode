#!/usr/bin/env python3
"""Publish and inspect Markdown posts through the CNBlogs MetaWeblog API."""

from __future__ import annotations

import argparse
import os
import sys
import xmlrpc.client
from pathlib import Path


REQUIRED_ENV = (
    "CNBLOGS_ENDPOINT",
    "CNBLOGS_USERNAME",
    "CNBLOGS_PASSWORD",
    "CNBLOGS_BLOGID",
)


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


def parse_csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


def get_config() -> dict[str, object]:
    load_env()
    missing = [name for name in REQUIRED_ENV if not os.environ.get(name)]
    if missing:
        names = ", ".join(missing)
        raise SystemExit(f"Missing required environment variable(s): {names}")

    blog_id = os.environ["CNBLOGS_BLOGID"]
    blog_url = os.environ.get(
        "CNBLOGS_BLOG_URL",
        f"https://www.cnblogs.com/{blog_id}",
    ).rstrip("/")
    return {
        "endpoint": os.environ["CNBLOGS_ENDPOINT"],
        "username": os.environ["CNBLOGS_USERNAME"],
        "password": os.environ["CNBLOGS_PASSWORD"],
        "blogid": blog_id,
        "blog_url": blog_url,
        "categories": parse_csv(os.environ.get("CNBLOGS_CATEGORIES", "[Markdown]")),
        "tags": parse_csv(os.environ.get("CNBLOGS_TAGS", "")),
    }


def parse_markdown(filepath: str) -> tuple[str, str]:
    """Read a Markdown H1 and return its title and remaining body."""

    raw = Path(filepath).read_text(encoding="utf-8")
    lines = raw.splitlines()
    if not lines:
        raise SystemExit(f"Markdown file is empty: {filepath}")

    title = lines[0].lstrip("#").strip()
    if not title:
        raise SystemExit(f"Markdown file has no title on the first line: {filepath}")
    body = "\n".join(lines[1:]).lstrip("\n")
    return title, body


def build_post(
    title: str,
    body: str,
    categories: list[str],
    tags: list[str],
) -> dict[str, object]:
    return {
        "title": title,
        "description": body,
        "categories": categories,
        "mt_keywords": ",".join(tags),
    }


def post_options(args: argparse.Namespace, config: dict[str, object]) -> tuple[list[str], list[str]]:
    categories = (
        parse_csv(args.categories)
        if args.categories is not None
        else list(config["categories"])
    )
    tags = parse_csv(args.tags) if args.tags is not None else list(config["tags"])
    return categories, tags


def public_post_url(config: dict[str, object], post_id: object) -> str:
    return f"{config['blog_url']}/p/{post_id}.html"


def cmd_publish(args: argparse.Namespace) -> None:
    config = get_config()
    title, body = parse_markdown(args.file)
    categories, tags = post_options(args, config)
    post = build_post(title, body, categories, tags)

    client = xmlrpc.client.ServerProxy(str(config["endpoint"]))
    post_id = client.metaWeblog.newPost(
        config["blogid"],
        config["username"],
        config["password"],
        post,
        True,
    )
    print("Published successfully")
    print(f"postid: {post_id}")
    print(f"url: {public_post_url(config, post_id)}")


def cmd_update(args: argparse.Namespace) -> None:
    config = get_config()
    title, body = parse_markdown(args.file)
    categories, tags = post_options(args, config)
    post = build_post(title, body, categories, tags)

    client = xmlrpc.client.ServerProxy(str(config["endpoint"]))
    result = client.metaWeblog.editPost(
        args.update,
        config["username"],
        config["password"],
        post,
        True,
    )
    print(f"Updated successfully: {result}")
    print(f"url: {public_post_url(config, args.update)}")


def cmd_list(args: argparse.Namespace) -> None:
    config = get_config()
    count = args.list
    client = xmlrpc.client.ServerProxy(str(config["endpoint"]))
    posts = client.metaWeblog.getRecentPosts(
        config["blogid"],
        config["username"],
        config["password"],
        count,
    )
    print(f"Recent posts: {len(posts)}")
    for post in posts:
        print(f"[{post['postid']}] {post['title']}")


def cmd_get(args: argparse.Namespace) -> None:
    config = get_config()
    client = xmlrpc.client.ServerProxy(str(config["endpoint"]))
    post = client.metaWeblog.getPost(
        args.get,
        config["username"],
        config["password"],
    )
    print(f"title: {post['title']}")
    print(f"postid: {post['postid']}")
    print(f"body preview:\n{post['description'][:200]}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("file", nargs="?", help="Markdown file to publish")
    parser.add_argument("--update", metavar="POST_ID", help="update an existing post")
    parser.add_argument(
        "--categories",
        metavar="CSV",
        help="comma-separated categories; overrides CNBLOGS_CATEGORIES",
    )
    parser.add_argument(
        "--tags",
        metavar="CSV",
        help="comma-separated tags; overrides CNBLOGS_TAGS",
    )
    parser.add_argument(
        "--list",
        nargs="?",
        type=int,
        const=10,
        metavar="N",
        help="list the N most recent posts (default: 10)",
    )
    parser.add_argument("--get", metavar="POST_ID", help="get one post")
    args = parser.parse_args()

    selected_actions = sum(
        (
            args.file is not None,
            args.list is not None,
            args.get is not None,
        )
    )
    if selected_actions != 1:
        parser.error("choose exactly one of FILE, --list, or --get")
    if args.update and not args.file:
        parser.error("--update requires FILE")
    if (args.categories is not None or args.tags is not None) and not args.file:
        parser.error("--categories and --tags require FILE")

    if args.list is not None:
        cmd_list(args)
    elif args.get is not None:
        cmd_get(args)
    elif args.update:
        cmd_update(args)
    else:
        cmd_publish(args)


if __name__ == "__main__":
    main()
