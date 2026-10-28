import { Search } from 'lucide-react'
import { ALL_PRIORITIES, ALL_STATUSES, type BugSortMode } from '../lib/bugs'
import type { BugPriority, BugStatus } from '../types/bug'

interface Props {
  priority: BugPriority | 'all'
  status: BugStatus | 'all'
  query: string
  sort: BugSortMode
  onPriority: (v: BugPriority | 'all') => void
  onStatus: (v: BugStatus | 'all') => void
  onQuery: (v: string) => void
  onSort: (v: BugSortMode) => void
  onClear: () => void
  resultCount: number
  totalCount: number
}

export function BugFilters({
  priority,
  status,
  query,
  sort,
  onPriority,
  onStatus,
  onQuery,
  onSort,
  onClear,
  resultCount,
  totalCount,
}: Props) {
  const filtered =
    priority !== 'all' || status !== 'all' || query.trim().length > 0 || sort !== 'newest'

  return (
    <div className="flex flex-col gap-3 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-elevated)_88%,transparent)] px-4 py-3 backdrop-blur-sm sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
      <label className="flex min-w-[200px] flex-1 flex-col gap-1">
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
          Search
        </span>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-[var(--text-dim)]"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Title, tags, id, Hóc Môn…"
            className="w-full rounded border border-[var(--border)] bg-[var(--bg)] py-2 pr-3 pl-8 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-dim)] focus:border-[var(--amber-dim)]"
          />
        </div>
      </label>

      <label className="flex w-full flex-col gap-1 sm:w-36">
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
          Priority
        </span>
        <select
          value={priority}
          onChange={(e) => onPriority(e.target.value as BugPriority | 'all')}
          className="rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--amber-dim)]"
        >
          <option value="all">All</option>
          {ALL_PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p === 'P0' ? 'P0 / Urgent' : p}
            </option>
          ))}
        </select>
      </label>

      <label className="flex w-full flex-col gap-1 sm:w-40">
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
          Status
        </span>
        <select
          value={status}
          onChange={(e) => onStatus(e.target.value as BugStatus | 'all')}
          className="rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--amber-dim)]"
        >
          <option value="all">All</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="flex w-full flex-col gap-1 sm:w-40">
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
          Sort
        </span>
        <select
          value={sort}
          onChange={(e) => onSort(e.target.value as BugSortMode)}
          className="rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--amber-dim)]"
        >
          <option value="priority">Priority</option>
          <option value="newest">Newest first</option>
        </select>
      </label>

      <div className="flex items-center gap-3 sm:ml-auto sm:pb-2">
        {filtered ? (
          <button
            type="button"
            onClick={onClear}
            className="font-[family-name:var(--font-mono)] text-xs text-[var(--amber)] hover:underline"
          >
            Clear filters
          </button>
        ) : null}
        <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--text-muted)]">
          {resultCount}
          <span className="text-[var(--text-dim)]"> / {totalCount}</span>
        </p>
      </div>
    </div>
  )
}
