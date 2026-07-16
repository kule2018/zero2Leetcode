import io
import json
import sys
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path
from unittest.mock import AsyncMock, patch


SKILL_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SKILL_DIR))

from scripts import crawl_wechat  # noqa: E402


class CrawlWechatHelpersTest(unittest.TestCase):
    def test_accepts_public_https_article_url(self):
        url = "https://mp.weixin.qq.com/s/example?from=test"
        self.assertEqual(crawl_wechat.validate_wechat_url(url), url)

    def test_rejects_non_wechat_or_insecure_urls(self):
        invalid = [
            "http://mp.weixin.qq.com/s/example",
            "https://example.com/s/example",
            "https://mp.weixin.qq.com.evil.test/s/example",
            "https://mp.weixin.qq.com/profile/example",
        ]
        for url in invalid:
            with self.subTest(url=url), self.assertRaises(ValueError):
                crawl_wechat.validate_wechat_url(url)

    def test_image_reference_is_relative_posix_path(self):
        self.assertEqual(
            crawl_wechat._image_reference(r"assets\images", "image.jpg"),
            "assets/images/image.jpg",
        )
        for prefix in ("/images", "../images", "https://example.com/images"):
            with self.subTest(prefix=prefix), self.assertRaises(ValueError):
                crawl_wechat._image_reference(prefix, "image.jpg")

    def test_output_stem_does_not_overwrite(self):
        with tempfile.TemporaryDirectory() as directory:
            Path(directory, "article.md").write_text("old", encoding="utf-8")
            stem = crawl_wechat._unique_output_stem(directory, "article", [".md", ".html"])
            self.assertEqual(stem, "article_2")

    def test_cli_keeps_stdout_as_json(self):
        article = {
            "title": "Example",
            "author": "Author",
            "publish_time": "2026-01-01",
            "account_desc": "Description",
            "markdown": "Body",
            "html": "<p>Body</p>",
            "url": "https://mp.weixin.qq.com/s/example",
        }
        stdout = io.StringIO()
        stderr = io.StringIO()
        argv = ["crawl_wechat.py", article["url"]]
        with (
            patch.object(sys, "argv", argv),
            patch.object(crawl_wechat, "crawl_wechat_article", AsyncMock(return_value=article)),
            redirect_stdout(stdout),
            redirect_stderr(stderr),
        ):
            crawl_wechat.main()

        self.assertEqual(json.loads(stdout.getvalue())["title"], "Example")
        self.assertNotIn("Content preview", stdout.getvalue())
        self.assertIn("Content preview", stderr.getvalue())


class FakeContent:
    def __init__(self, chunks):
        self.chunks = chunks

    async def iter_chunked(self, _size):
        for chunk in self.chunks:
            yield chunk


class FakeResponse:
    def __init__(self, url, status=200, headers=None, chunks=None):
        self.url = url
        self.status = status
        self.headers = headers or {}
        self.content = FakeContent(chunks or [])
        self.released = False

    def raise_for_status(self):
        if self.status >= 400:
            raise RuntimeError(f"HTTP {self.status}")

    def release(self):
        self.released = True


class FakeSession:
    def __init__(self, responses):
        self.responses = iter(responses)

    async def get(self, _url, allow_redirects=False):
        if allow_redirects:
            raise AssertionError("redirects must be handled manually")
        return next(self.responses)


class ImageDownloadSafetyTest(unittest.IsolatedAsyncioTestCase):
    async def test_download_returns_filename_and_writes_bounded_image(self):
        url = "https://mmbiz.qpic.cn/example"
        response = FakeResponse(
            url,
            headers={"Content-Type": "image/png", "Content-Length": "3"},
            chunks=[b"png"],
        )
        with tempfile.TemporaryDirectory() as directory:
            filename = await crawl_wechat._download_one(FakeSession([response]), url, directory)
            self.assertEqual(Path(directory, filename).read_bytes(), b"png")
            self.assertTrue(filename.endswith(".png"))
        self.assertTrue(response.released)

    async def test_rejects_redirect_outside_wechat_cdn(self):
        url = "https://mmbiz.qpic.cn/example"
        response = FakeResponse(
            url,
            status=302,
            headers={"Location": "https://example.com/image.jpg"},
        )
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaises(ValueError):
                await crawl_wechat._download_one(FakeSession([response]), url, directory)
        self.assertTrue(response.released)


if __name__ == "__main__":
    unittest.main()
