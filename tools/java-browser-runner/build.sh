#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ECJ_VERSION="3.42.0"
ECJ_SHA256="29f6d3918ee02db4400c103bc25dd90a22491c3a395867d9393070cb96a7dd29"
OUTPUT="$ROOT/assets/vendor/zero2leetcode-java-runner.jar"
SOURCE="$ROOT/tools/java-browser-runner/src/top/onefly/zero2leetcode/runner/BrowserJavaRunner.java"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

curl --fail --location --silent --show-error \
  "https://repo.maven.apache.org/maven2/org/eclipse/jdt/ecj/$ECJ_VERSION/ecj-$ECJ_VERSION.jar" \
  --output "$TMP_DIR/ecj.jar"
echo "$ECJ_SHA256  $TMP_DIR/ecj.jar" | sha256sum --check --status

mkdir -p "$TMP_DIR/classes" "$TMP_DIR/stage"
javac --release 17 -cp "$TMP_DIR/ecj.jar" -d "$TMP_DIR/classes" "$SOURCE"
(
  cd "$TMP_DIR/stage"
  jar xf "$TMP_DIR/ecj.jar"
)
rm -f "$TMP_DIR/stage/META-INF/"*.SF \
      "$TMP_DIR/stage/META-INF/"*.RSA \
      "$TMP_DIR/stage/META-INF/"*.DSA
cp -R "$TMP_DIR/classes/." "$TMP_DIR/stage/"
mkdir -p "$(dirname "$OUTPUT")"
jar --create --file "$OUTPUT" -C "$TMP_DIR/stage" .
sha256sum "$OUTPUT"
