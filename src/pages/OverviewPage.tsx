import type { ReactNode } from 'react'
import { SiteNav } from '../components/SiteNav'

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
          Grounded in QA research (test strategy / plan, week-1 smoke, API & UI audits). Tags mark evidence — nothing invented.
          <span className="mt-2 flex flex-wrap gap-1.5">
            <Tag tone="doc">[Documented]</Tag>
            <Tag tone="obs">[Observed]</Tag>
            <Tag tone="soon">[Coming soon]</Tag>
          </span>
        </p>

        <div className="space-y-10">
          <Section id="what" title="What Gas is">
            <p>
              Gas is a <strong className="font-semibold text-[var(--text)]">location-based on-chain game</strong> on{' '}
              <strong className="font-semibold text-[var(--text)]">Robinhood Chain (chain id 4663)</strong>.{' '}
              <Tag tone="doc">[Documented]</Tag> <Tag tone="obs">[Observed]</Tag>
            </p>
            <p>
              Players sign in with social OAuth via <strong className="font-semibold text-[var(--text)]">Privy</strong>, get an embedded
              wallet, obtain a vehicle (free bike or car via keys), then physically go to a real gas station, hold to pump, and receive{' '}
              <strong className="font-semibold text-[var(--text)]">USO Stock Token</strong> + <strong className="font-semibold text-[var(--text)]">$GAS</strong>{' '}
              from the prize pool. <Tag tone="doc">[Documented]</Tag>
            </p>
            <p>
              This is <em>not</em> a classic DEX-first dApp: primary UX is mobile + map + social login, not MetaMask/WalletConnect connect.{' '}
              <Tag tone="obs">[Observed]</Tag>
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
                <strong className="text-[var(--text)]">Mini Mart</strong> — keys (Regular / Super / Premium) in $GAS; inventory open/boost.{' '}
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
              <li>Social onboarding (no seed-first MetaMask flow) with exportable non-custodial wallet. <Tag tone="doc">[Documented]</Tag></li>
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
                <strong className="text-[var(--text)]">Bike vs car</strong> — free bike if no car; limited uses, never jackpot, claim cap ~$0.50.
                Cars unlock fuller claim economics. <Tag tone="doc">[Documented]</Tag>
              </li>
              <li>
                Claim refusals (wrong location, busy pumps, cooldown, daily cap ≤3) cost nothing — uses not consumed.{' '}
                <Tag tone="doc">[Documented]</Tag>
              </li>
              <li>Repairs cost USO (burn path to $GAS per docs). <Tag tone="doc">[Documented]</Tag></li>
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
            </ul>
          </Section>
        </div>

        <footer className="mt-12 border-t border-[var(--border)] pt-4 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-dim)]">
          Sources: test-strategy.md, test-plan.md, week-1-smoke-results.md, api-network-audit.md, ui-bug-audit.md · Gas Cash QA
        </footer>
      </main>
    </div>
  )
}
