import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { MindMapNode } from '../components/MindMapNode'
import { SiteNav } from '../components/SiteNav'
import {
  journeyEdges,
  mindMapEdges,
  mindMapNodes,
  type EvidenceTag,
  type MindMapNodeData,
} from '../lib/mindmapData'

const nodeTypes = { gasNode: MindMapNode }

const tagClass: Record<EvidenceTag, string> = {
  Documented: 'border-[var(--blue)]/50 text-[var(--blue)]',
  Observed: 'border-[var(--green)]/50 text-[var(--green)]',
  'Coming soon': 'border-[var(--amber)]/50 text-[var(--amber)]',
}

function MindMapCanvas() {
  const [nodes, , onNodesChange] = useNodesState(mindMapNodes)
  const [edges, , onEdgesChange] = useEdgesState([...mindMapEdges, ...journeyEdges])
  const [selected, setSelected] = useState<Node<MindMapNodeData> | null>(null)
  const { fitView, setViewport, getViewport } = useReactFlow()

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelected(node as Node<MindMapNodeData>)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelected(null)
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => {
      void fitView({ padding: 0.18, duration: 200 })
    }, 50)
    return () => window.clearTimeout(t)
  }, [fitView])

  const resetView = useCallback(() => {
    void fitView({ padding: 0.18, duration: 300 })
    setSelected(null)
  }, [fitView])

  const zoomBy = useCallback(
    (factor: number) => {
      const v = getViewport()
      void setViewport({ ...v, zoom: Math.min(2.5, Math.max(0.2, v.zoom * factor)) }, { duration: 120 })
    },
    [getViewport, setViewport],
  )

  const defaultEdgeOptions = useMemo(
    () => ({
      style: { stroke: 'var(--border-strong)', strokeWidth: 1.5 },
    }),
    [],
  )

  return (
    <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
      <div className="relative min-h-[55vh] flex-1 lg:min-h-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          minZoom={0.15}
          maxZoom={2.5}
          panOnDrag
          zoomOnScroll
          zoomOnPinch
          attributionPosition="bottom-left"
          proOptions={{ hideAttribution: true }}
          className="bg-[color-mix(in_srgb,var(--bg)_88%,#0a0e12)]"
        >
          <Background color="var(--border)" gap={28} size={1} />
          <Controls
            showInteractive={false}
            className="!overflow-hidden !rounded-md !border ![border-color:var(--border)] !bg-[var(--bg-elevated)] !shadow-none [&>button]:!border-[var(--border)] [&>button]:!bg-[var(--bg-panel)] [&>button]:!fill-[var(--text-muted)]"
          />
          <MiniMap
            pannable
            zoomable
            className="!overflow-hidden !rounded-md !border ![border-color:var(--border)] !bg-[var(--bg-elevated)]"
            maskColor="rgba(15, 20, 25, 0.65)"
            nodeColor={(n) => {
              const d = n.data as MindMapNodeData
              if (d?.kind === 'center') return '#f0a020'
              if (d?.tags?.includes('Coming soon')) return '#8a5a10'
              if (d?.kind === 'branch') return '#4a8fd4'
              return '#3a4a5c'
            }}
          />
        </ReactFlow>

        <div className="pointer-events-none absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 sm:left-4">
          <div className="pointer-events-auto flex flex-wrap gap-1 rounded-md border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-elevated)_92%,transparent)] p-1 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => zoomBy(1.2)}
              className="rounded-sm px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-muted)] hover:bg-[var(--bg-panel)] hover:text-[var(--text)]"
            >
              Zoom +
            </button>
            <button
              type="button"
              onClick={() => zoomBy(1 / 1.2)}
              className="rounded-sm px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-muted)] hover:bg-[var(--bg-panel)] hover:text-[var(--text)]"
            >
              Zoom −
            </button>
            <button
              type="button"
              onClick={resetView}
              className="rounded-sm px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[11px] text-[var(--amber)] hover:bg-[color-mix(in_srgb,var(--amber)_15%,transparent)]"
            >
              Fit view
            </button>
            <button
              type="button"
              onClick={resetView}
              className="rounded-sm px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-muted)] hover:bg-[var(--bg-panel)] hover:text-[var(--text)]"
            >
              Reset
            </button>
          </div>
        </div>

        <p className="pointer-events-none absolute right-3 bottom-3 z-10 hidden max-w-[200px] text-right font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-dim)] sm:block">
          Scroll / pinch zoom · drag empty canvas to pan · click a node for detail
        </p>
      </div>

      <aside
        className={[
          'border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-panel)_85%,transparent)] lg:w-[min(340px,38%)] lg:border-t-0 lg:border-l',
          selected ? 'block' : 'hidden lg:block',
        ].join(' ')}
      >
        {selected ? (
          <div className="flex h-full flex-col p-4 sm:p-5">
            <div className="mb-3 flex items-start justify-between gap-2">
              <h2 className="text-base font-semibold tracking-tight text-[var(--text)]">
                {(selected.data as MindMapNodeData).label}
              </h2>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="shrink-0 rounded-sm px-2 py-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-dim)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text)] lg:hidden"
              >
                Close
              </button>
            </div>
            <div className="mb-3 flex flex-wrap gap-1">
              {((selected.data as MindMapNodeData).tags ?? []).map((tag) => (
                <span
                  key={tag}
                  className={`rounded-sm border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] ${tagClass[tag]}`}
                >
                  [{tag}]
                </span>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              {(selected.data as MindMapNodeData).summary}
            </p>
            {(selected.data as MindMapNodeData).detail ? (
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-dim)]">
                {(selected.data as MindMapNodeData).detail}
              </p>
            ) : null}
            <p className="mt-auto pt-6 font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-dim)]">
              Evidence-tagged from QA research — no invented features.
            </p>
          </div>
        ) : (
          <div className="hidden h-full flex-col justify-center gap-2 p-5 lg:flex">
            <p className="text-sm font-medium text-[var(--text)]">Select a node</p>
            <p className="text-sm leading-relaxed text-[var(--text-dim)]">
              Click any branch or leaf for a short, evidence-tagged description. Dashed lines hint the player journey
              (Auth → Wallet → Fund → Vehicle → Claim → Rewards).
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
          </div>
        )}
      </aside>
    </div>
  )
}

export function MindMapPage() {
  return (
    <div className="flex h-[100dvh] min-h-screen flex-col overflow-hidden">
      <header className="z-20 shrink-0 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-elevated)_92%,transparent)] px-4 py-3.5 backdrop-blur-md sm:px-5">
        <div className="relative flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="z-10 shrink-0 text-center sm:min-w-[10rem] sm:text-left">
            <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--amber)] uppercase">
              Gas Cash · Local QA
            </p>
            <h1 className="text-lg font-bold tracking-tight text-[var(--text)]">Product mind map</h1>
          </div>
          <div className="z-10 flex justify-center sm:absolute sm:inset-x-0 sm:top-1/2 sm:-translate-y-1/2 sm:pointer-events-none">
            <div className="sm:pointer-events-auto">
              <SiteNav />
            </div>
          </div>
          <div className="pointer-events-none hidden sm:block sm:min-w-[10rem]" aria-hidden />
        </div>
      </header>
      <ReactFlowProvider>
        <MindMapCanvas />
      </ReactFlowProvider>
    </div>
  )
}
