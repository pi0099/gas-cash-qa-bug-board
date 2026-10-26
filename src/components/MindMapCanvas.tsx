import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MindMapJson, MindMapNodeData } from '../types/mindmap'
import { COVERAGE_STROKE, toFlowEdges, toFlowNodes } from '../lib/mindmaps'
import { MindMapCoverageLegend } from './MindMapCoverageLegend'
import { MindMapNode } from './MindMapNode'
import { MindMapSidePanel } from './MindMapSidePanel'

const nodeTypes = { gasNode: MindMapNode }

type Props = {
  map: MindMapJson
  /** Hub: show TC counts and navigate on domain click */
  mode: 'hub' | 'detail'
  emptyHint?: string
}

export function MindMapCanvas({ map, mode, emptyHint }: Props) {
  const navigate = useNavigate()
  const initialNodes = useMemo(
    () => toFlowNodes(map, { withTcCounts: mode === 'hub' }),
    [map, mode],
  )
  const initialEdges = useMemo(() => toFlowEdges(map), [map])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selected, setSelected] = useState<Node<MindMapNodeData> | null>(null)
  const { fitView, setViewport, getViewport } = useReactFlow()

  useEffect(() => {
    setNodes(toFlowNodes(map, { withTcCounts: mode === 'hub' }))
    setEdges(toFlowEdges(map))
    setSelected(null)
  }, [map, mode, setNodes, setEdges])

  useEffect(() => {
    const t = window.setTimeout(() => {
      void fitView({ padding: 0.18, duration: 200 })
    }, 50)
    return () => window.clearTimeout(t)
  }, [fitView, map.id])

  const openHref = useCallback(
    (href: string) => {
      navigate(href)
    },
    [navigate],
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const n = node as Node<MindMapNodeData>
      setSelected(n)
      // Double-purpose: single click selects; domain nodes can also open via panel CTA.
      // Double-click / Open detail button navigates.
    },
    [],
  )

  const onNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const d = node.data as MindMapNodeData
      if (d.href) openHref(d.href)
    },
    [openHref],
  )

  const onPaneClick = useCallback(() => {
    setSelected(null)
  }, [])

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
      style: { stroke: COVERAGE_STROKE.none, strokeWidth: 1.5 },
    }),
    [],
  )

  const selectedData = selected ? (selected.data as MindMapNodeData) : null

  return (
    <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
      <div className="relative min-h-[55vh] flex-1 lg:min-h-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
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
              if (d?.coverage) return COVERAGE_STROKE[d.coverage]
              if (d?.kind === 'domain') return '#c88820'
              return COVERAGE_STROKE.none
            }}
          />
        </ReactFlow>

        <div className="pointer-events-none absolute top-3 left-3 z-10 flex max-w-[calc(100%-1.5rem)] flex-col gap-2 sm:left-4">
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
          <MindMapCoverageLegend />
        </div>

        <p className="pointer-events-none absolute right-3 bottom-3 z-10 hidden max-w-[240px] text-right font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-dim)] sm:block">
          {mode === 'hub'
            ? 'Colored edges = TC coverage · click domain · double-click to open'
            : 'Edge + border color = suite coverage · click a leaf for TC detail'}
        </p>
      </div>

      <MindMapSidePanel
        data={selectedData}
        onClose={() => setSelected(null)}
        onOpenDetail={mode === 'hub' ? openHref : undefined}
        emptyHint={emptyHint}
      />
    </div>
  )
}
