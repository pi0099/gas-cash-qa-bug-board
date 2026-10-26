-- Gas Cash QA bug board — open (no-auth) RLS for temporary public triage.
-- Run in Supabase SQL editor after creating the project.
-- WARNING: anyone with the anon key can select/insert/update. Temporary QA only.

create table if not exists public.bug_live_status (
  bug_id text primary key,
  status text not null
    check (status in ('Triage', 'Open', 'In Progress', 'Blocked', 'Resolved', 'Closed')),
  updated_at timestamptz not null default now()
);

create table if not exists public.bug_comments (
  id uuid primary key default gen_random_uuid(),
  bug_id text not null,
  body text not null check (char_length(trim(body)) > 0),
  author text not null default 'anon',
  created_at timestamptz not null default now()
);

create index if not exists bug_comments_bug_id_created_at_idx
  on public.bug_comments (bug_id, created_at);

alter table public.bug_live_status enable row level security;
alter table public.bug_comments enable row level security;

-- Drop leftover policies if re-running
drop policy if exists "anon_select_bug_live_status" on public.bug_live_status;
drop policy if exists "anon_insert_bug_live_status" on public.bug_live_status;
drop policy if exists "anon_update_bug_live_status" on public.bug_live_status;
drop policy if exists "anon_select_bug_comments" on public.bug_comments;
drop policy if exists "anon_insert_bug_comments" on public.bug_comments;
drop policy if exists "anon_update_bug_comments" on public.bug_comments;

create policy "anon_select_bug_live_status"
  on public.bug_live_status for select to anon using (true);

create policy "anon_insert_bug_live_status"
  on public.bug_live_status for insert to anon with check (true);

create policy "anon_update_bug_live_status"
  on public.bug_live_status for update to anon using (true) with check (true);

create policy "anon_select_bug_comments"
  on public.bug_comments for select to anon using (true);

create policy "anon_insert_bug_comments"
  on public.bug_comments for insert to anon with check (true);

-- Allow editing comments if needed (temp open board)
create policy "anon_update_bug_comments"
  on public.bug_comments for update to anon using (true) with check (true);

-- Seed from current data/bugs.json statuses (upsert-safe)
insert into public.bug_live_status (bug_id, status, updated_at) values
  ('gc-api-500-outage', 'Resolved', now()),
  ('gc-rpc-storm-atm', 'Open', now()),
  ('gc-layout-refetch-storm', 'Open', now()),
  ('gc-auth-sync-500', 'Resolved', now()),
  ('gc-docs-route-404', 'Open', now()),
  ('gc-minimart-blank-prices', 'Resolved', now()),
  ('gc-404-unbranded', 'Open', now()),
  ('gc-header-ellipsis-forever', 'Open', now()),
  ('gc-garage-reading-forever', 'Resolved', now()),
  ('gc-portfolio-zero-dishonest', 'Resolved', now()),
  ('gc-minimart-availability-labels', 'Open', now()),
  ('gc-minimart-watermark-clip', 'Open', now()),
  ('gc-minimart-insure-overlap', 'Resolved', now()),
  ('gc-pumps-duplicate-error', 'Resolved', now()),
  ('gc-bike-rest-copy-mismatch', 'Open', now())
on conflict (bug_id) do update
  set status = excluded.status,
      updated_at = excluded.updated_at;
