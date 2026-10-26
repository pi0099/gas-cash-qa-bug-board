import type { ReactNode } from 'react'
import { SiteNav } from '../components/SiteNav'
import { publicUrl } from '../lib/publicUrl'

const LIVE = 'https://pi0099.github.io/gas-cash-qa-bug-board/'

function Tag({ children, tone }: { children: string; tone: 'doc' | 'obs' | 'soon' }) {
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

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-6">
      <h2 className="mb-3 border-b border-[var(--border)] pb-2 text-lg font-semibold tracking-tight text-[var(--text)]">
        {title}
      </h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-[var(--text-muted)]">{children}</div>
    </section>
  )
}

export function OverviewPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-elevated)_92%,transparent)] px-4 py-3.5 backdrop-blur-md sm:px-6">
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="z-10 shrink-0 text-center sm:min-w-[10rem] sm:text-left">
            <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--amber)] uppercase">
              Gas Cash · Local QA
            </p>
            <h1 className="text-lg font-bold tracking-tight text-[var(--text)]">Product overview</h1>
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
        <p className="mb-8 text-sm leading-relaxed text-[var(--text-dim)]">
          Grounded in QA research (test strategy / plan, week-1 smoke, API & UI audits) plus live modal capture.
          Tags mark evidence — nothing invented.
          <span className="mt-2 flex flex-wrap gap-1.5">
            <Tag tone="doc">[Documented]</Tag>
            <Tag tone="obs">[Observed]</Tag>
            <Tag tone="soon">[Coming soon]</Tag>
          </span>
        </p>

        <div className="space-y-10">
          <Section id="wedge" title="Product wedge">
            <p>
              Gas is <strong className="font-semibold text-[var(--text)]">not another DEX</strong>. It is a{' '}
              <strong className="font-semibold text-[var(--text)]">proof-of-location game</strong> on{' '}
              <strong className="font-semibold text-[var(--text)]">Robinhood Chain (4663)</strong> whose prize pool is funded by
              on-chain protocol activity. Primary UX is mobile + map + social login (Privy), not MetaMask connect-first.{' '}
              <Tag tone="doc">[Documented]</Tag> <Tag tone="obs">[Observed]</Tag>
            </p>
            <ol className="list-decimal space-y-2.5 pl-5 marker:font-semibold marker:text-[var(--amber)]">
              <li>
                <strong className="text-[var(--text)]">Protocol activity → prize pool</strong> — 2% $GAS trade tax plus key /
                merge fees feed the pool players claim from. <Tag tone="doc">[Documented]</Tag>{' '}
                <Tag tone="obs">[Observed]</Tag> on Proof
              </li>
              <li>
                <strong className="text-[var(--text)]">Real stations + anti-cheat → hold-to-pump</strong> — visit a real gas
                station, pass geo / Fingerprint / photo checks, hold to pump. <Tag tone="doc">[Documented]</Tag>{' '}
                <Tag tone="obs">[Observed]</Tag> map shell
              </li>
              <li>
                <strong className="text-[var(--text)]">Payout on Robinhood Chain</strong> — successful claims pay{' '}
                <strong className="text-[var(--text)]">USO Stock Token</strong> + <strong className="text-[var(--text)]">$GAS</strong>{' '}
                into the Privy embedded wallet. <Tag tone="doc">[Documented]</Tag>
              </li>
              <li>
                <strong className="text-[var(--text)]">Progression</strong> — free bike → keys / cars → Starting 5 lineup → ATM
                stake. Cars unlock fuller claim economics. <Tag tone="doc">[Documented]</Tag>
              </li>
            </ol>
            <p>
              <strong className="text-[var(--text)]">Differentiator:</strong> gameplay is geo-gated and funded by protocol
              activity — not a swap UI with a map skin. <Tag tone="doc">[Documented]</Tag>
            </p>
          </Section>

          <Section id="free-bike" title="Onboarding / free bike modal">
            <p>
              Live Mini Mart overlay captured on the QA account. <Tag tone="obs">[Observed]</Tag>
            </p>
            <p className="font-semibold tracking-wide text-[var(--text)]">A BIKE, ON THE HOUSE.</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-[var(--amber)]">
              <li>
                <strong className="text-[var(--text)]">7 claims</strong> on the bike; each claim pays{' '}
                <strong className="text-[var(--text)]">4–20% of the rate</strong> (drawn fresh).
              </li>
              <li>
                <strong className="text-[var(--text)]">1 use per claim</strong>; bike <strong className="text-[var(--text)]">rests 36h</strong>{' '}
                between uses.
              </li>
              <li>
                <strong className="text-[var(--text)]">Cannot be repaired</strong>.
              </li>
              <li>
                <strong className="text-[var(--text)]">Buy a car and the bike parks for good</strong>.
              </li>
              <li>
                CTA: <strong className="text-[var(--text)]">CLAIM YOUR BIKE</strong>.
              </li>
            </ul>
            <figure className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg-panel)]">
              <img
                src={publicUrl('/evidence/obs-bike-on-the-house-modal.png')}
                alt="Mini Mart overlay: A BIKE, ON THE HOUSE. with CLAIM YOUR BIKE CTA"
                className="block w-full"
                loading="lazy"
              />
              <figcaption className="border-t border-[var(--border)] px-3 py-2 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-dim)]">
                Evidence · app.gas.cash/mini-mart · free-bike modal · [Observed]
              </figcaption>
            </figure>
            <p className="rounded-md border border-[var(--green)]/35 bg-[color-mix(in_srgb,var(--green)_8%,transparent)] px-3 py-2.5 text-sm text-[var(--text-muted)]">
              <strong className="text-[var(--text)]">Claim status:</strong> Free bike{' '}
              <strong className="text-[var(--text)]">Claimed [Observed]</strong> on the QA test account (2026-10-26,
              authorized). Garage shows STARTER Free BIKE (OVR 5); home READY TO CLAIM. Funded car buys / field pump still
              money-safe blocked.
            </p>
            <figure className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg-panel)]">
              <img
                src={publicUrl('/evidence/claim-bike-garage-post.png')}
                alt="Garage after claim: STARTER Free BIKE OVR 5 attributes"
                className="block w-full"
                loading="lazy"
              />
              <figcaption className="border-t border-[var(--border)] px-3 py-2 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-dim)]">
                Evidence · app.gas.cash/garage?car=bike · post-claim · [Observed]
              </figcaption>
            </figure>
          </Section>

          <Section id="coverage" title="Exploration coverage">
            <p>Honest status for stakeholders and next field / funded work:</p>
            <div className="overflow-x-auto rounded-md border border-[var(--border)]">
              <table className="w-full min-w-[320px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--bg-panel)] font-[family-name:var(--font-mono)] text-[11px] tracking-wide text-[var(--text-dim)] uppercase">
                    <th className="px-3 py-2 font-medium">Area</th>
                    <th className="px-3 py-2 font-medium">Depth</th>
                    <th className="px-3 py-2 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--text-muted)]">
                  <tr className="border-b border-[var(--border)]">
                    <td className="px-3 py-2.5 font-medium text-[var(--text)]">Auth / Privy / shell routes</td>
                    <td className="px-3 py-2.5">Full (lab)</td>
                    <td className="px-3 py-2.5">Smoke, UI audit, TC run</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="px-3 py-2.5 font-medium text-[var(--text)]">Map / Mini Mart / Garage / ATM / Proof</td>
                    <td className="px-3 py-2.5">Full shells</td>
                    <td className="px-3 py-2.5">UI + API audits; stake UI observed</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="px-3 py-2.5 font-medium text-[var(--text)]">Free bike modal + claim grant</td>
                    <td className="px-3 py-2.5">Claimed [Observed]</td>
                    <td className="px-3 py-2.5">CLAIM YOUR BIKE → LET&apos;S GO; STARTER Free BIKE in garage</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="px-3 py-2.5 font-medium text-[var(--text)]">Field hold-to-pump claim</td>
                    <td className="px-3 py-2.5">Not done</td>
                    <td className="px-3 py-2.5">Needs real station + field tester</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="px-3 py-2.5 font-medium text-[var(--text)]">Funded swaps / key buy / open</td>
                    <td className="px-3 py-2.5">Partial / blocked</td>
                    <td className="px-3 py-2.5">Micro-fund policy; Buy Gas attestation path only</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-medium text-[var(--text)]">Claimed-bike → claim economics</td>
                    <td className="px-3 py-2.5">Lab partial</td>
                    <td className="px-3 py-2.5">READY TO CLAIM chrome; field payout + 4–20% still blocked</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Detail maps:{' '}
              <a className="text-[var(--amber)] hover:underline" href={`${LIVE}mindmap/vehicle`}>
                Vehicle (free bike)
              </a>
              {' · '}
              <a className="text-[var(--amber)] hover:underline" href={`${LIVE}mindmap/claim`}>
                Map / Claim
              </a>
              {' · '}
              <a className="text-[var(--amber)] hover:underline" href={`${LIVE}mindmap`}>
                Hub mind map
              </a>
            </p>
          </Section>

          <Section id="provides" title="What it provides">
            <ul className="list-disc space-y-2 pl-5 marker:text-[var(--amber)]">
              <li>
                <strong className="text-[var(--text)]">Auth</strong> — Privy Google / X; Apple also in login modal.{' '}
                <Tag tone="obs">[Observed]</Tag>
              </li>
              <li>
                <strong className="text-[var(--text)]">Embedded wallet</strong> — balances, Deposit / Buy Gas, key export, gas sponsorship courtesy.{' '}
                <Tag tone="doc">[Documented]</Tag>
              </li>
              <li>
                <strong className="text-[var(--text)]">Map / claim</strong> — stations, hold-to-pump, geo + photo anti-cheat, on-chain payout.{' '}
                <Tag tone="doc">[Documented]</Tag> <Tag tone="obs">[Observed]</Tag> map shell
              </li>
              <li>
                <strong className="text-[var(--text)]">Garage / lineup</strong> — Starting 5, reserves, cooldown, repairs.{' '}
                <Tag tone="doc">[Documented]</Tag> <Tag tone="obs">[Observed]</Tag>
              </li>
              <li>
                <strong className="text-[var(--text)]">Mini Mart</strong> — keys (Regular / Super / Premium) in $GAS; free-bike overlay; inventory open/boost.{' '}
                <Tag tone="doc">[Documented]</Tag> <Tag tone="obs">[Observed]</Tag>
              </li>
              <li>
                <strong className="text-[var(--text)]">Chop Shop</strong> — merge cars (fees / odds). Docs: live; UI at{' '}
                <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--text)]">/chopshop</code>.{' '}
                <Tag tone="doc">[Documented]</Tag> <Tag tone="obs">[Observed]</Tag>
              </li>
              <li>
                <strong className="text-[var(--text)]">ATM</strong> — stake $GAS 7–30d, claim rewards, early unlock.{' '}
                <Tag tone="doc">[Documented]</Tag> <Tag tone="obs">[Observed]</Tag>
              </li>
              <li>
                <strong className="text-[var(--text)]">Social</strong> — mileage, leaderboard, profiles, referrals (
                <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--text)]">gas.cash/r/…</code>
                ). <Tag tone="doc">[Documented]</Tag> <Tag tone="obs">[Observed]</Tag> shells
              </li>
              <li>
                <strong className="text-[var(--text)]">Proof</strong> — public prize pool, prices, contract links.{' '}
                <Tag tone="obs">[Observed]</Tag>
              </li>
            </ul>
          </Section>

          <Section id="benefits" title="Benefits to the player">
            <ul className="list-disc space-y-2 pl-5 marker:text-[var(--amber)]">
              <li>Earn from real-world station visits — prize pool funded by protocol activity (tax + fees). <Tag tone="doc">[Documented]</Tag></li>
              <li>Low-friction start: social login + free bike (limited claims) before buying keys. <Tag tone="doc">[Documented]</Tag> <Tag tone="obs">[Observed]</Tag></li>
              <li>Exportable non-custodial Privy wallet — no seed-first MetaMask flow. <Tag tone="doc">[Documented]</Tag></li>
              <li>Progression via cars, lineup multipliers, staking, and social leaderboards. <Tag tone="doc">[Documented]</Tag></li>
              <li>Transparent on-chain reconciliation via Proof + Blockscout. <Tag tone="obs">[Observed]</Tag></li>
            </ul>
          </Section>

          <Section id="costs" title="Costs / economics">
            <ul className="list-disc space-y-2 pl-5 marker:text-[var(--amber)]">
              <li>
                <strong className="text-[var(--text)]">2% $GAS trade tax</strong> (buy/sell) — feeds prize pool.{' '}
                <Tag tone="doc">[Documented]</Tag> <Tag tone="obs">[Observed]</Tag> on proof
              </li>
              <li>
                <strong className="text-[var(--text)]">Key purchase</strong> priced in $GAS; merge fees in Chop Shop.{' '}
                <Tag tone="doc">[Documented]</Tag>
              </li>
              <li>
                <strong className="text-[var(--text)]">ATM stake</strong> — lock 7d or 30d (~1.5× weight for 30d). Early unlock: penalty ≤20%
                shrinking; <em>all unclaimed rewards forfeited</em>. <Tag tone="doc">[Documented]</Tag>
              </li>
              <li>
                <strong className="text-[var(--text)]">Gas sponsorship</strong> — courtesy only; may be unavailable mid-flow.{' '}
                <Tag tone="doc">[Documented]</Tag>
              </li>
              <li>
                <strong className="text-[var(--text)]">Free bike</strong> — 7 claims, 4–20% of rate, 36h rest, cannot repair; car purchase parks bike for good.{' '}
                <Tag tone="obs">[Observed]</Tag> modal · Docs also note never jackpot / low claim cap for bike tier.{' '}
                <Tag tone="doc">[Documented]</Tag>
              </li>
              <li>
                Claim refusals (wrong location, busy pumps, cooldown, daily cap ≤3) cost nothing — uses not consumed.{' '}
                <Tag tone="doc">[Documented]</Tag>
              </li>
              <li>Repairs cost USO (burn path to $GAS per docs) — cars; bike cannot be repaired. <Tag tone="doc">[Documented]</Tag> <Tag tone="obs">[Observed]</Tag></li>
            </ul>
          </Section>

          <Section id="chains" title="Chains / tokens">
            <div className="overflow-x-auto rounded-md border border-[var(--border)]">
              <table className="w-full min-w-[320px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--bg-panel)] font-[family-name:var(--font-mono)] text-[11px] tracking-wide text-[var(--text-dim)] uppercase">
                    <th className="px-3 py-2 font-medium">Asset</th>
                    <th className="px-3 py-2 font-medium">Role</th>
                    <th className="px-3 py-2 font-medium">Evidence</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--text-muted)]">
                  <tr className="border-b border-[var(--border)]">
                    <td className="px-3 py-2.5 font-medium text-[var(--text)]">Robinhood Chain 4663</td>
                    <td className="px-3 py-2.5">Execution chain</td>
                    <td className="px-3 py-2.5">
                      <Tag tone="doc">[Documented]</Tag>
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="px-3 py-2.5 font-medium text-[var(--text)]">USO Stock Token</td>
                    <td className="px-3 py-2.5">Claim payout / repairs</td>
                    <td className="px-3 py-2.5">
                      <Tag tone="doc">[Documented]</Tag> <Tag tone="obs">[Observed]</Tag>
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="px-3 py-2.5 font-medium text-[var(--text)]">$GAS</td>
                    <td className="px-3 py-2.5">Shop / stake / swap / claim side-pay</td>
                    <td className="px-3 py-2.5">
                      <Tag tone="doc">[Documented]</Tag> <Tag tone="obs">[Observed]</Tag>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-medium text-[var(--text)]">USDC / ETH</td>
                    <td className="px-3 py-2.5">Funding into Gas wallet (FAQ)</td>
                    <td className="px-3 py-2.5">
                      <Tag tone="doc">[Documented]</Tag>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="risks" title="Risks / constraints">
            <ul className="list-disc space-y-2 pl-5 marker:text-[var(--amber)]">
              <li>
                <strong className="text-[var(--text)]">Must visit real stations</strong> — core loop is geo-gated; remote QA cannot fully claim
                without field testers. <Tag tone="doc">[Documented]</Tag>
              </li>
              <li>
                <strong className="text-[var(--text)]">Geo anti-cheat</strong> — VPN/proxy likely refused; Fingerprint subdomain; photo challenge.
                Support appeal path documented. <Tag tone="doc">[Documented]</Tag>
              </li>
              <li>
                <strong className="text-[var(--text)]">Privy embedded wallet</strong> — export or risk lockout if social access is lost.{' '}
                <Tag tone="doc">[Documented]</Tag>
              </li>
              <li>
                <strong className="text-[var(--text)]">Free bike is irreversible progression</strong> — claiming starts the 7-use / 36h cycle; buying a
                car parks the bike for good. QA left claim untouched on purpose. <Tag tone="obs">[Observed]</Tag>
              </li>
              <li>
                <strong className="text-[var(--text)]">Coming soon / limited</strong> — Dealership (route shell, empty market); crowbars / insurance /
                theft / scratchers / Alarm-class Mini Mart items; Mafia Men / Job Board / jackpot; chat “We&apos;re Closed”; referral claim share off.{' '}
                <Tag tone="soon">[Coming soon]</Tag> <Tag tone="obs">[Observed]</Tag> where noted in audits
              </li>
              <li>
                Docs path gaps: <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--text)]">/chop-shop</code> &amp;{' '}
                <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--text)]">/inventory</code> 404; live UI uses{' '}
                <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--text)]">/chopshop</code> &amp;{' '}
                <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--text)]">/pitstop</code>.{' '}
                <Tag tone="obs">[Observed]</Tag>
              </li>
              <li>Production-only testing so far (no staging discovered). Micro-funds only for money paths. <Tag tone="doc">[Documented]</Tag> strategy</li>
            </ul>
          </Section>

          <Section id="links" title="Links">
            <ul className="list-none space-y-2 pl-0">
              <li>
                <a
                  className="text-[var(--amber)] hover:underline"
                  href="https://app.gas.cash"
                  target="_blank"
                  rel="noreferrer"
                >
                  Live app — app.gas.cash
                </a>
              </li>
              <li>
                <a
                  className="text-[var(--amber)] hover:underline"
                  href="https://app.gas.cash/proof"
                  target="_blank"
                  rel="noreferrer"
                >
                  Proof / transparency
                </a>
              </li>
              <li>
                <a
                  className="text-[var(--amber)] hover:underline"
                  href="https://www.gas.cash"
                  target="_blank"
                  rel="noreferrer"
                >
                  Marketing / docs — gas.cash
                </a>
              </li>
              <li>
                <a className="text-[var(--amber)] hover:underline" href={LIVE}>
                  QA Bug board (this site)
                </a>
              </li>
              <li>
                <a className="text-[var(--amber)] hover:underline" href={`${LIVE}overview`}>
                  This overview
                </a>
              </li>
              <li>
                <a className="text-[var(--amber)] hover:underline" href={`${LIVE}mindmap`}>
                  Interactive mind map
                </a>
              </li>
              <li>
                <a className="text-[var(--amber)] hover:underline" href={`${LIVE}mindmap/vehicle`}>
                  Vehicle detail map
                </a>
              </li>
              <li>
                <a className="text-[var(--amber)] hover:underline" href={`${LIVE}mindmap/claim`}>
                  Claim detail map
                </a>
              </li>
            </ul>
          </Section>
        </div>

        <footer className="mt-12 border-t border-[var(--border)] pt-4 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-dim)]">
          Sources: test-strategy.md, test-plan.md, week-1-smoke-results.md, api-network-audit.md, ui-bug-audit.md · free-bike modal capture · Gas Cash QA
        </footer>
      </main>
    </div>
  )
}
