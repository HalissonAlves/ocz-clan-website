create extension if not exists pgcrypto;

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  name text not null,
  slug text not null unique,
  avatar_url text not null,
  bio text not null default '',
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  player_id uuid null references public.players(id),
  name text not null,
  role text not null default 'player' check (role in ('player', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_players_updated_at on public.players;
create trigger set_players_updated_at
before update on public.players
for each row
execute function public.set_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  );
$$;

alter table public.players enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "Public can read active players" on public.players;
create policy "Public can read active players"
on public.players
for select
using (active = true);

drop policy if exists "Admins can manage players" on public.players;
create policy "Admins can manage players"
on public.players
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Admins can manage profiles"
on public.profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.players (
  legacy_id,
  name,
  slug,
  avatar_url,
  bio,
  sort_order
)
values
  (
    'pardal',
    'Pardal',
    'pardal',
    '/assets/pardal_portrait.png',
    'Precisão, paciência e um olhar atento para transformar qualquer oportunidade em troféu.',
    1
  ),
  (
    'bode',
    'Bode',
    'bode',
    '/assets/bode_portrait.png',
    'Instinto agressivo e sangue-frio para encarar os desafios mais improváveis da reserva.',
    2
  ),
  (
    'black-apple',
    'Black Apple',
    'black-apple',
    '/assets/black_apple_portrait.png',
    'Estratégia e versatilidade a serviço da caçada perfeita, seja qual for a arma escolhida.',
    3
  )
on conflict (legacy_id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  avatar_url = excluded.avatar_url,
  bio = excluded.bio,
  sort_order = excluded.sort_order;

-- After creating the three Supabase Auth users, insert one profile for each:
--
-- insert into public.profiles (id, player_id, name, role)
-- select
--   'AUTH_USER_UUID_HERE',
--   players.id,
--   players.name,
--   'admin'
-- from public.players
-- where players.legacy_id = 'pardal';
