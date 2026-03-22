#!/usr/bin/env python3
"""博客园 MetaWeblog 发布脚本

用法:
  python publish.py <markdown文件路径>                  # 发布新文章
  python publish.py <markdown文件路径> --update <postid> # 更新已有文章
  python publish.py --list [N]                          # 查询最近 N 篇文章（默认10）
  python publish.py --get <postid>                      # 获取单篇文章详情

环境变量从项目根目录 .env 文件读取。
"""

import argparse
import os
import sys
import xmlrpc.client
from pathlib import Path


def load_env():
    """从 .env 文件加载环境变量"""
    # 从脚本位置向上找到项目根目录的 .env
    env_path = Path(__file__).resolve().parents[2] / ".env"
    if not env_path.exists():
        print(f"❌ 找不到 .env 文件: {env_path}")
        sys.exit(1)

    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            key, _, value = line.partition("=")
            os.environ.setdefault(key.strip(), value.strip())


def get_config():
    """从环境变量获取配置"""
    load_env()
    return {
        "endpoint": os.environ["CNBLOGS_ENDPOINT"],
        "username": os.environ["CNBLOGS_USERNAME"],
        "password": os.environ["CNBLOGS_PASSWORD"],
        "blogid":   os.environ["CNBLOGS_BLOGID"],
    }


def parse_markdown(filepath):
    """解析 Markdown 文件，返回 (title, body)"""
    with open(filepath, "r", encoding="utf-8") as f:
        raw = f.read()

    lines = raw.splitlines()
    title = lines[0].lstrip("#").strip()
    body = "\n".join(lines[1:]).lstrip("\n")
    return title, body


def build_post(title, body, extra_keywords=""):
    """构建 post 字典"""
    keywords = "LeetCode,Python,算法,复习指导"
    if extra_keywords:
        keywords += "," + extra_keywords

    return {
        "title":       title,
        "description": body,
        "categories":  ["[Markdown]", "python", "LeetCode"],
        "mt_keywords": keywords,
    }


def cmd_publish(args):
    """发布新文章"""
    cfg = get_config()
    title, body = parse_markdown(args.file)
    post = build_post(title, body, args.tags or "")

    client = xmlrpc.client.ServerProxy(cfg["endpoint"])
    postid = client.metaWeblog.newPost(cfg["blogid"], cfg["username"], cfg["password"], post, True)

    url = f"https://www.cnblogs.com/ranxi169/p/{postid}.html"
    print(f"✅ 发布成功!")
    print(f"   postid: {postid}")
    print(f"   链接:   {url}")
    return postid


def cmd_update(args):
    """更新已有文章"""
    cfg = get_config()
    title, body = parse_markdown(args.file)
    post = build_post(title, body, args.tags or "")

    client = xmlrpc.client.ServerProxy(cfg["endpoint"])
    result = client.metaWeblog.editPost(args.update, cfg["username"], cfg["password"], post, True)

    url = f"https://www.cnblogs.com/ranxi169/p/{args.update}.html"
    print(f"✅ 更新成功: {result}")
    print(f"   链接:   {url}")


def cmd_list(args):
    """查询最近文章列表"""
    cfg = get_config()
    count = args.list if args.list else 10

    client = xmlrpc.client.ServerProxy(cfg["endpoint"])
    posts = client.metaWeblog.getRecentPosts(cfg["blogid"], cfg["username"], cfg["password"], count)

    print(f"📋 最近 {len(posts)} 篇文章:\n")
    for p in posts:
        print(f"  [{p['postid']}] {p['title']}")


def cmd_get(args):
    """获取单篇文章详情"""
    cfg = get_config()

    client = xmlrpc.client.ServerProxy(cfg["endpoint"])
    post = client.metaWeblog.getPost(args.get, cfg["username"], cfg["password"])

    print(f"📄 标题: {post['title']}")
    print(f"   postid: {post['postid']}")
    print(f"   正文前200字:\n{post['description'][:200]}")


def main():
    parser = argparse.ArgumentParser(description="博客园 MetaWeblog 发布工具")
    parser.add_argument("file", nargs="?", help="要发布的 Markdown 文件路径")
    parser.add_argument("--update", metavar="POSTID", help="更新已有文章的 postid")
    parser.add_argument("--tags", metavar="TAGS", help="额外标签，逗号分隔，如: 链表,双指针")
    parser.add_argument("--list", nargs="?", type=int, const=10, metavar="N", help="查询最近 N 篇文章")
    parser.add_argument("--get", metavar="POSTID", help="获取单篇文章详情")

    args = parser.parse_args()

    if args.list is not None:
        cmd_list(args)
    elif args.get:
        cmd_get(args)
    elif args.file:
        if args.update:
            cmd_update(args)
        else:
            cmd_publish(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
