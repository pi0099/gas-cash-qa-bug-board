import { useState, type FormEvent } from 'react'
import { useBugComments } from '../hooks/useBugComments'
import { ALL_STATUSES } from '../lib/bugs'
import { liveBackendLabel } from '../lib/supabase'
import type { BugStatus } from '../types/bug'
import { StatusChip } from './StatusChip'

interface Props {
  bugId: string
  status: BugStatus
  onStatusChange: (status: BugStatus) => Promise<void>
}

export function BugLivePanel({ bugId, status, onStatusChange }: Props) {
  const { comments, loading, error, saving, post } = useBugComments(bugId)
  const [draft, setDraft] = useState('')
  const [author, setAuthor] = useState('')
  const [statusBusy, setStatusBusy] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  async function handleStatus(next: BugStatus) {
    if (next === status) return
    setStatusBusy(true)
    setLocalError(null)
    try {
      await onStatusChange(next)
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Status update failed')
    } finally {
      setStatusBusy(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!draft.trim()) return
    setLocalError(null)
    try {
      await post(draft, author || 'anon')
      setDraft('')
    } catch {
      /* error surfaced via hook */
    }
  }

  const showError = localError || error

  return (
    <section className="space-y-4 rounded border border-[var(--border)] bg-[var(--bg-panel)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-[family-name:var(--font-mono)] text-[11px] font-semibold tracking-[0.16em] text-[var(--amber)] uppercase">
            Live status
          </h3>
          <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-dim)]">
            {liveBackendLabel()} · no auth
          </p>
        </div>
        <StatusChip status={status} />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.12em] text-[var(--text-dim)] uppercase">
          Status
        </span>
        <select
          value={status}
          disabled={statusBusy}
          onChange={(e) => void handleStatus(e.target.value as BugStatus)}
          className="rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--amber-dim)] disabled:opacity-60"
        >
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <div className="border-t border-[var(--border)] pt-4">
        <h3 className="mb-3 font-[family-name:var(--font-mono)] text-[11px] font-semibold tracking-[0.16em] text-[var(--amber)] uppercase">
          Comments
        </h3>

        {loading ? (
          <p className="text-sm text-[var(--text-dim)]">Loading comments…</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-[var(--text-dim)]">No comments yet.</p>
        ) : (
          <ul className="mb-4 max-h-64 space-y-3 overflow-y-auto">
            {comments.map((c) => (
              <li
                key={c.id}
                className="rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5"
              >
                <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-dim)]">
                  <span className="text-[var(--amber)]">{c.author}</span>
                  <span>{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-muted)]">
                  {c.body}
                </p>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-2">
          <label className="flex flex-col gap-1">
            <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.12em] text-[var(--text-dim)] uppercase">
              Name (optional)
            </span>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="anon"
              maxLength={80}
              className="rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-dim)] focus:border-[var(--amber-dim)]"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.12em] text-[var(--text-dim)] uppercase">
              Add comment
            </span>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              placeholder="Update, note, or triage comment…"
              className="resize-y rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-dim)] focus:border-[var(--amber-dim)]"
            />
          </label>
          <button
            type="submit"
            disabled={saving || !draft.trim()}
            className="rounded border border-[var(--amber-dim)] bg-[color-mix(in_srgb,var(--amber)_22%,transparent)] px-3 py-2 text-sm font-medium text-[var(--amber)] transition-colors hover:bg-[color-mix(in_srgb,var(--amber)_32%,transparent)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Posting…' : 'Add comment'}
          </button>
        </form>
      </div>

      {showError ? (
        <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--red)]">{showError}</p>
      ) : null}
    </section>
  )
}
