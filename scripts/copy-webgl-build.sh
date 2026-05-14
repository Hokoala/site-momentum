#!/usr/bin/env bash
set -euo pipefail

SRC="${1:-}"
DEST="$(dirname "$0")/../public/webgl"

if [ -z "$SRC" ]; then
  echo "Usage: $0 <unity-webgl-build-dir>"
  echo "  Pass the path to the folder Unity output (containing index.html, Build/, TemplateData/)"
  exit 1
fi

if [ ! -f "$SRC/index.html" ]; then
  echo "Error: $SRC/index.html not found — does this look like a Unity WebGL output?"
  exit 1
fi

echo "Copying Unity WebGL build from $SRC to $DEST..."
mkdir -p "$DEST"
# Wipe destination but keep our .gitignore-marked placeholder
find "$DEST" -mindepth 1 -delete
cp -R "$SRC"/* "$DEST"/
echo "Done. Files copied:"
ls "$DEST"
