import suite from '../../data/test-cases.json'
import type {
  TestCase,
  TestCasePriority,
  TestCaseResult,
  TestCaseSuite,
  TestCaseType,
} from '../types/testCase'

export const testCaseSuite = suite as TestCaseSuite

export function getTestCaseById(id: string): TestCase | undefined {
  return testCaseSuite.testCases.find((t) => t.id === id)
}

export function priorityRank(p: TestCasePriority): number {
  switch (p) {
    case 'P1':
      return 1
    case 'P2':
      return 2
    case 'P3':
      return 3
    default:
      return 9
  }
}

export function sortTestCases(cases: TestCase[]): TestCase[] {
  return [...cases].sort((a, b) => {
    const pr = priorityRank(a.priority) - priorityRank(b.priority)
    if (pr !== 0) return pr
    return a.id.localeCompare(b.id)
  })
}

export function filterTestCases(
  cases: TestCase[],
  opts: {
    type?: TestCaseType | 'all'
    result?: TestCaseResult | 'all'
    priority?: TestCasePriority | 'all'
    q?: string
  },
): TestCase[] {
  const q = opts.q?.trim().toLowerCase() ?? ''
  return sortTestCases(
    cases.filter((t) => {
      if (opts.type && opts.type !== 'all' && t.type !== opts.type) return false
      if (opts.result && opts.result !== 'all' && t.result !== opts.result) return false
      if (opts.priority && opts.priority !== 'all' && t.priority !== opts.priority) return false
      if (!q) return true
      const hay = [t.id, t.title, t.mindmapNode, t.expected, t.notes, ...(t.bugIds ?? [])]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    }),
  )
}

export const ALL_TC_TYPES: TestCaseType[] = ['Functional', 'Validation', 'Security']
export const ALL_TC_RESULTS: TestCaseResult[] = ['Pass', 'Fail', 'Blocked', 'Skip']
export const ALL_TC_PRIORITIES: TestCasePriority[] = ['P1', 'P2', 'P3']
