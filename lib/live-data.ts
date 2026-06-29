import type { LiveSession } from "@/lib/live-session";
import { createClient } from "@/lib/supabase/server";

export async function getLatestOpenSession() {
  // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include live tables.
  const supabase = (await createClient()) as any;
  const { data, error } = await supabase
    .from("gameplay_sessions")
    .select(`
      id,
      title,
      status,
      duration_minutes,
      starts_at,
      ends_at,
      session_competitions (
        id,
        status,
        winner_player_id,
        competitions (
          id,
          legacy_id,
          name,
          category,
          objective,
          trophy_image_url
        ),
        session_entries (
          id,
          player_id,
          notes,
          score_text,
          players (
            id,
            name
          )
        )
      )
    `)
    .in("status", ["draft", "scheduled", "running"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as LiveSession | null;
}
