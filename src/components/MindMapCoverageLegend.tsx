import { COVERAGE_LEGEND } from '../lib/mindmaps'

/** Compact edge/border legend for hub + domain mind maps. */
export function MindMapCoverageLegend() {
  return (
    <div
      role="note"
      aria-label="Test coverage legend"
      className="pointer-events-auto rounded-md border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-elevated)_94%,transparent)] px-2.5 py-2 backdrop-blur-sm"
    >
      <p className="mb-1.5 font-[family-name:var(--font-mono)] text-[9px] tracking-[0.14em] text-[var(--text-dim)] uppercase">
        Flow coverage
      </p>
      <ul className="space-y-1">
        {COVERAGE_LEGEND.map((row) => (
          <li key={row.status} className="flex items-center gap-2">
            <span
              className="inline-block h-0.5 w-5 shrink-0 rounded-full"
              style={{ backgroundColor: row.color, boxShadow: `0 0 0 1px ${row.color}` }}
              aria-hidden
            />
            <span className="font-[family-name:var(--font-mono)] text-[10px] leading-tight text-[var(--text-muted)]">
              {row.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
