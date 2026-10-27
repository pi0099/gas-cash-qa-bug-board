import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { publicUrl } from '../lib/publicUrl'
import { domainForMindmapNode } from '../lib/mindmaps'
import {
  ALL_TC_PRIORITIES,
  ALL_TC_RESULTS,
  ALL_TC_TYPES,
  filterTestCases,
  getTestCaseById,
  priorityRank,
  testCaseSuite,
} from '../lib/testCases'
import type { TestCase, TestCasePriority, TestCaseResult, TestCaseType } from '../types/testCase'

const SHEET_EMBED = (import.meta.env.VITE_TC_SHEET_EMBED_URL as string | undefined)?.trim() ?? ''

type SortKey = 'id' | 'type' | 'priority' | 'title' | 'result' | 'bugs' | 'mindmap'
type SortDir = 'asc' | 'desc'
type ViewMode = 'grid' | 'sheets'

function ResultChip({ result }: { result: TestCaseResult | null }) {
  const r = result ?? 'Skip'
  const tone =
    r === 'Pass'
      ? 'border-[var(--green)]/50 text-[var(--green)]'
      : r === 'Fail'
        ? 'border-[var(--red)]/55 text-[var(--red)]'
        : r === 'Blocked'
          ? 'border-[var(--amber)]/50 text-[var(--amber)]'
          : 'border-[var(--border-strong)] text-[var(--text-muted)]'
  return (
    <span
      className={`inline-block rounded-sm border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] tracking-wide ${tone}`}
    >
      {r}
    </span>
  )
}

function TypeChip({ type }: { type: TestCaseType }) {
  const tone =
    type === 'Functional'
      ? 'border-[var(--blue)]/45 text-[var(--blue)]'
      : type === 'Validation'
        ? 'border-[var(--amber)]/45 text-[var(--amber)]'
        : 'border-[var(--red)]/40 text-[#e88]'
  return (
    <span
      className={`inline-block rounded-sm border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] tracking-wide ${tone}`}
    >
      {type}
    </span>
  )
}

function resultRank(r: TestCaseResult | null): number {
  switch (r) {
    case 'Fail':
      return 0
    case 'Blocked':
      return 1
    case 'Pass':
      return 2
    case 'Skip':
      return 3
    default:
      return 4
  }
}

function sortCases(cases: TestCase[], key: SortKey, dir: SortDir): TestCase[] {
  const mul = dir === 'asc' ? 1 : -1
  return [...cases].sort((a, b) => {
    let cmp = 0
    switch (key) {
      case 'id':
        cmp = a.id.localeCompare(b.id)
        break
      case 'type':
        cmp = a.type.localeCompare(b.type)
        break
      case 'priority':
        cmp = priorityRank(a.priority) - priorityRank(b.priority)
        break
      case 'title':
        cmp = a.title.localeCompare(b.title)
        break
      case 'result':
        cmp = resultRank(a.result) - resultRank(b.result)
        break
      case 'bugs':
        cmp = (a.bugIds?.[0] ?? '').localeCompare(b.bugIds?.[0] ?? '')
        break
      case 'mindmap':
        cmp = a.mindmapNode.localeCompare(b.mindmapNode)
        break
    }
    return cmp * mul
  })
}

function TcDetail({ tc }: { tc: TestCase }) {
  return (
    <article className="space-y-5 p-5 sm:p-7">
      <header className="space-y-2 border-b border-[var(--border)] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--amber)]">{tc.id}</span>
          <TypeChip type={tc.type} />
          <ResultChip result={tc.result} />
          <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-dim)]">
            {tc.priority} · node:{tc.mindmapNode}
          </span>
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">{tc.title}</h2>
      </header>

      <section>
        <h3 className="mb-1.5 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[var(--text-dim)] uppercase">
          Preconditions
        </h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--text-muted)]">
          {tc.preconditions.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-1.5 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[var(--text-dim)] uppercase">
          Steps
        </h3>
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-[var(--text-muted)]">
          {tc.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section>
        <h3 className="mb-1.5 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[var(--text-dim)] uppercase">
          Expected
        </h3>
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">{tc.expected}</p>
      </section>

      {tc.notes ? (
        <section>
          <h3 className="mb-1.5 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[var(--text-dim)] uppercase">
            Execution notes
          </h3>
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">{tc.notes}</p>
        </section>
      ) : null}

      {tc.bugIds?.length ? (
        <section>
          <h3 className="mb-1.5 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[var(--text-dim)] uppercase">
            Linked bugs
          </h3>
          <ul className="flex flex-wrap gap-2">
            {tc.bugIds.map((id) => (
              <li key={id}>
                <Link
                  to={`/bugs/${id}`}
                  className="font-[family-name:var(--font-mono)] text-sm text-[var(--amber)] hover:underline"
                >
                  {id}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tc.evidence?.length ? (
        <section>
          <h3 className="mb-2 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[var(--text-dim)] uppercase">
            Evidence
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {tc.evidence.map((src) => (
              <a key={src} href={publicUrl(src)} target="_blank" rel="noreferrer" className="block">
                <img
                  src={publicUrl(src)}
                  alt={`${tc.id} evidence`}
                  className="max-h-56 w-full rounded border border-[var(--border)] object-cover object-top"
                />
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <p className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-dim)]">
        automatable: {tc.automatable ? 'yes' : 'no'}
      </p>
    </article>
  )
}

function SortHeader({
  label,
  col,
  sortKey,
  sortDir,
  onSort,
  className = '',
}: {
  label: string
  col: SortKey
  sortKey: SortKey
  sortDir: SortDir
  onSort: (k: SortKey) => void
  className?: string
}) {
  const active = sortKey === col
  return (
    <th
      className={`sticky top-0 z-10 border-b border-[var(--border-strong)] bg-[var(--bg-elevated)] px-2 py-2 text-left font-[family-name:var(--font-mono)] text-[10px] font-semibold tracking-[0.12em] text-[var(--text-dim)] uppercase ${className}`}
    >
      <button
        type="button"
        onClick={() => onSort(col)}
        className="inline-flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--amber)]"
      >
        {label}
        {active ? <span className="text-[var(--amber)]">{sortDir === 'asc' ? '↑' : '↓'}</span> : null}
      </button>
    </th>
  )
}

export function TestCasesPage() {
  const { tcId } = useParams()
  const navigate = useNavigate()
  const [type, setType] = useState<TestCaseType | 'all'>('all')
  const [result, setResult] = useState<TestCaseResult | 'all'>('all')
  const [priority, setPriority] = useState<TestCasePriority | 'all'>('all')
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('id')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [view, setView] = useState<ViewMode>('grid')

  const filtered = useMemo(() => {
    const base = filterTestCases(testCaseSuite.testCases, { type, result, priority, q: query })
    return sortCases(base, sortKey, sortDir)
  }, [type, result, priority, query, sortKey, sortDir])

  const selected = tcId ? getTestCaseById(tcId) : undefined
  const { summary } = testCaseSuite.execution

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader
        title={
          <Link to="/test-cases" className="text-[var(--text)] no-underline hover:text-[var(--amber)]">
            Test Cases
          </Link>
        }
        meta={
          <>
            <div>
              {summary.pass}P · {summary.fail}F · {summary.blocked}B · {summary.skip}S
            </div>
            <div>{testCaseSuite.execution.date}</div>
          </>
        }
      />

      <div className="flex flex-col gap-3 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-elevated)_88%,transparent)] px-4 py-3 backdrop-blur-sm sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
        <label className="flex min-w-[180px] flex-1 flex-col gap-1">
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
            Search
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ID, title, node, bug…"
            className="w-full rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-dim)] focus:border-[var(--amber-dim)]"
          />
        </label>
        <label className="flex w-full flex-col gap-1 sm:w-36">
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
            Type
          </span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TestCaseType | 'all')}
            className="rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--amber-dim)]"
          >
            <option value="all">All</option>
            {ALL_TC_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="flex w-full flex-col gap-1 sm:w-32">
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
            Result
          </span>
          <select
            value={result}
            onChange={(e) => setResult(e.target.value as TestCaseResult | 'all')}
            className="rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--amber-dim)]"
          >
            <option value="all">All</option>
            {ALL_TC_RESULTS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className="flex w-full flex-col gap-1 sm:w-28">
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
            Priority
          </span>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TestCasePriority | 'all')}
            className="rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--amber-dim)]"
          >
            <option value="all">All</option>
            {ALL_TC_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        {SHEET_EMBED ? (
          <div className="flex gap-1 rounded border border-[var(--border)] p-0.5 sm:ml-2">
            <button
              type="button"
              onClick={() => setView('grid')}
              className={[
                'rounded-sm px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[11px]',
                view === 'grid'
                  ? 'bg-[var(--amber)] text-[#1a1204]'
                  : 'text-[var(--text-muted)] hover:text-[var(--amber)]',
              ].join(' ')}
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => setView('sheets')}
              className={[
                'rounded-sm px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[11px]',
                view === 'sheets'
                  ? 'bg-[var(--amber)] text-[#1a1204]'
                  : 'text-[var(--text-muted)] hover:text-[var(--amber)]',
              ].join(' ')}
            >
              Sheets
            </button>
          </div>
        ) : null}

        <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--text-muted)] sm:ml-auto sm:pb-2">
          {filtered.length}
          <span className="text-[var(--text-dim)]"> / {testCaseSuite.testCases.length}</span>
        </p>
      </div>

      {view === 'sheets' && SHEET_EMBED ? (
        <div className="flex min-h-0 flex-1 flex-col bg-[var(--bg)]">
          <iframe
            title="Test cases Google Sheet"
            src={SHEET_EMBED}
            className="min-h-[70vh] w-full flex-1 border-0"
            allow="fullscreen"
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <div className="min-h-0 min-w-0 flex-1 overflow-auto border-b border-[var(--border)] lg:border-r lg:border-b-0">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr>
                  <SortHeader label="ID" col="id" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="w-[7.5rem]" />
                  <SortHeader label="Type" col="type" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="w-[7rem]" />
                  <SortHeader label="Priority" col="priority" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="w-[5rem]" />
                  <SortHeader label="Title" col="title" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  <SortHeader label="Result" col="result" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="w-[5.5rem]" />
                  <SortHeader label="Linked bugs" col="bugs" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="w-[9rem]" />
                  <SortHeader label="Mind-map" col="mindmap" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="w-[8rem]" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((tc) => {
                  const active = tc.id === tcId
                  return (
                    <tr
                      key={tc.id}
                      onClick={() => navigate(`/test-cases/${tc.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          navigate(`/test-cases/${tc.id}`)
                        }
                      }}
                      tabIndex={0}
                      className={[
                        'cursor-pointer border-b border-[var(--border)] transition-colors',
                        active
                          ? 'bg-[color-mix(in_srgb,var(--amber)_14%,transparent)]'
                          : 'hover:bg-[color-mix(in_srgb,var(--amber)_8%,transparent)]',
                      ].join(' ')}
                    >
                      <td className="whitespace-nowrap px-2 py-2 font-[family-name:var(--font-mono)] text-[11px] text-[var(--amber)]">
                        {tc.id}
                      </td>
                      <td className="px-2 py-2">
                        <TypeChip type={tc.type} />
                      </td>
                      <td className="px-2 py-2 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-muted)]">
                        {tc.priority}
                      </td>
                      <td className="max-w-[28rem] px-2 py-2 text-[13px] leading-snug text-[var(--text)]">
                        <span className="line-clamp-2">{tc.title}</span>
                      </td>
                      <td className="px-2 py-2">
                        <ResultChip result={tc.result} />
                      </td>
                      <td className="px-2 py-2 font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-dim)]">
                        {tc.bugIds?.length ? (
                          <span className="inline-flex flex-wrap gap-1">
                            {tc.bugIds.map((id) => (
                              <Link
                                key={id}
                                to={`/bugs/${id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-[var(--amber)] hover:underline"
                              >
                                {id}
                              </Link>
                            ))}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-2 py-2 font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-dim)]">
                        {(() => {
                          const domain = domainForMindmapNode(tc.mindmapNode)
                          if (!domain) return <span title={tc.mindmapNode}>{tc.mindmapNode}</span>
                          return (
                            <Link
                              to={`/mindmap/${domain}`}
                              onClick={(e) => e.stopPropagation()}
                              className="hover:text-[var(--amber)] hover:underline"
                              title={`${tc.mindmapNode} → ${domain}`}
                            >
                              {tc.mindmapNode}
                            </Link>
                          )
                        })()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 ? (
              <p className="p-8 text-center text-sm text-[var(--text-muted)]">No test cases match these filters.</p>
            ) : null}
          </div>

          <aside className="max-h-[48vh] min-h-[220px] overflow-y-auto bg-[color-mix(in_srgb,var(--bg)_80%,transparent)] lg:max-h-none lg:w-[min(420px,38%)]">
            {tcId && !selected ? (
              <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 p-8 text-center">
                <p className="text-sm font-medium text-[var(--text)]">Test case not found</p>
                <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--text-dim)]">id={tcId}</p>
                <Link to="/test-cases" className="mt-2 text-sm text-[var(--amber)] hover:underline">
                  Back to sheet
                </Link>
              </div>
            ) : selected ? (
              <TcDetail tc={selected} />
            ) : (
              <div className="flex min-h-[40vh] flex-col justify-center gap-3 p-8 text-[var(--text-muted)]">
                <p className="text-sm text-[var(--text)]">Select a row</p>
                <p className="max-w-md text-sm leading-relaxed">
                  Native spreadsheet from{' '}
                  <code className="font-[family-name:var(--font-mono)] text-[var(--amber)]">
                    data/test-cases.json
                  </code>
                  . Scroll horizontally on mobile · click a column header to sort · click a row for
                  detail.
                </p>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}
