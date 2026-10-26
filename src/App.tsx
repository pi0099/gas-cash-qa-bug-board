import { useMemo, useState } from 'react'
import { Link, Route, Routes, useParams } from 'react-router-dom'
import { BugDetail, BugDetailEmpty } from './components/BugDetail'
import { BugFilters } from './components/BugFilters'
import { BugList } from './components/BugList'
import { SiteNav } from './components/SiteNav'
import { bugBoard, filterBugs, getBugById } from './lib/bugs'
import { MindMapPage } from './pages/MindMapPage'
import { OverviewPage } from './pages/OverviewPage'
import type { BugPriority, BugStatus } from './types/bug'

function BoardShell() {
  const { bugId } = useParams()
  const [priority, setPriority] = useState<BugPriority | 'all'>('all')
  const [status, setStatus] = useState<BugStatus | 'all'>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () => filterBugs(bugBoard.bugs, { priority, status, q: query }),
    [priority, status, query],
  )

  const selected = bugId ? getBugById(bugId) : undefined

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-elevated)_92%,transparent)] px-4 py-3 backdrop-blur-md sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link to="/" className="group inline-flex flex-col gap-0.5 no-underline">
              <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--amber)] uppercase">
                Gas Cash · Local QA
              </span>
              <span className="text-lg font-bold tracking-tight text-[var(--text)] group-hover:text-[var(--amber)]">
                Bug Board
              </span>
            </Link>
            <SiteNav />
          </div>
          <div className="text-right font-[family-name:var(--font-mono)] text-[10px] leading-relaxed text-[var(--text-dim)]">
            <div>{bugBoard.bugs.length} seeded · disk SoT</div>
            <div className="max-w-[280px] truncate sm:max-w-none" title={bugBoard.source}>
              {bugBoard.updatedAt}
            </div>
          </div>
        </div>
      </header>

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
            <BugDetail bug={selected} />
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
    </Routes>
  )
}
