import type { Bug, BugEditableFields, BugPriority, BugStatus } from '../types/bug'
import { getSupabase, supabaseConfigured } from './supabase'

const EDITS_KEY = 'gc-qa-bug-edits-v1'
/** Sentinel author for edit payloads stored in bug_comments when bug_edits table is absent. */
export const EDIT_COMMENT_AUTHOR = '__edit__'

export type BugEditRow = BugEditableFields & {
  bugId: string
  updatedAt: string
}

type EditsMap = Record<string, BugEditRow>

function nowIso(): string {
  return new Date().toISOString()
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((v) => String(v))
}

function normalizeEdit(bugId: string, fields: BugEditableFields, updatedAt: string): BugEditRow {
  return {
    bugId,
    title: fields.title,
    description: fields.description,
    testData: [...fields.testData],
    precondition: [...fields.precondition],
    steps: [...fields.steps],
    actual: fields.actual,
    expected: fields.expected,
    apiNotes: fields.apiNotes ? [...fields.apiNotes] : undefined,
    priority: fields.priority,
    status: fields.status,
    updatedAt,
  }
}

function lsGetEdits(): EditsMap {
  return readJson<EditsMap>(EDITS_KEY, {})
}

function lsSaveEdit(bugId: string, fields: BugEditableFields): BugEditRow {
  const map = lsGetEdits()
  const row = normalizeEdit(bugId, fields, nowIso())
  map[bugId] = row
  writeJson(EDITS_KEY, map)
  return row
}

function rowFromDb(row: Record<string, unknown>): BugEditRow {
  const apiNotes = row.api_notes
  return {
    bugId: String(row.bug_id),
    title: String(row.title ?? ''),
    description: String(row.description ?? ''),
    testData: asStringArray(row.test_data),
    precondition: asStringArray(row.precondition),
    steps: asStringArray(row.steps),
    actual: String(row.actual ?? ''),
    expected: String(row.expected ?? ''),
    apiNotes: apiNotes == null ? undefined : asStringArray(apiNotes),
    priority: row.priority as BugPriority,
    status: row.status as BugStatus,
    updatedAt: String(row.updated_at ?? nowIso()),
  }
}

function parseEditCommentBody(body: string): BugEditableFields | null {
  try {
    const raw = JSON.parse(body) as Partial<BugEditableFields> & { v?: number }
    if (!raw || typeof raw.title !== 'string') return null
    return {
      title: raw.title,
      description: typeof raw.description === 'string' ? raw.description : '',
      testData: asStringArray(raw.testData),
      precondition: asStringArray(raw.precondition),
      steps: asStringArray(raw.steps),
      actual: typeof raw.actual === 'string' ? raw.actual : '',
      expected: typeof raw.expected === 'string' ? raw.expected : '',
      apiNotes: raw.apiNotes == null ? undefined : asStringArray(raw.apiNotes),
      priority: raw.priority as BugPriority,
      status: raw.status as BugStatus,
    }
  } catch {
    return null
  }
}

async function sbFetchEditsFromTable(): Promise<EditsMap | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb
    .from('bug_edits')
    .select(
      'bug_id, title, description, test_data, precondition, steps, actual, expected, api_notes, priority, status, updated_at',
    )
  if (error) {
    // Table missing until 002 migration is applied
    if (error.code === 'PGRST205' || /bug_edits/i.test(error.message)) return null
    throw error
  }
  const map: EditsMap = {}
  for (const row of data ?? []) {
    const edit = rowFromDb(row as Record<string, unknown>)
    map[edit.bugId] = edit
  }
  return map
}

async function sbFetchEditsFromComments(): Promise<EditsMap> {
  const sb = getSupabase()
  if (!sb) return {}
  const { data, error } = await sb
    .from('bug_comments')
    .select('bug_id, body, created_at')
    .eq('author', EDIT_COMMENT_AUTHOR)
    .order('created_at', { ascending: false })
  if (error) throw error
  const map: EditsMap = {}
  for (const row of data ?? []) {
    const bugId = String(row.bug_id)
    if (map[bugId]) continue
    const fields = parseEditCommentBody(String(row.body ?? ''))
    if (!fields) continue
    map[bugId] = normalizeEdit(bugId, fields, String(row.created_at ?? nowIso()))
  }
  return map
}

async function sbSaveEditTable(bugId: string, fields: BugEditableFields): Promise<BugEditRow | null> {
  const sb = getSupabase()
  if (!sb) return null
  const updatedAt = nowIso()
  const payload = {
    bug_id: bugId,
    title: fields.title,
    description: fields.description,
    test_data: fields.testData,
    precondition: fields.precondition,
    steps: fields.steps,
    actual: fields.actual,
    expected: fields.expected,
    api_notes: fields.apiNotes ?? null,
    priority: fields.priority,
    status: fields.status,
    updated_at: updatedAt,
  }
  const { error } = await sb.from('bug_edits').upsert(payload, { onConflict: 'bug_id' })
  if (error) {
    if (error.code === 'PGRST205' || /bug_edits/i.test(error.message)) return null
    throw error
  }
  // Keep live status in sync
  await sb.from('bug_live_status').upsert(
    { bug_id: bugId, status: fields.status, updated_at: updatedAt },
    { onConflict: 'bug_id' },
  )
  return normalizeEdit(bugId, fields, updatedAt)
}

async function sbSaveEditComment(bugId: string, fields: BugEditableFields): Promise<BugEditRow> {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase not configured')
  const updatedAt = nowIso()
  const body = JSON.stringify({ v: 1, ...fields })
  const { error } = await sb.from('bug_comments').insert({
    bug_id: bugId,
    body,
    author: EDIT_COMMENT_AUTHOR,
  })
  if (error) throw error
  await sb.from('bug_live_status').upsert(
    { bug_id: bugId, status: fields.status, updated_at: updatedAt },
    { onConflict: 'bug_id' },
  )
  return normalizeEdit(bugId, fields, updatedAt)
}

export async function fetchAllBugEdits(): Promise<EditsMap> {
  if (supabaseConfigured) {
    try {
      const fromTable = await sbFetchEditsFromTable()
      if (fromTable) return fromTable
      return await sbFetchEditsFromComments()
    } catch (err) {
      console.warn('[bugEdits] Supabase fetch failed; using localStorage', err)
      return lsGetEdits()
    }
  }
  return lsGetEdits()
}

export async function saveBugEdit(bugId: string, fields: BugEditableFields): Promise<BugEditRow> {
  const cleaned: BugEditableFields = {
    title: fields.title.trim(),
    description: fields.description.trim(),
    testData: fields.testData.map((s) => s.trim()).filter(Boolean),
    precondition: fields.precondition.map((s) => s.trim()).filter(Boolean),
    steps: fields.steps.map((s) => s.trim()).filter(Boolean),
    actual: fields.actual.trim(),
    expected: fields.expected.trim(),
    apiNotes: fields.apiNotes?.map((s) => s.trim()).filter(Boolean),
    priority: fields.priority,
    status: fields.status,
  }
  if (!cleaned.title) throw new Error('Title is required')

  if (supabaseConfigured) {
    try {
      const viaTable = await sbSaveEditTable(bugId, cleaned)
      if (viaTable) return viaTable
      return await sbSaveEditComment(bugId, cleaned)
    } catch (err) {
      console.warn('[bugEdits] Supabase write failed; falling back to localStorage', err)
      return lsSaveEdit(bugId, cleaned)
    }
  }
  return lsSaveEdit(bugId, cleaned)
}

export function applyBugEdit(bug: Bug, edit: BugEditRow | undefined): Bug {
  if (!edit) return bug
  return {
    ...bug,
    title: edit.title,
    description: edit.description,
    testData: edit.testData,
    precondition: edit.precondition,
    steps: edit.steps,
    actual: edit.actual,
    expected: edit.expected,
    apiNotes: edit.apiNotes,
    priority: edit.priority,
    status: edit.status,
    updatedAt: edit.updatedAt.slice(0, 10),
  }
}

export function editableFromBug(bug: Bug): BugEditableFields {
  return {
    title: bug.title,
    description: bug.description,
    testData: [...bug.testData],
    precondition: [...bug.precondition],
    steps: [...bug.steps],
    actual: bug.actual,
    expected: bug.expected,
    apiNotes: bug.apiNotes ? [...bug.apiNotes] : undefined,
    priority: bug.priority,
    status: bug.status,
  }
}
