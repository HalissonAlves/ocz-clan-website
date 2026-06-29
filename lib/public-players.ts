import { createClient } from "@/lib/supabase/server";
import type { Player, PlayerStat } from "@/lib/types";

type DbPlayer = {
  id: string;
  legacy_id: string | null;
  name: string;
  slug: string;
  avatar_url: string;
  bio: string;
  sort_order: number;
};

type DbPlayerStat = DbPlayer & {
  trophies: { id: string }[];
};

export async function getPlayersWithSupabase() {
  try {
    // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include public player reads.
    const supabase = (await createClient()) as any;
    const { data, error } = await supabase
      .from("players")
      .select("id, legacy_id, name, slug, avatar_url, bio, sort_order")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data as DbPlayer[]).map(resolveDatabasePlayer);
  } catch {
    return [];
  }
}

export async function getPlayerStatsWithSupabase() {
  try {
    // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include public player reads.
    const supabase = (await createClient()) as any;
    const { data, error } = await supabase
      .from("players")
      .select(`
        id,
        legacy_id,
        name,
        slug,
        avatar_url,
        bio,
        sort_order,
        trophies (
          id
        )
      `)
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data as DbPlayerStat[]).map((player) => ({
      player: resolveDatabasePlayer(player),
      trophyCount: player.trophies.length,
    })) satisfies PlayerStat[];
  } catch {
    return [];
  }
}

function resolveDatabasePlayer(player: DbPlayer): Player {
  return {
    id: player.legacy_id ?? player.id,
    name: player.name,
    slug: player.slug,
    avatar: player.avatar_url,
    bio: player.bio,
  };
}
