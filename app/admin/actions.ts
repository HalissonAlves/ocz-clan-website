"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getCompetitionCatalog, toCompetitionRow } from "@/lib/live-session";
import { createClient } from "@/lib/supabase/server";

export async function createGameplaySession(formData: FormData) {
  const profile = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const durationMinutes = Number(formData.get("durationMinutes") ?? 30);
  const competitionIds = formData
    .getAll("competitionIds")
    .map(String)
    .filter(Boolean);

  if (
    !title ||
    competitionIds.length === 0 ||
    !Number.isFinite(durationMinutes)
  ) {
    throw new Error("Informe titulo, duracao e ao menos uma competicao.");
  }

  const catalog = getCompetitionCatalog();
  const selectedCompetitions = catalog.filter((competition) =>
    competitionIds.includes(competition.id),
  );

  // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include live tables.
  const supabase = (await createClient()) as any;

  const { data: existingSession, error: existingSessionError } = await supabase
    .from("gameplay_sessions")
    .select("id")
    .in("status", ["draft", "scheduled", "running"])
    .limit(1)
    .maybeSingle();

  if (existingSessionError) {
    throw new Error(existingSessionError.message);
  }

  if (existingSession) {
    throw new Error("Finalize a rodada aberta antes de criar uma nova.");
  }

  const { data: session, error: sessionError } = await supabase
    .from("gameplay_sessions")
    .insert({
      title,
      duration_minutes: Math.max(1, Math.round(durationMinutes)),
      created_by: profile.id,
    })
    .select("id")
    .single();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const { data: competitionRows, error: competitionsError } = await supabase
    .from("competitions")
    .upsert(selectedCompetitions.map(toCompetitionRow), {
      onConflict: "legacy_id",
    })
    .select("id, legacy_id");

  if (competitionsError) {
    throw new Error(competitionsError.message);
  }

  const sessionCompetitionRows = competitionRows.map(
    (competition: { id: string }) => ({
      session_id: session.id,
      competition_id: competition.id,
    }),
  );

  const { data: sessionCompetitions, error: sessionCompetitionsError } =
    await supabase
      .from("session_competitions")
      .insert(sessionCompetitionRows)
      .select("id");

  if (sessionCompetitionsError) {
    throw new Error(sessionCompetitionsError.message);
  }

  const { data: players, error: playersError } = await supabase
    .from("players")
    .select("id")
    .eq("active", true);

  if (playersError) {
    throw new Error(playersError.message);
  }

  const entryRows = sessionCompetitions.flatMap(
    (sessionCompetition: { id: string }) =>
      players.map((player: { id: string }) => ({
        session_competition_id: sessionCompetition.id,
        player_id: player.id,
      })),
  );

  if (entryRows.length > 0) {
    const { error: entriesError } = await supabase
      .from("session_entries")
      .insert(entryRows);

    if (entriesError) {
      throw new Error(entriesError.message);
    }
  }

  revalidatePath("/admin/rodadas");
  redirect("/admin/rodadas");
}

export async function startGameplaySession(formData: FormData) {
  await requireAdmin();
  const sessionId = String(formData.get("sessionId") ?? "");
  const durationMinutes = Number(formData.get("durationMinutes") ?? 30);
  const startsAt = new Date();
  const endsAt = new Date(startsAt.getTime() + durationMinutes * 60_000);
  // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include live tables.
  const supabase = (await createClient()) as any;

  const { error } = await supabase
    .from("gameplay_sessions")
    .update({
      status: "running",
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      duration_minutes: Math.max(1, Math.round(durationMinutes)),
    })
    .eq("id", sessionId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/rodadas");
  revalidatePath("/ao-vivo");
}

export async function finishGameplaySession(formData: FormData) {
  await requireAdmin();
  const sessionId = String(formData.get("sessionId") ?? "");
  // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include live tables.
  const supabase = (await createClient()) as any;

  const { error } = await supabase
    .from("gameplay_sessions")
    .update({ status: "finished" })
    .eq("id", sessionId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/rodadas");
  revalidatePath("/ao-vivo");
}

export async function setSessionCompetitionWinner(formData: FormData) {
  await requireAdmin();
  const sessionCompetitionId = String(
    formData.get("sessionCompetitionId") ?? "",
  );
  const winnerPlayerId = String(formData.get("winnerPlayerId") ?? "");

  if (!sessionCompetitionId) {
    throw new Error("Competicao da rodada nao informada.");
  }

  // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include live tables.
  const supabase = (await createClient()) as any;
  const { error } = await supabase
    .from("session_competitions")
    .update({
      winner_player_id: winnerPlayerId || null,
      status: winnerPlayerId ? "finished" : "active",
    })
    .eq("id", sessionCompetitionId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/rodadas");
  revalidatePath("/ao-vivo");
}
