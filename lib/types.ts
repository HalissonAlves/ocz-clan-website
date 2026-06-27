export type Player = {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  bio: string;
};

export type CompetitionTarget = {
  type: "general" | "group" | "species";
  slug: string;
  label: string;
};

export type Competition = {
  id: string;
  name: string;
  category: "standard" | "diamond";
  target?: CompetitionTarget;
  objective: string;
  allowedWeapons: string[];
  specialConditions: string[];
  trophyImage: string;
};

export type Trophy = {
  id: string;
  competitionId: string;
  winnerId: string;
  edition: number;
  date: string;
  weapon: string;
  reserve: string;
  details: string;
};

export type ResolvedTrophy = Trophy & {
  competition: Competition;
  winner: Player;
  displayName: string;
  formattedDate: string;
};

export type PlayerStat = {
  player: Player;
  trophyCount: number;
};

export type CompetitionStat = {
  competition: Competition;
  trophyCount: number;
};
