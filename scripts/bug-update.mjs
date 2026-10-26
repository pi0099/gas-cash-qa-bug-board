#!/usr/bin/env node
/**
 * Update a bug's live status and/or add a comment.
 *
 * Uses VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (or SUPABASE_URL / SUPABASE_ANON_KEY)
 * from the environment or a local .env file. Without keys, prints guidance for
 * the localStorage-only Pages board (no remote write).
 *
 * Usage:
 *   node scripts/bug-update.mjs --id gc-404-unbranded --status "In Progress"
 *   node scripts/bug-update.mjs --id gc-404-unbranded --comment "Repro still on prod" --author lam
 *   node scripts/bug-update.mjs --id gc-404-unbranded --status Open --comment "Reopened" --author lam
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const STATUSES = new Set(['Triage', 'Open', 'In Progress', 'Blocked', 'Resolved', 'Closed'])

function loadDotEnv() {
  const envPath = resolve(root, '.env')
  if (!existsSync(envPath)) return
  const text = readFileSync(envPath, 'utf8')
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 0) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = val
  }
}

function parseArgs(argv) {
  const out = { id: '', status: '', comment: '', author: 'cli' }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    const next = argv[i + 1]
    if ((a === '--id' || a === '-i') && next) {
      out.id = next
      i++
    } else if ((a === '--status' || a === '-s') && next) {
      out.status = next
      i++
    } else if ((a === '--comment' || a === '-c') && next) {
      out.comment = next
      i++
    } else if ((a === '--author' || a === '-a') && next) {
      out.author = next
      i++
    } else if (a === '--help' || a === '-h') {
      out.help = true
    }
  }
  return out
}

function usage() {
  console.log(`bug-update.mjs — set status / add comment on the open QA board

Usage:
  node scripts/bug-update.mjs --id <bugId> [--status <Status>] [--comment <text>] [--author <name>]

Statuses: ${[...STATUSES].join(' | ')}

Env (required for remote writes):
  VITE_SUPABASE_URL / SUPABASE_URL
  VITE_SUPABASE_ANON_KEY / SUPABASE_ANON_KEY

Without env keys: this script cannot write (Pages uses localStorage in-browser).
Open the bug detail on the live board and use the status dropdown + Add comment UI.
`)
}

async function main() {
  loadDotEnv()
  const args = parseArgs(process.argv.slice(2))
  if (args.help || !args.id || (!args.status && !args.comment)) {
    usage()
    process.exit(args.help || (!args.id && !args.status && !args.comment) ? 0 : 1)
  }

  if (args.status && !STATUSES.has(args.status)) {
    console.error(`Invalid status "${args.status}". Expected one of: ${[...STATUSES].join(', ')}`)
    process.exit(1)
  }

  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
  const key = (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim()

  if (!url || !key) {
    console.error(`No Supabase credentials found.

This CLI needs VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (or SUPABASE_*).
Until those exist, live edits only work in the browser via localStorage
on the GitHub Pages site (one browser / one device).

Local-only path:
  1. Open https://pi0099.github.io/gas-cash-qa-bug-board/bugs/${args.id}
  2. Change Status in the dropdown and/or Add comment
  3. Data stays in that browser until Supabase is wired

After creating a Supabase project:
  1. Run supabase/migrations/001_open_rls.sql in the SQL editor
  2. Copy Project URL + anon key into .env (see .env.example)
  3. Add the same names as GitHub Actions secrets for Pages builds
  4. Re-run this script
`)
    process.exit(2)
  }

  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  if (args.status) {
    const { error } = await sb.from('bug_live_status').upsert(
      { bug_id: args.id, status: args.status, updated_at: new Date().toISOString() },
      { onConflict: 'bug_id' },
    )
    if (error) {
      console.error('Status update failed:', error.message)
      process.exit(1)
    }
    console.log(`OK status ${args.id} → ${args.status}`)
  }

  if (args.comment) {
    const { data, error } = await sb
      .from('bug_comments')
      .insert({ bug_id: args.id, body: args.comment, author: args.author || 'cli' })
      .select('id, created_at')
      .single()
    if (error) {
      console.error('Comment insert failed:', error.message)
      process.exit(1)
    }
    console.log(`OK comment ${data.id} @ ${data.created_at}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
