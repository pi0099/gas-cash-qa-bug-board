import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SiteNav } from '../components/SiteNav'

function Tag({ children, tone }: { children: string; tone: 'lab' | 'field' | 'gate' }) {
  const cls =
    tone === 'lab'
      ? 'border-[var(--blue)]/45 text-[var(--blue)]'
      : tone === 'field'
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

const ACTORS = [
  {
    title: 'Mac agent + Playwright',
    role: 'Lab soft-gates',
    tone: 'lab' as const,
    bullets: ['Mobile viewport / isMobile / hasTouch', 'geolocation mock', 'Phone-gate asserts on desktop', 'Stop before paid hold'],
  },
  {
    title: 'User on real phone',
    role: 'Field / HOLD',
    tone: 'field' as const,
    bullets: ['Same Privy account when possible', 'Allow location + motion', 'Tiếp tục / tutorial dismiss', 'Long-press HOLD TO PUMP'],
  },
  {
    title: 'iOS Simulator',
    role: 'Safari realism',
    tone: 'lab' as const,
    bullets: ['Custom Sim location', 'Safari UA + touch', 'Compass Don’t Allow edges', 'Desk-side claim chrome'],
  },
  {
    title: 'Android Emulator',
    role: 'Chrome parity',
    tone: 'lab' as const,
    bullets: ['Custom location', 'Chrome Android UA', 'Same handoff pattern as Sim', 'Not a payout substitute'],
  },
]

const HANDOFF = [
  { who: 'Agent', step: 'Prep', detail: 'Storage state, station coords, money-safe checklist' },
  { who: 'User', step: 'Open', detail: 'app.gas.cash on phone/Sim → READY TO CLAIM' },
  { who: 'User', step: 'Grant', detail: 'Allow location; dismiss tutorial (Tiếp tục / LET’S GO)' },
  { who: 'Agent', step: 'Cue', detail: 'Call expected copy; request screenshot after each gate' },
  { who: 'Both', step: 'Field', detail: 'User at station; agent on chat; certify paid + refused' },
]

const MATRIX = [
  { client: 'iOS Safari', role: 'Primary Safari', claim: 'Required — device or Simulator' },
  { client: 'Android Chrome', role: 'Primary Android', claim: 'Required — device or Emulator' },
  { client: 'Desktop Chrome mobile emul.', role: 'Fast smoke', claim: 'Soft-gate only' },
  { client: 'Desktop UA + Sensors', role: 'Map / distance lab', claim: 'Phone-gate block expected' },
]

const LANES = [
  { id: 'A', name: 'Desktop phone-gate', stop: 'Assert block copy' },
  { id: 'B', name: 'Lab mobile chrome', stop: 'No paid hold' },
  { id: 'C', name: 'Shared session', stop: 'Agent stop vs proceed' },
  { id: 'D', name: 'Field certification', stop: '≥1 paid + ≥1 refused' },
]

export function MobileCoopPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-elevated)_92%,transparent)] px-4 py-3.5 backdrop-blur-md sm:px-6">
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="z-10 shrink-0 text-center sm:min-w-[10rem] sm:text-left">
            <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--amber)] uppercase">
              Gas Cash · Local QA
            </p>
            <h1 className="text-lg font-bold tracking-tight text-[var(--text)]">Mobile coop</h1>
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
          Visual summary of <strong className="text-[var(--text)]">mobile-only claim</strong> strategy +{' '}
          <strong className="text-[var(--text)]">AI agent ↔ user</strong> shared-session handoff. Canonical text lives in
          Project store strategy §§4.4–4.5 and plan §4.10.
        </p>
        <div className="mb-8 flex flex-wrap items-center gap-1.5">
          <Tag tone="gate">Phone-gated</Tag>
          <Tag tone="lab">Lab UI</Tag>
          <Tag tone="field">Field payout</Tag>
          <Link to="/claim-gps" className="ml-1 text-sm text-[var(--amber)] hover:underline">
            Claim / GPS →
          </Link>
          <Link to="/overview" className="text-sm text-[var(--amber)] hover:underline">
            Overview →
          </Link>
        </div>

        <div className="space-y-10">
          <Section id="highlights" title="Mobile-only claim highlights">
            <ul className="list-disc space-y-2 pl-5 marker:text-[var(--amber)]">
              <li>
                <strong className="text-[var(--text)]">HOLD TO PUMP / Check in / ROUTE TO THE STATION</strong> require a
                phone-class client (UA / touch / phone detection).
              </li>
              <li>
                Desktop + DevTools Sensors can move the map and show distance — HOLD still says “Pumping only works on a
                phone…”.
              </li>
              <li>
                <strong className="text-[var(--text)]">Lab</strong> = soft-gates + screenshots.{' '}
                <strong className="text-[var(--text)]">Field</strong> = paid / refused claim + server anti-cheat.
              </li>
              <li>
                Money-safe: never burn a bike/car use without Lam/product authorization.
              </li>
            </ul>
          </Section>

          <Section id="actors" title="Who does what">
            <div className="grid gap-3 sm:grid-cols-2">
              {ACTORS.map((a) => (
                <div
                  key={a.title}
                  className="border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-panel)_75%,transparent)] p-3"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-[var(--text)]">{a.title}</p>
                    <Tag tone={a.tone}>{a.role}</Tag>
                  </div>
                  <ul className="space-y-1 font-[family-name:var(--font-mono)] text-[12px] leading-snug text-[var(--text-dim)]">
                    {a.bullets.map((b) => (
                      <li key={b}>· {b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section id="handoff" title="Agent ↔ user handoff">
            <ol className="space-y-0">
              {HANDOFF.map((h, i) => (
                <li key={h.step} className="relative flex gap-3 pb-5 last:pb-0">
                  {i < HANDOFF.length - 1 ? (
                    <span
                      className="absolute top-7 bottom-0 left-[13px] w-px bg-[color-mix(in_srgb,var(--amber)_35%,var(--border))]"
                      aria-hidden
                    />
                  ) : null}
                  <span className="relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-[var(--amber)]/50 bg-[color-mix(in_srgb,var(--amber)_18%,var(--bg))] font-[family-name:var(--font-mono)] text-[11px] font-semibold text-[var(--amber)]">
                    {i + 1}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-wide text-[var(--amber)] uppercase">
                      {h.who} · {h.step}
                    </p>
                    <p className="text-[var(--text)]">{h.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="matrix" title="Chrome / Safari + GPS / sim matrix">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] font-[family-name:var(--font-mono)] text-[11px] tracking-wide text-[var(--text-dim)] uppercase">
                    <th className="py-2 pr-3 font-medium">Client</th>
                    <th className="py-2 pr-3 font-medium">Role</th>
                    <th className="py-2 font-medium">Claim / pump</th>
                  </tr>
                </thead>
                <tbody>
                  {MATRIX.map((row) => (
                    <tr key={row.client} className="border-b border-[var(--border)]/70">
                      <td className="py-2.5 pr-3 font-medium text-[var(--text)]">{row.client}</td>
                      <td className="py-2.5 pr-3 text-[var(--text-muted)]">{row.role}</td>
                      <td className="py-2.5 text-[var(--text-muted)]">{row.claim}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-[var(--text-dim)]">
              Fake GPS: DevTools Sensors (map only) · Sim/Emulator custom location · Playwright{' '}
              <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--text)]">setGeolocation</code> +
              mobile emulation. See{' '}
              <Link to="/claim-gps" className="text-[var(--amber)] hover:underline">
                Claim / GPS
              </Link>
              .
            </p>
          </Section>

          <Section id="lanes" title="Execution lanes (plan §4.10)">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {LANES.map((lane) => (
                <div
                  key={lane.id}
                  className="border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_60%,transparent)] px-2.5 py-3 text-center"
                >
                  <p className="font-[family-name:var(--font-mono)] text-[20px] font-semibold text-[var(--amber)]">
                    {lane.id}
                  </p>
                  <p className="mt-1 text-[13px] font-medium leading-snug text-[var(--text)]">{lane.name}</p>
                  <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[10px] leading-snug text-[var(--text-dim)]">
                    {lane.stop}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-sm text-[var(--text-dim)]">
              Suites D + H · GC-S04-14/15 · GC-S08-06/07/08 · exit needs iOS Safari + Android Chrome smoke and field
              paid+refused on phone.
            </p>
          </Section>

          <Section id="rules" title="Quick rules">
            <ul className="list-disc space-y-2 pl-5 marker:text-[var(--amber)]">
              <li>Desktop Sensors GPS ≠ claim path.</li>
              <li>Prefer iOS Simulator for Safari / compass; real iPhone for exit-criteria claims.</li>
              <li>Evidence: device + browser + approx city/coords + screenshot; tx hash if on-chain.</li>
              <li>Screen share / paste shots to tracker or store media for Lam review.</li>
            </ul>
          </Section>
        </div>
      </main>
    </div>
  )
}
