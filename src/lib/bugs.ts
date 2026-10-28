import board from '../../data/bugs.json'
import type { Bug, BugBoardData, BugPriority, BugStatus } from '../types/bug'

export const bugBoard = board as BugBoardData

export function getBugById(id: string): Bug | undefined {
  return bugBoard.bugs.find((b) => b.id === id)
}

/** Fold accents so "hoc mon" matches "Hóc Môn". */
export function foldSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
}

export function priorityRank(p: BugPriority | string): number {
  switch (p) {
    case 'P0':
      return 0
    case 'P1':
    case 'High':
      return 1
    case 'P2':
    case 'Medium':
      return 2
    case 'P3':
    case 'Low':
      return 3
    default:
      return 9
  }
}

export type BugSortMode = 'priority' | 'newest'

export function sortBugs(bugs: Bug[], mode: BugSortMode = 'priority'): Bug[] {
  return [...bugs].sort((a, b) => {
    if (mode === 'newest') {
      const byDate = b.updatedAt.localeCompare(a.updatedAt) || b.createdAt.localeCompare(a.createdAt)
      if (byDate !== 0) return byDate
      return a.title.localeCompare(b.title)
    }
    const pr = priorityRank(a.priority) - priorityRank(b.priority)
    if (pr !== 0) return pr
    const byDate = b.updatedAt.localeCompare(a.updatedAt) || b.createdAt.localeCompare(a.createdAt)
    if (byDate !== 0) return byDate
    return a.title.localeCompare(b.title)
  })
}

export function filterBugs(
  bugs: Bug[],
  opts: {
    priority?: BugPriority | 'all'
    status?: BugStatus | 'all'
    q?: string
    sort?: BugSortMode
  },
): Bug[] {
  const q = foldSearchText(opts.q?.trim() ?? '')
  return sortBugs(
    bugs.filter((b) => {
      if (opts.priority && opts.priority !== 'all' && b.priority !== opts.priority) return false
      if (opts.status && opts.status !== 'all' && b.status !== opts.status) return false
      if (!q) return true
      const hay = foldSearchText(
        [b.title, b.description, b.id, ...b.tags, b.actual, b.expected].join(' '),
      )
      return hay.includes(q)
    }),
    opts.sort ?? 'priority',
  )
}

export const ALL_PRIORITIES: BugPriority[] = ['P0', 'P1', 'High', 'P2', 'Medium', 'P3', 'Low']
export const ALL_STATUSES: BugStatus[] = [
  'Triage',
  'Open',
  'In Progress',
  'Blocked',
  'Resolved',
  'Closed',
]
