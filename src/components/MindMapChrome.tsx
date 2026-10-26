import { Link, useNavigate } from 'react-router-dom'
import { DOMAIN_LABELS, DOMAIN_ORDER, type DomainId } from '../lib/mindmaps'
import { SiteNav } from './SiteNav'

type Props = {
  domainId?: DomainId
  subtitle?: string
}

export function MindMapChrome({ domainId, subtitle }: Props) {
  const navigate = useNavigate()
  const title = domainId ? DOMAIN_LABELS[domainId] : 'Product mind map'

  return (
    <header className="z-20 shrink-0 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-elevated)_92%,transparent)] px-4 py-3.5 backdrop-blur-md sm:px-5">
      <div className="relative flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="z-10 shrink-0 text-center sm:min-w-[11rem] sm:text-left">
          <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--amber)] uppercase">
            Gas Cash · Local QA
          </p>
          <h1 className="text-lg font-bold tracking-tight text-[var(--text)]">{title}</h1>
          <nav
            aria-label="Mind map breadcrumb"
            className="mt-1 flex flex-wrap items-center justify-center gap-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-dim)] sm:justify-start"
          >
            <Link to="/mindmap" className="text-[var(--amber)] no-underline hover:underline">
              Mind map
            </Link>
            {domainId ? (
              <>
                <span aria-hidden>›</span>
                <span className="text-[var(--text-muted)]">{DOMAIN_LABELS[domainId]}</span>
              </>
            ) : (
              <>
                <span aria-hidden>›</span>
                <span className="text-[var(--text-muted)]">Hub</span>
              </>
            )}
          </nav>
          {subtitle ? (
            <p className="mt-1 hidden max-w-[14rem] text-[11px] leading-snug text-[var(--text-dim)] sm:block">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="z-10 flex justify-center sm:absolute sm:inset-x-0 sm:top-1/2 sm:-translate-y-1/2 sm:pointer-events-none">
          <div className="sm:pointer-events-auto">
            <SiteNav />
          </div>
        </div>

        <div className="z-10 flex w-full max-w-xs flex-col items-stretch gap-1 sm:min-w-[11rem] sm:max-w-[13rem] sm:items-end">
          <label
            htmlFor="mindmap-domain"
            className="font-[family-name:var(--font-mono)] text-[10px] tracking-wide text-[var(--text-dim)] uppercase"
          >
            Domain
          </label>
          <select
            id="mindmap-domain"
            className="w-full rounded-md border border-[var(--border-strong)] bg-[var(--bg-panel)] px-2.5 py-2 font-[family-name:var(--font-mono)] text-[12px] text-[var(--text)] outline-none focus:border-[var(--amber)]"
            value={domainId ?? 'hub'}
            onChange={(e) => {
              const v = e.target.value
              if (v === 'hub') navigate('/mindmap')
              else navigate(`/mindmap/${v}`)
            }}
            aria-label="Jump to domain mind map"
          >
            <option value="hub">Hub / overview</option>
            {DOMAIN_ORDER.map((id) => (
              <option key={id} value={id}>
                {DOMAIN_LABELS[id]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  )
}
