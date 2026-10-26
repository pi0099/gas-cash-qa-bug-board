import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { MindMapNodeData } from '../lib/mindmapData'

const tagClass: Record<string, string> = {
  Documented: 'border-[var(--blue)]/50 text-[var(--blue)]',
  Observed: 'border-[var(--green)]/50 text-[var(--green)]',
  'Coming soon': 'border-[var(--amber)]/50 text-[var(--amber)]',
}

export function MindMapNode({ data, selected }: NodeProps) {
  const d = data as MindMapNodeData
  const isCenter = d.kind === 'center'
  const isBranch = d.kind === 'branch'

  return (
    <div
      className={[
        'min-w-[140px] max-w-[200px] rounded-md border px-3 py-2 shadow-sm transition-shadow',
        isCenter
          ? 'border-[var(--amber)] bg-[color-mix(in_srgb,var(--amber)_18%,var(--bg-elevated))] shadow-[0_0_0_1px_color-mix(in_srgb,var(--amber)_40%,transparent)]'
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

      <div
        className={[
          'font-semibold leading-snug text-[var(--text)]',
          isCenter ? 'text-base tracking-tight' : 'text-[13px]',
        ].join(' ')}
      >
        {d.label}
      </div>
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
    </div>
  )
}
