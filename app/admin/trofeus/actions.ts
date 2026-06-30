"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function createDiamondTrophy(formData: FormData) {
  await requireAdmin();

  const competitionId = String(formData.get("competitionId") ?? "");
  const winnerPlayerId = String(formData.get("winnerPlayerId") ?? "");
  const trophyDate = String(formData.get("trophyDate") ?? "");
  const weapon = String(formData.get("weapon") ?? "").trim();
  const reserve = String(formData.get("reserve") ?? "").trim();
  const details = String(formData.get("details") ?? "").trim();

  if (
    !competitionId ||
    !winnerPlayerId ||
    !trophyDate ||
    !weapon ||
    !reserve ||
    !details
  ) {
    throw new Error("Informe trofeu, cacador, data, arma, reserva e relato.");
  }

  // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include trophies.
  const supabase = (await createClient()) as any;

  const { data: competition, error: competitionError } = await supabase
    .from("competitions")
    .select("id, legacy_id, slug, category")
    .eq("id", competitionId)
    .single();

  if (competitionError) {
    throw new Error(competitionError.message);
  }

  if (competition.category !== "diamond") {
    throw new Error("Apenas competicoes diamond podem ser registradas aqui.");
  }

  const { data: player, error: playerError } = await supabase
    .from("players")
    .select("id, legacy_id, slug")
    .eq("id", winnerPlayerId)
    .eq("active", true)
    .single();

  if (playerError) {
    throw new Error(playerError.message);
  }

  const { data: latestTrophy, error: latestTrophyError } = await supabase
    .from("trophies")
    .select("edition")
    .eq("competition_id", competitionId)
    .order("edition", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestTrophyError) {
    throw new Error(latestTrophyError.message);
  }

  const edition = (latestTrophy?.edition ?? 0) + 1;
  const competitionSlug = competition.legacy_id ?? competition.slug;
  const playerSlug = player.legacy_id ?? player.slug;

  const { error: trophyError } = await supabase.from("trophies").insert({
    legacy_id: `${competitionSlug}-${edition}-${playerSlug}`,
    competition_id: competitionId,
    winner_player_id: winnerPlayerId,
    edition,
    trophy_date: trophyDate,
    weapon,
    reserve,
    details,
  });

  if (trophyError) {
    throw new Error(trophyError.message);
  }

  revalidatePath("/admin/trofeus");
  revalidatePath("/exposicao");
}
