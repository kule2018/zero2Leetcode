import top.onefly.zero2leetcode.runner.BrowserJavaRunner;

public final class BrowserJavaRunnerTest {
    public static void main(String[] args) {
        expectContains(BrowserJavaRunner.warmup(), "ok", "compiler warmup");

        String success = BrowserJavaRunner.run("""
            import java.util.*;
            public class Main {
                record Pair(int left, int right) {}
                public static void main(String[] args) {
                    try (Scanner scanner = new Scanner(System.in)) {
                        Pair pair = new Pair(scanner.nextInt(), scanner.nextInt());
                        System.out.println(pair.left() + pair.right());
                    }
                }
            }
            """, "3 5", 65536);
        expectContains(success, "\"stdout\":\"8\\n\"", "Java 17 stdin/stdout");
        expectContains(success, "\"error\":null", "successful execution");

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
}
