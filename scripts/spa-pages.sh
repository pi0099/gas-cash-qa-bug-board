#!/usr/bin/env bash
# GitHub Pages returns HTTP 404 for unknown paths even when 404.html is the SPA shell.
# Materialize known SPA routes as directories so deep links return 200.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/dist"
cp "$DIST/index.html" "$DIST/404.html"
for route in overview summary mindmap; do
  mkdir -p "$DIST/$route"
  cp "$DIST/index.html" "$DIST/$route/index.html"
done
