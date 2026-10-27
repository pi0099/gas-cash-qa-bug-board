import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MarkdownDoc } from '../components/MarkdownDoc'
import { PageHeader } from '../components/PageHeader'
import { publicUrl } from '../lib/publicUrl'
import strategyMd from '../../docs/test-strategy.md?raw'

function EvidenceFig({ src, caption, alt }: { src: string; caption: string; alt: string }) {
  return (
    <figure className="overflow-hidden rounded-sm border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-panel)_80%,transparent)]">
      <img src={publicUrl(src)} alt={alt} className="mx-auto max-h-[420px] w-auto object-contain" loading="lazy" />
      <figcaption className="border-t border-[var(--border)] px-3 py-2 font-[family-name:var(--font-mono)] text-[11px] leading-snug text-[var(--text-dim)]">
        {caption}
      </figcaption>
    </figure>
  )
}

export function StrategyPage() {
  const location = useLocation()

  useEffect(() => {
    const hash = location.hash.replace(/^#/, '')
    if (!hash) return
    const t = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => window.clearTimeout(t)
  }, [location.hash, location.pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader sticky title="Test Strategy" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <p className="mb-4 text-sm leading-relaxed text-[var(--text-dim)]">
          Canonical strategy from the project store — includes phone-gated claim / lab GPS (§4.4,{' '}
          <a className="text-[var(--amber)] hover:underline" href="#claim-gps">
            #claim-gps
          </a>
          ) and agent↔user coop (§4.5,{' '}
          <a className="text-[var(--amber)] hover:underline" href="#mobile-coop">
            #mobile-coop
          </a>
          ). Former top-nav routes redirect here.
        </p>
        <div className="mb-8 flex flex-wrap gap-x-3 gap-y-1 text-sm">
          <Link to="/plan" className="text-[var(--amber)] hover:underline">
            Test Plan →
          </Link>
          <Link to="/test-cases" className="text-[var(--amber)] hover:underline">
            Test Cases →
          </Link>
          <Link to="/mindmap/claim" className="text-[var(--amber)] hover:underline">
            Claim mind map →
          </Link>
        </div>

        <MarkdownDoc markdown={strategyMd} />

        <section id="claim-evidence" className="mt-12 scroll-mt-28 space-y-4">
          <h2 className="border-b border-[var(--border)] pb-2 text-lg font-semibold tracking-tight text-[var(--text)]">
            Claim / GPS evidence (lab)
          </h2>
          <p className="text-[15px] leading-relaxed text-[var(--text-muted)]">
            Screenshots from the Claim / GPS guide run (2026-10-26). Soft-gates only — money-safe; see §4.4 above.
          </p>
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
        </section>
      </main>
    </div>
  )
}
