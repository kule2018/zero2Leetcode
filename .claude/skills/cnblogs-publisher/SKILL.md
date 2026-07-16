---
name: cnblogs-publisher
description: >
  Publish, update, inspect, and organize local Markdown articles on cnblogs.com
  through the MetaWeblog API and an optional Playwright collection workflow.
  Use when the user explicitly asks to publish or update an article on CNBlogs,
  list or inspect existing CNBlogs posts, or add posts to a CNBlogs collection.
---

# CNBlogs Publisher

Publish local Markdown files through the CNBlogs MetaWeblog API. Collection
membership is managed separately through the CNBlogs web editor because the
MetaWeblog API does not expose that setting.

## Safety

- Publishing and updating are external, user-visible mutations. Only run those
  commands after the user has explicitly requested the corresponding action.
- Confirm the target file, title, categories, tags, and update post ID before
  publishing or replacing an existing post.
- Never put credentials or browser session data in source files, command
  arguments, logs, or chat output.
- Keep `.env` and `.browser_profile/` untracked. The repository `.gitignore`
  already excludes both names at any directory depth.
- `publish.py` publishes immediately. Use it only when a public post is intended.

## Configuration

The scripts preserve already exported environment variables and optionally load
the nearest `.env` found by walking upward from the current directory and the
script directory.

Required for MetaWeblog operations:

| Variable | Purpose |
|---|---|
| `CNBLOGS_ENDPOINT` | MetaWeblog XML-RPC endpoint |
| `CNBLOGS_USERNAME` | CNBlogs login name |
| `CNBLOGS_PASSWORD` | MetaWeblog access token or password |
| `CNBLOGS_BLOGID` | Blog ID passed to MetaWeblog |

Optional publishing defaults:

| Variable | Purpose | Default |
|---|---|---|
| `CNBLOGS_BLOG_URL` | Public blog base URL used to print post links | `https://www.cnblogs.com/<CNBLOGS_BLOGID>` |
| `CNBLOGS_CATEGORIES` | Comma-separated post categories | `[Markdown]` |
| `CNBLOGS_TAGS` | Comma-separated post tags | empty |

Optional collection defaults:

| Variable | Purpose |
|---|---|
| `CNBLOGS_COLLECTION_ID` | Collection checkbox ID |
| `CNBLOGS_TITLE_PATTERN` | Regex used to select posts for bulk collection updates |
| `CNBLOGS_PROFILE_DIR` | Playwright persistent profile directory |

Example `.env` with placeholders:

```dotenv
CNBLOGS_ENDPOINT=https://rpc.cnblogs.com/metaweblog/YOUR_BLOG_ID
CNBLOGS_USERNAME=YOUR_USERNAME
CNBLOGS_PASSWORD=YOUR_ACCESS_TOKEN
CNBLOGS_BLOGID=YOUR_BLOG_ID
CNBLOGS_BLOG_URL=https://www.cnblogs.com/YOUR_BLOG_ID
CNBLOGS_CATEGORIES=[Markdown],Python
CNBLOGS_TAGS=Python,Algorithms
CNBLOGS_COLLECTION_ID=YOUR_COLLECTION_ID
CNBLOGS_TITLE_PATTERN=^LeetCode-
```

## Markdown Contract

`publish.py` treats the first line as the title and publishes the remaining
lines as the body. The first line should therefore be a Markdown H1:

```markdown
# Article title

Article body...
```

The script removes the leading `#` from the title and does not render Jekyll
front matter. Convert Jekyll articles to this simple format before publishing.

## Publish And Update

Script path:

```text
.claude/skills/cnblogs-publisher/publish.py
```

Publish with environment defaults:

```bash
python3 .claude/skills/cnblogs-publisher/publish.py path/to/article.md
```

Override categories and tags for one post:

```bash
python3 .claude/skills/cnblogs-publisher/publish.py path/to/article.md \
  --categories "[Markdown],Python" \
  --tags "Python,Dynamic Programming"
```

Update an existing post only after confirming its post ID:

```bash
python3 .claude/skills/cnblogs-publisher/publish.py path/to/article.md \
  --update POST_ID
```

Read-only inspection commands:

```bash
python3 .claude/skills/cnblogs-publisher/publish.py --list
python3 .claude/skills/cnblogs-publisher/publish.py --list 20
python3 .claude/skills/cnblogs-publisher/publish.py --get POST_ID
```

After a successful publish or update, report the returned post ID and the URL
printed by the script. Do not infer an account-specific URL in the skill.

## Collection Membership

Script path:

```text
.claude/skills/cnblogs-publisher/add_to_collection.py
```

Install the optional dependency once:

```bash
python3 -m pip install playwright
python3 -m playwright install chromium
```

Create a local authenticated browser profile:

```bash
python3 .claude/skills/cnblogs-publisher/add_to_collection.py --login
```

Add explicit posts to a collection. The collection can come from
`CNBLOGS_COLLECTION_ID` or `--collection`:

```bash
python3 .claude/skills/cnblogs-publisher/add_to_collection.py \
  --postids POST_ID_A POST_ID_B \
  --collection COLLECTION_ID
```

For a bulk operation, a title regex is required. Preview the selection before
removing `--dry-run`:

```bash
python3 .claude/skills/cnblogs-publisher/add_to_collection.py \
  --title-pattern '^LeetCode-' \
  --limit 100 \
  --collection COLLECTION_ID \
  --dry-run
```

Then run the same command without `--dry-run` only after the user confirms the
selected posts. `--headless` is available after the login profile has been
created.

## Operational Notes

- `editPost` may remove collection membership. Re-run the collection command
  for that post after an update when collection membership must be preserved.
- The Playwright workflow uses public CNBlogs editor URLs and locates the
  collection checkbox by its configured numeric ID.
- Website markup can change. Use `--dry-run` and a small explicit post list when
  validating the automation after a CNBlogs UI change.
- Platform rate limits are external state. Stop on a limit response and report
  completed and remaining posts instead of retrying publication indefinitely.
