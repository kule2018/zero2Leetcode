import java.lang.reflect.Modifier;
import top.onefly.zero2leetcode.runner.BrowserJavaRunner;

public final class BrowserJavaRunnerTest {
    public static void main(String[] args) throws Exception {
        String runtimeVersion = System.getProperty("java.version");
        expectTrue(
            Modifier.isSynchronized(
                BrowserJavaRunner.class.getMethod("run", String.class, String.class, int.class).getModifiers()
            ),
            "serialized runner execution"
        );
        expectContains(BrowserJavaRunner.warmup(), "ok", "compiler warmup");
        expectEquals(System.getProperty("java.version"), runtimeVersion, "java.version restoration");

        String success = BrowserJavaRunner.run("""
            import java.util.*;
            import java.util.random.RandomGenerator;
            public class Main {
                record Pair(int left, int right) {}
                public static void main(String[] args) {
                    try (Scanner scanner = new Scanner(System.in)) {
                        Pair pair = new Pair(scanner.nextInt(), scanner.nextInt());
                        RandomGenerator generator = RandomGenerator.getDefault();
                        System.out.println(pair.left() + pair.right() + (generator == null ? 1 : 0));
                    }
                }
            }
            """, "3 5", 65536);
        expectContains(success, "\"stdout\":\"8\\n\"", "Java 17 stdin/stdout");
        expectContains(success, "\"error\":null", "successful execution");

        String modules = BrowserJavaRunner.run("""
            import java.net.http.HttpClient;
            import java.sql.Date;
            import javax.swing.JFrame;
            import org.w3c.dom.Document;
            public class Main {
                static HttpClient http;
                static Date date;
                static JFrame frame;
                static Document document;
                public static void main(String[] args) {
                    System.out.println(System.getProperty("java.version"));
                }
            }
            """, "", 65536);
        expectContains(modules, "\"stdout\":\"" + runtimeVersion + "\\n\"", "Java 17 module APIs");
        expectEquals(System.getProperty("java.version"), runtimeVersion, "java.version after execution");

        String compileError = BrowserJavaRunner.run(
            "public class Main { public static void main(String[] args) { nope } }",
            "",
            65536
        );
        expectContains(compileError, "\"phase\":\"compile\"", "compile error phase");

        String runtimeError = BrowserJavaRunner.run(
            "public class Main { public static void main(String[] args) { throw new RuntimeException(\"boom\"); } }",
            "",
            65536
        );
        expectContains(runtimeError, "RuntimeException", "runtime stack trace");
        expectContains(runtimeError, "\"phase\":\"runtime\"", "runtime error phase");

        String limited = BrowserJavaRunner.run(
            "public class Main { public static void main(String[] args) { System.out.print(\"x\".repeat(4096)); } }",
            "",
            1024
        );
        expectContains(limited, "\"phase\":\"limit\"", "output limit phase");

        System.out.println("BrowserJavaRunner tests passed");
    }

    private static void expectContains(String actual, String expected, String label) {
        if (!actual.contains(expected)) {
            throw new AssertionError(label + " failed. Expected " + expected + " in " + actual);
        }
    }

    private static void expectEquals(String actual, String expected, String label) {
        if (!java.util.Objects.equals(actual, expected)) {
            throw new AssertionError(label + " failed. Expected " + expected + ", got " + actual);
        }
    }

    private static void expectTrue(boolean actual, String label) {
        if (!actual) throw new AssertionError(label + " failed.");
    }
}
