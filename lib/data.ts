import competitionsData from "@/data/competitions.json";
import playersData from "@/data/players.json";
import trophiesData from "@/data/trophies.json";
import type {
  Competition,
  CompetitionStat,
  Player,
  PlayerStat,
  ResolvedTrophy,
  Trophy,
} from "@/lib/types";

const players = playersData satisfies Player[];
const competitions = competitionsData satisfies Competition[];
const trophies = trophiesData satisfies Trophy[];

function assertUniqueIds(items: { id: string }[], label: string) {
  const ids = new Set<string>();

  for (const item of items) {
    if (ids.has(item.id)) {
      throw new Error(`ID duplicado em ${label}: "${item.id}".`);
    }

    ids.add(item.id);
  }
}

function validateData() {
  assertUniqueIds(players, "players.json");
  assertUniqueIds(competitions, "competitions.json");
  assertUniqueIds(trophies, "trophies.json");

  const playerIds = new Set(players.map((player) => player.id));
  const competitionIds = new Set(
    competitions.map((competition) => competition.id),
  );

  for (const competition of competitions) {
    if (competition.allowedWeapons.length === 0) {
      throw new Error(
        `Competição "${competition.id}" precisa informar ao menos uma arma permitida.`,
      );
    }

    if (
      competition.specialConditions.some(
        (condition) => condition.trim().length === 0,
      )
    ) {
      throw new Error(
        `Competição "${competition.id}" possui uma condição especial vazia.`,
      );
    }
  }

  for (const trophy of trophies) {
    if (!playerIds.has(trophy.winnerId)) {
      throw new Error(
        `Troféu "${trophy.id}" referencia jogador inexistente: "${trophy.winnerId}".`,
      );
    }

    if (!competitionIds.has(trophy.competitionId)) {
      throw new Error(
        `Troféu "${trophy.id}" referencia competição inexistente: "${trophy.competitionId}".`,
      );
    }

    if (!Number.isInteger(trophy.edition) || trophy.edition < 1) {
      throw new Error(
        `Troféu "${trophy.id}" possui uma edição inválida: "${trophy.edition}".`,
      );
    }

    if (Number.isNaN(Date.parse(`${trophy.date}T12:00:00`))) {
      throw new Error(
        `Troféu "${trophy.id}" possui uma data inválida: "${trophy.date}".`,
      );
    }
  }
}

validateData();

export function toRoman(value: number) {
  const numerals: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  let remaining = value;
  let result = "";

  for (const [number, numeral] of numerals) {
    while (remaining >= number) {
      result += numeral;
      remaining -= number;
    }
  }

  return result;
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

export function getPlayers(): Player[] {
  return players;
}

export function getCompetitions(): Competition[] {
  return competitions;
}

export function getResolvedTrophies(): ResolvedTrophy[] {
  return trophies
    .map((trophy) => {
      const competition = competitions.find(
        (item) => item.id === trophy.competitionId,
      );
      const winner = players.find((item) => item.id === trophy.winnerId);

      if (!competition || !winner) {
        throw new Error(`Não foi possível resolver o troféu "${trophy.id}".`);
      }

      return {
        ...trophy,
        competition,
        winner,
        displayName: `${competition.name} ${toRoman(trophy.edition)}`,
        formattedDate: formatDate(trophy.date),
      };
    })
    .sort(
      (first, second) =>
        new Date(second.date).getTime() - new Date(first.date).getTime(),
    );
}

export function getPlayerStats(): PlayerStat[] {
  return players.map((player) => ({
    player,
    trophyCount: trophies.filter((trophy) => trophy.winnerId === player.id)
      .length,
  }));
}

export function getCompetitionStats(): CompetitionStat[] {
  return competitions.map((competition) => ({
    competition,
    trophyCount: trophies.filter(
      (trophy) => trophy.competitionId === competition.id,
    ).length,
  }));
}
