import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MarkdownDoc } from '../components/MarkdownDoc'
import { PageHeader } from '../components/PageHeader'
import planMd from '../../docs/test-plan.md?raw'

export function PlanPage() {
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
      <PageHeader sticky title="Test Plan" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <p className="mb-4 text-sm leading-relaxed text-[var(--text-dim)]">
          Week-1 execution plan from the project store. Companion:{' '}
          <Link to="/strategy" className="text-[var(--amber)] hover:underline">
            Test Strategy
          </Link>
          .
        </p>
        <div className="mb-8 flex flex-wrap gap-x-3 gap-y-1 text-sm">
          <Link to="/strategy" className="text-[var(--amber)] hover:underline">
            Test Strategy →
          </Link>
          <Link to="/test-cases" className="text-[var(--amber)] hover:underline">
            Test Cases →
          </Link>
          <Link to="/strategy#mobile-coop" className="text-[var(--amber)] hover:underline">
            Mobile coop (§4.5) →
          </Link>
        </div>

        <MarkdownDoc markdown={planMd} />
      </main>
    </div>
  )
}
