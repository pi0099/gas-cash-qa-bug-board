#!/usr/bin/env bash
# GitHub Pages returns HTTP 404 for unknown paths even when 404.html is the SPA shell.
# Materialize known SPA routes as directories so deep links return 200.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/dist"
cp "$DIST/index.html" "$DIST/404.html"
for route in overview summary mindmap test-cases; do
  mkdir -p "$DIST/$route"
  cp "$DIST/index.html" "$DIST/$route/index.html"
done
# Materialize known TC detail shells so deep links 200 on Pages
if [[ -f "$ROOT/data/test-cases.json" ]]; then
  node -e "
    const fs=require('fs');
    const path=require('path');
    const dist=process.argv[1];
    const suite=JSON.parse(fs.readFileSync(path.join(process.argv[2],'data/test-cases.json'),'utf8'));
    const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
    for (const tc of suite.testCases||[]) {
      const dir=path.join(dist,'test-cases',tc.id);
      fs.mkdirSync(dir,{recursive:true});
      fs.writeFileSync(path.join(dir,'index.html'), html);
    }
  " "$DIST" "$ROOT"
fi
