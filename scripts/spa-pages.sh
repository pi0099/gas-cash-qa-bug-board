#!/usr/bin/env bash
# GitHub Pages returns HTTP 404 for unknown paths even when 404.html is the SPA shell.
# Materialize known SPA routes as directories so deep links return 200.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/dist"
cp "$DIST/index.html" "$DIST/404.html"

ROUTES=(overview summary mindmap test-cases)

# Detail mind maps from data/mindmaps/*.json (skip hub)
if [[ -d "$ROOT/data/mindmaps" ]]; then
  for f in "$ROOT"/data/mindmaps/*.json; do
    id="$(basename "$f" .json)"
    if [[ "$id" == "hub" ]]; then
      continue
    fi
    ROUTES+=("mindmap/$id")
  done
fi

for route in "${ROUTES[@]}"; do
  mkdir -p "$DIST/$route"
  cp "$DIST/index.html" "$DIST/$route/index.html"
done

# Materialize known TC + bug detail shells so deep links 200 on Pages
node -e "
  const fs=require('fs');
  const path=require('path');
  const dist=process.argv[1];
  const root=process.argv[2];
  const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
  function materialize(subdir, ids) {
    for (const id of ids) {
      const dir=path.join(dist, subdir, id);
      fs.mkdirSync(dir,{recursive:true});
      fs.writeFileSync(path.join(dir,'index.html'), html);
    }
  }
  if (fs.existsSync(path.join(root,'data/test-cases.json'))) {
    const suite=JSON.parse(fs.readFileSync(path.join(root,'data/test-cases.json'),'utf8'));
    materialize('test-cases', (suite.testCases||[]).map(t=>t.id).filter(Boolean));
  }
  if (fs.existsSync(path.join(root,'data/bugs.json'))) {
    const board=JSON.parse(fs.readFileSync(path.join(root,'data/bugs.json'),'utf8'));
    materialize('bugs', (board.bugs||[]).map(b=>b.id).filter(Boolean));
  }
" "$DIST" "$ROOT"
