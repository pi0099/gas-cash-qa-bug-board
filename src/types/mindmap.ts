export type EvidenceTag = 'Documented' | 'Observed' | 'Coming soon'

/** Optional TC-design tags on a node */
export type TcTypeTag = 'F' | 'V' | 'S'

export type MindMapNodeKind = 'center' | 'branch' | 'leaf' | 'domain'

export type MindMapNodeJson = {
  id: string
  label: string
  kind: MindMapNodeKind
  position: { x: number; y: number }
  tags: EvidenceTag[]
  /** Functional / Validation / Security hints for TC design */
  tcTypes?: TcTypeTag[]
  summary: string
  detail?: string
  /** Short suggested cases when no GC-TC-* exists yet */
  tcIdeas?: string[]
  /** Linked cases from data/test-cases.json */
  tcIds?: string[]
  /** Hub only: navigate to detail map */
  href?: string
  /** Lab vs field note (claim flows) */
  envHint?: 'lab' | 'field' | 'lab+field'
}

export type MindMapEdgeJson = {
  id: string
  source: string
  target: string
  /** tree = solid hierarchy; journey = dashed progression */
  kind?: 'tree' | 'journey'
}

export type MindMapJson = {
  id: string
  title: string
  summary: string
  tags: EvidenceTag[]
  nodes: MindMapNodeJson[]
  edges: MindMapEdgeJson[]
}

/** Derived from linked GC-TC-* + execution results (not from tcIdeas alone). */
export type TcCoverageStatus = 'pass' | 'issue' | 'designed' | 'none'

export type MindMapNodeData = {
  label: string
  kind: MindMapNodeKind
  tags: EvidenceTag[]
  tcTypes: TcTypeTag[]
  summary: string
  detail?: string
  tcIdeas: string[]
  tcIds: string[]
  href?: string
  envHint?: 'lab' | 'field' | 'lab+field'
  /** Resolved linked TC count (hub domains) */
  linkedTcCount?: number
  /** Suite-backed coverage for borders / edges */
  coverage?: TcCoverageStatus
}
