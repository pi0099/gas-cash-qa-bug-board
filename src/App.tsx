import { useMemo, useState } from 'react'
import { Link, Route, Routes, useParams } from 'react-router-dom'
import { BugDetail, BugDetailEmpty } from './components/BugDetail'
import { BugFilters } from './components/BugFilters'
import { BugList } from './components/BugList'
import { OpenBoardBanner } from './components/OpenBoardBanner'
import { SiteNav } from './components/SiteNav'
import { useLiveBugStatuses } from './hooks/useLiveBugStatuses'
import { bugBoard, filterBugs, getBugById } from './lib/bugs'
import { MindMapDetailPage, MindMapPage } from './pages/MindMapPage'
import { ClaimGeoPage } from './pages/ClaimGeoPage'
import { OverviewPage } from './pages/OverviewPage'
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
      <header className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-elevated)_92%,transparent)] px-4 py-3.5 backdrop-blur-md sm:px-5">
        <div className="relative flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Link
            to="/"
            className="group z-10 inline-flex shrink-0 flex-col gap-0.5 no-underline sm:min-w-[9.5rem]"
          >
            <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--amber)] uppercase">
              Gas Cash · Local QA
            </span>
            <span className="text-lg font-bold tracking-tight text-[var(--text)] group-hover:text-[var(--amber)]">
              Bug Board
            </span>
          </Link>
          <div className="z-10 flex justify-center sm:absolute sm:inset-x-0 sm:top-1/2 sm:-translate-y-1/2 sm:pointer-events-none">
            <div className="sm:pointer-events-auto">
              <SiteNav />
            </div>
          </div>
          <div className="z-10 hidden text-right font-[family-name:var(--font-mono)] text-[10px] leading-relaxed text-[var(--text-dim)] sm:block sm:min-w-[9.5rem]">
            <div>{bugBoard.bugs.length} seeded · disk SoT</div>
            <div className="max-w-[280px] truncate sm:ml-auto sm:max-w-[11rem]" title={bugBoard.source}>
              {bugBoard.updatedAt}
            </div>
          </div>
        </div>
      </header>

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
      <Route path="/claim-gps" element={<ClaimGeoPage />} />
    </Routes>
  )
}
