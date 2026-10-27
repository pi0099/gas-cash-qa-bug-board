import { useMemo, useState } from 'react'
import { Link, Route, Routes, useParams } from 'react-router-dom'
import { BugDetail, BugDetailEmpty } from './components/BugDetail'
import { BugFilters } from './components/BugFilters'
import { BugList } from './components/BugList'
import { OpenBoardBanner } from './components/OpenBoardBanner'
import { PageHeader } from './components/PageHeader'
import { useLiveBugStatuses } from './hooks/useLiveBugStatuses'
import { bugBoard, filterBugs, getBugById } from './lib/bugs'
import { MindMapDetailPage, MindMapPage } from './pages/MindMapPage'
import { OverviewPage } from './pages/OverviewPage'
import { PlanPage } from './pages/PlanPage'
import { ClaimGpsRedirect, MobileCoopRedirect } from './pages/StrategyRedirect'
import { StrategyPage } from './pages/StrategyPage'
import { TestCasesPage } from './pages/TestCasesPage'
import type { BugPriority, BugStatus } from './types/bug'

function BoardShell() {
  const { bugId } = useParams()
  const [priority, setPriority] = useState<BugPriority | 'all'>('all')
  const [status, setStatus] = useState<BugStatus | 'all'>('all')
  const [query, setQuery] = useState('')
  const { mergeBugs, mergeBug, applyStatus } = useLiveBugStatuses()

  const liveBugs = useMemo(() => mergeBugs(bugBoard.bugs), [mergeBugs])

  const filtered = useMemo(
    () => filterBugs(liveBugs, { priority, status, q: query }),
    [liveBugs, priority, status, query],
  )

  const seeded = bugId ? getBugById(bugId) : undefined
  const selected = seeded ? mergeBug(seeded) : undefined

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader
        title={
          <Link to="/" className="text-[var(--text)] no-underline hover:text-[var(--amber)]">
            Bug Board
          </Link>
        }
        meta={
          <>
            <div>
              {bugBoard.bugs.length} seeded · disk SoT
            </div>
            <div className="max-w-[280px] truncate sm:ml-auto sm:max-w-[14rem]" title={bugBoard.source}>
              {bugBoard.updatedAt}
            </div>
          </>
        }
      />

      <OpenBoardBanner />

      <BugFilters
        priority={priority}
        status={status}
        query={query}
        onPriority={setPriority}
        onStatus={setStatus}
        onQuery={setQuery}
        resultCount={filtered.length}
        totalCount={bugBoard.bugs.length}
      />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="max-h-[42vh] overflow-y-auto border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-panel)_70%,transparent)] lg:max-h-none lg:w-[min(420px,40%)] lg:border-r lg:border-b-0">
          <BugList bugs={filtered} selectedId={bugId} />
        </aside>
        <main className="min-h-0 flex-1 overflow-y-auto bg-[color-mix(in_srgb,var(--bg)_80%,transparent)]">
          {bugId && !selected ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 p-8 text-center">
              <p className="text-sm font-medium text-[var(--text)]">Bug not found</p>
              <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--text-dim)]">
                id={bugId}
              </p>
              <Link to="/" className="mt-2 text-sm text-[var(--amber)] hover:underline">
                Back to board
              </Link>
            </div>
          ) : selected ? (
            <BugDetail
              bug={selected}
              onStatusChange={(next) => applyStatus(selected.id, next).then(() => undefined)}
            />
          ) : (
            <BugDetailEmpty />
          )}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BoardShell />} />
      <Route path="/bugs/:bugId" element={<BoardShell />} />
      <Route path="/overview" element={<OverviewPage />} />
      <Route path="/summary" element={<OverviewPage />} />
      <Route path="/mindmap" element={<MindMapPage />} />
      <Route path="/mindmap/:domain" element={<MindMapDetailPage />} />
      <Route path="/test-cases" element={<TestCasesPage />} />
      <Route path="/test-cases/:tcId" element={<TestCasesPage />} />
      <Route path="/strategy" element={<StrategyPage />} />
      <Route path="/plan" element={<PlanPage />} />
      <Route path="/claim-gps" element={<ClaimGpsRedirect />} />
      <Route path="/mobile-coop" element={<MobileCoopRedirect />} />
    </Routes>
  )
}
