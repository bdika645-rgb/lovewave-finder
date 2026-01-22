-- Phase 0: Privacy hardening (Public/Private profiles + stricter photos access)

-- 1) Public projection table (minimal exposure)
create table if not exists public.profiles_public (
  id uuid primary key references public.profiles(id) on delete cascade,
  name text not null,
  age integer not null,
  city text not null,
  avatar_url text,
  interests text[] not null default '{}'::text[],
  is_visible boolean not null default true,
  is_online boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.profiles_public enable row level security;

-- Authenticated users can read only visible public profiles
create policy "Authenticated users can view visible public profiles"
on public.profiles_public
for select
using (
  auth.uid() is not null
  and is_visible = true
);

-- Admins can manage public projection (for ops/debug)
create policy "Admins can manage profiles_public"
on public.profiles_public
for all
using (public.is_admin())
with check (public.is_admin());

-- Keep profiles_public in sync with profiles
create or replace function public.sync_profiles_public()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles_public (id, name, age, city, avatar_url, interests, is_visible, is_online, updated_at)
  values (
    new.id,
    new.name,
    new.age,
    new.city,
    new.avatar_url,
    coalesce(new.interests, '{}'::text[]),
    coalesce(new.is_visible, true),
    coalesce(new.is_online, false),
    now()
  )
  on conflict (id) do update set
    name = excluded.name,
    age = excluded.age,
    city = excluded.city,
    avatar_url = excluded.avatar_url,
    interests = excluded.interests,
    is_visible = excluded.is_visible,
    is_online = excluded.is_online,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists trg_sync_profiles_public on public.profiles;
create trigger trg_sync_profiles_public
after insert or update of name, age, city, avatar_url, interests, is_visible, is_online
on public.profiles
for each row
execute function public.sync_profiles_public();

-- Backfill existing rows
insert into public.profiles_public (id, name, age, city, avatar_url, interests, is_visible, is_online, updated_at)
select p.id, p.name, p.age, p.city, p.avatar_url, coalesce(p.interests, '{}'::text[]), coalesce(p.is_visible, true), coalesce(p.is_online, false), now()
from public.profiles p
on conflict (id) do update set
  name = excluded.name,
  age = excluded.age,
  city = excluded.city,
  avatar_url = excluded.avatar_url,
  interests = excluded.interests,
  is_visible = excluded.is_visible,
  is_online = excluded.is_online,
  updated_at = now();

-- 2) Tighten SELECT on full profiles table (owner/admin only)
-- Replace overly broad policy
drop policy if exists "Authenticated users can view visible profiles" on public.profiles;

create policy "Owners and admins can view full profiles"
on public.profiles
for select
using (
  public.is_admin() or user_id = auth.uid()
);

-- 3) Photos: allow only owner/admin OR a relationship (match or mutual-like)
create or replace function public.can_view_private_profile(_viewer_profile_id uuid, _target_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    -- self
    (_viewer_profile_id = _target_profile_id)
    -- match
    or exists (
      select 1
      from public.matches m
      where (m.profile1_id = least(_viewer_profile_id, _target_profile_id)
             and m.profile2_id = greatest(_viewer_profile_id, _target_profile_id))
    )
    -- mutual-like
    or exists (
      select 1
      from public.likes l1
      join public.likes l2
        on l2.liker_id = l1.liked_id
       and l2.liked_id = l1.liker_id
      where l1.liker_id = _viewer_profile_id
        and l1.liked_id = _target_profile_id
    );
$$;

drop policy if exists "Anyone can view photos of visible profiles" on public.photos;

create policy "Users can view photos only for permitted profiles"
on public.photos
for select
using (
  public.is_admin()
  or profile_id = public.get_my_profile_id()
  or public.can_view_private_profile(public.get_my_profile_id(), profile_id)
);
