import type { BugStatus } from '../types/bug'
import { getSupabase, supabaseConfigured } from './supabase'

const STATUS_KEY = 'gc-qa-bug-live-status-v1'
const COMMENTS_KEY = 'gc-qa-bug-live-comments-v1'

export interface BugComment {
  id: string
  bugId: string
  body: string
  author: string
  createdAt: string
}

export interface BugStatusRow {
  bugId: string
  status: BugStatus
  updatedAt: string
}

type StatusMap = Record<string, BugStatusRow>
type CommentsMap = Record<string, BugComment[]>

function nowIso(): string {
  return new Date().toISOString()
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `c-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
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

function lsGetStatuses(): StatusMap {
  return readJson<StatusMap>(STATUS_KEY, {})
}

function lsSetStatus(bugId: string, status: BugStatus): BugStatusRow {
  const map = lsGetStatuses()
  const row: BugStatusRow = { bugId, status, updatedAt: nowIso() }
  map[bugId] = row
  writeJson(STATUS_KEY, map)
  return row
}

function lsGetComments(bugId: string): BugComment[] {
  const map = readJson<CommentsMap>(COMMENTS_KEY, {})
  return [...(map[bugId] ?? [])].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

function lsAddComment(bugId: string, body: string, author: string): BugComment {
  const map = readJson<CommentsMap>(COMMENTS_KEY, {})
  const comment: BugComment = {
    id: newId(),
    bugId,
    body,
    author,
    createdAt: nowIso(),
  }
  map[bugId] = [...(map[bugId] ?? []), comment]
  writeJson(COMMENTS_KEY, map)
  return comment
}

async function sbGetStatuses(): Promise<StatusMap> {
  const sb = getSupabase()
  if (!sb) return {}
  const { data, error } = await sb.from('bug_live_status').select('bug_id, status, updated_at')
  if (error) throw error
  const map: StatusMap = {}
  for (const row of data ?? []) {
    map[row.bug_id as string] = {
      bugId: row.bug_id as string,
      status: row.status as BugStatus,
      updatedAt: row.updated_at as string,
    }
  }
  return map
}

async function sbSetStatus(bugId: string, status: BugStatus): Promise<BugStatusRow> {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase not configured')
  const updatedAt = nowIso()
  const { error } = await sb.from('bug_live_status').upsert(
    { bug_id: bugId, status, updated_at: updatedAt },
    { onConflict: 'bug_id' },
  )
  if (error) throw error
  return { bugId, status, updatedAt }
}

async function sbGetComments(bugId: string): Promise<BugComment[]> {
  const sb = getSupabase()
  if (!sb) return []
  const { data, error } = await sb
    .from('bug_comments')
    .select('id, bug_id, body, author, created_at')
    .eq('bug_id', bugId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map((row) => ({
    id: row.id as string,
    bugId: row.bug_id as string,
    body: row.body as string,
    author: (row.author as string) || 'anon',
    createdAt: row.created_at as string,
  }))
}

async function sbAddComment(bugId: string, body: string, author: string): Promise<BugComment> {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase not configured')
  const { data, error } = await sb
    .from('bug_comments')
    .insert({ bug_id: bugId, body, author })
    .select('id, bug_id, body, author, created_at')
    .single()
  if (error) throw error
  return {
    id: data.id as string,
    bugId: data.bug_id as string,
    body: data.body as string,
    author: (data.author as string) || 'anon',
    createdAt: data.created_at as string,
  }
}

export async function fetchAllLiveStatuses(): Promise<StatusMap> {
  if (supabaseConfigured) {
    try {
      return await sbGetStatuses()
    } catch (err) {
      console.warn('[bugLive] Supabase status fetch failed; using localStorage', err)
      return lsGetStatuses()
    }
  }
  return lsGetStatuses()
}

export async function setLiveStatus(bugId: string, status: BugStatus): Promise<BugStatusRow> {
  if (supabaseConfigured) {
    try {
      return await sbSetStatus(bugId, status)
    } catch (err) {
      console.warn('[bugLive] Supabase status write failed; falling back to localStorage', err)
      return lsSetStatus(bugId, status)
    }
  }
  return lsSetStatus(bugId, status)
}

export async function fetchComments(bugId: string): Promise<BugComment[]> {
  if (supabaseConfigured) {
    try {
      return await sbGetComments(bugId)
    } catch (err) {
      console.warn('[bugLive] Supabase comments fetch failed; using localStorage', err)
      return lsGetComments(bugId)
    }
  }
  return lsGetComments(bugId)
}

export async function addComment(
  bugId: string,
  body: string,
  author = 'anon',
): Promise<BugComment> {
  const trimmed = body.trim()
  if (!trimmed) throw new Error('Comment body is empty')
  const who = author.trim() || 'anon'
  if (supabaseConfigured) {
    try {
      return await sbAddComment(bugId, trimmed, who)
    } catch (err) {
      console.warn('[bugLive] Supabase comment insert failed; falling back to localStorage', err)
      return lsAddComment(bugId, trimmed, who)
    }
  }
  return lsAddComment(bugId, trimmed, who)
}
