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
  source_url text,
  source_name text,
  license_name text,
  license_url text,
  attribution_text text,
  source_file_url text,
  hosted_file_url text,
  storage_path text,
  hosted_parts jsonb,
  created_at timestamptz not null default now()
);

alter table public.books add column if not exists source_url text;
alter table public.books add column if not exists source_name text;
alter table public.books add column if not exists license_name text;
alter table public.books add column if not exists license_url text;
alter table public.books add column if not exists attribution_text text;
alter table public.books add column if not exists source_file_url text;
alter table public.books add column if not exists hosted_file_url text;
alter table public.books add column if not exists storage_path text;
alter table public.books add column if not exists hosted_parts jsonb;

alter table public.profiles enable row level security;
alter table public.usage_log enable row level security;
alter table public.books enable row level security;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_admin = true
  );
$$;

-- Published library titles are readable by everyone.
drop policy if exists "Public can view published books" on public.books;
create policy "Public can view published books"
on public.books
for select
to anon, authenticated
using (status = 'published');

-- Authenticated admins can manage all book rows, including drafts.
drop policy if exists "Admins can manage books" on public.books;
create policy "Admins can manage books"
on public.books
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admins can read profiles" on public.profiles;
create policy "Admins can read profiles"
on public.profiles
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Admins can read usage log" on public.usage_log;
create policy "Admins can read usage log"
on public.usage_log
for select
to authenticated
using (public.is_admin_user());

grant select, insert, update, delete on public.books to authenticated;
grant select on public.profiles to authenticated;
grant select on public.usage_log to authenticated;
grant select, insert, update, delete on public.books to service_role;
grant select on public.profiles to service_role;
grant select on public.usage_log to service_role;

-- Open Educational PDFs are mirrored into this public bucket by a protected
-- server route using the service-role client. Public buckets can serve known
-- object URLs directly; no broad storage.objects listing policy is required.
insert into storage.buckets (id, name, public)
values ('textbooks', 'textbooks', true)
on conflict (id) do update set public = excluded.public;
