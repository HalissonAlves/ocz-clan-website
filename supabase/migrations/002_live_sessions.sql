create table if not exists public.competitions (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  name text not null,
  slug text not null unique,
  category text not null check (category in ('standard', 'diamond')),
  target_type text null check (target_type in ('general', 'group', 'species')),
  target_slug text null,
  target_label text null,
  objective text not null,
  allowed_weapons text[] not null default '{}',
  special_conditions text[] not null default '{}',
  trophy_image_url text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gameplay_sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status text not null default 'draft' check (
    status in ('draft', 'scheduled', 'running', 'finished', 'cancelled')
  ),
  duration_minutes int not null default 30 check (duration_minutes > 0),
  starts_at timestamptz null,
  ends_at timestamptz null,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.session_competitions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.gameplay_sessions(id) on delete cascade,
  competition_id uuid not null references public.competitions(id),
  status text not null default 'active' check (status in ('active', 'finished', 'cancelled')),
  winner_player_id uuid null references public.players(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, competition_id)
);

create table if not exists public.session_entries (
  id uuid primary key default gen_random_uuid(),
  session_competition_id uuid not null references public.session_competitions(id) on delete cascade,
  player_id uuid not null references public.players(id),
  notes text not null default '',
  score_text text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_competition_id, player_id)
);

drop trigger if exists set_competitions_updated_at on public.competitions;
create trigger set_competitions_updated_at
before update on public.competitions
for each row
execute function public.set_updated_at();

drop trigger if exists set_gameplay_sessions_updated_at on public.gameplay_sessions;
create trigger set_gameplay_sessions_updated_at
before update on public.gameplay_sessions
for each row
execute function public.set_updated_at();

drop trigger if exists set_session_competitions_updated_at on public.session_competitions;
create trigger set_session_competitions_updated_at
before update on public.session_competitions
for each row
execute function public.set_updated_at();

drop trigger if exists set_session_entries_updated_at on public.session_entries;
create trigger set_session_entries_updated_at
before update on public.session_entries
for each row
execute function public.set_updated_at();

alter table public.competitions enable row level security;
alter table public.gameplay_sessions enable row level security;
alter table public.session_competitions enable row level security;
alter table public.session_entries enable row level security;

drop policy if exists "Public can read active competitions" on public.competitions;
create policy "Public can read active competitions"
on public.competitions
for select
using (active = true);

drop policy if exists "Admins can manage competitions" on public.competitions;
create policy "Admins can manage competitions"
on public.competitions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated users can read gameplay sessions" on public.gameplay_sessions;
create policy "Authenticated users can read gameplay sessions"
on public.gameplay_sessions
for select
to authenticated
using (true);

drop policy if exists "Admins can manage gameplay sessions" on public.gameplay_sessions;
create policy "Admins can manage gameplay sessions"
on public.gameplay_sessions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated users can read session competitions" on public.session_competitions;
create policy "Authenticated users can read session competitions"
on public.session_competitions
for select
to authenticated
using (true);

drop policy if exists "Admins can manage session competitions" on public.session_competitions;
create policy "Admins can manage session competitions"
on public.session_competitions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated users can read session entries" on public.session_entries;
create policy "Authenticated users can read session entries"
on public.session_entries
for select
to authenticated
using (true);

drop policy if exists "Players can update own session entries" on public.session_entries;
create policy "Players can update own session entries"
on public.session_entries
for update
to authenticated
using (
  player_id = (
    select profiles.player_id
    from public.profiles
    where profiles.id = auth.uid()
  )
)
with check (
  player_id = (
    select profiles.player_id
    from public.profiles
    where profiles.id = auth.uid()
  )
);

drop policy if exists "Admins can manage session entries" on public.session_entries;
create policy "Admins can manage session entries"
on public.session_entries
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

do $$
begin
  alter publication supabase_realtime add table public.gameplay_sessions;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.session_competitions;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.session_entries;
exception
  when duplicate_object then null;
end $$;
