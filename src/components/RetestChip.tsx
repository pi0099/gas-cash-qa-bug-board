import type { RetestResult } from '../types/bug'

const styles: Record<RetestResult, string> = {
  'Still valid':
    'bg-[color-mix(in_srgb,var(--red)_22%,transparent)] text-[#ffb4b4] border-[var(--red)]',
  Fixed:
    'bg-[color-mix(in_srgb,var(--green)_22%,transparent)] text-[#8fd4ae] border-[#2a6048]',
  Partial:
    'bg-[color-mix(in_srgb,var(--amber)_22%,transparent)] text-[var(--amber)] border-[var(--amber-dim)]',
  Blocked: 'bg-[var(--slate-chip)] text-[var(--text-muted)] border-[var(--border)]',
}

export function RetestChip({ result }: { result: RetestResult }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-wide ${styles[result]}`}
      title="Latest production retest"
    >
      Retest: {result}
    </span>
  )
}
