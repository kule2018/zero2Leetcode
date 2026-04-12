// =============================================
// ACM Bridge — 在真题文章中注入"在 ACM IDE 中运行"按钮
// 仅在 04_real_interviews 页面上激活
// =============================================

(function () {
    // 仅在真题页面生效
    if (window.location.pathname.indexOf('04_real_interviews') === -1) return;

    // 等待 hljs 高亮完成后执行
    var ready = window.requestIdleCallback || function (fn) { setTimeout(fn, 100); };
    ready(function () { injectButtons(); });

    function injectButtons() {
        var article = document.querySelector('.doc-article');
        if (!article) return;

        // 找到所有 Python 代码块
        var codeBlocks = article.querySelectorAll('pre > code');
        var pythonBlocks = [];
        for (var i = 0; i < codeBlocks.length; i++) {
            var cls = codeBlocks[i].className || '';
            if (cls.indexOf('python') !== -1) {
                pythonBlocks.push(codeBlocks[i].parentElement); // <pre>
            }
        }

        pythonBlocks.forEach(function (pre) {
            var data = findSampleData(pre);
            if (!data) return;

            var btn = document.createElement('a');
            btn.className = 'acm-run-btn';
            btn.target = '_blank';
            btn.rel = 'noopener';
            btn.textContent = '\u25B6 \u5728 ACM IDE \u4E2D\u8FD0\u884C'; // ▶ 在 ACM IDE 中运行

            // 构建 URL
            var base = (window.Z2L_BASE || '').replace(/\/$/, '');
            var params = [];
            params.push('code=' + encodeURIComponent(encodeB64(data.code)));
            if (data.input) params.push('input=' + encodeURIComponent(encodeB64(data.input)));
            if (data.expected) params.push('expected=' + encodeURIComponent(encodeB64(data.expected)));
            btn.href = base + '/acm-playground.html?' + params.join('&');

            // 插入到代码块前面
            pre.parentNode.insertBefore(btn, pre);
        });
    }

    /**
     * 从一个 Python <pre> 块向上查找同一道题的 样例输入/输出
     * 返回 { code, input, expected } 或 null
     */
    function findSampleData(pythonPre) {
        var code = pythonPre.textContent || '';
        if (!code.trim()) return null;

        // 向上遍历同级兄弟节点，寻找输入/输出 code blocks
        var input = null;
        var expected = null;

        // 收集从当前 <pre> 往上直到 <h2> 之间的所有元素
        var siblings = [];
        var el = pythonPre.previousElementSibling;
        while (el) {
            if (el.tagName === 'H2') break; // 题目边界
            siblings.unshift(el);
            el = el.previousElementSibling;
        }

        // 在 siblings 中寻找 **输入** 和 **输出** 后的 <pre> 块
        for (var i = 0; i < siblings.length; i++) {
            var node = siblings[i];
            var text = node.textContent || '';

            // 检查是否包含 **输入** 标记
            if (isLabel(node, '输入') && siblings[i + 1] && siblings[i + 1].tagName === 'PRE') {
                input = siblings[i + 1].textContent || '';
            }
            // 检查是否包含 **输出** 标记
            if (isLabel(node, '输出') && siblings[i + 1] && siblings[i + 1].tagName === 'PRE') {
                expected = siblings[i + 1].textContent || '';
            }
        }

        // 至少要有代码才返回
        if (!code.trim()) return null;

        return {
            code: code.trim(),
            input: (input || '').trim(),
            expected: (expected || '').trim()
        };
    }

    /**
     * 判断一个元素是否是 <p><strong>输入</strong></p> 这样的标记
     */
    function isLabel(el, keyword) {
        if (el.tagName !== 'P') return false;
        var strong = el.querySelector('strong');
        if (!strong) return false;
        return strong.textContent.trim() === keyword;
    }

    /**
     * Base64 编码（支持 Unicode / 中文）
     */
    function encodeB64(str) {
        try {
            var bytes = new TextEncoder().encode(str);
            var binary = '';
            for (var i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
        } catch (e) {
            return btoa(unescape(encodeURIComponent(str)));
        }
    }
})();
