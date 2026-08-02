#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ECJ_VERSION="3.42.0"
ECJ_SHA256="29f6d3918ee02db4400c103bc25dd90a22491c3a395867d9393070cb96a7dd29"
OUTPUT="$ROOT/assets/vendor/zero2leetcode-java-runner-20260803.jar"
SOURCE="$ROOT/tools/java-browser-runner/src/top/onefly/zero2leetcode/runner/BrowserJavaRunner.java"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

JAVA_HOME="${JAVA_HOME:-$(cd "$(dirname "$(command -v javac)")/.." && pwd)}"
CT_SYM="$JAVA_HOME/lib/ct.sym"
JAVA_17_SYMBOL="H"
SOURCE_DATE_EPOCH="${SOURCE_DATE_EPOCH:-1785715200}"
JAR_TIMESTAMP="$(date -u -d "@$SOURCE_DATE_EPOCH" '+%Y-%m-%dT%H:%M:%SZ')"
if [[ ! -f "$CT_SYM" ]]; then
  echo "OpenJDK ct.sym not found under JAVA_HOME: $JAVA_HOME" >&2
  exit 1
fi

curl --fail --location --silent --show-error \
  --connect-timeout 15 --retry 5 --retry-all-errors \
  "https://repo.maven.apache.org/maven2/org/eclipse/jdt/ecj/$ECJ_VERSION/ecj-$ECJ_VERSION.jar" \
  --output "$TMP_DIR/ecj.jar"
echo "$ECJ_SHA256  $TMP_DIR/ecj.jar" | sha256sum --check --status

mkdir -p "$TMP_DIR/classes" "$TMP_DIR/stage"
javac --release 17 -encoding UTF-8 -cp "$TMP_DIR/ecj.jar" -d "$TMP_DIR/classes" "$SOURCE"
mkdir -p "$TMP_DIR/ct-sym" "$TMP_DIR/java17-api"
(
  cd "$TMP_DIR/ct-sym"
  jar xf "$CT_SYM"
)
for release_dir in "$TMP_DIR/ct-sym/"*"$JAVA_17_SYMBOL"*; do
  [[ -d "$release_dir" ]] || continue
  for module_dir in "$release_dir"/*; do
    [[ -d "$module_dir" ]] || continue
    cp -R "$module_dir/." "$TMP_DIR/java17-api/"
  done
done
find "$TMP_DIR/java17-api" -name 'module-info.sig' -delete

if [[ ! -f "$TMP_DIR/java17-api/java/lang/Object.sig" ]]; then
  echo "JAVA_HOME ct.sym does not contain Java 17 API signatures; use JDK 21+" >&2
  exit 1
fi
(
  cd "$TMP_DIR/stage"
  jar xf "$TMP_DIR/ecj.jar"
)
rm -f "$TMP_DIR/stage/META-INF/"*.SF \
      "$TMP_DIR/stage/META-INF/"*.RSA \
      "$TMP_DIR/stage/META-INF/"*.DSA
cp -R "$TMP_DIR/classes/." "$TMP_DIR/stage/"
mkdir -p "$TMP_DIR/stage/META-INF/java17-api"
cp -R "$TMP_DIR/java17-api/." "$TMP_DIR/stage/META-INF/java17-api/"
(
  cd "$TMP_DIR/java17-api"
  find . -type f -name '*.sig' \
    | LC_ALL=C sort \
    | sed -e 's#^\./##' -e 's#/#.#g' -e 's#\.sig$##'
) > "$TMP_DIR/stage/META-INF/java17-api.index"
mkdir -p "$(dirname "$OUTPUT")"
jar --create --file "$OUTPUT" --date="$JAR_TIMESTAMP" -C "$TMP_DIR/stage" .
sha256sum "$OUTPUT"
