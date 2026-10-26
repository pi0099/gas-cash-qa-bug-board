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
import type { MindMapJson, MindMapNodeData, TcCoverageStatus } from '../types/mindmap'
import type { TestCaseResult } from '../types/testCase'
import { getTestCaseById, testCaseSuite } from './testCases'

/** Stroke / border colors for TC coverage (readable when zoomed). */
export const COVERAGE_STROKE: Record<TcCoverageStatus, string> = {
  pass: '#3d9a6a',
  issue: '#ffb020',
  designed: '#6b7cff',
  none: '#5c6d82',
}

export const COVERAGE_LEGEND: { status: TcCoverageStatus; label: string; color: string }[] = [
  { status: 'pass', label: 'TCs all Pass', color: COVERAGE_STROKE.pass },
  { status: 'issue', label: 'TCs mixed / Fail / Blocked', color: COVERAGE_STROKE.issue },
  { status: 'designed', label: 'TCs designed, not executed', color: COVERAGE_STROKE.designed },
  { status: 'none', label: 'No TC coverage', color: COVERAGE_STROKE.none },
]

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

function tcMatchesDomain(tcMindmapNode: string, domainId: string, nodeIds: Set<string>): boolean {
  const mn = tcMindmapNode
  return (
    mn === domainId ||
    mn.startsWith(`${domainId}-`) ||
    nodeIds.has(mn) ||
    (domainId === 'chopshop' && (mn === 'chop' || mn.startsWith('chop-'))) ||
    (domainId === 'coming-soon' && (mn === 'minimart-soon' || mn === 'proof-dealership'))
  )
}

/** Suite-backed GC-TC-* ids for a domain (ignores tcIdeas-only). */
export function linkedTcIdsForDomain(domainId: string): string[] {
  const map = getMindMap(domainId)
  const nodeIds = new Set(map?.nodes.map((n) => n.id) ?? [])
  const explicit = new Set<string>()
  for (const n of map?.nodes ?? []) {
    for (const id of n.tcIds ?? []) explicit.add(id)
  }

  const matched = new Set<string>()
  for (const tc of testCaseSuite.testCases) {
    if (explicit.has(tc.id) || tcMatchesDomain(tc.mindmapNode, domainId, nodeIds)) {
      matched.add(tc.id)
    }
  }
  return [...matched].sort()
}

/** Count suite TCs that map to this domain (exact, prefix, or listed on domain nodes). */
export function countLinkedTcsForDomain(domainId: string): number {
  return linkedTcIdsForDomain(domainId).length
}

/**
 * Linked GC-TC-* for a mind-map node.
 * Explicit `tcIds` + suite rows whose `mindmapNode` equals this node id.
 * Domain hub nodes aggregate the whole domain. tcIdeas alone → empty (no coverage).
 */
export function linkedTcIdsForNode(map: MindMapJson, nodeId: string): string[] {
  const node = map.nodes.find((n) => n.id === nodeId)
  if (!node) return []

  if (map.id === 'hub' && (node.kind === 'domain' || node.href)) {
    const domainKey = node.href?.replace(/^\/mindmap\//, '') ?? node.id
    if (isDomainId(domainKey)) return linkedTcIdsForDomain(domainKey)
  }

  const ids = new Set<string>(node.tcIds ?? [])
  for (const tc of testCaseSuite.testCases) {
    if (tc.mindmapNode === nodeId) ids.add(tc.id)
  }
  return [...ids].sort()
}

export function coverageFromResults(results: Array<TestCaseResult | null | undefined>): TcCoverageStatus {
  if (results.length === 0) return 'none'

  const executedFail = results.some((r) => r === 'Fail' || r === 'Blocked')
  const allPass = results.every((r) => r === 'Pass')
  const noneExecuted = results.every((r) => r == null || r === 'Skip')

  if (allPass) return 'pass'
  if (executedFail) return 'issue'
  if (noneExecuted) return 'designed'
  // Mix of Pass + unexecuted (or other) → treat as mixed
  return 'issue'
}

export function coverageForTcIds(tcIds: string[]): TcCoverageStatus {
  if (tcIds.length === 0) return 'none'
  const results = tcIds.map((id) => getTestCaseById(id)?.result ?? null)
  return coverageFromResults(results)
}

export function coverageForNode(map: MindMapJson, nodeId: string): TcCoverageStatus {
  return coverageForTcIds(linkedTcIdsForNode(map, nodeId))
}

/** Worst coverage wins (for edge = source∪target). */
export function mergeCoverage(a: TcCoverageStatus, b: TcCoverageStatus): TcCoverageStatus {
  const rank: Record<TcCoverageStatus, number> = {
    issue: 0,
    designed: 1,
    pass: 2,
    none: 3,
  }
  return rank[a] <= rank[b] ? a : b
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
    const linkedIds = linkedTcIdsForNode(map, n.id)
    const coverage = coverageForTcIds(linkedIds)
    const data: MindMapNodeData = {
      label: n.label,
      kind: n.kind,
      tags: n.tags,
      tcTypes: n.tcTypes ?? [],
      summary: n.summary,
      detail: n.detail,
      tcIdeas: n.tcIdeas ?? [],
      // Prefer resolved suite links so the side panel matches coverage coloring
      tcIds: linkedIds.length ? linkedIds : (n.tcIds ?? []),
      href: n.href,
      envHint: n.envHint,
      coverage,
    }
    if (opts?.withTcCounts && (n.kind === 'domain' || n.href)) {
      const domainKey = n.href?.replace(/^\/mindmap\//, '') ?? n.id
      data.linkedTcCount = countLinkedTcsForDomain(domainKey)
    } else if (linkedIds.length > 0 && n.kind !== 'center') {
      data.linkedTcCount = linkedIds.length
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
  const nodeCoverage = new Map<string, TcCoverageStatus>()
  for (const n of map.nodes) {
    nodeCoverage.set(n.id, coverageForNode(map, n.id))
  }

  return map.edges.map((e) => {
    // Color the flow by the step being entered (target), blending source if both have coverage
    const src = nodeCoverage.get(e.source) ?? 'none'
    const tgt = nodeCoverage.get(e.target) ?? 'none'
    const status =
      tgt !== 'none' ? (src !== 'none' ? mergeCoverage(src, tgt) : tgt) : src !== 'none' ? src : 'none'
    const stroke = COVERAGE_STROKE[status]
    const strokeWidth = status === 'none' ? 1.5 : 2.75
    const isJourney = e.kind === 'journey'

    return {
      id: e.id,
      source: e.source,
      target: e.target,
      type: isJourney ? 'smoothstep' : 'default',
      style: {
        stroke,
        strokeWidth,
        ...(isJourney
          ? { strokeDasharray: '7 5', opacity: status === 'none' ? 0.45 : 0.9 }
          : { opacity: status === 'none' ? 0.55 : 0.95 }),
      },
      data: { coverage: status },
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
