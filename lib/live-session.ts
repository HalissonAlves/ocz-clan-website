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
