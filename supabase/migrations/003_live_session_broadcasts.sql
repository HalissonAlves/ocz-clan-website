drop policy if exists "Authenticated users can receive live session broadcasts" on realtime.messages;
create policy "Authenticated users can receive live session broadcasts"
on realtime.messages
for select
to authenticated
using ((select realtime.topic()) = 'live:sessions');

create or replace function public.broadcast_live_session_changes()
returns trigger
security definer
set search_path = public, realtime
language plpgsql
as $$
begin
  perform realtime.broadcast_changes(
    'live:sessions',
    TG_OP,
    TG_OP,
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    OLD
  );

  return null;
end;
$$;

drop trigger if exists broadcast_gameplay_session_changes on public.gameplay_sessions;
create trigger broadcast_gameplay_session_changes
after insert or update or delete
on public.gameplay_sessions
for each row
execute function public.broadcast_live_session_changes();

drop trigger if exists broadcast_session_competition_changes on public.session_competitions;
create trigger broadcast_session_competition_changes
after insert or update or delete
on public.session_competitions
for each row
execute function public.broadcast_live_session_changes();

drop trigger if exists broadcast_session_entry_changes on public.session_entries;
create trigger broadcast_session_entry_changes
after insert or update or delete
on public.session_entries
for each row
execute function public.broadcast_live_session_changes();