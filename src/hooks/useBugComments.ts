import { useCallback, useEffect, useState } from 'react'
import { addComment, fetchComments, type BugComment } from '../lib/bugLive'

export function useBugComments(bugId: string) {
  const [comments, setComments] = useState<BugComment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setComments(await fetchComments(bugId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments')
    } finally {
      setLoading(false)
    }
  }, [bugId])

  useEffect(() => {
    void reload()
  }, [reload])

  const post = useCallback(
    async (body: string, author?: string) => {
      setSaving(true)
      setError(null)
      try {
        const comment = await addComment(bugId, body, author)
        setComments((prev) => [...prev, comment])
        return comment
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add comment')
        throw err
      } finally {
        setSaving(false)
      }
    },
    [bugId],
  )

  return { comments, loading, error, saving, reload, post }
}
