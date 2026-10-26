import { Link } from 'react-router-dom'
import type { Bug } from '../types/bug'
import { PriorityChip } from './PriorityChip'
import { RetestChip } from './RetestChip'
import { StatusChip } from './StatusChip'

interface Props {
  bugs: Bug[]
  selectedId?: string
}

export function BugList({ bugs, selectedId }: Props) {
  if (bugs.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-10 text-center">
        <p className="text-sm font-medium text-[var(--text)]">No bugs match these filters</p>
        <p className="max-w-xs text-sm text-[var(--text-muted)]">
          Clear search or widen priority/status. Source of truth remains{' '}
          <code className="font-[family-name:var(--font-mono)] text-[var(--amber)]">data/bugs.json</code>.
        </p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-[var(--border)]">
      {bugs.map((bug) => {
        const active = bug.id === selectedId
        return (
          <li key={bug.id}>
            <Link
              to={`/bugs/${bug.id}`}
              className={`block px-4 py-3 transition-colors hover:bg-[color-mix(in_srgb,var(--amber)_6%,transparent)] ${
                active
                  ? 'border-l-2 border-l-[var(--amber)] bg-[color-mix(in_srgb,var(--amber)_10%,transparent)]'
                  : 'border-l-2 border-l-transparent'
              }`}
            >
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <PriorityChip priority={bug.priority} />
                <StatusChip status={bug.status} />
                {bug.lastRetestResult ? <RetestChip result={bug.lastRetestResult} /> : null}
                <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-dim)]">
                  {bug.id}
                </span>
              </div>
              <h2 className="text-[13.5px] leading-snug font-medium text-[var(--text)]">{bug.title}</h2>
              {bug.lastRetestNote ? (
                <p className="mt-1.5 line-clamp-2 font-[family-name:var(--font-mono)] text-[11px] leading-snug text-[var(--text-muted)]">
                  {bug.lastRetestAt ? `${bug.lastRetestAt} · ` : ''}
                  {bug.lastRetestNote}
                </p>
              ) : null}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {bug.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-[var(--border)] bg-[var(--bg)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
