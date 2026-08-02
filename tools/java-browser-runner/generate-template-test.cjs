const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const outputPath = process.argv[2];
if (!outputPath) {
    throw new Error('Usage: node generate-template-test.cjs <output.java>');
}

const projectRoot = path.resolve(__dirname, '..', '..');
const playgroundSource = fs.readFileSync(
    path.join(projectRoot, 'assets/js/acm-playground.js'),
    'utf8'
);
const storage = new Map();
const sandbox = {
    AbortController,
    TextDecoder,
    TextEncoder,
    URLSearchParams,
    atob,
    btoa,
    clearTimeout,
    console,
    document: {
        addEventListener() {},
        createElement() { return {}; },
        getElementById() { return null; }
    },
    fetch: async () => { throw new Error('Unexpected network request'); },
    localStorage: {
        getItem(key) { return storage.has(key) ? storage.get(key) : null; },
        removeItem(key) { storage.delete(key); },
        setItem(key, value) { storage.set(key, String(value)); }
    },
    performance: { now: () => 0 },
    setTimeout,
    window: { location: { search: '' } }
};
sandbox.window.window = sandbox.window;

vm.createContext(sandbox);
vm.runInContext(playgroundSource, sandbox, { filename: 'acm-playground.js' });
const templates = JSON.parse(vm.runInContext('JSON.stringify(JAVA_TEMPLATES)', sandbox));

function base64(value) {
    return Buffer.from(String(value), 'utf8').toString('base64');
}

const invocations = Object.entries(templates).map(([name, template]) => (
    `        verify("${name}", "${base64(template.code)}", ` +
    `"${base64(template.input)}", "${base64(template.expected || '')}");`
)).join('\n');

const generatedSource = String.raw`import java.nio.charset.StandardCharsets;
import java.util.Base64;
import top.onefly.zero2leetcode.runner.BrowserJavaRunner;

public final class GeneratedJavaTemplatesTest {
    public static void main(String[] args) {
${invocations}
        System.out.println("Java template tests passed: ${Object.keys(templates).length}");
    }

    private static void verify(
        String name,
        String sourceBase64,
        String inputBase64,
        String expectedBase64
    ) {
        String result = BrowserJavaRunner.run(
            decode(sourceBase64),
            decode(inputBase64),
            65536
        );
        if (!result.contains("\"error\":null")) {
            throw new AssertionError(name + " template failed: " + result);
        }

        String expected = decode(expectedBase64);
        String exact = "\"stdout\":" + jsonString(expected);
        String withNewline = "\"stdout\":" + jsonString(expected + "\n");
        if (!result.contains(exact) && !result.contains(withNewline)) {
            throw new AssertionError(name + " output mismatch: " + result);
        }
    }

    private static String decode(String value) {
        return new String(Base64.getDecoder().decode(value), StandardCharsets.UTF_8);
    }

    private static String jsonString(String value) {
        return "\"" + value
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\r", "\\r")
            .replace("\n", "\\n")
            .replace("\t", "\\t") + "\"";
    }
}
`;

fs.writeFileSync(outputPath, generatedSource, 'utf8');
