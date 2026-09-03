-- StudyBench Supabase schema
-- This file documents the current production structure.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  unlimited_until timestamptz,
  is_admin boolean not null default false
);

create table if not exists public.usage_log (
  user_id uuid primary key references auth.users(id) on delete cascade,
  count int not null default 0,
  window_start timestamptz not null default now()
);

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  wing text not null check (wing in ('educational', 'web3')),
  description text not null,
  is_free boolean not null default true,
  status text not null default 'draft' check (status in ('draft', 'published')),
  amazon_query text,
  content text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.usage_log enable row level security;
alter table public.books enable row level security;

-- Public library access: only published books are readable by anon/authenticated clients.
drop policy if exists "Public can view published books" on public.books;
create policy "Public can view published books"
on public.books
for select
to anon, authenticated
using (status = 'published');

-- profiles and usage_log intentionally have no public client policies.
-- Server routes use SUPABASE_SERVICE_ROLE_KEY for protected reads/writes.
