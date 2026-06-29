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
