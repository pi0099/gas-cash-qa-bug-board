import { Link } from 'react-router-dom'
import { COVERAGE_LEGEND, COVERAGE_STROKE, resolveTcSummaries } from '../lib/mindmaps'
import type { EvidenceTag, MindMapNodeData, TcTypeTag } from '../types/mindmap'

const tagClass: Record<EvidenceTag, string> = {
  Documented: 'border-[var(--blue)]/50 text-[var(--blue)]',
  Observed: 'border-[var(--green)]/50 text-[var(--green)]',
  'Coming soon': 'border-[var(--amber)]/50 text-[var(--amber)]',
}

const tcTypeLabel: Record<TcTypeTag, string> = {
  F: 'Functional',
  V: 'Validation',
  S: 'Security',
}

const tcTypeClass: Record<TcTypeTag, string> = {
  F: 'border-[var(--green)]/50 text-[var(--green)]',
  V: 'border-[var(--blue)]/50 text-[var(--blue)]',
  S: 'border-[var(--red)]/50 text-[var(--red)]',
}

type Props = {
  data: MindMapNodeData | null
  onClose: () => void
  /** Hub: show open-detail CTA */
  onOpenDetail?: (href: string) => void
  emptyHint?: string
}

export function MindMapSidePanel({ data, onClose, onOpenDetail, emptyHint }: Props) {
  if (!data) {
    return (
      <aside className="hidden border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-panel)_85%,transparent)] lg:block lg:w-[min(340px,38%)] lg:border-t-0 lg:border-l">
        <div className="flex h-full flex-col justify-center gap-2 p-5">
          <p className="text-sm font-medium text-[var(--text)]">Select a node</p>
          <p className="text-sm leading-relaxed text-[var(--text-dim)]">
            {emptyHint ??
              'Click a node for evidence tags, F/V/S hints, and linked or suggested test cases.'}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {(Object.keys(tagClass) as EvidenceTag[]).map((tag) => (
              <span
                key={tag}
                className={`rounded-sm border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] ${tagClass[tag]}`}
              >
                [{tag}]
              </span>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(Object.keys(tcTypeLabel) as TcTypeTag[]).map((t) => (
              <span
                key={t}
                className={`rounded-sm border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] ${tcTypeClass[t]}`}
              >
                {t} · {tcTypeLabel[t]}
              </span>
            ))}
          </div>
          <div className="mt-3 space-y-1 border-t border-[var(--border)] pt-3">
            <p className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.12em] text-[var(--text-dim)] uppercase">
              Edge / border coverage
            </p>
            {COVERAGE_LEGEND.map((row) => (
              <div key={row.status} className="flex items-center gap-2">
                <span className="h-0.5 w-4 rounded-full" style={{ backgroundColor: row.color }} />
                <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-muted)]">
                  {row.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    )
  }

  const linked = resolveTcSummaries(data.tcIds)
  const coverage = data.coverage ?? 'none'
  const coverageLabel = COVERAGE_LEGEND.find((r) => r.status === coverage)?.label ?? coverage

  return (
    <aside className="border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-panel)_85%,transparent)] lg:w-[min(340px,38%)] lg:border-t-0 lg:border-l">
      <div className="flex h-full max-h-[45vh] flex-col overflow-y-auto p-4 sm:p-5 lg:max-h-none">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h2 className="text-base font-semibold tracking-tight text-[var(--text)]">{data.label}</h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-sm px-2 py-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-dim)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text)] lg:hidden"
          >
            Close
          </button>
        </div>
        <p
          className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-sm border px-2 py-1 font-[family-name:var(--font-mono)] text-[10px]"
          style={{
            borderColor: COVERAGE_STROKE[coverage],
            color: COVERAGE_STROKE[coverage],
            backgroundColor: `color-mix(in srgb, ${COVERAGE_STROKE[coverage]} 12%, transparent)`,
          }}
        >
          <span className="inline-block h-0.5 w-3 rounded-full" style={{ backgroundColor: COVERAGE_STROKE[coverage] }} />
          {coverageLabel}
        </p>

        <div className="mb-2 flex flex-wrap gap-1">
          {data.tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-sm border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] ${tagClass[tag]}`}
            >
              [{tag}]
            </span>
          ))}
        </div>

        {data.tcTypes.length > 0 ? (
          <div className="mb-3 flex flex-wrap gap-1">
            {data.tcTypes.map((t) => (
              <span
                key={t}
                className={`rounded-sm border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] ${tcTypeClass[t]}`}
              >
                {t} · {tcTypeLabel[t]}
              </span>
            ))}
            {data.envHint ? (
              <span className="rounded-sm border border-[var(--border)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-dim)]">
                {data.envHint}
              </span>
            ) : null}
          </div>
        ) : null}

        <p className="text-sm leading-relaxed text-[var(--text-muted)]">{data.summary}</p>
        {data.detail ? (
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-dim)]">{data.detail}</p>
        ) : null}

        {data.href && onOpenDetail ? (
          <button
            type="button"
            onClick={() => onOpenDetail(data.href!)}
            className="mt-4 rounded-md border border-[var(--amber)]/50 bg-[color-mix(in_srgb,var(--amber)_14%,transparent)] px-3 py-2 text-left text-sm font-medium text-[var(--amber)] hover:bg-[color-mix(in_srgb,var(--amber)_22%,transparent)]"
          >
            Open {data.label} detail map →
            {typeof data.linkedTcCount === 'number' ? (
              <span className="mt-0.5 block font-[family-name:var(--font-mono)] text-[11px] font-normal text-[var(--text-dim)]">
                {data.linkedTcCount} linked TC{data.linkedTcCount === 1 ? '' : 's'}
              </span>
            ) : null}
          </button>
        ) : null}

        {linked.length > 0 ? (
          <div className="mt-4">
            <p className="mb-1.5 font-[family-name:var(--font-mono)] text-[10px] tracking-wide text-[var(--text-dim)] uppercase">
              Linked test cases
            </p>
            <ul className="space-y-1.5">
              {linked.map((tc) => (
                <li key={tc.id}>
                  <Link
                    to={`/test-cases/${tc.id}`}
                    className="block rounded-sm border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-1.5 no-underline hover:border-[var(--amber)]/40"
                  >
                    <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--amber)]">
                      {tc.id}
                    </span>
                    {tc.type ? (
                      <span className="ml-1.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-dim)]">
                        {tc.type}
                        {tc.result ? ` · ${tc.result}` : ''}
                      </span>
                    ) : null}
                    <span className="mt-0.5 block text-[12px] leading-snug text-[var(--text-muted)]">
                      {tc.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {data.tcIdeas.length > 0 ? (
          <div className="mt-4">
            <p className="mb-1.5 font-[family-name:var(--font-mono)] text-[10px] tracking-wide text-[var(--text-dim)] uppercase">
              Suggested TC ideas
            </p>
            <ul className="list-disc space-y-1 pl-4 text-[13px] leading-snug text-[var(--text-muted)]">
              {data.tcIdeas.map((idea) => (
                <li key={idea}>{idea}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="mt-auto pt-6 font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-dim)]">
          Evidence-tagged from QA research — no invented features.
        </p>
      </div>
    </aside>
  )
}
