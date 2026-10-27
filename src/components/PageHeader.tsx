import type { ReactNode } from 'react'
import { SiteNav } from './SiteNav'

type Props = {
  /** Page H1 — never under the nav */
  title: ReactNode
  /** Optional eyebrow above the title */
  eyebrow?: string
  /** Optional right-side meta (desktop) */
  meta?: ReactNode
  /** Optional controls under the title (breadcrumbs, domain select, etc.) */
  belowTitle?: ReactNode
  /** sticky header (doc pages) vs static (board) */
  sticky?: boolean
  className?: string
}

/**
 * Shared chrome: title row, then full-width nav row.
 * Avoids the old absolute-centered nav that overlapped H1 on sm+.
 */
export function PageHeader({
  title,
  eyebrow = 'Gas Cash · Local QA',
  meta,
  belowTitle,
  sticky = false,
  className = '',
}: Props) {
  return (
    <header
      className={[
        sticky ? 'sticky top-0 z-30' : 'z-20',
        'shrink-0 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-elevated)_92%,transparent)] px-4 py-3.5 backdrop-blur-md sm:px-5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0 shrink text-center sm:text-left">
            <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--amber)] uppercase">
              {eyebrow}
            </p>
            <div className="text-lg font-bold tracking-tight text-[var(--text)]">{title}</div>
            {belowTitle}
          </div>
          {meta ? (
            <div className="flex w-full shrink-0 justify-center font-[family-name:var(--font-mono)] text-[10px] leading-relaxed text-[var(--text-dim)] sm:w-auto sm:justify-end sm:text-right">
              {meta}
            </div>
          ) : null}
        </div>
        <div className="flex justify-center">
          <SiteNav />
        </div>
      </div>
    </header>
  )
}
