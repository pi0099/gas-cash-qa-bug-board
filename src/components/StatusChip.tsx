import type { BugStatus } from '../types/bug'

const styles: Record<BugStatus, string> = {
  Triage: 'bg-[color-mix(in_srgb,var(--amber)_22%,transparent)] text-[var(--amber)] border-[var(--amber-dim)]',
  Open: 'bg-[color-mix(in_srgb,var(--blue)_20%,transparent)] text-[#9ec5f0] border-[#2a5080]',
  'In Progress': 'bg-[color-mix(in_srgb,var(--blue)_28%,transparent)] text-[#b8d6f5] border-[#3a6aa0]',
  Blocked: 'bg-[var(--red-dim)] text-[#ffb4b4] border-[var(--red)]',
  Resolved: 'bg-[color-mix(in_srgb,var(--green)_22%,transparent)] text-[#8fd4ae] border-[#2a6048]',
  Closed: 'bg-[var(--slate-chip)] text-[var(--text-muted)] border-[var(--border)]',
}

export function StatusChip({ status }: { status: BugStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-wide ${styles[status]}`}
    >
      {status}
    </span>
  )
}
