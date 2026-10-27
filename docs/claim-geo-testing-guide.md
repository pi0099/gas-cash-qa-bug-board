# Gas Cash — Claim / reward + lab GPS testing guide

| Field | Value |
| --- | --- |
| Product | [app.gas.cash](https://app.gas.cash) |
| Audience | QA (lab + field) |
| Date | 2026-10-26 (phone-gate note 2026-10-27) |
| Money policy | Free bike already claimed on QA account; **do not** complete a paid hold-to-pump that burns a bike use unless explicitly authorized |
| Legend | **[Documented]** public docs/privacy/terms · **[Observed]** this lab run / prior store runs · **[Inferred]** logical from evidence, not a product promise |

**Bottom line for the two user questions**

1. **Fake GPS for testing:** Browser / Playwright geolocation mocking is **lab-sufficient for proximity UI** (map centers, distance label, station sheet, unlocked **HOLD TO PUMP** at `0 m` on a **phone-class** client). It is **not** proven to produce a paid claim — product docs say the server trusts nothing the phone says; expect **Partial → Field-only** for payout. **Phone gate [Observed 2026-10-27]:** desktop + DevTools Sensors can show distance (e.g. ~18 m at Hóc Môn) but HOLD still says “Pumping only works on a phone…” — use mobile UA/touch, iOS Sim / Android Emulator, or Playwright mobile emulation for claim chrome.
2. **Is being “at a station” enough?** No. You must be signed in with an eligible vehicle (free bike or car lineup), off cooldown / under daily caps, on a **phone** client, grant location, open a live station pump, get inside the (unpublished) station radius so the client drops the “Move closer…” soft-gate, then **hold to pump** and pass **server** geo / Fingerprint / network / optional photo checks. Standing nearby without hold + checks does not pay.

---

## A. Claim / reward how-to (product rules)

### A.1 Prerequisites

| Prerequisite | Evidence | Notes |
| --- | --- | --- |
| Signed in (Privy Google / X / Apple) | **[Documented]** docs + **[Observed]** session | Unauth map soft-fails some chrome; claim path is authed. |
| Vehicle: free bike **or** car NFT in wallet / lineup | **[Documented]** docs “The free bike” / “A car in your wallet”; **[Observed]** QA garage shows **BIKE**, **READY TO CLAIM** | Bike: 7 uses, 4–20% of base rate, low cap (~$0.50), never jackpot, cannot repair. Car parks bike for good. |
| Rest / cooldown ready | **[Documented]** wait 4–36h by Speed (cars); bike docs say **24h** between claims; **[Observed]** garage modal once said **36h**, garage detail “24-hour wait”, in-app COOLDOWN explainer “starts at 24 hours… floor of 12 hours” with cars — **copy conflict** filed elsewhere | `GET /api/cooldown` this run: `cooldownSec: null` (ready). |
| Claims remaining / daily cap | **[Documented]** ≤3 claims/day account; bike 7 lifetime uses | Refusals do **not** consume uses **[Documented]**. |
| Geolocation permission | **[Documented]** privacy; **[Observed]** deny → “Blocked by your browser. Allow location for this site, then reload.” + **Turn on location** | Location only while claim screen open (no background) **[Documented]**. |
| Proximity to a **real** mapped station | **[Documented]** how-it-works / docs / terms (“inside the radius”); **[Observed]** station sheet distance + soft-gate | Map shows real stations (fuel brands / OSM-style names), not a curated country list **[Documented]**. |
| Station has a free pump | **[Documented]** 6 pumps/station; busy → refuse + clock; **[Observed]** UI “AVAILABLE” bars + copy “A full bar is a free pump…” | |

### A.2 Exact user steps (happy path)

**[Documented]** how-it-works + docs “The pump”, refined with **[Observed]** UI copy:

1. Sign in → ensure bike or Starting 5 ready (profile / garage: multiplier, Daily Claim Rate, cooldown).
2. Allow location when prompted.
3. Open the map (`/`). Tap **Ready to claim. Open the nearest pump** (or select a station marker).
4. Confirm station sheet: name, distance (`N m from you, ≈ X min walk`), **Pumped N×**, pump bars **AVAILABLE**, **EST. CLAIM**.
5. Optional: **LINEUP** / **CHECK IN** (check-in is separate chrome; `checkinOpen: true` on `/api/me` **[Observed]** — not verified as required for claim).
6. **HOLD TO PUMP** (long-press). Server runs visit checks. On success, prize pool pays **USO Stock Token + $GAS** on Robinhood Chain to the Privy wallet.
7. Optional share card; Live pumps feed may show the paid station (privacy: Location off can hide station on feeds) **[Documented]**.

### A.3 What “at the station” means

| Question | Answer | Tag |
| --- | --- | --- |
| Radius in metres? | **Not published.** Privacy: position checked “inside the station radius”; docs intentionally omit thresholds so farms cannot tune. | **[Documented]** |
| Client soft-gate? | At mock **0 m**: no “Move closer…”; **HOLD TO PUMP** usable. At **147 m**: copy **“Move closer, you are 147 m away.”** | **[Observed]** 2026-10-26 |
| Which stations? | Any real mapped fuel venue returned by `GET /api/stations` (bbox); live paid claims appear on `GET /api/claims/live?scope=latest` with `station.lat/lng`. | **[Observed]** |
| Must map show in-range? | Client distance / soft-gate is the UX gate; payout still needs server checks. | **[Observed]** + **[Documented]** |
| Vehicle equipped? | Yes — bike or car ownership/lineup required before a claim can start **[Documented]**; QA shows **READY TO CLAIM** with bike **[Observed]**. | |

### A.4 Soft fails vs hard fails

| Condition | UX / behaviour | Cost | Tag |
| --- | --- | --- | --- |
| Geolocation denied | “Blocked by your browser…”, **Turn on location**; map may fall back (e.g. NYC-ish bbox) | No claim | **[Observed]** |
| Too far | “Move closer, you are N m away.” under HOLD TO PUMP | No claim / no use | **[Observed]** |
| Cooldown / wait | Refused; cooldown chrome | No use | **[Documented]** |
| No uses / worn bike | Cannot claim | — | **[Documented]** |
| 4th claim same day | Cap refuse | No use | **[Documented]** |
| All 6 pumps busy | Refuse + clock to next free | No use | **[Documented]** |
| VPN / proxy | Likely refuse; actionable copy | No use | **[Documented]** |
| Spoofed location (IP country ≠ station country, bot/emulator signals, etc.) | Server refuse; reason shown without revealing which check | No use | **[Documented]** |
| Photo challenge fail / reuse | Refuse | No use (dispute via support) | **[Documented]** |
| API / sponsorship failure | Soft error UX; must not silent-success | Must not burn use incorrectly | **[Documented]** strategy |

### A.5 Evidence pointers (this run)

- Screenshots: `media/claim-geo-20261026/` — especially `deep-at-station-d-hold-visible.png` (`0 m` + HOLD TO PUMP) and `deep-far-hcmc-d-hold-visible.png` (`147 m` + Move closer).
- Network digests: `internal/claim-geo/summary.json`, `deep-summary.json`, `station-pick.json`.
- Public oracles: [How it works](https://www.gas.cash/how-it-works), [Docs — The pump / Stopping farms](https://www.gas.cash/docs), [Privacy §03–04](https://www.gas.cash/privacy), [Terms §02](https://www.gas.cash/terms).

**Copy strings captured [Observed]**

- `Ready to claim. Open the nearest pump`
- `0 m from you, ≈ 1 min walk. pumped 0 times.` / `Pumped 0×`
- `HOLD TO PUMP` · `LINEUP` · `CHECK IN` · `AVAILABLE` · `EST. CLAIM`
- `Move closer, you are 147 m away.`
- `Blocked by your browser. Allow location for this site, then reload.` / `Turn on location`
- Safari motion tip: `SAFARI REMEMBERS A “DON’T ALLOW”` (heading/compass — separate from lat/lng)

---

## B. Fake GPS for lab testing

### B.1 What the app trusts (probe results)

| Signal | Role | Tag |
| --- | --- | --- |
| Browser Geolocation API (`lat`/`lng`/`accuracy` + recent fixes) | Client map center, distance label, soft “Move closer” gate; **sent on claim** per privacy | **[Documented]** + **[Observed]** UI reacts to Playwright geo |
| `GET /api/stations?west&east&south&north&cols=` | Station markers for map bbox (follows mocked location) | **[Observed]** |
| `GET /api/claims/live` (+ `?scope=latest`) | Live pumps feed; latest includes `station:{lat,lng}` for paid claims | **[Observed]** |
| IP + edge geo + Fingerprint (`anti.fillgas.xyz`) | Server anti-cheat / bot / VPN | **[Documented]** + **[Observed]** Fingerprint scripts load on map |
| Photo (sometimes) | Pump image check via Claude; 7-day retention | **[Documented]** |
| Motion / compass | Facing direction on map; deny tip for Safari | **[Observed]** copy — not required for lat/lng mock |

**Network while opening station / short-tapping HOLD (money-safe):** no `POST` claim body observed. Station list is GET-only with bbox; signed-in features add `stationId` **[Observed]**. Full claim payload shape (lat/lng array, fingerprint token) is described in privacy but **not captured** here because we did not complete hold.

### B.2 Verdict table

| Goal | Verdict | Why |
| --- | --- | --- |
| Map centers on mocked coords; stations load | **Lab-sufficient** | `/api/stations` bbox tracked mock Indonesia vs HCMC **[Observed]** |
| Distance `0 m` + HOLD TO PUMP without “Move closer” | **Lab-sufficient** | Mock at Pertashop `-7.670405, 111.228684` **[Observed]** |
| Soft-fail too-far UX | **Lab-sufficient** | 147 m → Move closer **[Observed]** |
| Paid claim / burn use / on-chain payout | **Partial → Field-only** (treat as **Field-only** until product approves a refuse-only lab attempt) | Docs: “server checks the visit. It trusts nothing your phone says.” IP↔station country, Fingerprint, optional photo **[Documented]**. Not submitted in this run. |

### B.3 Practical recipe (QA only — not fraud tooling)

#### Pick live station coordinates

```bash
# Recent paid claims often include station lat/lng
curl -s 'https://app.gas.cash/api/claims/live?scope=latest' | jq '.data.rows[] | select(.station!=null) | {place,lat:.station.lat,lng:.station.lng,at}'

# Resolve a concrete map feature near a claim
curl -sG 'https://app.gas.cash/api/stations' \
  --data-urlencode "west=<lng-0.05>" --data-urlencode "east=<lng+0.05>" \
  --data-urlencode "south=<lat-0.05>" --data-urlencode "north=<lat+0.05>" \
  --data-urlencode 'cols=16' | jq '.data.features[] | select(.kind=="station")'
```

This run used **Pertashop / Pertamina** `lat:-7.670405, lng:111.228684` (`stationId` when signed-in: `jdo7gnbglcyzjtc8js4fi9sv`) near a live Indonesia claim.

#### Playwright / CDP

```js
import { chromium } from 'playwright';

const station = { latitude: -7.670405, longitude: 111.228684, accuracy: 5 };

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  storageState: 'internal/sessions/gas-cash-privy-storageState.json',
  geolocation: station,
  permissions: ['geolocation'],
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
await context.setGeolocation(station);

const page = await context.newPage();
await page.goto('https://app.gas.cash/');
// Skip tutorial → click "Ready to claim. Open the nearest pump"
// Assert: /0 m from you/ and HOLD TO PUMP without /Move closer/
// STOP before a completed long-press that submits a claim.
```

Prior smoke runs used synthetic HCMC (`10.8231, 106.6297`) for map-only UX — that is **not** “at station” and will hit Move closer on the nearest HCMC pump (~147 m in this probe).

#### Chrome DevTools Sensors

1. Open `app.gas.cash` → DevTools → **Sensors** (or Command Menu → “Show Sensors”).
2. Location → **Other…** → paste station lat/lng.
3. Reload; allow location if prompted.
4. Open nearest pump; confirm `0 m` / no Move closer.

#### iOS Simulator / Android Emulator (mobile web)

Set the simulator/emulator custom location to the same station coords, open Safari/Chrome to `app.gas.cash`, grant location. Same UI expectations as DevTools. Native GPS spoof apps / OS-level fraud tooling are **out of scope** for this guide.

### B.4 Money-safe farthest probe (this run)

| Step | Done? | Burns use? |
| --- | --- | --- |
| Mock geo + map + stations GET | Yes | No |
| Open station sheet; read distance / AVAILABLE | Yes | No |
| See HOLD TO PUMP at `0 m` | Yes | No |
| See Move closer at `147 m` | Yes | No |
| Short pointerdown (~200 ms) on HOLD | Yes | **No** — no claim `POST` observed |
| Full hold / submit / photo / payout | **No** | Would risk bike use + anti-cheat flags |

**Dry-run conclusion:** Opening the claim sheet and short-tapping HOLD does **not** appear to burn uses. Completing the hold gesture until server response **might** still be free on refuse **[Documented]** (“refused claim costs nothing”), but was **not** attempted — ask before any full hold on the QA bike.

---

## C. Lab checklist (quick)

1. Reuse `internal/sessions/gas-cash-privy-storageState.json` (re-login if Privy stale).
2. Pull a live `station` feature near `claims/live?scope=latest`.
3. `setGeolocation` to that lat/lng + `permissions: ['geolocation']`.
4. Expect: map at station, `0 m`, HOLD TO PUMP, no Move closer.
5. Negative: set coords ~150 m away → Move closer copy.
6. Deny geo → Turn on location banner.
7. Stop before submitting a paid claim unless authorized.

---

## D. Open questions (do not invent answers)

1. Exact client radius (metres) that clears “Move closer…” — unpublished; only bounded by observations (0 m OK, 147 m blocked).
2. Whether a lab mock that shows `0 m` can ever pass **server** IP↔station and Fingerprint checks from a remote QA IP.
3. Whether **CHECK IN** is required before HOLD TO PUMP or only optional mileage/chrome.
4. Bike rest copy: modal 36h vs docs/garage 24h vs cooldown explainer 24h→12h with cars.

---

## Related store docs

- `docs/claim-bike-deep-dive.md` — free bike grant on QA account
- `docs/test-plan.md` Suite D — claim scenarios
- `docs/test-strategy.md` — §4.4 mobile-only claim / fake GPS / browser matrix
- `docs/mobile-agent-cooperation.md` — agent ↔ user phone handoff (not in strategy)
- Mind map: [Map / Claim](https://pi0099.github.io/gas-cash-qa-bug-board/mindmap/claim)
