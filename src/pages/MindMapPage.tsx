import { ReactFlowProvider } from '@xyflow/react'
import { Link, useParams } from 'react-router-dom'
import { MindMapCanvas } from '../components/MindMapCanvas'
import { MindMapChrome } from '../components/MindMapChrome'
import { SiteNav } from '../components/SiteNav'
import { DOMAIN_LABELS, getMindMap, hubMap, isDomainId, type DomainId } from '../lib/mindmaps'

function MindMapShell({
  domainId,
  mapId,
}: {
  domainId?: DomainId
  mapId: string
}) {
  const map = getMindMap(mapId)
  if (!map) return null

  return (
    <div className="flex h-[100dvh] min-h-screen flex-col overflow-hidden">
      <MindMapChrome
        domainId={domainId}
        subtitle={
          domainId
            ? 'Detail flow map for F / V / S test-case design'
            : 'Click a domain to open its detail map'
        }
      />
      <ReactFlowProvider>
        <MindMapCanvas
          map={map}
          mode={domainId ? 'detail' : 'hub'}
          emptyHint={
            domainId
              ? 'Click a leaf for happy / alt / error TC ideas and linked GC-TC-* ids.'
              : 'Click a domain node, then Open detail (or double-click) to drill down. Dashed lines hint Auth → Wallet → Fund → Vehicle → Claim.'
          }
        />
      </ReactFlowProvider>
    </div>
  )
}

function MindMapNotFound({ slug }: { slug: string }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-elevated)_92%,transparent)] px-4 py-3.5 sm:px-5">
        <div className="relative flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--amber)] uppercase">
              Gas Cash · Local QA
            </p>
            <h1 className="text-lg font-bold text-[var(--text)]">Mind map not found</h1>
          </div>
          <SiteNav />
          <div className="hidden sm:block sm:min-w-[10rem]" />
        </div>
      </header>
      <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="text-sm text-[var(--text-muted)]">
          No detail map for{' '}
          <span className="font-[family-name:var(--font-mono)] text-[var(--amber)]">{slug}</span>.
        </p>
        <Link to="/mindmap" className="text-sm text-[var(--amber)] hover:underline">
          ← Back to mind map hub
        </Link>
        <ul className="mt-4 grid grid-cols-2 gap-2 text-left font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)]">
          {(Object.keys(DOMAIN_LABELS) as DomainId[]).map((id) => (
            <li key={id}>
              <Link to={`/mindmap/${id}`} className="text-[var(--text-muted)] hover:text-[var(--amber)]">
                {DOMAIN_LABELS[id]}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

/** Hub at /mindmap */
export function MindMapPage() {
  return <MindMapShell mapId={hubMap.id} />
}

/** Detail at /mindmap/:domain */
export function MindMapDetailPage() {
  const { domain } = useParams()
  if (!domain || !isDomainId(domain)) {
    return <MindMapNotFound slug={domain ?? ''} />
  }
  return <MindMapShell domainId={domain} mapId={domain} />
}
