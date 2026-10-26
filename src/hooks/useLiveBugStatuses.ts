import { useCallback, useEffect, useState } from 'react'
import { fetchAllLiveStatuses, setLiveStatus, type BugStatusRow } from '../lib/bugLive'
import type { Bug, BugStatus } from '../types/bug'

export function useLiveBugStatuses() {
  const [overrides, setOverrides] = useState<Record<string, BugStatusRow>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const map = await fetchAllLiveStatuses()
      setOverrides(map)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load live statuses')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const applyStatus = useCallback(async (bugId: string, status: BugStatus) => {
    const row = await setLiveStatus(bugId, status)
    setOverrides((prev) => ({ ...prev, [bugId]: row }))
    return row
  }, [])

  const mergeBug = useCallback(
    (bug: Bug): Bug => {
      const live = overrides[bug.id]
      if (!live) return bug
      return { ...bug, status: live.status, updatedAt: live.updatedAt.slice(0, 10) }
    },
    [overrides],
  )

  const mergeBugs = useCallback((bugs: Bug[]): Bug[] => bugs.map(mergeBug), [mergeBug])

  return { overrides, loading, error, reload, applyStatus, mergeBug, mergeBugs }
}
