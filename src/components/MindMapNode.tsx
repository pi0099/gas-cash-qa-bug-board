import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { MindMapNodeData, TcTypeTag } from '../types/mindmap'

const tagClass: Record<string, string> = {
  Documented: 'border-[var(--blue)]/50 text-[var(--blue)]',
  Observed: 'border-[var(--green)]/50 text-[var(--green)]',
  'Coming soon': 'border-[var(--amber)]/50 text-[var(--amber)]',
}

const tcTypeClass: Record<TcTypeTag, string> = {
  F: 'border-[var(--green)]/55 bg-[color-mix(in_srgb,var(--green)_14%,transparent)] text-[var(--green)]',
  V: 'border-[var(--blue)]/55 bg-[color-mix(in_srgb,var(--blue)_14%,transparent)] text-[var(--blue)]',
  S: 'border-[var(--red)]/55 bg-[color-mix(in_srgb,var(--red)_14%,transparent)] text-[var(--red)]',
}

export function MindMapNode({ data, selected }: NodeProps) {
  const d = data as MindMapNodeData
  const isCenter = d.kind === 'center'
  const isBranch = d.kind === 'branch'
  const isDomain = d.kind === 'domain'
  const drillable = Boolean(d.href) || isDomain

  return (
    <div
      className={[
        'min-w-[148px] max-w-[220px] rounded-md border px-3 py-2 shadow-sm transition-shadow',
        isCenter
          ? 'border-[var(--amber)] bg-[color-mix(in_srgb,var(--amber)_18%,var(--bg-elevated))] shadow-[0_0_0_1px_color-mix(in_srgb,var(--amber)_40%,transparent)]'
          : isDomain
            ? 'cursor-pointer border-[var(--border-strong)] bg-[var(--bg-panel)] hover:border-[var(--amber)]'
            : isBranch
              ? 'border-[var(--border-strong)] bg-[var(--bg-panel)]'
              : 'border-[var(--border)] bg-[var(--bg-elevated)]',
        selected ? 'ring-2 ring-[var(--amber)] ring-offset-1 ring-offset-[var(--bg)]' : '',
      ].join(' ')}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-[var(--border)] !bg-[var(--text-dim)]"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-[var(--border)] !bg-[var(--text-dim)]"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="t"
        className="!h-2 !w-2 !border-[var(--border)] !bg-[var(--text-dim)]"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        className="!h-2 !w-2 !border-[var(--border)] !bg-[var(--text-dim)]"
      />

      <div className="flex items-start justify-between gap-2">
        <div
          className={[
            'font-semibold leading-snug text-[var(--text)]',
            isCenter ? 'text-base tracking-tight' : 'text-[13px]',
          ].join(' ')}
        >
          {d.label}
        </div>
        {typeof d.linkedTcCount === 'number' ? (
          <span
            className="shrink-0 rounded-sm border border-[var(--amber)]/40 bg-[color-mix(in_srgb,var(--amber)_12%,transparent)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--amber)]"
            title="Linked test cases"
          >
            {d.linkedTcCount} TC
          </span>
        ) : null}
      </div>

      {(d.tcTypes.length > 0 || d.envHint) && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1">
          {d.tcTypes.map((t) => (
            <span
              key={t}
              className={`rounded-sm border px-1 py-px font-[family-name:var(--font-mono)] text-[9px] font-semibold tracking-wide ${tcTypeClass[t]}`}
              title={t === 'F' ? 'Functional' : t === 'V' ? 'Validation' : 'Security'}
            >
              {t}
            </span>
          ))}
          {d.envHint ? (
            <span className="rounded-sm border border-[var(--border)] px-1 py-px font-[family-name:var(--font-mono)] text-[9px] text-[var(--text-dim)]">
              {d.envHint}
            </span>
          ) : null}
        </div>
      )}

      <div className="mt-1.5 flex flex-wrap gap-1">
        {d.tags.map((tag) => (
          <span
            key={tag}
            className={`rounded-sm border px-1 py-px font-[family-name:var(--font-mono)] text-[9px] tracking-wide ${tagClass[tag] ?? ''}`}
          >
            {tag}
          </span>
        ))}
      </div>

      {drillable ? (
        <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[9px] tracking-wide text-[var(--amber)]">
          Open detail →
        </p>
      ) : null}
    </div>
  )
}
