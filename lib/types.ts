export type Player = {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  bio: string;
};

export type Competition = {
  id: string;
  name: string;
  objective: string;
  allowedWeapons: string[];
  specialConditions: string | null;
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
