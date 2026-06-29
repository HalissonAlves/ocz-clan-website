create table if not exists public.trophies (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  competition_id uuid not null references public.competitions(id),
  winner_player_id uuid not null references public.players(id),
  gameplay_session_id uuid null references public.gameplay_sessions(id) on delete set null,
  session_competition_id uuid null unique references public.session_competitions(id) on delete set null,
  edition int not null check (edition > 0),
  trophy_date date not null,
  weapon text not null,
  reserve text not null,
  details text not null,
  image_url text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_trophies_updated_at on public.trophies;
create trigger set_trophies_updated_at
before update on public.trophies
for each row
execute function public.set_updated_at();

alter table public.trophies enable row level security;

drop policy if exists "Public can read trophies" on public.trophies;
create policy "Public can read trophies"
on public.trophies
for select
using (true);

drop policy if exists "Admins can manage trophies" on public.trophies;
create policy "Admins can manage trophies"
on public.trophies
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());