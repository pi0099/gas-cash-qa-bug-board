import { ExternalLink, ImageOff, Pencil } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { publicUrl } from '../lib/publicUrl'
import type { Bug, BugEditableFields, BugStatus } from '../types/bug'
import { BugEditForm } from './BugEditForm'
import { BugLivePanel } from './BugLivePanel'
import { PriorityChip } from './PriorityChip'
import { RetestChip } from './RetestChip'
import { StatusChip } from './StatusChip'

function BulletList({ items }: { items: string[] }) {
  if (!items.length) {
    return <p className="text-sm text-[var(--text-dim)]">—</p>
  }
  return (
    <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--text-muted)]">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[var(--text-muted)]">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ol>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-[var(--border)] pt-5">
      <h3 className="mb-3 font-[family-name:var(--font-mono)] text-[11px] font-semibold tracking-[0.16em] text-[var(--amber)] uppercase">
        {title}
      </h3>
      {children}
    </section>
  )
}

function EvidenceImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)
  const href = publicUrl(src)

  if (failed) {
    return (
      <div className="flex aspect-video items-center justify-center gap-2 rounded border border-dashed border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-dim)]">
        <ImageOff className="size-4" aria-hidden />
        Missing: {src}
      </div>
    )
  }

  return (
    <figure className="overflow-hidden rounded border border-[var(--border)] bg-[var(--bg)]">
      <a href={href} target="_blank" rel="noreferrer" className="block">
        <img
          src={href}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="max-h-[min(70vh,720px)] w-full object-contain object-top bg-[#0a0e12]"
        />
      </a>
      <figcaption className="border-t border-[var(--border)] px-3 py-2 text-xs text-[var(--text-muted)]">
        {alt}{' '}
        <span className="font-[family-name:var(--font-mono)] text-[var(--text-dim)]">({src})</span>
      </figcaption>
    </figure>
  )
}

export function BugDetail({
  bug,
  onStatusChange,
  onSaveEdit,
}: {
  bug: Bug
  onStatusChange?: (status: BugStatus) => Promise<void>
  onSaveEdit?: (fields: BugEditableFields) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)

  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <PriorityChip priority={bug.priority} />
          <StatusChip status={bug.status} />
          {bug.lastRetestResult ? <RetestChip result={bug.lastRetestResult} /> : null}
          <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--text-dim)]">
            {bug.id}
          </span>
          {onSaveEdit && !editing ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="ml-auto inline-flex items-center gap-1.5 rounded border border-[var(--border)] bg-[var(--bg-panel)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)] hover:border-[var(--amber-dim)] hover:text-[var(--amber)]"
            >
              <Pencil className="size-3" aria-hidden />
              Edit
            </button>
          ) : null}
        </div>
        <h1 className="text-xl leading-snug font-semibold text-[var(--text)] sm:text-2xl">
          {bug.title}
        </h1>
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">{bug.description}</p>
        {bug.lastRetestResult ? (
          <div className="rounded border border-[var(--border)] bg-[var(--bg-panel)] px-3 py-2.5 text-sm leading-relaxed text-[var(--text-muted)]">
            <p className="mb-1 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-[var(--amber)] uppercase">
              Latest retest
            </p>
            <p>
              <span className="font-[family-name:var(--font-mono)] text-[var(--text)]">
                {bug.lastRetestResult}
              </span>
              {bug.lastRetestAt ? (
                <span className="font-[family-name:var(--font-mono)] text-[var(--text-dim)]">
                  {' '}
                  · {bug.lastRetestAt} (Asia/Saigon)
                </span>
              ) : null}
            </p>
            {bug.lastRetestNote ? <p className="mt-1">{bug.lastRetestNote}</p> : null}
          </div>
        ) : null}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-dim)]">
          <span>Created {bug.createdAt}</span>
          <span>Updated {bug.updatedAt}</span>
          <a
            href={bug.env}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[var(--blue)] hover:underline"
          >
            {bug.env}
            <ExternalLink className="size-3" aria-hidden />
          </a>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {bug.tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-[var(--border)] bg-[var(--bg-panel)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {editing && onSaveEdit ? (
        <BugEditForm
          bug={bug}
          onCancel={() => setEditing(false)}
          onSave={async (fields) => {
            await onSaveEdit(fields)
            setEditing(false)
          }}
        />
      ) : null}

      {!editing && onStatusChange ? (
        <BugLivePanel bugId={bug.id} status={bug.status} onStatusChange={onStatusChange} />
      ) : null}

      <Section title="Test data">
        <BulletList items={bug.testData} />
      </Section>

      <Section title="Precondition">
        <BulletList items={bug.precondition} />
      </Section>

      <Section title="Steps to reproduce">
        <NumberedList items={bug.steps} />
      </Section>

      <Section title="Actual result">
        <p className="rounded border border-[color-mix(in_srgb,var(--red)_40%,var(--border))] bg-[color-mix(in_srgb,var(--red)_10%,transparent)] px-3 py-2.5 text-sm leading-relaxed text-[#ffc9c9]">
          {bug.actual}
        </p>
      </Section>

      <Section title="Expected result">
        <p className="rounded border border-[color-mix(in_srgb,var(--green)_35%,var(--border))] bg-[color-mix(in_srgb,var(--green)_10%,transparent)] px-3 py-2.5 text-sm leading-relaxed text-[#b8e6cc]">
          {bug.expected}
        </p>
      </Section>

      {bug.apiNotes && bug.apiNotes.length > 0 && (
        <Section title="API notes">
          <ul className="space-y-1 font-[family-name:var(--font-mono)] text-xs leading-relaxed text-[var(--text-muted)]">
            {bug.apiNotes.map((n) => (
              <li key={n} className="border-l-2 border-[var(--border-strong)] pl-3">
                {n}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Evidence">
        {bug.evidence.length === 0 ? (
          <p className="text-sm text-[var(--text-dim)]">No screenshots attached.</p>
        ) : (
          <div className="space-y-4">
            {bug.evidence.map((img) => (
              <EvidenceImage key={img.src} src={img.src} alt={img.alt} />
            ))}
          </div>
        )}
      </Section>
    </article>
  )
}

export function BugDetailEmpty() {
  return (
    <div className="flex h-full min-h-[40vh] flex-col items-center justify-center gap-2 px-6 text-center">
      <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-[var(--amber)] uppercase">
        Gas Cash QA
      </p>
      <h2 className="text-lg font-semibold text-[var(--text)]">Select a bug</h2>
      <p className="max-w-sm text-sm text-[var(--text-muted)]">
        Local triage board — STSS sections and evidence live in{' '}
        <code className="font-[family-name:var(--font-mono)] text-[var(--amber)]">data/bugs.json</code>.
        Not connected to Linear. Use <strong>Edit</strong> on a bug to change title / STSS / priority /
        status (Supabase when wired).
      </p>
    </div>
  )
}
