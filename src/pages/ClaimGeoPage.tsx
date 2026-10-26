import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SiteNav } from '../components/SiteNav'
import { publicUrl } from '../lib/publicUrl'

function Tag({ children, tone }: { children: string; tone: 'doc' | 'obs' | 'inf' }) {
  const cls =
    tone === 'doc'
      ? 'border-[var(--blue)]/45 text-[var(--blue)]'
      : tone === 'obs'
        ? 'border-[var(--green)]/45 text-[var(--green)]'
        : 'border-[var(--amber)]/45 text-[var(--amber)]'
  return (
    <span
      className={`inline-block rounded-sm border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] tracking-wide ${cls}`}
    >
      {children}
    </span>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6">
      <h2 className="mb-3 border-b border-[var(--border)] pb-2 text-lg font-semibold tracking-tight text-[var(--text)]">
        {title}
      </h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-[var(--text-muted)]">{children}</div>
    </section>
  )
}

function EvidenceFig({
  src,
  caption,
  alt,
}: {
  src: string
  caption: string
  alt: string
}) {
  return (
    <figure className="overflow-hidden rounded-sm border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-panel)_80%,transparent)]">
      <img src={publicUrl(src)} alt={alt} className="mx-auto max-h-[420px] w-auto object-contain" loading="lazy" />
      <figcaption className="border-t border-[var(--border)] px-3 py-2 font-[family-name:var(--font-mono)] text-[11px] leading-snug text-[var(--text-dim)]">
        {caption}
      </figcaption>
    </figure>
  )
}

export function ClaimGeoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-elevated)_92%,transparent)] px-4 py-3.5 backdrop-blur-md sm:px-6">
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="z-10 shrink-0 text-center sm:min-w-[10rem] sm:text-left">
            <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--amber)] uppercase">
              Gas Cash · Local QA
            </p>
            <h1 className="text-lg font-bold tracking-tight text-[var(--text)]">Claim / GPS</h1>
          </div>
          <div className="z-10 flex justify-center sm:absolute sm:inset-x-0 sm:top-1/2 sm:-translate-y-1/2 sm:pointer-events-none">
            <div className="sm:pointer-events-auto">
              <SiteNav />
            </div>
          </div>
          <div className="pointer-events-none hidden sm:block sm:min-w-[10rem]" aria-hidden />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <p className="mb-2 text-sm leading-relaxed text-[var(--text-dim)]">
          Evidence-based QA answers for hold-to-pump and lab geolocation mocking on{' '}
          <a className="text-[var(--amber)] hover:underline" href="https://app.gas.cash" target="_blank" rel="noreferrer">
            app.gas.cash
          </a>
          . Date 2026-10-26. Money policy: free bike already claimed — do{' '}
          <strong className="text-[var(--text)]">not</strong> complete a paid hold that burns a bike use unless authorized.
        </p>
        <div className="mb-8 flex flex-wrap gap-1.5">
          <Tag tone="doc">[Documented]</Tag>
          <Tag tone="obs">[Observed]</Tag>
          <Tag tone="inf">[Inferred]</Tag>
          <Link to="/mindmap/claim" className="ml-1 text-sm text-[var(--amber)] hover:underline">
            Claim mind map →
          </Link>
        </div>

        <div className="space-y-10">
          <Section id="answers" title="Bottom line">
            <ol className="list-decimal space-y-3 pl-5 marker:font-semibold marker:text-[var(--amber)]">
              <li>
                <strong className="text-[var(--text)]">Fake GPS for testing:</strong> Playwright / CDP{' '}
                <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--text)]">setGeolocation</code> +
                geo permission is <strong className="text-[var(--text)]">lab-sufficient for proximity UI</strong> (map center,
                distance, station sheet, unlocked <strong className="text-[var(--text)]">HOLD TO PUMP</strong> at{' '}
                <code className="font-[family-name:var(--font-mono)] text-[13px]">0 m</code>). Paid payout is still{' '}
                <strong className="text-[var(--text)]">Field-only</strong> — docs say the server trusts nothing the phone says.{' '}
                <Tag tone="obs">[Observed]</Tag> <Tag tone="doc">[Documented]</Tag>
              </li>
              <li>
                <strong className="text-[var(--text)]">Is being “at a station” enough?</strong> No. Need login + eligible
                vehicle (bike/cars), cooldown / uses OK, location granted, open a live pump, clear the client “Move closer…”
                soft-gate, then hold-to-pump and pass server geo / Fingerprint / network / optional photo. Standing nearby
                without hold + checks does not pay. <Tag tone="doc">[Documented]</Tag> <Tag tone="obs">[Observed]</Tag>
              </li>
            </ol>
          </Section>

          <Section id="prereqs" title="Prerequisites">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Signed in (Privy Google / X / Apple) <Tag tone="doc">[Documented]</Tag>
              </li>
              <li>
                Free bike or car NFT / Starting 5 — QA shows <strong className="text-[var(--text)]">READY TO CLAIM</strong>{' '}
                with bike <Tag tone="obs">[Observed]</Tag>
              </li>
              <li>
                Cooldown ready; ≤3 claims/day; bike has 7 lifetime uses (refusals cost nothing){' '}
                <Tag tone="doc">[Documented]</Tag>
              </li>
              <li>
                Geolocation allowed — deny → “Blocked by your browser… Turn on location” <Tag tone="obs">[Observed]</Tag>
              </li>
              <li>
                Inside unpublished station radius + free pump (6 pumps/station) <Tag tone="doc">[Documented]</Tag>
              </li>
            </ul>
          </Section>

          <Section id="steps" title="Hold-to-pump steps">
            <ol className="list-decimal space-y-2 pl-5">
              <li>Sign in → bike or Starting 5 ready (profile / garage).</li>
              <li>Allow location.</li>
              <li>
                Map → <strong className="text-[var(--text)]">Ready to claim. Open the nearest pump</strong> (or tap a
                station).
              </li>
              <li>
                Confirm sheet: distance (<code className="font-[family-name:var(--font-mono)] text-[13px]">N m from you</code>
                ), <strong className="text-[var(--text)]">AVAILABLE</strong> pumps, EST. CLAIM.
              </li>
              <li>
                Long-press <strong className="text-[var(--text)]">HOLD TO PUMP</strong>. Server checks visit → pays USO +
                $GAS on Robinhood Chain when eligible.
              </li>
            </ol>
            <p className="text-sm text-[var(--text-dim)]">
              Source: how-it-works / docs “The pump” <Tag tone="doc">[Documented]</Tag> + live UI copy{' '}
              <Tag tone="obs">[Observed]</Tag>
            </p>
          </Section>

          <Section id="at-station" title="What “at the station” means">
            <div className="overflow-x-auto rounded-sm border border-[var(--border)]">
              <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-panel)_70%,transparent)]">
                    <th className="px-3 py-2 font-medium text-[var(--text)]">Question</th>
                    <th className="px-3 py-2 font-medium text-[var(--text)]">Answer</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--text-muted)]">
                  <tr className="border-b border-[var(--border)]">
                    <td className="px-3 py-2.5">Radius (m)?</td>
                    <td className="px-3 py-2.5">
                      Not published. Privacy: “inside the station radius.” <Tag tone="doc">[Documented]</Tag>
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="px-3 py-2.5">Client soft-gate</td>
                    <td className="px-3 py-2.5">
                      Mock <strong className="text-[var(--text)]">0 m</strong> → HOLD TO PUMP OK. At{' '}
                      <strong className="text-[var(--text)]">147 m</strong> → “Move closer, you are 147 m away.”{' '}
                      <Tag tone="obs">[Observed]</Tag>
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="px-3 py-2.5">Which stations?</td>
                    <td className="px-3 py-2.5">
                      Live map features from <code className="font-[family-name:var(--font-mono)] text-[12px]">GET /api/stations</code>{' '}
                      (bbox); paid claim coords on{' '}
                      <code className="font-[family-name:var(--font-mono)] text-[12px]">/api/claims/live?scope=latest</code>.{' '}
                      <Tag tone="obs">[Observed]</Tag>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5">Vehicle?</td>
                    <td className="px-3 py-2.5">
                      Required before claim can start. <Tag tone="doc">[Documented]</Tag>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="fails" title="Soft / hard fails (refusals free)">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Geo denied → Turn on location banner <Tag tone="obs">[Observed]</Tag>
              </li>
              <li>
                Too far → Move closer copy <Tag tone="obs">[Observed]</Tag>
              </li>
              <li>
                Cooldown / no uses / daily cap / busy pumps / VPN / spoof / photo fail → refuse, no use{' '}
                <Tag tone="doc">[Documented]</Tag>
              </li>
            </ul>
          </Section>

          <Section id="lab-gps" title="Lab GPS mocking — verdict">
            <div className="overflow-x-auto rounded-sm border border-[var(--border)]">
              <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-panel)_70%,transparent)]">
                    <th className="px-3 py-2 font-medium text-[var(--text)]">Goal</th>
                    <th className="px-3 py-2 font-medium text-[var(--text)]">Verdict</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--text-muted)]">
                  <tr className="border-b border-[var(--border)]">
                    <td className="px-3 py-2.5">Map + stations follow mock coords</td>
                    <td className="px-3 py-2.5">
                      <strong className="text-[var(--green)]">Lab-sufficient</strong>
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="px-3 py-2.5">0 m + HOLD TO PUMP / Move closer UX</td>
                    <td className="px-3 py-2.5">
                      <strong className="text-[var(--green)]">Lab-sufficient</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5">Paid claim / burn use</td>
                    <td className="px-3 py-2.5">
                      <strong className="text-[var(--amber)]">Field-only</strong> (IP↔station, Fingerprint{' '}
                      <code className="font-[family-name:var(--font-mono)] text-[12px]">anti.fillgas.xyz</code>, optional
                      photo) <Tag tone="doc">[Documented]</Tag>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Recipe: pick station lat/lng from{' '}
              <code className="font-[family-name:var(--font-mono)] text-[12px]">claims/live?scope=latest</code> +{' '}
              <code className="font-[family-name:var(--font-mono)] text-[12px]">/api/stations</code> bbox → Playwright{' '}
              <code className="font-[family-name:var(--font-mono)] text-[12px]">
                {'{ geolocation, permissions: [\'geolocation\'] }'}
              </code>{' '}
              or Chrome DevTools → Sensors. This run used Pertashop{' '}
              <code className="font-[family-name:var(--font-mono)] text-[12px]">-7.670405, 111.228684</code>. Short HOLD
              tap (~200&nbsp;ms): no claim POST — uses not burned. <Tag tone="obs">[Observed]</Tag>
            </p>
            <p className="text-sm text-[var(--text-dim)]">
              Out of scope: OS-level / fraud GPS spoof tutorials. QA browser automation + Sensors only.
            </p>
          </Section>

          <Section id="evidence" title="Evidence screenshots">
            <div className="grid gap-4 sm:grid-cols-2">
              <EvidenceFig
                src="/evidence/claim-geo-20261026/deep-at-station-d-hold-visible.png"
                alt="Pertashop at 0 m with HOLD TO PUMP"
                caption="Mock at Pertashop — 0 m · HOLD TO PUMP (no Move closer)"
              />
              <EvidenceFig
                src="/evidence/claim-geo-20261026/deep-far-hcmc-d-hold-visible.png"
                alt="HCMC station 147 m Move closer"
                caption="HCMC mock ~147 m — Move closer, you are 147 m away."
              />
              <EvidenceFig
                src="/evidence/claim-geo-20261026/geo-denied-04-map-final.png"
                alt="Location blocked banner"
                caption="Geo denied — Blocked by your browser / Turn on location"
              />
              <EvidenceFig
                src="/evidence/claim-geo-20261026/geo-at-station-04-map-final.png"
                alt="Map centered on Pertashop 0 M"
                caption="Map follows mock geo — Pertashop · 0 M distance chip"
              />
            </div>
          </Section>

          <Section id="links" title="Related">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <Link to="/mindmap/claim" className="text-[var(--amber)] hover:underline">
                  Map / Claim mind map
                </Link>{' '}
                (includes Lab GPS spoof leaf)
              </li>
              <li>
                <Link to="/overview" className="text-[var(--amber)] hover:underline">
                  Product overview
                </Link>
              </li>
              <li>
                <a
                  className="text-[var(--amber)] hover:underline"
                  href="https://www.gas.cash/docs"
                  target="_blank"
                  rel="noreferrer"
                >
                  gas.cash/docs — The pump / anti-cheat
                </a>
              </li>
              <li>
                <a
                  className="text-[var(--amber)] hover:underline"
                  href="https://www.gas.cash/privacy"
                  target="_blank"
                  rel="noreferrer"
                >
                  Privacy — position / Fingerprint / photo
                </a>
              </li>
            </ul>
          </Section>
        </div>
      </main>
    </div>
  )
}
