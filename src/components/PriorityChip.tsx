import type { BugPriority } from '../types/bug'

const styles: Record<BugPriority, string> = {
  P0: 'bg-[var(--red-dim)] text-[#ffb4b4] border-[var(--red)]',
  P1: 'bg-[color-mix(in_srgb,var(--amber)_18%,transparent)] text-[var(--amber)] border-[var(--amber-dim)]',
  High: 'bg-[color-mix(in_srgb,var(--amber)_18%,transparent)] text-[var(--amber)] border-[var(--amber-dim)]',
  P2: 'bg-[var(--slate-chip)] text-[#c5d0de] border-[var(--border-strong)]',
  Medium: 'bg-[var(--slate-chip)] text-[#c5d0de] border-[var(--border-strong)]',
  P3: 'bg-[color-mix(in_srgb,var(--text-dim)_25%,transparent)] text-[var(--text-muted)] border-[var(--border)]',
  Low: 'bg-[color-mix(in_srgb,var(--text-dim)_25%,transparent)] text-[var(--text-muted)] border-[var(--border)]',
}

const fallback =
  'bg-[var(--slate-chip)] text-[#c5d0de] border-[var(--border-strong)]'

export function PriorityChip({ priority }: { priority: string }) {
  const known = styles[priority as BugPriority] ?? fallback
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-wide ${known}`}
    >
      {priority === 'P0' ? 'P0 / Urgent' : priority}
    </span>
  )
}
