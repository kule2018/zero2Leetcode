package top.onefly.zero2leetcode.runner;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.io.StringWriter;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.SecureClassLoader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;
import javax.tools.Diagnostic;
import javax.tools.DiagnosticCollector;
import javax.tools.FileObject;
import javax.tools.ForwardingJavaFileManager;
import javax.tools.JavaCompiler;
import javax.tools.JavaFileManager;
import javax.tools.JavaFileObject;
import javax.tools.SimpleJavaFileObject;
import javax.tools.StandardJavaFileManager;
import javax.tools.StandardLocation;
import org.eclipse.jdt.internal.compiler.tool.EclipseCompiler;

/** Compiles and runs a single ACM-style Main.java entirely inside CheerpJ. */
public final class BrowserJavaRunner {
    private static final int MIN_OUTPUT_BYTES = 1024;
    private static final JavaCompiler COMPILER = new EclipseCompiler();

    private BrowserJavaRunner() {}

    public static String warmup() {
        CompilationResult result = compile("final class Z2LWarmup {}", "Z2LWarmup.java");
        return result.success ? "ok" : result.errors;
    }

    public static String run(String source, String stdin, int maxOutputBytes) {
        if (source == null || source.trim().isEmpty()) {
            return result("", "Java 源码不能为空。", null, "compile", false);
        }

        CompilationResult compilation = compile(source, "Main.java");
        if (!compilation.success) {
            return result("", compilation.errors, compilation.warnings, "compile", false);
        }
        if (!compilation.classes.containsKey("Main")) {
            return result(
                "",
                "找不到入口类 Main，请使用不带 package 的 public class Main。",
                compilation.warnings,
                "compile",
                false
            );
        }

        int outputLimit = Math.max(MIN_OUTPUT_BYTES, maxOutputBytes);
        OutputBudget outputBudget = new OutputBudget(outputLimit);
        LimitedOutputStream stdoutBuffer = new LimitedOutputStream(outputBudget);
        LimitedOutputStream stderrBuffer = new LimitedOutputStream(outputBudget);
        PrintStream stdout;
        PrintStream stderr;
        try {
            stdout = new PrintStream(stdoutBuffer, true, StandardCharsets.UTF_8.name());
            stderr = new PrintStream(stderrBuffer, true, StandardCharsets.UTF_8.name());
        } catch (Exception error) {
            return result("", stackTrace(error), compilation.warnings, "service", true);
        }

        ByteArrayInputStream input = new ByteArrayInputStream(
            (stdin == null ? "" : stdin).getBytes(StandardCharsets.UTF_8)
        );
        PrintStream originalOut = System.out;
        PrintStream originalErr = System.err;
        java.io.InputStream originalIn = System.in;
        AtomicReference<Throwable> runtimeFailure = new AtomicReference<>();
        ThreadGroup userThreads = new ThreadGroup("z2l-java-user-code");

        try {
            System.setIn(input);
            System.setOut(stdout);
            System.setErr(stderr);

            MemoryClassLoader classLoader = new MemoryClassLoader(compilation.classes);
            Thread mainThread = new Thread(userThreads, () -> {
                try {
                    invokeMain(classLoader);
                } catch (Throwable error) {
                    runtimeFailure.set(unwrap(error));
                }
            }, "Main");
            mainThread.setContextClassLoader(classLoader);
            mainThread.start();
            mainThread.join();

            boolean leakedThreads = interruptRemainingThreads(userThreads);
            stdout.flush();
            stderr.flush();

            String stdoutText = stdoutBuffer.asString();
            String stderrText = stderrBuffer.asString();
            if (outputBudget.truncated) {
                return result(
                    stdoutText,
                    "Java 程序输出超过 64 KB 限制。",
                    joinWarnings(compilation.warnings, stderrText),
                    "limit",
                    leakedThreads
                );
            }

            Throwable failure = runtimeFailure.get();
            if (failure != null) {
                String runtimeError = stackTrace(failure);
                return result(
                    stdoutText,
                    joinWarnings(stderrText, runtimeError),
                    compilation.warnings,
                    "runtime",
                    leakedThreads
                );
            }

            String threadWarning = leakedThreads
                ? "程序结束后仍有后台线程，浏览器 Java 运行时将重新加载。"
                : null;
            return result(
                stdoutText,
                null,
                joinWarnings(compilation.warnings, stderrText, threadWarning),
                null,
                leakedThreads
            );
        } catch (InterruptedException error) {
            Thread.currentThread().interrupt();
            return result(
                stdoutBuffer.asString(),
                "Java 执行线程被中断。",
                compilation.warnings,
                "runtime",
                true
            );
        } catch (Throwable error) {
            return result(
                stdoutBuffer.asString(),
                stackTrace(unwrap(error)),
                compilation.warnings,
                "runtime",
                true
            );
        } finally {
            System.setIn(originalIn);
            System.setOut(originalOut);
            System.setErr(originalErr);
            stdout.close();
            stderr.close();
        }
    }

    private static CompilationResult compile(String source, String fileName) {
        System.setProperty("jdt.compiler.useSingleThread", "true");
        DiagnosticCollector<JavaFileObject> diagnostics = new DiagnosticCollector<>();
        StandardJavaFileManager standardManager = COMPILER.getStandardFileManager(
            diagnostics,
            Locale.SIMPLIFIED_CHINESE,
            StandardCharsets.UTF_8
        );
        MemoryFileManager manager = new MemoryFileManager(standardManager);
        List<String> options = List.of(
            "-source", "17",
            "-target", "17",
            "-encoding", "UTF-8",
            "-proc:none",
            "-g:none"
        );

        boolean success = false;
        String internalError = null;
        StringWriter compilerOutput = new StringWriter();
        try {
            JavaCompiler.CompilationTask task = COMPILER.getTask(
                compilerOutput,
                manager,
                diagnostics,
                options,
                null,
                List.of(new SourceFile(fileName, source))
            );
            success = Boolean.TRUE.equals(task.call());
        } catch (Throwable error) {
            internalError = "Java 编译器异常：" + error.getClass().getSimpleName() + ": " + error.getMessage();
        } finally {
            try {
                manager.close();
            } catch (IOException ignored) {}
        }

        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        for (Diagnostic<? extends JavaFileObject> diagnostic : diagnostics.getDiagnostics()) {
            String formatted = formatDiagnostic(diagnostic);
            if (diagnostic.getKind() == Diagnostic.Kind.ERROR) {
                errors.add(formatted);
            } else if (diagnostic.getKind() == Diagnostic.Kind.WARNING ||
                       diagnostic.getKind() == Diagnostic.Kind.MANDATORY_WARNING) {
                warnings.add(formatted);
            }
        }
        if (internalError != null) errors.add(internalError);
        if (!success && errors.isEmpty() && !compilerOutput.toString().trim().isEmpty()) {
            errors.add(compilerOutput.toString().trim());
        }
        if (!success && errors.isEmpty()) errors.add("Java 编译失败。");

        return new CompilationResult(
            success && internalError == null,
            manager.classBytes(),
            String.join("\n", errors),
            warnings.isEmpty() ? null : String.join("\n", warnings)
        );
    }

    private static String formatDiagnostic(Diagnostic<? extends JavaFileObject> diagnostic) {
        StringBuilder text = new StringBuilder("Main.java");
        if (diagnostic.getLineNumber() > 0) {
            text.append(':').append(diagnostic.getLineNumber());
            if (diagnostic.getColumnNumber() > 0) {
                text.append(':').append(diagnostic.getColumnNumber());
            }
        }
        text.append(": ").append(diagnostic.getMessage(Locale.SIMPLIFIED_CHINESE));
        return text.toString();
    }

    private static void invokeMain(ClassLoader classLoader) throws Throwable {
        Class<?> mainClass = Class.forName("Main", true, classLoader);
        Method main = mainClass.getMethod("main", String[].class);
        if (!Modifier.isStatic(main.getModifiers()) || main.getReturnType() != Void.TYPE) {
            throw new NoSuchMethodException("Main.main 必须是 public static void main(String[] args)。");
        }
        try {
            main.invoke(null, (Object) new String[0]);
        } catch (InvocationTargetException error) {
            throw error.getCause() == null ? error : error.getCause();
        }
    }

    private static Throwable unwrap(Throwable error) {
        if (error instanceof InvocationTargetException &&
            ((InvocationTargetException) error).getCause() != null) {
            return ((InvocationTargetException) error).getCause();
        }
        return error;
    }

    private static boolean interruptRemainingThreads(ThreadGroup group) {
        int estimate = Math.max(8, group.activeCount() * 2 + 4);
        Thread[] threads = new Thread[estimate];
        int count = group.enumerate(threads, true);
        boolean found = false;
        for (int i = 0; i < count; i++) {
            Thread thread = threads[i];
            if (thread != null && thread.isAlive()) {
                found = true;
                thread.interrupt();
            }
        }
        return found;
    }

    private static String stackTrace(Throwable error) {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        try (PrintStream stream = new PrintStream(buffer, true, StandardCharsets.UTF_8.name())) {
            error.printStackTrace(stream);
        } catch (Exception ignored) {
            return error.toString();
        }
        return new String(buffer.toByteArray(), StandardCharsets.UTF_8).trim();
    }

    private static String joinWarnings(String... parts) {
        StringBuilder joined = new StringBuilder();
        for (String part : parts) {
            if (part == null || part.trim().isEmpty()) continue;
            if (joined.length() > 0) joined.append('\n');
            joined.append(part.trim());
        }
        return joined.length() == 0 ? null : joined.toString();
    }

    private static String result(
        String stdout,
        String error,
        String warning,
        String phase,
        boolean restartRuntime
    ) {
        return "{" +
            "\"stdout\":" + jsonString(stdout == null ? "" : stdout) + "," +
            "\"error\":" + jsonString(error) + "," +
            "\"warning\":" + jsonString(warning) + "," +
            "\"warningLabel\":\"Java stderr\"," +
            "\"phase\":" + jsonString(phase) + "," +
            "\"restartRuntime\":" + restartRuntime +
            "}";
    }

    private static String jsonString(String value) {
        if (value == null) return "null";
        StringBuilder escaped = new StringBuilder(value.length() + 16);
        escaped.append('"');
        for (int i = 0; i < value.length(); i++) {
            char ch = value.charAt(i);
            switch (ch) {
                case '"': escaped.append("\\\""); break;
                case '\\': escaped.append("\\\\"); break;
                case '\b': escaped.append("\\b"); break;
                case '\f': escaped.append("\\f"); break;
                case '\n': escaped.append("\\n"); break;
                case '\r': escaped.append("\\r"); break;
                case '\t': escaped.append("\\t"); break;
                default:
                    if (ch < 0x20) {
                        escaped.append(String.format("\\u%04x", (int) ch));
                    } else {
                        escaped.append(ch);
                    }
            }
        }
        return escaped.append('"').toString();
    }

    private static final class CompilationResult {
        final boolean success;
        final Map<String, byte[]> classes;
        final String errors;
        final String warnings;

        CompilationResult(
            boolean success,
            Map<String, byte[]> classes,
            String errors,
            String warnings
        ) {
            this.success = success;
            this.classes = classes;
            this.errors = errors;
            this.warnings = warnings;
        }
    }

    private static final class SourceFile extends SimpleJavaFileObject {
        private final String source;

        SourceFile(String fileName, String source) {
            super(URI.create("string:///" + fileName), JavaFileObject.Kind.SOURCE);
            this.source = source;
        }

        @Override
        public CharSequence getCharContent(boolean ignoreEncodingErrors) {
            return source;
        }
    }

    private static final class ClassFile extends SimpleJavaFileObject {
        private final ByteArrayOutputStream bytes = new ByteArrayOutputStream();

        ClassFile(String className) {
            super(
                URI.create("mem:///" + className.replace('.', '/') + JavaFileObject.Kind.CLASS.extension),
                JavaFileObject.Kind.CLASS
            );
        }

        @Override
        public OutputStream openOutputStream() {
            return bytes;
        }

        byte[] bytes() {
            return bytes.toByteArray();
        }
    }

    private static final class MemoryFileManager
        extends ForwardingJavaFileManager<StandardJavaFileManager> {
        private final Map<String, ClassFile> output = new LinkedHashMap<>();

        MemoryFileManager(StandardJavaFileManager fileManager) {
            super(fileManager);
        }

        @Override
        public boolean hasLocation(JavaFileManager.Location location) {
            return location == StandardLocation.SOURCE_PATH || super.hasLocation(location);
        }

        @Override
        public boolean contains(JavaFileManager.Location location, FileObject file) throws IOException {
            if (file instanceof SourceFile &&
                (location == StandardLocation.SOURCE_PATH ||
                 location == StandardLocation.MODULE_SOURCE_PATH)) {
                return true;
            }
            return super.contains(location, file);
        }

        @Override
        public Iterable<JavaFileObject> list(
            JavaFileManager.Location location,
            String packageName,
            Set<JavaFileObject.Kind> kinds,
            boolean recurse
        ) throws IOException {
            if (location == StandardLocation.SOURCE_PATH) {
                return Collections.emptyList();
            }
            return super.list(location, packageName, kinds, recurse);
        }

        @Override
        public JavaFileObject getJavaFileForInput(
            JavaFileManager.Location location,
            String className,
            JavaFileObject.Kind kind
        ) throws IOException {
            if (location == StandardLocation.SOURCE_PATH) {
                return null;
            }
            return super.getJavaFileForInput(location, className, kind);
        }

        @Override
        public FileObject getFileForInput(
            JavaFileManager.Location location,
            String packageName,
            String relativeName
        ) throws IOException {
            if (location == StandardLocation.SOURCE_PATH) {
                return null;
            }
            return super.getFileForInput(location, packageName, relativeName);
        }

        @Override
        public JavaFileObject getJavaFileForOutput(
            JavaFileManager.Location location,
            String className,
            JavaFileObject.Kind kind,
            FileObject sibling
        ) {
            ClassFile classFile = new ClassFile(className);
            output.put(className, classFile);
            return classFile;
        }

        Map<String, byte[]> classBytes() {
            Map<String, byte[]> classes = new LinkedHashMap<>();
            output.forEach((name, classFile) -> classes.put(name, classFile.bytes()));
            return Collections.unmodifiableMap(classes);
        }
    }

    private static final class MemoryClassLoader extends SecureClassLoader {
        private final Map<String, byte[]> classes;

        MemoryClassLoader(Map<String, byte[]> classes) {
            super(BrowserJavaRunner.class.getClassLoader());
            this.classes = classes;
        }

        @Override
        protected Class<?> findClass(String name) throws ClassNotFoundException {
            byte[] bytes = classes.get(name);
            if (bytes == null) throw new ClassNotFoundException(name);
            return defineClass(name, bytes, 0, bytes.length);
        }
    }

    private static final class OutputBudget {
        int remaining;
        boolean truncated;

        OutputBudget(int limit) {
            this.remaining = limit;
        }
    }

    private static final class LimitedOutputStream extends OutputStream {
        private final OutputBudget budget;
        private final ByteArrayOutputStream bytes = new ByteArrayOutputStream();

        LimitedOutputStream(OutputBudget budget) {
            this.budget = budget;
        }

        @Override
        public synchronized void write(int value) {
            synchronized (budget) {
                if (budget.remaining <= 0) {
                    budget.truncated = true;
                    return;
                }
                bytes.write(value);
                budget.remaining--;
            }
        }

        @Override
        public synchronized void write(byte[] data, int offset, int length) {
            synchronized (budget) {
                int accepted = Math.min(length, Math.max(0, budget.remaining));
                if (accepted > 0) {
                    bytes.write(data, offset, accepted);
                    budget.remaining -= accepted;
                }
                if (accepted < length) budget.truncated = true;
            }
        }

        String asString() {
            return new String(bytes.toByteArray(), StandardCharsets.UTF_8)
                .replace("\r\n", "\n")
                .replace('\r', '\n');
        }
    }
}
