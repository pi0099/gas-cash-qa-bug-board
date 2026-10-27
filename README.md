# Gas Cash QA · Bug Board

Local triage board for Gas Cash production QA findings. **Not Linear** — bugs live on disk as JSON and render in a Vite + React UI with STSS sections and inline evidence screenshots.

**Temp open board** — no auth. Live status + comments use **localStorage** until `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` are set (then `@supabase/supabase-js` from the browser). See [`.env.example`](.env.example), [`supabase/migrations/001_open_rls.sql`](supabase/migrations/001_open_rls.sql), and `npm run bug:update`.

Also ships shareable research pages:

| Path | Page |
| --- | --- |
| `/` | Bug board (home) |
| `/overview` (alias `/summary`) | Product brief grounded in QA docs |
| `/mindmap` | Hub overview — edges/borders colored by suite TC coverage |
| `/mindmap/:domain` | Per-domain React Flow maps; green/amber/blue/gray = Pass / mixed-Fail / designed / none |
| `/test-cases` | TC spreadsheet (native grid from `data/test-cases.json`; optional Sheets iframe) |
| `/claim-gps` | Claim / GPS QA guide |
| `/mobile-coop` | Mobile agent ↔ user coop + phone claim matrix |

## Quick start

```bash
npm install
npm run dev
```

Dev server binds **`0.0.0.0:43127`**.

Open [http://127.0.0.1:43127/gas-cash-qa-bug-board/](http://127.0.0.1:43127/gas-cash-qa-bug-board/).

```bash
npm run build   # production build (+ copies index.html → 404.html for SPA)
npm run preview # preview build on port 43127
```

## GitHub Pages

Configured for **project Pages** at:

`https://<your-github-user>.github.io/gas-cash-qa-bug-board/`

| Piece | Setting |
| --- | --- |
| Vite `base` | `/gas-cash-qa-bug-board/` |
| Router | `BrowserRouter` with matching `basename` |
| SPA deep links | `dist/404.html` + `overview/` `summary/` `mindmap/` + `mindmap/<domain>/` + `test-cases/` `claim-gps/` `mobile-coop/` index copies (`scripts/spa-pages.sh`) |
| Mind map data | Editable JSON under [`data/mindmaps/`](data/mindmaps/) (hub + one file per domain) |
| Deploy | [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) → `actions/upload-pages-artifact` + `actions/deploy-pages` |

### Enable once (repo owner)

1. Create a **public** GitHub repo named `gas-cash-qa-bug-board` and push `main`.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main` (or run **Actions → Deploy GitHub Pages → Run workflow**).
4. After the workflow is green, open the Pages URL above (replace `<your-github-user>`).

CLI (needs `gh` auth):

```bash
gh auth login   # or: export GH_TOKEN=<PAT with repo + pages:write>
gh repo create gas-cash-qa-bug-board --public --source=. --remote=github --push
gh api -X POST "repos/$(gh api user -q .login)/gas-cash-qa-bug-board/pages" \
  -f build_type=workflow -f source[branch]=main -f source[path]=/
```

If the Pages API rejects `source` when using Actions, set Source to **GitHub Actions** in the UI instead — the workflow still deploys.

## Where bugs live

| Path | Role |
| --- | --- |
| [`data/bugs.json`](data/bugs.json) | **Source of truth** — all bugs, STSS fields, evidence paths |
| [`public/evidence/`](public/evidence/) | PNG screenshots referenced as `/evidence/…` (resolved via Vite `base` at runtime) |
| [`docs/retest.md`](docs/retest.md) | Latest production retest summary (2026-10-26) |

Seeded from the project audits (`api-network-audit`, `week-1-smoke`). Session secrets / HAR cookies are **not** included.

### Latest retest (2026-10-26 Asia/Saigon)

Live: https://pi0099.github.io/gas-cash-qa-bug-board/

| Still valid | Fixed | Partial | Blocked |
| ---: | ---: | ---: | ---: |
| 4 | 7 | 3 | 0 |

Each bug carries `lastRetestAt` / `lastRetestResult` / `lastRetestNote` (and a `retest` object). List + detail show a **Retest:** badge. Status map: Still valid / Partial → `Open`; Fixed → `Resolved`.

## How to add a bug

1. Copy needed screenshots into `public/evidence/` (kebab filenames).
2. Append an object to `bugs` in `data/bugs.json`:

```json
{
  "id": "gc-short-slug",
  "title": "[BUG] Page - Section - Issue",
  "priority": "High",
  "status": "Triage",
  "tags": ["api"],
  "createdAt": "2026-10-26",
  "updatedAt": "2026-10-26",
  "env": "https://app.gas.cash",
  "description": "One or two plain sentences.",
  "testData": ["Env: …", "Account: …"],
  "precondition": ["…"],
  "steps": ["1. …", "Observe …"],
  "actual": "Broken outcome only.",
  "expected": "Correct outcome only.",
  "evidence": [{ "src": "/evidence/your-shot.png", "alt": "Short desc" }],
  "apiNotes": ["GET /api/… → 500"]
}
```

3. Save — Vite HMR reloads the board. Open `/bugs/<id>` (under the Pages base path when deployed).

**Priorities:** `P0` | `High` | `Medium` | `Low`  
**Statuses:** `Triage` | `Open` | `In Progress` | `Blocked` | `Resolved` | `Closed`

Title format follows the STSS playbook: `[BUG] Page - Function/Section - Issue`.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- React Router (board, overview, mind map — BrowserRouter + basename)
- `@xyflow/react` for the mind-map canvas
- IBM Plex Sans / Mono — industrial QA palette (slate / amber / red)

## Safety

- Local / static Pages — no Linear, no auth, no wallet.
- Do not commit Privy `storageState`, HAR cookies, or key material.
- Evidence images are UI soft-fail captures only.
