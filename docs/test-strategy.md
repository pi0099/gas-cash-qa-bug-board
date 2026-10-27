# Gas Cash — Test Strategy

> **Changelog (2026-10-27):** Claim UX (HOLD TO PUMP, Check in / ROUTE TO THE STATION puzzle, related pump chrome) is **mobile-only** — desktop UA is blocked even with DevTools Sensors geo. Strategy covers fake-GPS lab options, Chrome+Safari matrix, money-safe lab vs field boundaries, and **§4.5 Mobile agent ↔ user cooperation** (shared-session handoff). Short pointer: `docs/mobile-agent-cooperation.md`.

| Field | Value |
| --- | --- |
| Product | Gas (app.gas.cash) |
| Version context | V2 game loop (keys/cars/pump/ATM); several V2.1 features documented but not live |
| Author | Lam (QA Lead) |
| Date | 2026-10-27 |
| Based on | Live exploration of `https://app.gas.cash`, `https://www.gas.cash` (marketing, docs, terms, privacy, how-it-works, proof); user field/lab evidence 2026-10-27 (phone gate + Sensors GPS ~18 m Hóc Môn) |
| Audience | QA / eng / product starting testing next week with no internal docs |

**Legend:** **[Observed]** = seen in live UI or confirmed on public pages during research. **[Documented]** = stated on gas.cash docs/terms/privacy/FAQ. **[Assumption]** = inferred; must be validated. **[Coming soon]** = explicitly marked not live by product docs.

---

## 1. Purpose

Define how we test Gas so funds, claims, auth/wallet integrity, and geo anti-cheat stay trustworthy while the team ships V2 features. This strategy sets risk-based priorities, test levels, automation vs manual split, environments, tools, entry/exit criteria, and metrics. Feature-level scenarios live in `docs/test-plan.md`.

---

## 2. Product summary (grounded)

Gas is a **location-based on-chain game** on **Robinhood Chain (chain id 4663)** **[Documented + Observed on proof/docs]**. Players:

1. Sign in with social OAuth via **Privy** (Google / X; Apple also shown in login modal) **[Observed]** → embedded non-custodial wallet **[Documented]**.
2. Obtain a car NFT (free bike if no car; or buy keys in Mini Mart and open cars) **[Documented]**.
3. Physically go to a real gas station, hold to pump; server validates presence; prize pool pays **USO Stock Token** + **$GAS** to the wallet **[Documented]**.
4. Optionally stake $GAS at the **ATM**, buy keys, merge cars (Chop Shop), track mileage/leaderboard, use referrals **[Documented; ATM/Mini Mart/Garage UI Observed]**.

**Value proposition (marketing):** “Drive to a gas station. Fill up. Earn USO.” Protocol activity (2% $GAS trade tax, key/merge fees) feeds a prize pool players claim at pumps **[Observed on marketing + proof]**.

This is **not** a classic DEX-first dApp: primary UX is mobile + map + social login, not MetaMask/WalletConnect connect **[Observed]**.

---

## 3. Scope

### 3.1 In scope

| Area | Notes |
| --- | --- |
| Marketing / docs consistency | `gas.cash`, how-it-works, docs, terms, privacy, FAQ vs app behavior |
| Auth session | Privy login/logout, session persistence, account deletion path (email) |
| Embedded wallet | Balances display, key export (Deposit/Buy Gas), sponsorship behavior |
| Deposit / Buy Gas / Swap | Fund wallet → deposit → swap into $GAS **[Documented FAQ]** |
| Map + stations + pumps | Map load, station markers, 6 pumps / station, busy pump UX **[Documented]** |
| Claim / pump flow | **Mobile-only** UX (UA / touch / phone gate); geolocation; anti-cheat; photo; refusal codes; on-chain payout |
| Garage / lineup / reserves | Starting 5, stats, cooldown/wait, repairs **[Documented; gate Observed]** |
| Mini Mart | Key purchase pricing in $GAS, inventory open/boost **[Documented; shop UI Observed]** |
| Chop Shop merge | Merge odds, fees, burn paths **[Documented; `/chop-shop` 404 Observed — treat as gap]** |
| ATM staking | Lock 7–30d, claim rewards, early unlock penalty **[Documented; UI Observed]** |
| Mileage / leaderboard / live pumps / profiles | Privacy Public/Private, location hide switch **[Documented; some API errors Observed unauth]** |
| Referrals | `gas.cash/r/{username}`, invite cookie 30d; **no claim share paid today** **[Documented]** |
| Proof / protocol stats | Prize pool, rates, contract links vs explorer **[Observed]** |
| Responsive / mobile | Primary client; pump / Check in / claim chrome **phone-gated** **[Observed 2026-10-27]**; desktop map smoke still in scope |
| Integrations (black-box) | Privy, Fingerprint (`anti.fillgas.xyz`), map tiles, Blockscout, support channels |

### 3.2 Out of scope (unless product explicitly expands)

- Invented admin panels, undocumented internal APIs, or backend code we cannot see
- Full formal smart-contract audit (recommend separate security engagement; QA does smoke + explorer reconciliation only)
- Writing or assisting location-spoof / multi-account farm exploits (we **test defenses** and refusal UX only)
- Third-party platforms (Robinhood Chain L1 itself, Google/X/Apple IdP outages beyond our retry/UX)
- Features explicitly **[Coming soon]** except: UI must not allow spend/claim as if live, and docs/app labels must match
- Native iOS/Android apps (web/PWA only today) **[Assumption: no native app observed]**

### 3.3 Feature readiness matrix (do not invent “live”)

| Feature | Docs say | App exploration |
| --- | --- | --- |
| Claim / pump | Live | Map + tutorial Observed; full claim needs auth + real station |
| Keys (Mini Mart) | Live | Keys listed Observed |
| Merging (Chop Shop) | Live | Route `/chop-shop` **404 Observed** — high priority gap |
| Inventory (open keys) | Live (docs) | `/inventory` **404 Observed** — high priority gap |
| ATM | Live | UI Observed |
| Dealership trading | Coming soon | Route exists; “Could not load the market” / empty **[Observed]** |
| Crowbars / insurance / theft | Coming soon | Items shown in Mini Mart UI **[Observed]** — verify purchasable vs display-only |
| Mafia Men / Job Board / drops / jackpot | Coming soon / not live | Do not treat as production claim paths |
| Chat | N/A | “We're Closed” **[Observed]** |
| Referral claim share | Off | Link + cookie only **[Documented]** |

---

## 4. Test approach

### 4.1 Principles

1. **Risk first:** money movement, signing, wrong balances/fees, false claim pays, false claim refusals that burn trust.
2. **Observe → document → challenge assumptions:** every defect cites environment, wallet, tx hash when on-chain.
3. **Mobile-only for claim chrome:** HOLD TO PUMP, Check in (+ ROUTE TO THE STATION puzzle), and related claim UX are **gated to phone** (UA / touch / phone detection). Desktop browsers show block copy such as “Pumping only works on a phone…” even when DevTools Sensors inject a valid GPS fix **[Observed 2026-10-27]**. Desktop remains useful for map/auth/shop smoke — not for completing pump/check-in.
4. **Chain truth > UI copy:** reconcile UI amounts with Blockscout / proof page.
5. **Anti-cheat testing is defensive:** valid refusals, reason codes, support appeal path — not bypass recipes. Lab geo mocks exercise **client** proximity UI only; **server** visit checks remain field (or product-approved refuse-only labs).
6. **Docs/app parity:** V2 docs and live routes currently disagree in places (Chop Shop/Inventory 404, Dealership “coming soon” vs route) — treat as P0 product/QA alignment.
7. **Money-safe by default:** never complete a hold that may burn a bike/car use unless explicitly authorized; prefer short-tap / soft-gate probes in lab.

### 4.2 Test levels

| Level | Goal | Examples |
| --- | --- | --- |
| **Smoke** | Build is usable | App loads, login modal, map tiles, proof numbers refresh, key pages 200 |
| **Functional** | Feature correct | Stake lock, key buy, lineup save, claim pay/refuse |
| **Integration** | Cross-system | Privy session → wallet → on-chain NFT ownership → claim eligibility |
| **End-to-end** | Real journey | Onboard → deposit → buy $GAS → buy key → open car → claim at station → repair → stake |
| **Regression** | Guard known bugs | Cooldown math, pump busy, early unstake penalty, privacy toggles |
| **Non-functional** | UX quality | Mobile layout, claim latency, map performance, a11y basics |
| **Security / abuse (QA)** | Session & funds safety | Logout clears session, no seed phishing in support UX, sponsorship failure messaging, duplicate claim prevention |
| **Exploratory** | Find unknowns | Charters around claim edge cases, marketplace-empty UX, music/chat noise |

### 4.3 Risk-based priorities

| Priority | Risk theme | Why | Primary verification |
| --- | --- | --- | --- |
| **P0** | Incorrect claim payout / double pay / pay when checks fail | Direct fund loss from prize pool | Claim E2E + explorer; refusal never charges uses |
| **P0** | Wallet key loss / export / wrong address display | Irrecoverable funds **[Documented]** | Export flow, Deposit balances, address match |
| **P0** | Deposit / swap / $GAS buy with wrong rate, tax, or stuck funds | User capital at risk | Deposit→swap scenarios; 2% tax visibility |
| **P0** | Gas sponsorship failure mid-claim with bad UX | Claim appears failed but state burned (or reverse) | Forced/no-sponsor path **[Documented: courtesy]** |
| **P1** | Lineup / cooldown / repair / payout math vs docs | Economic fairness | Spot-check against docs formulas + on-chain |
| **P1** | ATM early unlock penalty + reward forfeit | Staking capital | Stake, claim rewards first, early leave |
| **P1** | Key purchase / reveal fairness UX | Paid RNG | Price in $GAS, boost steps, open after reveal |
| **P1** | Auth session / sybil UX / one-human rules | Abuse + support load | Multi-device limits as *user-visible* only |
| **P1** | Geo permission denied / VPN refusal messaging | Core loop blocked | Refusal copy + recovery steps |
| **P1** | Phone-gate false positive / false negative | Desktop claim blocked correctly; real phones must not be blocked as “desktop” | Desktop Sensors + phone Safari/Chrome; emulator/sim UA |
| **P2** | Leaderboard / mileage / live pumps / profiles | Social trust | Privacy toggles latency (~1 min **[Documented]**) |
| **P2** | Marketing/docs vs app | Support confusion | Route matrix + “coming soon” labels |
| **P3** | Music player, chat closed, cosmetics | Low fund risk | Smoke only |

## 4.4 Mobile-only claim flows, fake GPS & browser matrix

**Gate (client):** Pump / Check in / related claim UX require a **phone-class client**. Desktop Chrome/Safari with Sensors custom location can move the map and show distance (e.g. ~18 m at Hóc Môn) **[Observed]**, but HOLD TO PUMP still surfaces phone-only copy (“Pumping only works on a phone…”). Treat desktop + Sensors as **geo/map lab only**, not a claim path.

**Lab vs field (money-safe):**

| Layer | Lab OK? | Notes |
| --- | --- | --- |
| Map center, station markers, distance label, “Move closer…” soft-gate | Yes | Fake GPS sufficient |
| Phone-gate copy on desktop; Check in / ROUTE TO THE STATION puzzle chrome (on phone/sim) | Yes | Assert UX; do not invent puzzle solutions as exploits |
| Unlocked HOLD TO PUMP at ~0 m on **mobile** UA / touch / sim | Yes (UI) | Stop before full hold unless authorized |
| Paid claim / use burn / on-chain payout | **Field** (or product-approved refuse-only lab) | Server trusts nothing the phone says alone **[Documented]** — IP↔station, Fingerprint, optional photo |

#### Fake GPS options (recommended)

Use these to drive **client** geo; never present as a way to beat production anti-cheat.

1. **Chrome / Safari DevTools → Sensors** — custom lat/lng for map + distance. Useful on desktop for proximity UI; **does not clear the phone gate**.
2. **iOS Simulator + Android Emulator** — set custom location, open mobile Safari / Chrome to `app.gas.cash`. Prefer **simulators for Safari realism** (motion/compass prompts, UA, touch). Emulators for Android Chrome parity.
3. **Playwright** — `geolocation` + `permissions: ['geolocation']` + **mobile emulation** (`isMobile`, `hasTouch`, phone viewport / device descriptor). Chromium for smoke; WebKit where available for Safari-shaped labs. Still lab-only for payout.
4. **Real device field** — physical station for paid/refused claim certification (exit criterion).

Out of scope: OS-level fraud GPS apps, multi-account farm tooling, or “how to spoof Fingerprint.”

#### Browser / device matrix

| Client | Role | Claim / pump / Check in |
| --- | --- | --- |
| **iOS Safari** (device or Simulator) | Primary Safari realism; motion/compass “Don’t Allow” tip | **Required** for claim UX + permission edges |
| **Android Chrome** (device or Emulator) | Primary Android claim path | **Required** |
| **Desktop Chrome mobile emulation** | Fast smoke (viewport + touch flags + geo mock) | Smoke / soft-gate only — not field substitute |
| Desktop Chrome/Safari (no phone UA) | Map, auth, Mini Mart, ATM | Expect phone-gate on pump; do not file as P0 if copy is clear |

Safari-specific: heading/compass “Don’t Allow” is separate from lat/lng **[Observed]**; regression that real phones are misclassified as desktop is **P1**.

Detail recipes: `docs/claim-geo-testing-guide.md`. Short pointer to this section: `docs/mobile-agent-cooperation.md`. Board: `/strategy#claim-gps` (and `/strategy#mobile-coop`).

## 4.5 Mobile agent ↔ user cooperation

Claim chrome is **phone-gated**. Mac/cloud agents cannot finish paid holds alone; week-1 execution uses a shared-session pattern between agents and users on real phones (or Sim/Emulator). Plan Suites D + H reference this section.

#### Who does what

| Actor | Best for | Clicks / grants |
| --- | --- | --- |
| **Mac worker + headed Playwright** (mobile viewport, `isMobile`/`hasTouch`, `geolocation`) | Soft-gates, phone-gate asserts, map distance, screenshots, no full hold | Agent drives; stop before paid hold unless authorized |
| **User on real phone** (same Privy account / shared session if possible) | Real HOLD TO PUMP, Check in + ROUTE TO THE STATION, photo, field payout/refuse | User taps **Tiếp tục** / tutorial dismiss; **Allow** location (and motion if prompted); long-press pump |
| **iOS Simulator on Mac** | Safari realism + custom location without leaving the desk | Agent or user: set Sim location → Safari → Allow → claim chrome |
| **Android Emulator** | Chrome Android parity + custom location | Same pattern as Sim |
| **Screen share / screenshots** | Lam reviews what agent or phone sees; evidence for bugs | Whoever holds the device pastes shots into tracker / store `media/` |

#### Shared-session pattern

1. Agent prepares: login storage state, station coords, money-safe checklist (no unauthorized hold).
2. User opens `app.gas.cash` on phone (or Sim) — same account when Privy allows; otherwise user re-auths and tells agent when READY TO CLAIM.
3. **Handoff cues (user):** Allow location when OS sheet appears; dismiss tutorial (**Tiếp tục** / LET'S GO); open nearest pump; confirm distance; agent tells stop vs proceed.
4. **Handoff cues (agent):** Call out expected copy (“Move closer…”, phone-only block on desktop, Check in puzzle); ask user for screenshot after each gate; never ask user to burn a bike use without Lam/product OK.
5. **Physical station needed:** agent pauses lab; user goes to station; agent stays on chat for steps / evidence; field certifies paid + refused claims.

#### Quick rules

- Desktop Sensors GPS ≠ claim path (phone gate). Use phone, Sim, Emulator, or Playwright mobile emulation.
- Prefer **iOS Simulator** when Safari / compass “Don’t Allow” matters; real iPhone for exit-criteria claims.
- Lab = UI/soft-gate; Field = payout + server anti-cheat. Keep bike uses money-safe.
- Evidence: device + browser + approx coords/city + screenshot; tx hash if on-chain.

---

## 5. Automation vs manual

### 5.1 Automate early (smoke / regression candidates)

Suitable once stable selectors + test accounts exist:

| Candidate | Type | Notes |
| --- | --- | --- |
| Marketing + app URL health | API/HTTP | `/`, `/docs`, `/terms`, `/privacy`, `/proof`, app routes |
| Proof page metrics parse + non-zero / refresh | UI or API | Compare snapshot drift |
| Unauthenticated gates | UI | Garage/Mileage sign-in copy; login CTA |
| Login modal providers visible | UI | Google, X, Apple |
| Mini Mart key SKUs + currency labels | UI | Assert $GAS pricing vs any stale USO label |
| ATM public pool labels render | UI | Est. APY present; disclaimer text if any |
| Contract addresses on docs match published list | Content | Diff vs known good |
| 404 watch | UI | `/chop-shop`, `/inventory` — fail build if still 404 when marked live |
| Responsive breakpoints | Visual | 375 / 768 / 1280 map chrome |
| Console error budget on cold load | Telemetry | Allowlist known third-party noise |

**Do not automate first:** physical claim at station, photo verification, Fingerprint bot scoring, paid merge RNG, full OAuth with real IdPs in CI without dedicated test tenants. Automate **phone-gate assertion** (desktop shows block copy) and **mobile-emulation proximity UI** once stable.

### 5.2 Keep manual / exploratory

- Full claim at real stations (multiple cities if possible)
- Photo challenge UX and Anthropic reject/accept paths
- Deposit/bridge/swap with small real funds
- Staking early-exit economic scenarios
- Merge boost UX and miss outcomes
- Privacy/public profile + Live pumps station hide
- **iOS Safari + Android Chrome** real devices (long-press pump, Check in puzzle, location / motion Allow flows)
- Support appeal path (`support@fillgas.xyz`, 72h review) for false refusals
- Session fixation / shared device logout hygiene
- Accessibility: focus, contrast on map overlays, tap targets

### 5.3 Recommended tool stack

| Need | Tooling (suggestion) |
| --- | --- |
| E2E UI smoke | Playwright (Chromium + WebKit); mobile viewport + `geolocation` for claim-chrome smoke |
| Fake GPS (lab) | DevTools Sensors; iOS Sim / Android Emulator custom location; Playwright `setGeolocation` — see §4.4 |
| Mobile real device | Physical iPhone Safari + Android Chrome; BrowserStack secondary; prefer simulators for Safari realism in lab |
| API contract (public only) | Playwright request / curl against documented public pages — **no invented private APIs** |
| On-chain checks | Blockscout UI + cast/viem scripts against published contracts |
| Exploratory notes | Session charters + annotated screenshots |
| Defect tracking | Team tracker with severity model in test plan |
| Wallet/auth test harness | Dedicated Google/X test accounts; Privy-exported keys in secure vault |

---

## 6. Environments

| Environment | Use | Notes |
| --- | --- | --- |
| **Production** `https://app.gas.cash` | Current research baseline; careful funded tests | Real Robinhood Chain; real USO/$GAS |
| **Staging / preview** | **[Open question]** — not discovered | Prefer for destructive staking/merge tests |
| **Marketing** `https://www.gas.cash` | Docs/terms parity | Same release train? **[Assumption]** |
| **Local / mock** | Unit/UI without chain | Only if eng provides; not assumed |

**Data rule:** Prefer tiny amounts. Never use personal main wallets. Export test keys and store offline. Document every funded tx hash in the defect or test log.

---

## 7. Entry criteria

Testing for a release candidate starts when:

1. Deploy URL + git/commit (or deploy id) identified
2. Known contract set for that build (or confirmation addresses unchanged)
3. At least 2 working test social accounts + funded micro balances ($GAS, USO, and a path to deposit USDC/ETH as needed)
4. Access to Blockscout for chain 4663
5. Product confirms which features are **live vs display-only** for that build (especially Mini Mart items, Dealership, Chop Shop, Inventory)
6. Smoke checklist green on unauthenticated surfaces
7. Support contact for false-refusal escalations agreed

## 8. Exit criteria

Release is QA-approved when:

1. All **P0** scenarios executed; zero open P0 defects
2. All **P1** scenarios executed or explicitly waived with product owner sign-off
3. Claim path: ≥1 successful paid claim and ≥1 refused claim with reason code, verified on-chain / ledger behavior — executed on **phone** (device or approved sim/emulator), not desktop Sensors alone
4. Deposit→Buy $GAS path proven with reconciliable balances
5. ATM stake + reward claim + (if time) early-exit penalty verified
6. Key buy + open path verified OR blocked with clear defect if routes 404
7. No high-severity docs/app contradictions on money flows unresolved
8. Mobile smoke on **iOS Safari + Android Chrome** for map + login + claim chrome (HOLD / Check in reachable; desktop phone-gate copy verified)
9. Regression pack (automated smoke) green
10. Known issues list published with severities

---

## 9. Risks & mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| No staging; only prod | Accidental large loss / noisy chain data | Micro-funds; checklists; dual-person review for spend scripts |
| Geolocation + **phone gate** for core loop | Desktop Sensors cannot complete pump; remote QA limited | Field phones; iOS Sim / Android Emulator + fake GPS for UI; product-approved refuse-only labs only |
| Lab geo mocks vs server anti-cheat | False confidence that `0 m` UI = paid claim | Keep lab vs field table in §4.4; certify payout in field |
| Auth wall blocks deep UI | Incomplete coverage | Seeded test accounts before week 1 |
| Chop Shop / Inventory 404 while docs say live | Broken economy loop | P0 bugs; block release of “merge/open” claims until fixed |
| UI shows coming-soon items as buyable | Accidental spend / support load | Purchase attempts; assert disabled or clear “not live” |
| Gas sponsorship intermittent | Stuck claims | Explicit UX for “sponsor unavailable”; retry; never silent double-spend of uses |
| Stock Token eligibility (e.g. US persons) | Legal / eligibility bugs | Confirm self-attestation UX before first claim/swap **[Documented]** |
| Fingerprint / VPN false positives | Angry real users | Capture reason codes; exercise appeal SLA |
| Privy / IdP outage | Total lockout | Status messaging; cached session behavior documented |
| Docs drift from app | Wrong test oracles | Freeze a “source of truth” owner per release |

---

## 10. Metrics

| Metric | Target (initial) |
| --- | --- |
| P0 escape rate to prod | 0 per release |
| Claim success path verified each release | ≥1 paid + ≥1 refused |
| On-chain reconciliation mismatches (UI vs explorer for test txs) | 0 unexplained |
| Smoke automation pass rate | ≥95% before RC sign-off |
| Critical path exploratory charters completed | 100% of P0/P1 areas in plan |
| Mean time to file claim-related defect with tx hash | <1 business day of discovery |
| Docs/app parity open issues | Tracked; P0 contradictions = 0 at exit |
| Mobile smoke devices covered | ≥2 (1 iOS, 1 Android) |

---

## 11. Roles (strategy-level)

| Role | Responsibility |
| --- | --- |
| QA Lead (Lam) | Strategy/plan ownership, risk calls, sign-off recommendation |
| QA engineers | Execute plan, automation, exploratory charters |
| Field testers | Real-station claims on phone Safari/Chrome, photo challenges, Check in puzzle; execute §4.5 shared-session handoffs with agents |
| Eng | Test hooks, feature flags, staging, tx debugging |
| Product | Live vs coming-soon matrix each release |
| Support | Refusal appeals, phishing awareness copy |

Detailed RACI and schedule: see `docs/test-plan.md`.

---

## 12. Dependencies & assumptions

**Assumptions (validate week 1):**

1. Production is the only available environment unless eng provides otherwise.
2. Apple login in UI is intentional alongside Google/X **[Observed vs terms mentioning Google/X primarily]**.
3. Map tiles may be OpenFreeMap (privacy) and/or Mapbox-like UI chrome **[Documented OpenFreeMap; exploration noted Mapbox-like]**.
4. “DBOP” or similar secondary currencies in Mini Mart UI need product confirmation — docs price keys in **$GAS**.
5. Dealership route is a shell ahead of launch, not a live marketplace.

**Open questions** are listed in the test plan § Open Questions — do not invent answers in execution.

---

## 13. Related artifacts

- Test plan: `docs/test-plan.md` (Suites D + H; §4.10 mobile-coop execution) · board `/plan`
- This strategy on board: `https://pi0099.github.io/gas-cash-qa-bug-board/strategy` (§4.4 Claim/GPS · §4.5 Mobile coop; deep links `/claim-gps` → `#claim-gps`, `/mobile-coop` → `#mobile-coop`)
- Claim / lab GPS guide: `docs/claim-geo-testing-guide.md` (detail recipes; board Strategy `#claim-gps`)
- Mobile agent ↔ user cooperation (pointer → §4.5): `docs/mobile-agent-cooperation.md`
- Research notes: `internal/gas-cash-qa-research-brief.md`
- Exploration screenshots: captured under `/tmp/gas-cash-exploration/` during recon (25 screens)

---

## 14. Change log

| Date | Change |
| --- | --- |
| 2026-10-27 | Nav: Claim/GPS + Mobile coop folded under Strategy; board `/strategy` with `#claim-gps` / `#mobile-coop` redirects |
| 2026-10-27 | §4.5 Mobile agent ↔ user cooperation merged into strategy (was separate-only); board `/strategy#mobile-coop` |
| 2026-10-27 | Mobile-only claim UX (phone gate); fake-GPS options; Chrome+Safari matrix; lab vs field / money-safe boundaries |
| 2026-10-25 | Initial strategy from live recon + public docs/terms/privacy |
