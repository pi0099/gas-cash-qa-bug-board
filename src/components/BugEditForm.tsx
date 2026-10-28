import { useState, type FormEvent } from 'react'
import { ALL_PRIORITIES, ALL_STATUSES } from '../lib/bugs'
import { liveBackendLabel } from '../lib/supabase'
import type { Bug, BugEditableFields, BugPriority, BugStatus } from '../types/bug'
import { editableFromBug } from '../lib/bugEdits'

function linesToText(items: string[]): string {
  return items.join('\n')
}

function textToLines(value: string): string[] {
  return value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

interface Props {
  bug: Bug
  onSave: (fields: BugEditableFields) => Promise<void>
  onCancel: () => void
}

export function BugEditForm({ bug, onSave, onCancel }: Props) {
  const seed = editableFromBug(bug)
  const [title, setTitle] = useState(seed.title)
  const [description, setDescription] = useState(seed.description)
  const [testData, setTestData] = useState(linesToText(seed.testData))
  const [precondition, setPrecondition] = useState(linesToText(seed.precondition))
  const [steps, setSteps] = useState(linesToText(seed.steps))
  const [actual, setActual] = useState(seed.actual)
  const [expected, setExpected] = useState(seed.expected)
  const [apiNotes, setApiNotes] = useState(linesToText(seed.apiNotes ?? []))
  const [priority, setPriority] = useState<BugPriority>(seed.priority)
  const [status, setStatus] = useState<BugStatus>(seed.status)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await onSave({
        title,
        description,
        testData: textToLines(testData),
        precondition: textToLines(precondition),
        steps: textToLines(steps),
        actual,
        expected,
        apiNotes: textToLines(apiNotes),
        priority,
        status,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  const fieldClass =
    'rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-dim)] focus:border-[var(--amber-dim)]'
  const labelClass =
    'font-[family-name:var(--font-mono)] text-[10px] tracking-[0.12em] text-[var(--text-dim)] uppercase'

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="space-y-4 rounded border border-[var(--border)] bg-[var(--bg-panel)] p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-[family-name:var(--font-mono)] text-[11px] font-semibold tracking-[0.16em] text-[var(--amber)] uppercase">
            Edit bug
          </h3>
          <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-dim)]">
            {liveBackendLabel()} · no auth · {bug.id}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-muted)] hover:bg-[var(--bg)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || !title.trim()}
            className="rounded border border-[var(--amber-dim)] bg-[color-mix(in_srgb,var(--amber)_22%,transparent)] px-3 py-1.5 text-sm font-medium text-[var(--amber)] hover:bg-[color-mix(in_srgb,var(--amber)_32%,transparent)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Title</span>
        <input
          className={fieldClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Priority</span>
          <select
            className={fieldClass}
            value={priority}
            onChange={(e) => setPriority(e.target.value as BugPriority)}
          >
            {ALL_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p === 'P0' ? 'P0 / Urgent' : p}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Status</span>
          <select
            className={fieldClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as BugStatus)}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Description</span>
        <textarea
          className={`${fieldClass} min-h-[5rem] resize-y`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Test data (one line each)</span>
        <textarea
          className={`${fieldClass} min-h-[6rem] resize-y font-[family-name:var(--font-mono)] text-xs`}
          value={testData}
          onChange={(e) => setTestData(e.target.value)}
          rows={5}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Precondition (one line each)</span>
        <textarea
          className={`${fieldClass} min-h-[5rem] resize-y`}
          value={precondition}
          onChange={(e) => setPrecondition(e.target.value)}
          rows={4}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Steps (one line each)</span>
        <textarea
          className={`${fieldClass} min-h-[6rem] resize-y`}
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          rows={5}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Actual result</span>
        <textarea
          className={`${fieldClass} min-h-[4rem] resize-y`}
          value={actual}
          onChange={(e) => setActual(e.target.value)}
          rows={3}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Expected result</span>
        <textarea
          className={`${fieldClass} min-h-[4rem] resize-y`}
          value={expected}
          onChange={(e) => setExpected(e.target.value)}
          rows={3}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>API notes (one line each, optional)</span>
        <textarea
          className={`${fieldClass} min-h-[3rem] resize-y font-[family-name:var(--font-mono)] text-xs`}
          value={apiNotes}
          onChange={(e) => setApiNotes(e.target.value)}
          rows={3}
        />
      </label>

      {error ? (
        <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--red)]">{error}</p>
      ) : null}
    </form>
  )
}
