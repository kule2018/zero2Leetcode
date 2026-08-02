#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RUNNER_JAR="$ROOT/assets/vendor/zero2leetcode-java-runner.jar"
TEST_SOURCE="$ROOT/tools/java-browser-runner/BrowserJavaRunnerTest.java"
TEMPLATE_GENERATOR="$ROOT/tools/java-browser-runner/generate-template-test.cjs"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

node "$TEMPLATE_GENERATOR" "$TMP_DIR/GeneratedJavaTemplatesTest.java"
javac --release 17 -cp "$RUNNER_JAR" -d "$TMP_DIR" \
  "$TEST_SOURCE" "$TMP_DIR/GeneratedJavaTemplatesTest.java"
java -cp "$RUNNER_JAR:$TMP_DIR" BrowserJavaRunnerTest
java -cp "$RUNNER_JAR:$TMP_DIR" GeneratedJavaTemplatesTest
