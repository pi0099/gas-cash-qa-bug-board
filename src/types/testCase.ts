export type TestCaseType = 'Functional' | 'Validation' | 'Security'
export type TestCasePriority = 'P1' | 'P2' | 'P3'
export type TestCaseResult = 'Pass' | 'Fail' | 'Blocked' | 'Skip'

export interface TestCase {
  id: string
  type: TestCaseType
  mindmapNode: string
  priority: TestCasePriority
  title: string
  preconditions: string[]
  steps: string[]
  expected: string
  automatable: boolean
  result: TestCaseResult | null
  bugIds: string[]
  notes: string
  evidence: string[]
}

export interface TestCaseSuite {
  version: number
  updatedAt: string
  source: string
  execution: {
    date: string
    env: string
    sessionValid: boolean | null
    sessionValidDuringRun?: boolean
    sessionNote?: string
    summary: {
      pass: number
      fail: number
      blocked: number
      skip: number
      total: number
    }
  }
  testCases: TestCase[]
}
