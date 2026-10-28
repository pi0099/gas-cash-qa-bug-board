-- Editable bug fields for the open (no-auth) QA board.
-- Run after 001_open_rls.sql. Anon can select/insert/update — temporary only.

create table if not exists public.bug_edits (
  bug_id text primary key,
  title text not null,
  description text not null default '',
  test_data jsonb not null default '[]'::jsonb,
  precondition jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,
  actual text not null default '',
  expected text not null default '',
  api_notes jsonb,
  priority text not null
    check (priority in ('P0', 'P1', 'High', 'P2', 'Medium', 'P3', 'Low')),
  status text not null
    check (status in ('Triage', 'Open', 'In Progress', 'Blocked', 'Resolved', 'Closed')),
  updated_at timestamptz not null default now()
);

alter table public.bug_edits enable row level security;

drop policy if exists "anon_select_bug_edits" on public.bug_edits;
drop policy if exists "anon_insert_bug_edits" on public.bug_edits;
drop policy if exists "anon_update_bug_edits" on public.bug_edits;

create policy "anon_select_bug_edits"
  on public.bug_edits for select to anon using (true);

create policy "anon_insert_bug_edits"
  on public.bug_edits for insert to anon with check (true);

create policy "anon_update_bug_edits"
  on public.bug_edits for update to anon using (true) with check (true);

-- Ensure Hóc Môn POI + other recent filings exist in live status seed
insert into public.bug_live_status (bug_id, status, updated_at) values
  ('gc-profile-blank-stats-dots', 'Open', now()),
  ('gc-chopshop-reading-forever', 'Open', now()),
  ('gc-starting5-route-404', 'Open', now()),
  ('gc-mileage-invite-without-username', 'Open', now()),
  ('gc-garage-carousel-reading-forever', 'Open', now()),
  ('gc-location-browser-geo-ignored', 'Open', now()),
  ('gc-location-allow-this-time-reprompt', 'Open', now()),
  ('gc-station-poi-hoc-mon-nonfuel', 'Open', now()),
  ('gc-checkin-emulator-phone-check-fail', 'Open', now())
on conflict (bug_id) do nothing;
