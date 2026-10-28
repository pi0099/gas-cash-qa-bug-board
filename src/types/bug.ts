export type BugPriority = 'P0' | 'P1' | 'High' | 'P2' | 'Medium' | 'P3' | 'Low'
export type BugStatus = 'Triage' | 'Open' | 'In Progress' | 'Blocked' | 'Resolved' | 'Closed'
export type RetestResult = 'Still valid' | 'Fixed' | 'Partial' | 'Blocked'

export interface EvidenceImage {
  src: string
  alt: string
}

export interface BugRetest {
  at: string
  result: RetestResult
  note: string
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
  /** Latest production retest (Asia/Saigon timestamps preferred). */
  lastRetestAt?: string
  lastRetestResult?: RetestResult
  lastRetestNote?: string
  retest?: BugRetest
}

/** Editable STSS + triage fields (disk seed + live overrides). */
export type BugEditableFields = Pick<
  Bug,
  | 'title'
  | 'description'
  | 'testData'
  | 'precondition'
  | 'steps'
  | 'actual'
  | 'expected'
  | 'apiNotes'
  | 'priority'
  | 'status'
>

export interface BugBoardData {
  version: number
  updatedAt: string
  source: string
  bugs: Bug[]
}
