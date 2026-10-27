# Gas Cash — Test Plan

| Field | Value |
| --- | --- |
| Product | Gas — `https://app.gas.cash` |
| Companion | `docs/test-strategy.md` |
| Author | Lam (QA Lead) |
| Date | 2026-10-27 |
| Status | Ready for week-1 execution (pending test accounts + feature-live matrix); claim chrome is **mobile-only** — strategy §4.4 + agent↔user coop §4.5 |

**Legend:** **[Observed]** / **[Documented]** / **[Assumption]** / **[Coming soon]** — same as strategy.

---

## 1. Objectives

1. Enable a QA team to start structured testing **next week** without internal product docs, using public docs + live app as oracle.
2. Prove **money-safe** paths: auth/wallet, deposit/swap, claims (pay + refuse), Mini Mart keys, ATM staking, repairs.
3. Catch **docs ↔ app** gaps that would confuse users or burn funds (404 routes, coming-soon items that look purchasable).
4. Establish smoke automation candidates and a severity/reporting model.
5. Surface open questions that block complete coverage (staging, live flags, pricing currency mismatches).

**Non-objectives:** Exploit writing, farming location spoof how-tos, inventing admin APIs, full formal audit of contracts.

---

## 2. Features in scope

### 2.1 Core (treat as must-test if marked live by product)

| ID | Feature | Evidence |
| --- | --- | --- |
| F01 | Marketing / FAQ / How it works / Docs / Terms / Privacy | **[Observed]** |
| F02 | Proof / protocol stats page | **[Observed]** `app.gas.cash/proof` |
| F03 | Auth — Privy Google / X / Apple | **[Observed]** modal; terms emphasize Google/X |
| F04 | Embedded wallet — balances, export, sponsorship messaging | **[Documented]** Deposit tab of Buy Gas |
| F05 | Deposit funds + Gas Swap buy $GAS | **[Documented]** FAQ |
| F06 | Map, stations, live pumps feed | **[Observed]** map; live pumps error unauth |
| F07 | Claim / hold-to-pump + anti-cheat + photo | **[Documented]**; **mobile-only** phone gate **[Observed 2026-10-27]** |
| F08 | Free bike (no car) | **[Documented]** |
| F09 | Garage / lineup (Starting 5) / reserves | **[Observed]** gates; docs |
| F10 | Mini Mart — keys (Regular / Super / Premium) | **[Observed]** + **[Documented]** |
| F11 | Inventory — open keys / boost | **[Documented]**; route **404 Observed** |
| F12 | Chop Shop — merge | **[Documented]**; route **404 Observed** |
| F13 | Repairs (USO → buy $GAS burn) | **[Documented]** |
| F14 | ATM staking | **[Observed]** UI + **[Documented]** |
| F15 | Mileage | **[Observed]** gate |
| F16 | Leaderboard (24h / 7d / all) | **[Observed]** error unauth |
| F17 | Referrals `gas.cash/r/{user}` | **[Documented]** (payout share off) |
| F18 | Profiles / Public-Private / location hide | **[Documented]** |
| F19 | Eligibility self-attestation (18+, Stock Token rules) | **[Documented]** |
| F20 | Responsive / mobile claim UX | Phone required for HOLD / Check in; desktop Sensors ≠ claim path **[Observed 2026-10-27]** |

### 2.2 Secondary / utility

| ID | Feature | Notes |
| --- | --- | --- |
| F21 | In-app music player | **[Observed]** |
| F22 | Chat | Closed state **[Observed]** |
| F23 | How Gas Works tutorial overlay | **[Observed]** |
| F24 | Share claim card | **[Documented]** |
| F25 | Support contacts | `support@fillgas.xyz`, X `@gasdotcash` **[Documented]** |

### 2.3 Explicitly limited / coming soon (test for safety, not full feature)

| ID | Feature | Test focus |
| --- | --- | --- |
| F30 | Dealership | Route present; assert no silent spend; empty/error UX **[Observed]**; docs say coming soon |
| F31 | Crowbars / insurance / theft | UI may list items **[Observed]**; docs say not live — purchase must fail safely or be blocked |
| F32 | Scratchers | Banner/UI **[Observed]** — confirm live vs stub |
| F33 | Mafia Men / Job Board / item drops / jackpot / franchises | Docs: not live or later — no production dependence |
| F34 | Coming soon Mini Mart (Alarm, Fake Plates, Nitro, …) | Labels only |

### 2.4 Networks / assets (test data)

| Asset | Role | Source |
| --- | --- | --- |
| Robinhood Chain `4663` | Execution chain | **[Documented]** |
| $GAS | Utility / shop / stake / swap pair | Proof + docs; contract on docs |
| USO Stock Token | Claim currency / repairs; tracks USO fund | Proof address observed: `0xa30FA36Db767ad9eD3f7a60fC79526fB4d56D344` |
| USDC / ETH (any chain) | Funding path into Gas wallet | **[Documented]** FAQ |
| Car NFT V2 / Bike NFT | Eligibility to claim | Contract list on docs |
| Prize pool wallet | Source of claim pays | Proof: `0xd3F3E252B79260E95Ad7DFb311FFFBd90f81ab78` |

Published game contracts (docs) include Mini Mart, Chop Shop merge, Gas Station (ATM), Payout, etc. — use as explorer anchors, not as private APIs.

---

## 3. Test types

| Type | Applied to |
| --- | --- |
| Smoke | All routes, proof, login modal |
| Functional | F03–F20 |
| E2E journeys | Onboarding → fund → key → claim → stake |
| Negative / error | Refusals, insufficient balance, VPN, location deny, sponsorship fail |
| Reconciliation | UI amount ↔ Blockscout ↔ proof |
| Exploratory | Charters §6 |
| Regression | After each fix; automated smoke |
| Compatibility | **iOS Safari** (device/sim), **Android Chrome** (device/emulator); desktop Chrome mobile emulation for smoke only; desktop desktop-UA for phone-gate assert |
| Accessibility (light) | Focus, contrast, tap targets on claim CTA |
| Security (QA-level) | Session clear, phishing-safe support copy, no seed requests |

---

## 4. Suites & high-value scenarios

IDs: `GC-Sxx-yy`. Priority: P0 / P1 / P2.

### 4.1 Suite A — Unauthenticated smoke

| ID | Pri | Scenario | Steps (summary) | Expected |
| --- | --- | --- | --- | --- |
| GC-S01-01 | P0 | App loads | Open `app.gas.cash` | Map or branded shell; no blank crash |
| GC-S01-02 | P0 | Login CTA | Tap LOG IN / SIGN UP | Privy modal: Google, X, Apple **[Observed]** |
| GC-S01-03 | P1 | Garage gate | Open `/garage` | Sign-in message + Sign In |
| GC-S01-04 | P1 | Mileage gate | Open `/mileage` | Sign-in message |
| GC-S01-05 | P1 | Mini Mart browse | Open `/mini-mart` | Keys visible with prices; purchase gated or prompts login |
| GC-S01-06 | P1 | ATM browse | Open `/atm` | Pool/APY UI; stake gated |
| GC-S01-07 | P1 | Dealership shell | Open `/dealership` | Empty or recoverable error; no crash |
| GC-S01-08 | P0 | Chop Shop reachability | Open `/chop-shop` | **Today: 404 Observed** — file P0 if docs still say live |
| GC-S01-09 | P0 | Inventory reachability | Open `/inventory` | **Today: 404 Observed** — same |
| GC-S01-10 | P1 | Leaderboard | Open `/leaderboard` | Data or clear retry error (not silent fail) |
| GC-S01-11 | P1 | Proof | Open `/proof` | Prize pool, prices, contract links |
| GC-S01-12 | P2 | Marketing FAQ buy path | `gas.cash` FAQ → how to buy $GAS | Steps match app labels |
| GC-S01-13 | P2 | Terms/privacy reachable | Footer/links | Pages load; support email present |
| GC-S01-14 | P2 | Location deny | Deny geolocation | Map fallback; claims unavailable with clear copy **[Documented]** |

### 4.2 Suite B — Auth & wallet

| ID | Pri | Scenario | Expected |
| --- | --- | --- | --- |
| GC-S02-01 | P0 | Sign in with Google | Session persists on reload; wallet address shown |
| GC-S02-02 | P0 | Sign in with X | Same |
| GC-S02-03 | P1 | Sign in with Apple | Same if offered |
| GC-S02-04 | P0 | Sign out | Session cleared; gated pages reappear |
| GC-S02-05 | P0 | Key export from Deposit / Buy Gas | User can view/export key; warning about loss of social access **[Documented]** |
| GC-S02-06 | P0 | Address consistency | UI address == Privy/exported == explorer |
| GC-S02-07 | P1 | Multi-tab session | Two tabs stay consistent; logout one invalidates |
| GC-S02-08 | P1 | First-claim / first-swap attestation | 18+ + rules + Robinhood Stock Token terms shown before action **[Documented]** |
| GC-S02-09 | P1 | Account deletion path | Email support flow documented; on-chain funds remain with exported key |
| GC-S02-10 | P0 | Phishing hygiene | No UI/support script asks for seed/password/unlock fee **[Documented privacy]** |

### 4.3 Suite C — Deposit, swap, balances, fees

| ID | Pri | Scenario | Expected |
| --- | --- | --- | --- |
| GC-S03-01 | P0 | Deposit USDC/ETH path | Clear instructions; funds appear in Gas wallet |
| GC-S03-02 | P0 | Swap to $GAS | Quote shown; 2% tax reflected in outcome or disclosed **[Documented]** |
| GC-S03-03 | P0 | Insufficient balance | Cannot complete; clear error; no partial debit |
| GC-S03-04 | P0 | Failed / rejected signature | Balances unchanged; UX recoverable |
| GC-S03-05 | P1 | Slippage / price move | User sees refresh or fail-safe; no silent worse fill **[Assumption on UX]** |
| GC-S03-06 | P1 | Fee / gas display | Native gas vs sponsored: user understands who pays |
| GC-S03-07 | P0 | Sponsorship unavailable | Claim/tx either user-pays or clear failure; **no silent “success”** **[Documented courtesy]** |
| GC-S03-08 | P1 | Proof prices vs swap quote | Order-of-magnitude consistency with proof $GAS/USO |

### 4.4 Suite D — Claim / pump (field + lab)

| ID | Pri | Scenario | Expected |
| --- | --- | --- | --- |
| GC-S04-01 | P0 | Eligible claim at real station | Hold pump → checks pass → USO+$GAS paid on-chain to wallet |
| GC-S04-02 | P0 | Claim while not at station | Refused; **no use consumed**; reason code shown (not thresholds) **[Documented]** |
| GC-S04-03 | P0 | Cooldown not elapsed | Refused; uses/cooldown unchanged correctly |
| GC-S04-04 | P0 | Station pumps full (6 busy) | Refused; clock to next free; nothing used **[Documented]** |
| GC-S04-05 | P0 | Daily account cap (≤3) | Fourth refused cleanly |
| GC-S04-06 | P1 | VPN / proxy | Likely refusal with actionable copy **[Documented]** |
| GC-S04-07 | P1 | Photo challenge | Accept real pump photo; reject reuse/fake; 7-day retention rules not user-visible but dispute path works |
| GC-S04-08 | P0 | Refusal cost | Always free; lineup uses not spent |
| GC-S04-09 | P1 | Live pumps card | After pay, appears in feed with privacy rules; station hidden if Location off |
| GC-S04-10 | P1 | Bike claim | No car → bike; limited uses; never jackpot; cap ~$0.50 **[Documented]** |
| GC-S04-11 | P1 | Lineup multiplier order | Heaviest in slot 1 pays more than reversed order (spot-check) |
| GC-S04-12 | P1 | Luck bonus display | If bonus, UI matches paid amount |
| GC-S04-13 | P2 | Share claim | Share creates card; withdraw via support |
| GC-S04-14 | P0 | Desktop + Sensors geo | Map/distance may update; HOLD shows phone-only block (“Pumping only works on a phone…”) — not a claim path |
| GC-S04-15 | P1 | Check in + ROUTE TO THE STATION | On phone: puzzle/chrome reachable; lab may use fake GPS; payout still field |

**Field note:** Claim suite needs a **phone-class client** (real device preferred; sim/emulator OK for UI). Desktop Sensors alone cannot clear the phone gate. Remote agents cannot complete GC-S04-01 without physical presence — schedule field testers using the shared-session pattern in strategy §4.5 (pointer: `docs/mobile-agent-cooperation.md`). See §4.10 for execution notes.

### 4.5 Suite E — Garage, keys, merge, repairs

| ID | Pri | Scenario | Expected |
| --- | --- | --- | --- |
| GC-S05-01 | P0 | Buy Regular key | Debits $GAS at shop price; key/credit recorded |
| GC-S05-02 | P0 | Open key after reveal | Stats/tier within published ranges; sealed→active |
| GC-S05-03 | P1 | Boost steps (≤5) | Odds/cost preview before open; can still roll lower |
| GC-S05-04 | P0 | Save Starting 5 | Multiplier/wait/daily estimate update |
| GC-S05-05 | P1 | Swap reserve ↔ lineup | Free; preview wait before save |
| GC-S05-06 | P0 | Merge two cars | Fee in $GAS; success or miss sealed car; both inputs consumed **[Documented]** |
| GC-S05-07 | P0 | Repair worn car | Cost in USO; car usable again; burn path observable via docs/proof narrative |
| GC-S05-08 | P1 | V1→V2 upgrade window | **[Documented]** window ended 16 Oct 2026 — verify UI no longer offers expired upgrade or handles gracefully |
| GC-S05-09 | P0 | Coming-soon item purchase | Crowbar/insurance: blocked or non-charging if not live |

### 4.6 Suite F — ATM staking

| ID | Pri | Scenario | Expected |
| --- | --- | --- | --- |
| GC-S06-01 | P0 | Stake $GAS 7d | Stake visible; rewards accrue |
| GC-S06-02 | P0 | Stake 30d | Higher weight (~1.5x) vs 7d **[Documented]** |
| GC-S06-03 | P0 | Claim staking rewards | $GAS only; balance increases |
| GC-S06-04 | P0 | Early unlock | Penalty ≤20% shrinking; **all unclaimed rewards forfeited** — UX must warn to claim first |
| GC-S06-05 | P1 | Est. APY disclaimer | Shown as estimate, not guarantee |
| GC-S06-06 | P1 | Insufficient $GAS stake | Clear error |

### 4.7 Suite G — Social / mileage / referrals / privacy

| ID | Pri | Scenario | Expected |
| --- | --- | --- | --- |
| GC-S07-01 | P2 | Mileage accrual rules | +10 per $1 claims and in-app $GAS buys; keys/repairs none; check-in +5 **[Documented]** |
| GC-S07-02 | P1 | Leaderboard filters | 24h/7d/all populate when authed |
| GC-S07-03 | P1 | Public→Private profile | Username/picture hide within ~1 min |
| GC-S07-04 | P1 | Location switch off | Station hidden on feeds; claims still listed |
| GC-S07-05 | P2 | Referral link | Cookie 30d; friend joins; **no claim share paid** today |
| GC-S07-06 | P2 | Send $GAS to referred friend | Works if UI offers; amounts reconcile |

### 4.8 Suite H — Mobile / responsive

| ID | Pri | Scenario | Expected |
| --- | --- | --- | --- |
| GC-S08-01 | P0 | 375px map | Usable controls; login reachable **[Observed OK]** |
| GC-S08-02 | P0 | Long-press pump on real phone | Gesture reliable; cancel mid-hold safe; iOS Safari + Android Chrome |
| GC-S08-03 | P1 | Landscape | No critical overlap of CTA |
| GC-S08-04 | P1 | Safe area / notches | Primary CTA not obscured |
| GC-S08-05 | P2 | Offline / flaky network mid-claim | Clear failure; no double pay |
| GC-S08-06 | P1 | Safari motion/compass Don’t Allow | Lat/lng claim path still usable; tip copy present **[Observed]** |
| GC-S08-07 | P1 | Desktop Chrome mobile emulation + geo | Soft-gate / HOLD chrome smoke only — not field substitute |
| GC-S08-08 | P1 | Agent↔user shared session | Agent prep → user phone Allow/tutorial → soft-gates → stop or authorized hold; evidence after each gate (strategy §4.5) |

### 4.9 Suite I — Integrations & transparency (black-box)

| ID | Pri | Scenario | Expected |
| --- | --- | --- | --- |
| GC-S09-01 | P1 | Proof pool ≈ explorer prize wallet | Matches within refresh window |
| GC-S09-02 | P1 | Docs contract links open Blockscout | Correct chain 4663 |
| GC-S09-03 | P2 | Fingerprint subdomain | Claim still works with common ad blockers (privacy claims) **[Documented]** |
| GC-S09-04 | P2 | Chat closed | Friendly closed state; no broken composer |

### 4.10 Mobile coop / phone-matrix execution notes

Aligned to strategy §§4.4–4.5. Run Suites D + H with this matrix — do not treat desktop Sensors as a claim path.

| Lane | Client | GPS | Who drives | Suites / IDs | Stop rule |
| --- | --- | --- | --- | --- | --- |
| **A — Desktop phone-gate** | Desktop Chrome/Safari (desktop UA) | DevTools Sensors OK | Agent | GC-S04-14 | Assert phone-only copy; no HOLD success |
| **B — Lab mobile chrome** | Playwright mobile emul. **or** iOS Sim Safari **or** Android Emulator Chrome | `setGeolocation` / Sim custom location | Agent (+ user for OS Allow sheets) | GC-S04-15 soft-gate; GC-S08-06/07 | Soft-gates + screenshots; **no paid hold** unless authorized |
| **C — Shared session** | Real phone Safari (iOS) or Chrome (Android), same Privy account when possible | Real GPS or Sim if still lab | Agent prep → **user** grants Allow / Tiếp tục / long-press | GC-S08-08; GC-S04-15 chrome | Agent calls stop vs proceed; money-safe |
| **D — Field certification** | Real iPhone Safari + Android Chrome at station | Physical presence | Field tester; agent on chat for cues/evidence | GC-S04-01 (paid) + refuse path (e.g. GC-S04-02/08) | Exit criterion: ≥1 paid + ≥1 refused with reason / tx |

**Handoff checklist (Lane C/D):**

1. Agent: storage state ready, station coords, money-safe checklist shared in chat.
2. User: open `app.gas.cash` → READY TO CLAIM when logged in.
3. User: Allow location (and motion if prompted); dismiss tutorial (**Tiếp tục** / LET'S GO).
4. Agent: call expected copy at each gate (“Move closer…”, Check in / ROUTE TO THE STATION); request screenshot after each gate.
5. Field: user at station for payout/refuse; paste device + browser + city + shot (+ tx hash) into tracker / store `media/`.

**Phone matrix minimum for exit (strategy §8):** iOS Safari + Android Chrome smoke for map + login + claim chrome; desktop phone-gate assert; field paid+refused on phone — not Sensors alone.

Board: `https://pi0099.github.io/gas-cash-qa-bug-board/strategy#mobile-coop`.

---

## 5. Exploratory charters (manual)

Time-box 60–90 minutes each; note surprises.

1. **First 10 minutes as a new driver** — confusion, dead ends, 404s, attestation clarity.
2. **Broke on purpose** — deny location, enable VPN, airplane mode mid-hold, double-tap pump.
3. **Follow the money** — buy key → open → claim → repair → stake; reconcile every balance change.
4. **Shop honesty** — tap every Mini Mart SKU including Coming Soon; record charge attempts.
5. **Privacy walk** — Public/Private + Location off; verify Live pumps + leaderboard + profile.
6. **Support surface** — find how a refused claim user would appeal; copy must not solicit seeds.

---

## 6. Data & wallet needs

| Resource | Qty | Purpose |
| --- | --- | --- |
| Google test accounts | ≥2 | Auth + sybil-adjacent UX (do not farm) |
| X test accounts | ≥2 | Auth |
| Apple ID (optional) | ≥1 | Provider coverage |
| Funded Gas wallets | ≥2 | Micro $GAS + USO |
| External funding wallet | ≥1 | USDC/ETH for deposit path |
| Physical access to ≥2 real stations | — | Claim suite |
| Devices | 1 iPhone (Safari) + 1 Android (Chrome) + 1 desktop; optional iOS Sim / Android Emulator for lab geo | Compatibility — claim on phone |
| Blockscout bookmarks | — | Contracts from docs + proof |
| Secure store for exported keys | — | Recovery tests |
| Product “live matrix” sheet | 1 | Per-build feature flags |

**Budget guidance:** Prefer smallest keys (Regular), tiny stakes, one repair — enough to prove math, not to grind economy.

---

## 7. Schedule phases (execution weeks, not calendar estimates of effort size)

| Phase | Focus | Exit of phase |
| --- | --- | --- |
| **P0 — Kickoff** | Accounts, funding, live-matrix meeting, smoke Suite A | Smoke green; matrix signed |
| **P1 — Money paths** | Suites B, C, F + key buy | Deposit/swap/stake/key P0s pass or blocked |
| **P2 — Claim field** | Suite D with field testers | Paid + refused claims logged with hashes |
| **P3 — Garage economy** | Suite E once Inventory/Chop Shop reachable | Merge/open/repair covered or P0 defects filed |
| **P4 — Social & polish** | Suites G–I + exploratory | Parity issues triaged |
| **P5 — Harden** | Automation smoke, regression, RC sign-off | Exit criteria in strategy met |

Parallelize automation scaffolding from Phase P0.

---

## 8. Roles (RACI-lite)

| Activity | QA Lead | QA Eng | Field | Eng | Product | Support |
| --- | --- | --- | --- | --- | --- | --- |
| Live feature matrix | C | I | I | C | **A/R** | I |
| Smoke / automation | A | **R** | I | C | I | I |
| Funded tx tests | A | **R** | C | C | I | I |
| Station claims | A | C | **R** | C | I | C |
| Agent↔user mobile handoff (§4.10) | A | **R** (prep) | **R** (phone) | C | I | I |
| Defect triage severity | **A/R** | C | C | C | C | C |
| Refusal appeals process | C | I | C | I | C | **R** |
| RC sign-off recommendation | **A/R** | C | C | C | A | I |

A = accountable, R = responsible, C = consulted, I = informed.

---

## 9. Defect severity

| Severity | Definition | Example | Release impact |
| --- | --- | --- | --- |
| **S0 Blocker** | Funds lost, double pay, irreversible wrong transfer, key export broken with funds at risk | Claim pays twice; swap drains without $GAS | Cannot ship |
| **S1 Critical** | Core loop broken for majority; auth broken; live feature 404 | Inventory 404 while keys sold; cannot claim when eligible | Ship only with waiver |
| **S2 Major** | Major feature wrong with workaround | APY display wrong; leaderboard fails for some | Fix in RC or fast follow |
| **S3 Minor** | UX polish, copy, non-fund visual | Music autoplay annoyance | Backlog OK |
| **S4 Trivial** | Cosmetics | Icon alignment | Optional |

**Crypto-specific tagging (required on money bugs):** `funds`, `signing`, `sponsorship`, `balance-mismatch`, `cooldown`, `anti-cheat-false-positive`, `docs-parity`.

Always attach: environment URL, account type, wallet address, tx hash(es), screenshots, approximate UTC time, network conditions (VPN yes/no).

---

## 10. Reporting

| Cadence | Artifact |
| --- | --- |
| Daily standup | Blockers, S0/S1 opened, field claim count |
| End of phase | Phase report: pass/fail by suite ID |
| Per RC | Test summary: exit criteria checklist, known issues, automation results |
| Continuous | Defect tracker; proof screenshots for payout bugs |

Template fields for claim defects:

- Station (city only if privacy), approximate time
- Reason code (if refused)
- Lineup summary (tiers/octane) without oversharing
- Explorer links for payout + NFT ownership

---

## 11. Automation candidate list (week 1 backlog)

1. HTTP 200 + title smoke: marketing pages + app shell  
2. Unauth gate copy snapshots: garage, mileage  
3. Login modal provider buttons present  
4. Mini Mart key names + currency assertion (`$GAS`)  
5. Proof metrics parse (prize pool string non-empty)  
6. Route watchlist: `/chop-shop`, `/inventory` must not 404 when flagged live  
7. Dealership “coming soon / empty” copy stability  
8. Responsive screenshot diff 375 vs 1280 (map chrome)  
9. Console error allowlist on cold load  

Defer OAuth and funded txs until secret management + staging exist.

---

## 12. Entry / exit (plan-level)

Follow strategy §§7–8. **Plan-specific go/no-go for “week 1 start”:**

- [ ] Test accounts created  
- [ ] Micro-funds available  
- [ ] Product live-matrix received  
- [ ] Field tester scheduled for claim suite  
- [ ] This plan + strategy reviewed 30 min with eng/product  

---

## 13. Open questions

1. Is there a **non-production** environment for funded tests?
2. Which Mini Mart SKUs are **purchasable on-chain today** vs UI placeholders (crowbars, insurance, scratchers, DBOP-priced items)?
3. Where is **Inventory / Chop Shop** meant to live if `/inventory` and `/chop-shop` 404 — deep links from Garage?
4. Is **Dealership** intentionally routed early, and should buys be hard-disabled?
5. Confirm **Apple** as supported IdP vs terms/privacy text that stress Google/X.
6. Exact **deposit/bridge** providers and supported source chains for USDC/ETH.
7. How is **gas sponsorship** toggled (always/sometimes/never), and what UX is required when off?
8. Official **slippage / quote refresh** rules for Gas Swap.
9. Are **leaderboard/dealership errors when logged out** expected or bugs?
10. Map tile provider of record (OpenFreeMap vs others) for allowlisting in corporate networks.
11. Test allowance for **location simulation** on staging only? (Prod lab: Sensors / sim / Playwright OK for UI; payout remains field — strategy §4.4)
12. Who owns updating **docs “live today”** list when app ships/removes routes?

---

## 14. Assumptions

1. Public docs at `gas.cash/docs` + terms/privacy are the best available oracle until product contradicts them in writing.
2. Production testing with micro-funds is approved.
3. Referral claim-share remains off until product announces otherwise.
4. Theft/Mafia/Job Board/Dealership trading are not part of P0 claim certification.
5. QA will not attempt multi-account farming; anti-cheat tests stay on dedicated accounts and focus on honest-user false positives.

---

## 15. Blockers observed during research (baseline)

| Blocker | Impact on plan |
| --- | --- |
| Hard Privy auth wall | Suites B–G need accounts before depth |
| Physical geolocation + phone gate for claims | Suite D needs phone client + field testers; desktop Sensors insufficient |
| `/chop-shop` and `/inventory` 404 | Suite E partially blocked |
| Unauth API errors on leaderboard/dealership/live pumps | Limits unauth verification of populated states |
| No traditional WalletConnect | Hardware wallet matrix N/A; Privy-only |
| No staging discovered | Heightened prod caution |

---

## 16. Related artifacts

- Strategy: `docs/test-strategy.md` (§§4.4–4.5)
- Mobile coop pointer: `docs/mobile-agent-cooperation.md`
- Claim / lab GPS: `docs/claim-geo-testing-guide.md`
- Board Strategy: `https://pi0099.github.io/gas-cash-qa-bug-board/strategy` · Plan page: `/plan` · Mobile coop: `/strategy#mobile-coop`
- Recon brief: `internal/gas-cash-qa-research-brief.md`
- Screenshots: `/tmp/gas-cash-exploration/` (01–25)

---

## 17. Change log

| Date | Change |
| --- | --- |
| 2026-10-27 | §4.10 mobile coop / phone-matrix execution; GC-S08-08; RACI handoff; align strategy §4.5 |
| 2026-10-27 | Align with strategy §4.4 — mobile-only claim gate, phone matrix, GC-S04-14/15 + GC-S08-06/07 |
| 2026-10-25 | Initial plan from live recon + public documentation |
