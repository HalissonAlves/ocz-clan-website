import type { Metadata } from "next";
import {
  createGameplaySession,
  finishGameplaySession,
  setSessionCompetitionWinner,
  startGameplaySession,
} from "@/app/admin/actions";
import { signOut } from "@/app/login/actions";
import { requireAdmin } from "@/lib/auth";
import { getLatestOpenSession } from "@/lib/live-data";
import { getCompetitionCatalog } from "@/lib/live-session";

export const metadata: Metadata = {
  title: "Rodadas",
  description: "Administracao de rodadas ao vivo do cla OCZ.",
};

export default async function AdminRoundsPage() {
  await requireAdmin();
  const [session, competitions] = await Promise.all([
    getLatestOpenSession(),
    Promise.resolve(getCompetitionCatalog()),
  ]);

  return (
    <section className="section-space">
      <div className="page-container">
        <div className="mb-10 flex flex-col gap-5 border-b border-white/8 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-stone-100 sm:text-5xl">
              Rodadas ao vivo
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-400">
              Crie a rodada da gameplay atual e escolha quais competicoes ficam
              ativas para os jogadores.
            </p>
          </div>
          <form action={signOut}>
            <button type="submit" className="button-secondary">
              Sair
            </button>
          </form>
        </div>

        {session && (
          <div className="mb-8 grid gap-5 border border-amber-400/20 bg-amber-400/[0.06] p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-400">
                  Rodada aberta
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold text-stone-100">
                  {session.title}
                </h2>
                <p className="mt-2 text-sm capitalize text-stone-500">
                  Status: {session.status}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {session.status !== "running" && (
                  <form action={startGameplaySession}>
                    <input type="hidden" name="sessionId" value={session.id} />
                    <input
                      type="hidden"
                      name="durationMinutes"
                      value={session.duration_minutes}
                    />
                    <button type="submit" className="button-primary">
                      Iniciar
                    </button>
                  </form>
                )}
                <form action={finishGameplaySession}>
                  <input type="hidden" name="sessionId" value={session.id} />
                  <button type="submit" className="button-secondary">
                    Finalizar
                  </button>
                </form>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {session.session_competitions.map((sessionCompetition) => {
                const winner = sessionCompetition.session_entries.find(
                  (entry) =>
                    entry.player_id === sessionCompetition.winner_player_id,
                );

                return (
                  <form
                    key={sessionCompetition.id}
                    action={setSessionCompetitionWinner}
                    className="grid gap-4 border border-white/10 bg-black/20 p-4"
                  >
                    <input
                      type="hidden"
                      name="sessionCompetitionId"
                      value={sessionCompetition.id}
                    />
                    <div>
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                        Vencedor
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-bold text-stone-100">
                        {sessionCompetition.competitions?.name ?? "Competicao"}
                      </h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-stone-500">
                        {winner?.players?.name
                          ? `Atual: ${winner.players.name}`
                          : "Sem vencedor definido"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <select
                        name="winnerPlayerId"
                        defaultValue={sessionCompetition.winner_player_id ?? ""}
                        className="min-h-11 flex-1 border border-white/10 bg-[#0d120f] px-3 text-sm text-stone-100 outline-none transition focus:border-amber-400"
                      >
                        <option value="">Sem vencedor</option>
                        {sessionCompetition.session_entries.map((entry) => (
                          <option key={entry.player_id} value={entry.player_id}>
                            {entry.players?.name ?? "Jogador"}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className="button-primary">
                        Salvar
                      </button>
                    </div>
                  </form>
                );
              })}
            </div>
          </div>
        )}

        <form action={createGameplaySession}>
          {session && (
            <div className="mb-5 border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-stone-400">
              Finalize a rodada aberta antes de criar uma nova.
            </div>
          )}
          <fieldset
            disabled={Boolean(session)}
            className="grid gap-6 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <div className="grid gap-5 md:grid-cols-[1fr_12rem]">
              <label className="grid gap-2">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                  Titulo
                </span>
                <input
                  name="title"
                  required
                  defaultValue="Gameplay OCZ"
                  className="min-h-12 border border-white/10 bg-white/[0.04] px-4 text-sm text-stone-100 outline-none transition focus:border-amber-400"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                  Minutos
                </span>
                <input
                  name="durationMinutes"
                  type="number"
                  min={1}
                  defaultValue={30}
                  required
                  className="min-h-12 border border-white/10 bg-white/[0.04] px-4 text-sm text-stone-100 outline-none transition focus:border-amber-400"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {competitions.map((competition) => (
                <label
                  key={competition.id}
                  className="grid cursor-pointer gap-3 border border-white/10 bg-white/[0.025] p-4 transition hover:border-white/25"
                >
                  <span className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="competitionIds"
                      value={competition.id}
                      className="mt-1 size-4 accent-amber-400"
                    />
                    <span>
                      <span className="block font-display text-xl font-bold text-stone-100">
                        {competition.name}
                      </span>
                      <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-stone-500">
                        {competition.category}
                      </span>
                    </span>
                  </span>
                  <span className="text-sm leading-6 text-stone-400">
                    {competition.objective}
                  </span>
                </label>
              ))}
            </div>

            <button type="submit" className="button-primary justify-self-start">
              Criar rodada
            </button>
          </fieldset>
        </form>
      </div>
    </section>
  );
}
