import type { Edge, Node } from '@xyflow/react'
import atm from '../../data/mindmaps/atm.json'
import auth from '../../data/mindmaps/auth.json'
import claim from '../../data/mindmaps/claim.json'
import chopshop from '../../data/mindmaps/chopshop.json'
import comingSoon from '../../data/mindmaps/coming-soon.json'
import fund from '../../data/mindmaps/fund.json'
import garage from '../../data/mindmaps/garage.json'
import hub from '../../data/mindmaps/hub.json'
import minimart from '../../data/mindmaps/minimart.json'
import proof from '../../data/mindmaps/proof.json'
import social from '../../data/mindmaps/social.json'
import vehicle from '../../data/mindmaps/vehicle.json'
import wallet from '../../data/mindmaps/wallet.json'
import type { MindMapJson, MindMapNodeData } from '../types/mindmap'
import { getTestCaseById, testCaseSuite } from './testCases'

export const DOMAIN_MAPS = {
  auth: auth as MindMapJson,
  wallet: wallet as MindMapJson,
  fund: fund as MindMapJson,
  vehicle: vehicle as MindMapJson,
  claim: claim as MindMapJson,
  garage: garage as MindMapJson,
  minimart: minimart as MindMapJson,
  chopshop: chopshop as MindMapJson,
  atm: atm as MindMapJson,
  social: social as MindMapJson,
  proof: proof as MindMapJson,
  'coming-soon': comingSoon as MindMapJson,
} as const satisfies Record<string, MindMapJson>

export type DomainId = keyof typeof DOMAIN_MAPS

export const DOMAIN_ORDER: DomainId[] = [
  'auth',
  'wallet',
  'fund',
  'vehicle',
  'claim',
  'garage',
  'minimart',
  'chopshop',
  'atm',
  'social',
  'proof',
  'coming-soon',
]

export const hubMap = hub as MindMapJson

export function isDomainId(id: string): id is DomainId {
  return id in DOMAIN_MAPS
}

export function getMindMap(id: string): MindMapJson | undefined {
  if (id === 'hub') return hubMap
  if (isDomainId(id)) return DOMAIN_MAPS[id]
  return undefined
}

/** Best-effort domain route for a TC mindmapNode id (for spreadsheet links). */
export function domainForMindmapNode(mindmapNode: string): DomainId | null {
  const mn = mindmapNode.trim()
  if (!mn) return null
  if (mn === 'chop' || mn.startsWith('chop-')) return 'chopshop'
  if (mn === 'minimart-soon' || mn === 'proof-dealership') return 'coming-soon'
  if (mn === 'gas' || mn.startsWith('gas-') || mn === 'rewards') return 'wallet'
  // Longer domain ids first (coming-soon before claim/coming collisions)
  const ordered = [...DOMAIN_ORDER].sort((a, b) => b.length - a.length)
  for (const id of ordered) {
    if (mn === id || mn.startsWith(`${id}-`)) return id
  }
  for (const id of DOMAIN_ORDER) {
    const map = DOMAIN_MAPS[id]
    if (map.nodes.some((n) => n.id === mn)) return id
  }
  return null
}

/** Count suite TCs that map to this domain (exact, prefix, or listed on domain nodes). */
export function countLinkedTcsForDomain(domainId: string): number {
  const map = getMindMap(domainId)
  const nodeIds = new Set(map?.nodes.map((n) => n.id) ?? [])
  const explicit = new Set<string>()
  for (const n of map?.nodes ?? []) {
    for (const id of n.tcIds ?? []) explicit.add(id)
  }

  const matched = new Set<string>()
  for (const tc of testCaseSuite.testCases) {
    if (explicit.has(tc.id)) {
      matched.add(tc.id)
      continue
    }
    const mn = tc.mindmapNode
    if (
      mn === domainId ||
      mn.startsWith(`${domainId}-`) ||
      nodeIds.has(mn) ||
      // legacy hub ids that live under renamed domains
      (domainId === 'chopshop' && (mn === 'chop' || mn.startsWith('chop-'))) ||
      (domainId === 'coming-soon' && (mn === 'minimart-soon' || mn === 'proof-dealership'))
    ) {
      matched.add(tc.id)
    }
  }
  return matched.size
}

export function resolveTcSummaries(tcIds: string[]) {
  return tcIds
    .map((id) => {
      const tc = getTestCaseById(id)
      if (!tc) return { id, title: '(missing from suite)', type: undefined as string | undefined }
      return { id: tc.id, title: tc.title, type: tc.type, result: tc.result }
    })
    .filter(Boolean)
}

export function toFlowNodes(map: MindMapJson, opts?: { withTcCounts?: boolean }): Node<MindMapNodeData>[] {
  return map.nodes.map((n) => {
    const data: MindMapNodeData = {
      label: n.label,
      kind: n.kind,
      tags: n.tags,
      tcTypes: n.tcTypes ?? [],
      summary: n.summary,
      detail: n.detail,
      tcIdeas: n.tcIdeas ?? [],
      tcIds: n.tcIds ?? [],
      href: n.href,
      envHint: n.envHint,
    }
    if (opts?.withTcCounts && (n.kind === 'domain' || n.href)) {
      const domainKey = n.href?.replace(/^\/mindmap\//, '') ?? n.id
      data.linkedTcCount = countLinkedTcsForDomain(domainKey)
    }
    return {
      id: n.id,
      type: 'gasNode',
      position: n.position,
      data,
    }
  })
}

export function toFlowEdges(map: MindMapJson): Edge[] {
  return map.edges.map((e) => {
    if (e.kind === 'journey') {
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'smoothstep',
        style: { strokeDasharray: '6 4', stroke: 'var(--text-dim)', opacity: 0.45 },
      }
    }
    return {
      id: e.id,
      source: e.source,
      target: e.target,
    }
  })
}

export const DOMAIN_LABELS: Record<DomainId, string> = {
  auth: 'Auth',
  wallet: 'Wallet',
  fund: 'Fund / Buy $GAS',
  vehicle: 'Vehicle',
  claim: 'Map / Claim',
  garage: 'Garage',
  minimart: 'Mini Mart',
  chopshop: 'Chop Shop',
  atm: 'ATM',
  social: 'Social',
  proof: 'Proof',
  'coming-soon': 'Coming soon',
}
