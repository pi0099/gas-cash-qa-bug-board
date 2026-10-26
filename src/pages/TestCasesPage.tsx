import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SiteNav } from '../components/SiteNav'
import { publicUrl } from '../lib/publicUrl'
import {
  ALL_TC_PRIORITIES,
  ALL_TC_RESULTS,
  ALL_TC_TYPES,
  filterTestCases,
  getTestCaseById,
  testCaseSuite,
} from '../lib/testCases'
import type { TestCase, TestCasePriority, TestCaseResult, TestCaseType } from '../types/testCase'

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

export function TestCasesPage() {
  const { tcId } = useParams()
  const [type, setType] = useState<TestCaseType | 'all'>('all')
  const [result, setResult] = useState<TestCaseResult | 'all'>('all')
  const [priority, setPriority] = useState<TestCasePriority | 'all'>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () => filterTestCases(testCaseSuite.testCases, { type, result, priority, q: query }),
    [type, result, priority, query],
  )
  const selected = tcId ? getTestCaseById(tcId) : undefined
  const { summary } = testCaseSuite.execution

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-elevated)_92%,transparent)] px-4 py-3.5 backdrop-blur-md sm:px-5">
        <div className="relative flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Link to="/test-cases" className="group z-10 inline-flex shrink-0 flex-col gap-0.5 no-underline sm:min-w-[9.5rem]">
            <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--amber)] uppercase">
              Gas Cash · Local QA
            </span>
            <span className="text-lg font-bold tracking-tight text-[var(--text)] group-hover:text-[var(--amber)]">
              Test Cases
            </span>
          </Link>
          <div className="z-10 flex justify-center sm:absolute sm:inset-x-0 sm:top-1/2 sm:-translate-y-1/2 sm:pointer-events-none">
            <div className="sm:pointer-events-auto">
              <SiteNav />
            </div>
          </div>
          <div className="z-10 hidden text-right font-[family-name:var(--font-mono)] text-[10px] leading-relaxed text-[var(--text-dim)] sm:block sm:min-w-[9.5rem]">
            <div>
              {summary.pass}P · {summary.fail}F · {summary.blocked}B · {summary.skip}S
            </div>
            <div>{testCaseSuite.execution.date}</div>
          </div>
        </div>
      </header>

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
        <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--text-muted)] sm:ml-auto sm:pb-2">
          {filtered.length}
          <span className="text-[var(--text-dim)]"> / {testCaseSuite.testCases.length}</span>
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="max-h-[42vh] overflow-y-auto border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-panel)_70%,transparent)] lg:max-h-none lg:w-[min(420px,40%)] lg:border-r lg:border-b-0">
          <ul className="divide-y divide-[var(--border)]">
            {filtered.map((tc) => {
              const active = tc.id === tcId
              return (
                <li key={tc.id}>
                  <Link
                    to={`/test-cases/${tc.id}`}
                    className={[
                      'block px-4 py-3 no-underline transition-colors',
                      active
                        ? 'bg-[color-mix(in_srgb,var(--amber)_14%,transparent)]'
                        : 'hover:bg-[color-mix(in_srgb,var(--amber)_8%,transparent)]',
                    ].join(' ')}
                  >
                    <div className="mb-1 flex flex-wrap items-center gap-1.5">
                      <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--amber)]">
                        {tc.id}
                      </span>
                      <ResultChip result={tc.result} />
                      <TypeChip type={tc.type} />
                    </div>
                    <p className="text-sm leading-snug text-[var(--text)]">{tc.title}</p>
                    <p className="mt-1 font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-dim)]">
                      {tc.priority} · {tc.mindmapNode}
                      {tc.bugIds?.[0] ? ` · ${tc.bugIds[0]}` : ''}
                    </p>
                  </Link>
                </li>
              )
            })}
          </ul>
        </aside>
        <main className="min-h-0 flex-1 overflow-y-auto bg-[color-mix(in_srgb,var(--bg)_80%,transparent)]">
          {tcId && !selected ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 p-8 text-center">
              <p className="text-sm font-medium text-[var(--text)]">Test case not found</p>
              <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--text-dim)]">id={tcId}</p>
              <Link to="/test-cases" className="mt-2 text-sm text-[var(--amber)] hover:underline">
                Back to suite
              </Link>
            </div>
          ) : selected ? (
            <TcDetail tc={selected} />
          ) : (
            <div className="flex min-h-[40vh] flex-col justify-center gap-3 p-8 text-[var(--text-muted)]">
              <p className="text-sm text-[var(--text)]">Select a test case</p>
              <p className="max-w-md text-sm leading-relaxed">
                Mind-map suite · {summary.total} cases · {summary.pass} pass / {summary.fail} fail /{' '}
                {summary.blocked} blocked / {summary.skip} skip. Filter by type, result, or priority.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
