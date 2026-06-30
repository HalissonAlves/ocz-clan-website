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
    trophy_image_url: string;
  } | null;
  players: {
    name: string;
  } | null;
};

export type DiamondTrophyCompetitionOption = {
  id: string;
  name: string;
  trophy_image_url: string;
};

export type TrophyPlayerOption = {
  id: string;
  name: string;
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
        category,
        trophy_image_url
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

export async function getDiamondTrophyCompetitionOptions() {
  // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include competitions.
  const supabase = (await createClient()) as any;
  const { data, error } = await supabase
    .from("competitions")
    .select("id, name, trophy_image_url")
    .eq("category", "diamond")
    .eq("active", true)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as DiamondTrophyCompetitionOption[];
}

export async function getTrophyPlayerOptions() {
  // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include players.
  const supabase = (await createClient()) as any;
  const { data, error } = await supabase
    .from("players")
    .select("id, name")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as TrophyPlayerOption[];
}
