export type BugPriority = 'P0' | 'High' | 'Medium' | 'Low'
export type BugStatus = 'Triage' | 'Open' | 'In Progress' | 'Blocked' | 'Resolved' | 'Closed'

export interface EvidenceImage {
  src: string
  alt: string
}

export interface Bug {
  id: string
  title: string
  priority: BugPriority
  status: BugStatus
  tags: string[]
  createdAt: string
  updatedAt: string
  env: string
  description: string
  testData: string[]
  precondition: string[]
  steps: string[]
  actual: string
  expected: string
  evidence: EvidenceImage[]
  apiNotes?: string[]
}

export interface BugBoardData {
  version: number
  updatedAt: string
  source: string
  bugs: Bug[]
}
