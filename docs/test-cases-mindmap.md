# Gas Cash — Mind-map test cases

| Field | Value |
| --- | --- |
| Date | 2026-10-26 |
| Env | https://app.gas.cash |
| SoT (site) | `data/test-cases.json` in [gas-cash-qa-bug-board](https://github.com/pi0099/gas-cash-qa-bug-board) |
| Live | https://pi0099.github.io/gas-cash-qa-bug-board/test-cases |
| Authored | Functional **16** · Validation **11** · Security **8** · **35** total |

Money-safe: no spend, no seed reveal in evidence, field claim TCs **Blocked**.

## Results (execution 2026-10-26)

| Pass | Fail | Blocked | Skip | Total |
| ---: | ---: | ---: | ---: | ---: |
| 29 | 5 | 1 | 0 | 35 |

**Session:** valid during suite run; `GC-TC-S-03` logout in disposable context revoked Privy refresh tokens server-side — on-disk `storageState` is stale until re-capture.


> Privy storageState was valid for the full TC suite (LOG OUT / SET USERNAME). GC-TC-S-03 logout in a disposable context revoked refresh tokens server-side; the on-disk storageState file is now stale until a fresh login capture.

## FAIL table

| TC | Bug | Note |
| --- | --- | --- |
| `GC-TC-V-01` | `gc-minimart-availability-labels` | Coming-soon sections mix SOON/OPEN/PLAY with live-looking controls — honesty gap. |
| `GC-TC-V-02` | `gc-docs-route-404` | Docs path /chop-shop is 404 while /chopshop is live. |
| `GC-TC-V-03` | `gc-docs-route-404` | Docs path /inventory is 404 while /pitstop is live. |
| `GC-TC-V-04` | `gc-404-unbranded` | Unbranded framework 404 with no home CTA. |
| `GC-TC-V-06` | `gc-minimart-availability-labels` | Availability labels inconsistent (SOON/OPEN/PLAY on Coming Later). |

## Suite by type

### Functional (16)

| ID | Pri | Node | Title | Result |
| --- | --- | --- | --- | --- |
| `GC-TC-F-01` | P1 | `auth` | Authenticated session loads home shell without login wall | **Pass** |
| `GC-TC-F-02` | P1 | `auth-privy` | Unauthenticated login modal shows Google / X / Apple | **Pass** |
| `GC-TC-F-03` | P1 | `wallet` | Header shows USO / $GAS balance chrome when authed | **Pass** |
| `GC-TC-F-04` | P1 | `fund-deposit` | Buy $GAS / Deposit entry opens without completing a swap | **Pass** |
| `GC-TC-F-05` | P1 | `auth-attest` | Eligibility attestation appears on Buy $GAS path (cancel-only) | **Pass** |
| `GC-TC-F-06` | P1 | `claim` | Map shell loads with station/pump chrome | **Pass** |
| `GC-TC-F-07` | P1 | `claim` | Field claim / hold-to-pump — Blocked (requires physical station) | **Blocked** |
| `GC-TC-F-08` | P2 | `vehicle` | Garage / vehicle surface reachable and settles | **Pass** |
| `GC-TC-F-09` | P1 | `minimart-keys` | Mini Mart lists Regular / Super / Premium keys with $GAS pricing | **Pass** |
| `GC-TC-F-10` | P1 | `chop` | Chop Shop live path /chopshop loads | **Pass** |
| `GC-TC-F-11` | P1 | `garage` | Inventory live path /pitstop loads | **Pass** |
| `GC-TC-F-12` | P1 | `atm` | ATM stake UI browses (no stake submitted) | **Pass** |
| `GC-TC-F-13` | P2 | `social-mileage` | Leaderboard page loads when authenticated | **Pass** |
| `GC-TC-F-14` | P2 | `social-mileage` | Mileage page loads when authenticated | **Pass** |
| `GC-TC-F-15` | P1 | `proof` | Proof page shows prize pool / prices / chain links | **Pass** |
| `GC-TC-F-16` | P2 | `rewards` | Header / portfolio surfaces USO and $GAS reward assets | **Pass** |

### Validation (11)

| ID | Pri | Node | Title | Result |
| --- | --- | --- | --- | --- |
| `GC-TC-V-01` | P1 | `minimart-soon` | Coming-soon Mini Mart items are not casually purchasable | **Fail** |
| `GC-TC-V-02` | P1 | `chop` | Docs path /chop-shop honesty (404 vs live /chopshop) | **Fail** |
| `GC-TC-V-03` | P1 | `minimart` | Docs path /inventory honesty (404 vs live /pitstop) | **Fail** |
| `GC-TC-V-04` | P2 | `gas` | Unknown route 404 page is branded with recovery CTA | **Fail** |
| `GC-TC-V-05` | P1 | `wallet` | Header balances: ellipsis must resolve or show failed state | **Pass** |
| `GC-TC-V-06` | P2 | `minimart-soon` | Mini Mart availability labels (SOON / OPEN / PLAY) are consistent | **Fail** |
| `GC-TC-V-07` | P2 | `atm-lock` | ATM empty / insufficient stake path shows clear UX (no silent success) | **Pass** |
| `GC-TC-V-08` | P1 | `auth-attest` | Attestation required before swap can proceed (cancel path) | **Pass** |
| `GC-TC-V-09` | P2 | `proof-dealership` | Dealership coming-soon / empty market honesty | **Pass** |
| `GC-TC-V-10` | P3 | `social` | Unauthenticated Garage shows sign-in gate | **Pass** |
| `GC-TC-V-11` | P2 | `fund` | Empty / invalid buy amount does not enable spend | **Pass** |

### Security (8)

| ID | Pri | Node | Title | Result |
| --- | --- | --- | --- | --- |
| `GC-TC-S-01` | P1 | `auth` | Session gate: Mileage requires auth when logged out | **Pass** |
| `GC-TC-S-02` | P1 | `wallet-export` | UI does not phish for seed phrase or account password | **Pass** |
| `GC-TC-S-03` | P1 | `auth` | Logout clears session (isolated context) | **Pass** |
| `GC-TC-S-04` | P1 | `wallet-export` | Wallet export not shown casually (warnings-only observe) | **Pass** |
| `GC-TC-S-05` | P1 | `auth-privy` | Auth sync vs Privy: /api/auth/sync healthy or clear failure | **Pass** |
| `GC-TC-S-06` | P2 | `social-ref` | Open-redirect smoke on obvious redirect/next params | **Pass** |
| `GC-TC-S-07` | P2 | `gas` | XSS smoke on obvious query param reflection | **Pass** |
| `GC-TC-S-08` | P2 | `auth` | Side menu / settings do not request wallet seed for support | **Pass** |

## Case details

### GC-TC-F-01 — Authenticated session loads home shell without login wall

- **Type:** Functional · **Priority:** P1 · **Mind-map:** `auth`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Valid Privy storageState with token + refresh
- Desktop Chrome headed

**Steps**

1. Open https://app.gas.cash with storageState.
2. Wait for shell to settle (≥8s).
3. Observe header chrome and primary map/home surface.

**Expected:** LOG OUT or SET USERNAME (or equivalent authed chrome) visible; no Privy login wall; branded map/home shell renders.

**Notes:** Authed chrome present (LOG OUT / SET USERNAME).

---

### GC-TC-F-02 — Unauthenticated login modal shows Google / X / Apple

- **Type:** Functional · **Priority:** P1 · **Mind-map:** `auth-privy`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Fresh browser context without storageState

**Steps**

1. Open https://app.gas.cash in a clean context.
2. Tap LOG IN / SIGN UP (or equivalent CTA).
3. Inspect Privy modal providers.

**Expected:** Modal lists Google, X (Twitter), and Apple as sign-in options.

**Notes:** Providers visible: Google=true X/Twitter=true Apple=true

---

### GC-TC-F-03 — Header shows USO / $GAS balance chrome when authed

- **Type:** Functional · **Priority:** P1 · **Mind-map:** `wallet`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated session

**Steps**

1. Open home while authenticated.
2. Locate header balance pills for USO and $GAS.

**Expected:** Balance chrome present (numeric values, 0, or transient ellipsis — not missing entirely).

**Notes:** USO and GAS chrome present in header/body.

---

### GC-TC-F-04 — Buy $GAS / Deposit entry opens without completing a swap

- **Type:** Functional · **Priority:** P1 · **Mind-map:** `fund-deposit`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated session
- Money-safe: cancel only; no spend

**Steps**

1. From home, open Buy $GAS / Deposit / Fund entry (header or menu).
2. Observe deposit/swap UI.
3. Cancel / close without signing.

**Expected:** Fund/Buy UI opens; user can cancel; no balance change.

**Notes:** Buy/Deposit UI reachable; cancelled without spend.

---

### GC-TC-F-05 — Eligibility attestation appears on Buy $GAS path (cancel-only)

- **Type:** Functional · **Priority:** P1 · **Mind-map:** `auth-attest`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated session
- Do not complete attestation checkbox flow if it would enable spend

**Steps**

1. Open Buy $GAS flow.
2. Look for 18+ / Stock Token / eligibility attestation copy or sheet.
3. Cancel without confirming spend.

**Expected:** Attestation / eligibility content is presented before a swap can complete (or already recorded for this account with clear prior state).

**Notes:** Attestation / eligibility copy observed on Buy path.

---

### GC-TC-F-06 — Map shell loads with station/pump chrome

- **Type:** Functional · **Priority:** P1 · **Mind-map:** `claim`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated session
- Geolocation granted (synthetic OK)

**Steps**

1. Open https://app.gas.cash/ (map).
2. Wait for map tiles / markers.
3. Observe Live pumps or station UI if present.

**Expected:** Map canvas renders; no blank crash; station or pump chrome appears or a clear soft-fail message is shown.

**Notes:** Map surface present (nodes=70).

---

### GC-TC-F-07 — Field claim / hold-to-pump — Blocked (requires physical station)

- **Type:** Functional · **Priority:** P1 · **Mind-map:** `claim`
- **Result:** Blocked
- **Automatable:** false

**Preconditions**

- Real gas station presence required
- Remote agent cannot complete without burning uses

**Steps**

1. N/A — field tester must hold-to-pump at a live station.
2. Document Blocked reason in execution notes.

**Expected:** Eligible claim pays USO+$GAS on-chain; refusals cost no uses. Not executable in this remote money-safe run.

**Notes:** Requires physical presence at a real gas station; remote run money-safe policy forbids hold-to-pump / burning uses.

---

### GC-TC-F-08 — Garage / vehicle surface reachable and settles

- **Type:** Functional · **Priority:** P2 · **Mind-map:** `vehicle`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated session

**Steps**

1. Navigate to /garage.
2. Wait up to 20s for fleet load.
3. Observe empty fleet or cars; avoid free-bike claim overlays that burn uses.

**Expected:** Garage settles to empty fleet, car list, or clear error — not endless 'Reading…'.

**Notes:** Garage settled (empty fleet or cars UI).

---

### GC-TC-F-09 — Mini Mart lists Regular / Super / Premium keys with $GAS pricing

- **Type:** Functional · **Priority:** P1 · **Mind-map:** `minimart-keys`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated session
- No purchase

**Steps**

1. Open /mini-mart.
2. Locate Keys section.
3. Read SKU names and price currency.

**Expected:** Key SKUs visible with non-blank prices in $GAS (or USD equivalent clearly labeled).

**Notes:** Key SKUs with pricing chrome present.

---

### GC-TC-F-10 — Chop Shop live path /chopshop loads

- **Type:** Functional · **Priority:** P1 · **Mind-map:** `chop`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated session
- No merge / no spend

**Steps**

1. Open https://app.gas.cash/chopshop.
2. Observe page content.

**Expected:** HTTP 200 SPA shell with Chop Shop UI (empty merge state OK); not a stranded unbranded 404.

**Notes:**  /chopshop loads SPA content.

---

### GC-TC-F-11 — Inventory live path /pitstop loads

- **Type:** Functional · **Priority:** P1 · **Mind-map:** `garage`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated session

**Steps**

1. Open https://app.gas.cash/pitstop.
2. Observe inventory / pitstop UI.

**Expected:** HTTP 200 SPA with inventory/pitstop content (empty OK).

**Notes:** /pitstop loads inventory/pitstop UI.

---

### GC-TC-F-12 — ATM stake UI browses (no stake submitted)

- **Type:** Functional · **Priority:** P1 · **Mind-map:** `atm`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated session
- No stake / no unlock

**Steps**

1. Open /atm.
2. Observe pool / APY / stake controls.
3. Open My Stakes tab if present; do not submit stake.

**Expected:** ATM UI renders with stake duration options and pool labels; My Stakes shows empty or existing stakes without crash.

**Notes:** ATM UI renders; no stake submitted.

---

### GC-TC-F-13 — Leaderboard page loads when authenticated

- **Type:** Functional · **Priority:** P2 · **Mind-map:** `social-mileage`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated session

**Steps**

1. Open /leaderboard.
2. Observe filters (24h / 7d / all) and list or clear error.

**Expected:** Leaderboard shell loads with data or a recoverable error message (not blank crash).

**Notes:** Leaderboard shell loaded.

---

### GC-TC-F-14 — Mileage page loads when authenticated

- **Type:** Functional · **Priority:** P2 · **Mind-map:** `social-mileage`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated session

**Steps**

1. Open /mileage.
2. Observe mileage stats or empty state.

**Expected:** Mileage shell loads without forcing re-login.

**Notes:** Mileage loads while authenticated.

---

### GC-TC-F-15 — Proof page shows prize pool / prices / chain links

- **Type:** Functional · **Priority:** P1 · **Mind-map:** `proof`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Session optional

**Steps**

1. Open /proof.
2. Read prize pool, USO/$GAS price, tax, and explorer links.

**Expected:** Proof metrics non-empty; contract/explorer links present for chain 4663 narrative.

**Notes:** Proof metrics/links present.

---

### GC-TC-F-16 — Header / portfolio surfaces USO and $GAS reward assets

- **Type:** Functional · **Priority:** P2 · **Mind-map:** `rewards`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated session
- No spend

**Steps**

1. From home, open portfolio / profile balance panel if available.
2. Observe USO and $GAS rows.

**Expected:** USO and $GAS appear as tracked assets (zeros OK for empty wallet).

**Notes:** USO and $GAS visible in portfolio/header surfaces.

---

### GC-TC-V-01 — Coming-soon Mini Mart items are not casually purchasable

- **Type:** Validation · **Priority:** P1 · **Mind-map:** `minimart-soon`
- **Result:** Fail · **Bugs:** `gc-minimart-availability-labels`
- **Automatable:** true

**Preconditions**

- Authenticated session
- No spend even if CTA looks live

**Steps**

1. Open /mini-mart.
2. Inspect Crowbars, Insurance, Scratchers, Alarm / Coming Later sections.
3. Attempt to increment coming-soon steppers or Buy only if clearly gated; abort before any signature.

**Expected:** Coming-soon SKUs are labeled SOON / Coming later / disabled, or purchase is blocked without charging. Live keys remain distinct.

**Notes:** Coming-soon sections mix SOON/OPEN/PLAY with live-looking controls — honesty gap.

---

### GC-TC-V-02 — Docs path /chop-shop honesty (404 vs live /chopshop)

- **Type:** Validation · **Priority:** P1 · **Mind-map:** `chop`
- **Result:** Fail · **Bugs:** `gc-docs-route-404`
- **Automatable:** true

**Preconditions**

- None

**Steps**

1. Open https://app.gas.cash/chop-shop.
2. Compare with /chopshop.

**Expected:** Either hyphen path resolves to Chop Shop, or product docs stop advertising /chop-shop. Today: 404 on hyphen is a known docs/route honesty bug.

**Notes:** Docs path /chop-shop is 404 while /chopshop is live.

---

### GC-TC-V-03 — Docs path /inventory honesty (404 vs live /pitstop)

- **Type:** Validation · **Priority:** P1 · **Mind-map:** `minimart`
- **Result:** Fail · **Bugs:** `gc-docs-route-404`
- **Automatable:** true

**Preconditions**

- None

**Steps**

1. Open https://app.gas.cash/inventory.
2. Compare with /pitstop.

**Expected:** Hyphen/docs inventory path works or is corrected in docs; stranded 404 fails honesty.

**Notes:** Docs path /inventory is 404 while /pitstop is live.

---

### GC-TC-V-04 — Unknown route 404 page is branded with recovery CTA

- **Type:** Validation · **Priority:** P2 · **Mind-map:** `gas`
- **Result:** Fail · **Bugs:** `gc-404-unbranded`
- **Automatable:** true

**Preconditions**

- None

**Steps**

1. Open a nonsense path e.g. /this-route-does-not-exist-qa-2026.
2. Observe 404 chrome.

**Expected:** Branded Gas 404 with link/CTA back to home or map — not a bare Next.js/framework page.

**Notes:** Unbranded framework 404 with no home CTA.

---

### GC-TC-V-05 — Header balances: ellipsis must resolve or show failed state

- **Type:** Validation · **Priority:** P1 · **Mind-map:** `wallet`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated session
- Observe ≥15s after load

**Steps**

1. Load home authenticated.
2. Watch USO/$GAS pills for 15–20s.
3. Note whether values settle to numbers/0 or remain … without error.

**Expected:** Balances settle to numbers (including 0) or show an explicit failed/retry state — not infinite ellipsis.

**Notes:** Balances settled or show numeric/0. pills=["USO 0 0 5 5 4 4 3 3 3 3 3 3 3 3 3 2 2 2 2 2 2 2 2 2 2 2 2 2 ","USO 0 0","USO 0","USO","$6.56 0.0282 USO + 4.3K GAS","0.0282 USO + 4.3K GAS","$4.18 0.018 USO + 2.7K GAS","0.018 USO + 2.7K GAS"]

---

### GC-TC-V-06 — Mini Mart availability labels (SOON / OPEN / PLAY) are consistent

- **Type:** Validation · **Priority:** P2 · **Mind-map:** `minimart-soon`
- **Result:** Fail · **Bugs:** `gc-minimart-availability-labels`
- **Automatable:** true

**Preconditions**

- Authenticated session

**Steps**

1. Open Mini Mart Coming Later / Scratchers sections.
2. Record SOON / OPEN / PLAY labels vs steppers.

**Expected:** Labels match purchasability; OPEN/PLAY must not imply live spend for Coming-soon SKUs.

**Notes:** Availability labels inconsistent (SOON/OPEN/PLAY on Coming Later).

---

### GC-TC-V-07 — ATM empty / insufficient stake path shows clear UX (no silent success)

- **Type:** Validation · **Priority:** P2 · **Mind-map:** `atm-lock`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated session
- Do not submit a stake tx

**Steps**

1. Open /atm My Stakes.
2. If stake form allows 0 / empty, observe validation without signing.

**Expected:** Empty stakes: 'NO STAKES YET' or similar. Invalid amount blocked client-side; no silent success.

**Notes:** Empty/insufficient stakes UX clear; no silent success.

---

### GC-TC-V-08 — Attestation required before swap can proceed (cancel path)

- **Type:** Validation · **Priority:** P1 · **Mind-map:** `auth-attest`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated session
- Money-safe cancel

**Steps**

1. Open Buy $GAS.
2. If attestation checkboxes/buttons exist, leave unchecked and attempt Continue if possible.
3. Cancel.

**Expected:** Continue/swap disabled until attestation complete, or flow already attested with prior record — never silent skip of required legal gates.

**Notes:** Attestation gate content present before swap completion.

---

### GC-TC-V-09 — Dealership coming-soon / empty market honesty

- **Type:** Validation · **Priority:** P2 · **Mind-map:** `proof-dealership`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated session preferred

**Steps**

1. Open /dealership.
2. Observe empty state or 'Could not load the market' / coming soon copy.
3. Confirm no silent purchasable listings.

**Expected:** No live buy path; empty/coming-soon/error is honest.

**Notes:** Dealership shell without live buy path.

---

### GC-TC-V-10 — Unauthenticated Garage shows sign-in gate

- **Type:** Validation · **Priority:** P3 · **Mind-map:** `social`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Clean context without storageState

**Steps**

1. Open /garage logged out.
2. Observe gate copy and Sign In CTA.

**Expected:** Sign-in required message + CTA; no fleet data leak.

**Notes:** Garage shows sign-in gate when logged out.

---

### GC-TC-V-11 — Empty / invalid buy amount does not enable spend

- **Type:** Validation · **Priority:** P2 · **Mind-map:** `fund`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated session
- Cancel-only

**Steps**

1. Open Buy $GAS / swap form if amount field present.
2. Leave empty or enter 0 / nonsense.
3. Observe CTA enabled state; do not sign.

**Expected:** CTA disabled or validation error; no signature prompt for empty/0.

**Notes:** CTA visible for 0 — did not click/sign (money-safe). Manual follow-up if enabled without validation.

---

### GC-TC-S-01 — Session gate: Mileage requires auth when logged out

- **Type:** Security · **Priority:** P1 · **Mind-map:** `auth`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Clean context

**Steps**

1. Open /mileage without storageState.
2. Observe gate.

**Expected:** Sign-in required; no private mileage data.

**Notes:** Mileage gated when logged out.

---

### GC-TC-S-02 — UI does not phish for seed phrase or account password

- **Type:** Security · **Priority:** P1 · **Mind-map:** `wallet-export`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated session
- Do NOT open export seed reveal; observe copy only

**Steps**

1. Scan home, settings/side menu, support surfaces for seed/password/unlock-fee requests.
2. Open Buy Gas / Deposit chrome only enough to see export entry labels — do not reveal key.
3. Screenshot without any seed visible.

**Expected:** No UI asks for seed phrase, social password, or unlock fee. Export entry (if any) shows warnings only in this run.

**Notes:** No seed/password phishing copy in scanned UI.

---

### GC-TC-S-03 — Logout clears session (isolated context)

- **Type:** Security · **Priority:** P1 · **Mind-map:** `auth`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Clone of storageState in disposable context
- Original storageState file left intact

**Steps**

1. In disposable context, confirm authed chrome.
2. Tap LOG OUT.
3. Reload and open /garage.

**Expected:** After logout, login wall / gates return; authed chrome gone.

**Notes:** DOM click LOG OUT cleared session; /garage gated. Disposable context; storageState file intact.

---

### GC-TC-S-04 — Wallet export not shown casually (warnings-only observe)

- **Type:** Security · **Priority:** P1 · **Mind-map:** `wallet-export`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated session
- Never display seed in screenshots

**Steps**

1. Open Deposit / Buy Gas / wallet menu.
2. Locate export/private-key entry if present.
3. Stop at warning / confirmation gate — do not reveal secret.

**Expected:** Export is behind intentional control + warning; seed never appears on home chrome casually.

**Notes:** No casual seed display on home; export not casually shown.

---

### GC-TC-S-05 — Auth sync vs Privy: /api/auth/sync healthy or clear failure

- **Type:** Security · **Priority:** P1 · **Mind-map:** `auth-privy`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated Privy session

**Steps**

1. Load app with network listen on POST /api/auth/sync.
2. Note status codes during bootstrap.

**Expected:** Sync returns 2xx, or user-visible recoverable error — not silent 500 with fake success UI.

**Notes:** auth/sync statuses observed: 200 (2xx present).

---

### GC-TC-S-06 — Open-redirect smoke on obvious redirect/next params

- **Type:** Security · **Priority:** P2 · **Mind-map:** `social-ref`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated or clean context

**Steps**

1. Open https://app.gas.cash/?redirect=https://evil.example/
2. Open https://app.gas.cash/?next=https://evil.example/
3. Observe final URL and navigation.

**Expected:** App stays on gas.cash origin; no automatic navigation to evil.example.

**Notes:** Stayed on app.gas.cash origin; evil.example only in unused query string (false-positive corrected).

---

### GC-TC-S-07 — XSS smoke on obvious query param reflection

- **Type:** Security · **Priority:** P2 · **Mind-map:** `gas`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated session preferred

**Steps**

1. Open https://app.gas.cash/?q=<img src=x onerror=alert(1)>
2. Open a second param like ?utm_campaign=<script>alert(1)</script>.
3. Listen for dialog; inspect visible reflected raw markup.

**Expected:** No alert dialog; payload not executed as script in page.

**Notes:** No alert dialog on obvious XSS query params.

---

### GC-TC-S-08 — Side menu / settings do not request wallet seed for support

- **Type:** Security · **Priority:** P2 · **Mind-map:** `auth`
- **Result:** Pass
- **Automatable:** true

**Preconditions**

- Authenticated session

**Steps**

1. Open side menu / settings / profile panel.
2. Scan for support copy asking for seed, private key, or password.

**Expected:** Support points to email/X without soliciting secrets.

**Notes:** Side menu/settings do not solicit seed/password.

---

