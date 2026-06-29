import { createClient } from "@/lib/supabase/server";

export type AdminTrophy = {
  id: string;
  legacy_id: string | null;
  edition: number;
  trophy_date: string;
  weapon: string;
  reserve: string;
  details: string;
  competitions: {
    name: string;
    category: string;
  } | null;
  players: {
    name: string;
  } | null;
};

export async function getAdminTrophies() {
  // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include trophies.
  const supabase = (await createClient()) as any;
  const { data, error } = await supabase
    .from("trophies")
    .select(`
      id,
      legacy_id,
      edition,
      trophy_date,
      weapon,
      reserve,
      details,
      competitions (
        name,
        category
      ),
      players (
        name
      )
    `)
    .order("trophy_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as AdminTrophy[];
}
