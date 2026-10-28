import { useCallback, useEffect, useState } from 'react'
import {
  applyBugEdit,
  fetchAllBugEdits,
  saveBugEdit,
  type BugEditRow,
} from '../lib/bugEdits'
import type { Bug, BugEditableFields } from '../types/bug'

export function useBugEdits() {
  const [edits, setEdits] = useState<Record<string, BugEditRow>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setEdits(await fetchAllBugEdits())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bug edits')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const applyEdit = useCallback(async (bugId: string, fields: BugEditableFields) => {
    const row = await saveBugEdit(bugId, fields)
    setEdits((prev) => ({ ...prev, [bugId]: row }))
    return row
  }, [])

  const mergeBug = useCallback(
    (bug: Bug): Bug => applyBugEdit(bug, edits[bug.id]),
    [edits],
  )

  const mergeBugs = useCallback((bugs: Bug[]): Bug[] => bugs.map(mergeBug), [mergeBug])

  return { edits, loading, error, reload, applyEdit, mergeBug, mergeBugs }
}
