-- Run this once in Supabase → SQL Editor → New Query → paste all → Run

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  unlimited_until timestamptz
);

create table if not exists usage_log (
  user_id uuid primary key references auth.users(id) on delete cascade,
  count int not null default 0,
  window_start timestamptz not null default now()
);

-- Lock these tables down from public/anon access.
-- Our server routes use the service role key, which bypasses these policies.
alter table profiles enable row level security;
alter table usage_log enable row level security;
