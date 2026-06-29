import { formatDate, toRoman } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import type {
  Competition,
  CompetitionTarget,
  Player,
  ResolvedTrophy,
} from "@/lib/types";

type DbTrophy = {
  id: string;
  legacy_id: string | null;
  edition: number;
  trophy_date: string;
  weapon: string;
  reserve: string;
  details: string;
  competitions: {
    id: string;
    legacy_id: string | null;
    name: string;
    category: Competition["category"];
    target_type: CompetitionTarget["type"] | null;
    target_slug: string | null;
    target_label: string | null;
    objective: string;
    allowed_weapons: string[];
    special_conditions: string[];
    trophy_image_url: string;
  } | null;
  players: {
    id: string;
    legacy_id: string | null;
    name: string;
    slug: string;
    avatar_url: string;
    bio: string;
  } | null;
};

export async function getResolvedTrophiesWithSupabase() {
  try {
    // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include trophies.
    const supabase = (await createClient()) as any;
    const { data, error } = await supabase.from("trophies").select(`
        id,
        legacy_id,
        edition,
        trophy_date,
        weapon,
        reserve,
        details,
        competitions (
          id,
          legacy_id,
          name,
          category,
          target_type,
          target_slug,
          target_label,
          objective,
          allowed_weapons,
          special_conditions,
          trophy_image_url
        ),
        players (
          id,
          legacy_id,
          name,
          slug,
          avatar_url,
          bio
        )
      `);

    if (error) {
      throw new Error(error.message);
    }

    return (data as DbTrophy[])
      .map(resolveDatabaseTrophy)
      .filter((trophy): trophy is ResolvedTrophy => Boolean(trophy))
      .sort(
        (first, second) =>
          new Date(second.date).getTime() - new Date(first.date).getTime(),
      );
  } catch {
    return [];
  }
}

function resolveDatabaseTrophy(trophy: DbTrophy) {
  if (!trophy.competitions || !trophy.players) {
    return null;
  }

  const competitionId = trophy.competitions.legacy_id ?? trophy.competitions.id;
  const winnerId = trophy.players.legacy_id ?? trophy.players.id;
  const player: Player = {
    id: winnerId,
    name: trophy.players.name,
    slug: trophy.players.slug,
    avatar: trophy.players.avatar_url,
    bio: trophy.players.bio,
  };
  const competition: Competition = {
    id: competitionId,
    name: trophy.competitions.name,
    category: trophy.competitions.category,
    objective: trophy.competitions.objective,
    allowedWeapons: trophy.competitions.allowed_weapons,
    specialConditions: trophy.competitions.special_conditions,
    trophyImage: trophy.competitions.trophy_image_url,
    target: trophy.competitions.target_type
      ? {
          type: trophy.competitions.target_type,
          slug: trophy.competitions.target_slug ?? "geral",
          label: trophy.competitions.target_label ?? "Geral",
        }
      : undefined,
  };

  return {
    id: trophy.legacy_id ?? trophy.id,
    competitionId,
    winnerId,
    edition: trophy.edition,
    date: trophy.trophy_date,
    weapon: trophy.weapon,
    reserve: trophy.reserve,
    details: trophy.details,
    competition,
    winner: player,
    displayName: `${competition.name} ${toRoman(trophy.edition)}`,
    formattedDate: formatDate(trophy.trophy_date),
  };
}
