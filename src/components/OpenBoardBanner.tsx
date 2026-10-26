import { liveBackendLabel } from '../lib/supabase'

export function OpenBoardBanner({ compact = false }: { compact?: boolean }) {
  const backend = liveBackendLabel()
  return (
    <div
      role="status"
      className={[
        'border-b border-[color-mix(in_srgb,var(--amber)_40%,var(--border))] bg-[color-mix(in_srgb,var(--amber)_14%,transparent)] px-4 py-2 text-center sm:px-5',
        compact ? 'text-[11px]' : 'text-xs sm:text-sm',
      ].join(' ')}
    >
      <p className="leading-snug text-[var(--text)]">
        <span className="font-semibold text-[var(--amber)]">Temp open board</span>
        {' — '}
        anyone with the link can edit status and comments (no login).
        <span className="ml-1 font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-dim)] sm:text-[11px]">
          backend: {backend}
        </span>
      </p>
    </div>
  )
}
