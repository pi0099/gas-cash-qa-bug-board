# Gas Cash — Wallet / deposit / withdraw UI + validation (money-safe)

| Field | Value |
| --- | --- |
| Date | **2026-10-28** (~23:55–00:20 +07) |
| Environment | Production `https://app.gas.cash` |
| Docs | `docs/product-internal/feature/swap-and-withdraw.md`, `wallets.md`, `feature/staking.md` (asof 2026-10-28) |
| Session | Privy `internal/sessions/gas-cash-privy-storageState.json` — **authed** (no re-login) |
| Money policy | **No** real deposit / withdraw / stake / swap completion. Cancel / Close before submit. **No** HOLD TO EXPORT. |
| Evidence | `media/wallet-dw-20261028/` → board `/evidence/wallet-dw-20261028/` |
| Digests | `internal/wallet-dw/{result,followup,buygas,tabs2}.json` |

## Verdict

Deepened wallet chrome + amount/address validation across header, Portfolio, Buy $GAS (Buy / Sell / Deposit / Withdraw), attestation, and ATM stake sheet. **0 new bugs filed** — validation and disabled states held; first-pass “enabled primary” hits were **false positives** (tabs mistaken for submit CTAs). **0 money POSTs** (`/api/swap|/withdraw|/station`). Known `gc-rpc-storm-atm` still elevated (`POST /api/rpc` ×116 this pass).

## Coverage matrix

| Area | Result | Notes / evidence |
| --- | --- | --- |
| Session | **Pass** | Authed; LOG OUT / SET USERNAME / READY TO CLAIM |
| Header USO / $GAS vs `/api/me` | **Pass** (aligned empty) | Header chips **0 / 0**. `/api/me` 200 returns user + `wallet` only (no token balances). Chain balances via UI/rpc — empty wallet consistent. Deposit address **matches** `me.user.wallet` `0x7AcA…A178`. `a8-header-final`, `b1-deposit` |
| Portfolio panel | **Pass** | Opens; `$0.00` + asset dashes with empty wallet (prior dishonest-$0 **Resolved** still holds). `10-portfolio`, `b8-portfolio` |
| Buy Gas entry | **Pass** | Open via `[aria-label="Buy Gas"]` / GAS `+` (text `+` alone is flaky). `90–91` |
| Attestation cancel | **Pass** | “Before you swap a Stock Token” → **Close** / Escape; no continue; **0** money POSTs. `b6-rules`, `b7-rules-cancel` |
| Buy amount validation | **Pass** | Empty → NO AMOUNT YET / READ THE RULES; `0` → “Enter more than 0.” + red border; neg/alpha → “Enter an amount in USO, like 0.1.”; over-balance → “That is more than your USO.” CTA is rules gate, not an enabled Buy submit. `a1-buy-*` |
| Sell toggle | **Pass** (chrome) | Switch control present (`Switch to selling GAS for USO`); amount rules same sheet pattern; cancel-only |
| Deposit tab | **Pass** | YOUR ADDRESS + QR + VIEW ON BLOCKSCOUT; address = session wallet; HOLD TO EXPORT present (**not** held). No Send/Confirm spend CTA. `b1-deposit` |
| Withdraw amount | **Pass** | WITHDRAW **disabled**; empty; `0` → “Enter an amount above zero.”; neg/alpha → “Enter an amount, like 100.”; `1` with 0 bal → “That is more than your $GAS.” `b3-wd-amt-*` |
| Withdraw address | **Pass** | Garbage/short → “Enter a Robinhood Chain address, starting 0x.”; zero addr → “That address cannot receive tokens.”; **self** → “That is your own address.”; valid format → “Valid Robinhood Chain address” but still disabled when amount > balance. `b4-wd-addr-*` |
| Address paste | **Pass*** | No dedicated Paste button; field accepts typed/`0x…` values (OS paste path). Typed-valid address accepted as format-OK. |
| ATM stake chrome | **Pass** | Sheet opens; Balance 0 GAS; lock 7–30d; share weight; early-exit warning. **ENTER disabled** for empty / 0 / neg / 1 / 999 / alpha / 1000 (0 balance). Cancel / Escape — no stake. `d-63-*`, `m-63-*` |
| ATM My Stakes | **Pass** | NO STAKES YET empty chrome |
| Money-safe | **Pass** | `moneyPosts: []` across all scripts |

\*Paste: exercised typed address insertion equivalent; clipboard Paste control not present in withdraw UI.

## False positives discarded (not filed)

| Auto-flag | Why discarded |
| --- | --- |
| `gc-atm-stake-*-enabled` | Matched **STAKE** tab/nav, not **ENTER** submit. ENTER correctly `disabled:true`. |
| `gc-buy/sell/withdraw-*-enabled` | Matched top **BUY $GAS / WITHDRAW tabs**, not sheet CTA. Real CTAs: READ THE RULES / disabled WITHDRAW / disabled ENTER. |

## Known Opens — retest

| ID | Result |
| --- | --- |
| `gc-rpc-storm-atm` | **Still valid (volume)** — rpc 200 OK; My Stakes healthy; **×116** `/api/rpc` this wallet/ATM pass |
| `gc-header-ellipsis-forever` | **Improved on this account** — numeric **0 / 0**, not stuck `…` |
| `gc-portfolio-zero-dishonest` | **Still Resolved** — empty wallet `$0.00` + dashes honest |
| `gc-layout-refetch-storm` | **Still valid** — me/stats, claims/live, scratch tiers burst with shell |

## Network / money-safe

- Main pass hist (approx): **200** dominant; **401** only on `page.evaluate(fetch('/api/me'))` without Privy bearer (browser XHR `/api/me` **200**)
- `/api/balances` observed (cross-chain stables picker path)
- **0** `POST /api/swap` · **0** `POST /api/withdraw` · **0** `POST /api/station`

## TCs added (board spreadsheet)

`GC-TC-W-DW-01` … `12` in `data/test-cases.json` (header↔me, portfolio, buy open, attestation cancel, buy/withdraw/deposit/ATM validation). All **Pass** this run.

## Blocked / out of scope

Funded buy / sell / withdraw / stake completion · HOLD TO EXPORT key reveal · phone `WRITES_ENABLED` sheet (unmounted per docs) · min-stake copy with **non-zero** $GAS balance (ENTER disabled by insufficient balance on this account)

## Board

- Pages: https://pi0099.github.io/gas-cash-qa-bug-board/
- Evidence: https://pi0099.github.io/gas-cash-qa-bug-board/evidence/wallet-dw-20261028/
- **New bugs:** none
