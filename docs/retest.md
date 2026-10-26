# Production retest — 2026-10-26 (Asia/Saigon)

Live board: https://pi0099.github.io/gas-cash-qa-bug-board/

| Verdict | Count |
| --- | ---: |
| Still valid | 4 |
| Fixed | 7 |
| Partial | 3 |
| Blocked | 0 |

## Results

| ID | Verdict | Status | Note |
| --- | --- | --- | --- |
| `gc-api-500-outage` | Fixed | Resolved | `/api/*` recovered (0×5xx); soft-fails gone |
| `gc-rpc-storm-atm` | Partial | Open | RPC 200 + My Stakes OK; volume still high |
| `gc-layout-refetch-storm` | Still valid | Open | Chrome still refetches me/stats, scratch tiers, claims/live, lineup per nav |
| `gc-auth-sync-500` | Fixed | Resolved | `auth/sync` no longer 500 (some 429 from refetch) |
| `gc-docs-route-404` | Still valid | Open | `/chop-shop`, `/inventory` still 404 |
| `gc-minimart-blank-prices` | Fixed | Resolved | Shop loads with real prices |
| `gc-404-unbranded` | Still valid | Open | Unbranded Next.js 404 unchanged |
| `gc-header-ellipsis-forever` | Partial | Open | Often `0`; still intermittent `…` without failed state |
| `gc-garage-reading-forever` | Fixed | Resolved | Garage settles (empty fleet) |
| `gc-portfolio-zero-dishonest` | Fixed | Resolved | Zeros honest with healthy `/api/me*` |
| `gc-minimart-availability-labels` | Still valid | Open | SOON / OPEN / PLAY mix remains |
| `gc-minimart-watermark-clip` | Partial | Open | Backdrop remains; clip-through unclear when loaded |
| `gc-minimart-insure-overlap` | Fixed | Resolved | No duration pill behind INSURE |
| `gc-pumps-duplicate-error` | Fixed | Resolved | Live pumps healthy; no duplicate errors |

## Top changes since filing

1. **Full `/api/*` 500 outage cleared** — data plane mostly 2xx; shop, pumps, leaderboard, ATM stakes readable.
2. **Auth sync 500 gone** — remaining pain is **layout refetch storm** (+ occasional `auth/sync` 429).
3. **UI honesty bugs tied to the outage largely fixed**; routing/404 branding and Mini Mart availability labels still open.

Evidence: `public/evidence/retest-20261026/`. Session: Privy storageState remained valid (token + refresh; LOG OUT / SET USERNAME; no login wall).
