import board from '../../data/bugs.json'
import type { Bug, BugBoardData, BugPriority, BugStatus } from '../types/bug'

export const bugBoard = board as BugBoardData

export function getBugById(id: string): Bug | undefined {
  return bugBoard.bugs.find((b) => b.id === id)
}

export function priorityRank(p: BugPriority): number {
  switch (p) {
    case 'P0':
      return 0
    case 'High':
      return 1
    case 'Medium':
      return 2
    case 'Low':
      return 3
    default:
      return 9
  }
}

export function sortBugs(bugs: Bug[]): Bug[] {
  return [...bugs].sort((a, b) => {
    const pr = priorityRank(a.priority) - priorityRank(b.priority)
    if (pr !== 0) return pr
    return a.title.localeCompare(b.title)
  })
}

export function filterBugs(
  bugs: Bug[],
  opts: { priority?: BugPriority | 'all'; status?: BugStatus | 'all'; q?: string },
): Bug[] {
  const q = opts.q?.trim().toLowerCase() ?? ''
  return sortBugs(
    bugs.filter((b) => {
      if (opts.priority && opts.priority !== 'all' && b.priority !== opts.priority) return false
      if (opts.status && opts.status !== 'all' && b.status !== opts.status) return false
      if (!q) return true
      const hay = [b.title, b.description, b.id, ...b.tags, b.actual, b.expected]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    }),
  )
}

export const ALL_PRIORITIES: BugPriority[] = ['P0', 'High', 'Medium', 'Low']
export const ALL_STATUSES: BugStatus[] = [
  'Triage',
  'Open',
  'In Progress',
  'Blocked',
  'Resolved',
  'Closed',
]
