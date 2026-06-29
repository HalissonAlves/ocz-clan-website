import { getCompetitions } from "@/lib/data";
import type { Competition } from "@/lib/types";

export type LivePlayer = {
  id: string;
  name: string;
};

export type LiveEntry = {
  id: string;
  player_id: string;
  notes: string;
  score_text: string;
  players?: LivePlayer | null;
};

export type LiveSessionCompetition = {
  id: string;
  status: string;
  winner_player_id: string | null;
  competitions: {
    id: string;
    legacy_id: string | null;
    name: string;
    category: Competition["category"];
    objective: string;
    trophy_image_url: string;
  } | null;
  session_entries: LiveEntry[];
};

export type LiveSession = {
  id: string;
  title: string;
  status: string;
  duration_minutes: number;
  starts_at: string | null;
  ends_at: string | null;
  session_competitions: LiveSessionCompetition[];
};

export function getCompetitionCatalog() {
  return getCompetitions().sort((first, second) =>
    first.name.localeCompare(second.name, "pt-BR"),
  );
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
