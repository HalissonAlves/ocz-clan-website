import { getCompetitionStats, getCompetitions } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import type {
  Competition,
  CompetitionStat,
  CompetitionTarget,
} from "@/lib/types";

type DbCompetition = {
  id: string;
  legacy_id: string | null;
  name: string;
  slug: string;
  category: Competition["category"];
  target_type: CompetitionTarget["type"] | null;
  target_slug: string | null;
  target_label: string | null;
  objective: string;
  allowed_weapons: string[];
  special_conditions: string[];
  trophy_image_url: string;
};

type DbCompetitionStat = DbCompetition & {
  trophies: { id: string }[];
};

export async function getCompetitionCatalog() {
  try {
    // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include competitions.
    const supabase = (await createClient()) as any;
    const { data, error } = await supabase
      .from("competitions")
      .select(`
        id,
        legacy_id,
        name,
        slug,
        category,
        target_type,
        target_slug,
        target_label,
        objective,
        allowed_weapons,
        special_conditions,
        trophy_image_url
      `)
      .eq("active", true)
      .order("name", { ascending: true });

    if (error || !data?.length) {
      return getCompetitions().sort(sortCompetitionByName);
    }

    return (data as DbCompetition[]).map(resolveDatabaseCompetition);
  } catch {
    return getCompetitions().sort(sortCompetitionByName);
  }
}

export async function getCompetitionStatsWithSupabase() {
  try {
    // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include competitions.
    const supabase = (await createClient()) as any;
    const { data, error } = await supabase
      .from("competitions")
      .select(`
        id,
        legacy_id,
        name,
        slug,
        category,
        target_type,
        target_slug,
        target_label,
        objective,
        allowed_weapons,
        special_conditions,
        trophy_image_url,
        trophies (
          id
        )
      `)
      .eq("active", true)
      .order("name", { ascending: true });

    if (error || !data?.length) {
      return getCompetitionStats();
    }

    return (data as DbCompetitionStat[]).map((competition) => ({
      competition: resolveDatabaseCompetition(competition),
      trophyCount: competition.trophies.length,
    })) satisfies CompetitionStat[];
  } catch {
    return getCompetitionStats();
  }
}

export function toCompetitionRow(competition: Competition) {
  return {
    legacy_id: competition.id,
    name: competition.name,
    slug: competition.id,
    category: competition.category,
    target_type: competition.target?.type ?? null,
    target_slug: competition.target?.slug ?? null,
    target_label: competition.target?.label ?? null,
    objective: competition.objective,
    allowed_weapons: competition.allowedWeapons,
    special_conditions: competition.specialConditions,
    trophy_image_url: competition.trophyImage,
    active: true,
  };
}

function resolveDatabaseCompetition(competition: DbCompetition): Competition {
  return {
    id: competition.legacy_id ?? competition.id,
    name: competition.name,
    category: competition.category,
    objective: competition.objective,
    allowedWeapons: competition.allowed_weapons,
    specialConditions: competition.special_conditions,
    trophyImage: competition.trophy_image_url,
    target: competition.target_type
      ? {
          type: competition.target_type,
          slug: competition.target_slug ?? "geral",
          label: competition.target_label ?? "Geral",
        }
      : undefined,
  };
}

function sortCompetitionByName(first: Competition, second: Competition) {
  return first.name.localeCompare(second.name, "pt-BR");
}
