import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  createGameplaySession,
  createTrophyFromSessionCompetition,
  finishGameplaySession,
  setSessionCompetitionWinner,
  startGameplaySession,
} from "@/app/admin/actions";
import { signOut } from "@/app/login/actions";
import { requireAdmin } from "@/lib/auth";
import { getLatestOpenSession } from "@/lib/live-data";
import { getCompetitionCatalog } from "@/lib/public-competitions";

export const metadata: Metadata = {
  title: "Mapa da Caçada",
  description: "Preparação de rodadas ao vivo do clã OCZ.",
};

export default async function AdminRoundsPage() {
  await requireAdmin();
  const today = new Date().toISOString().slice(0, 10);
  const [session, competitions] = await Promise.all([
    getLatestOpenSession(),
    getCompetitionCatalog(),
  ]);
  const standardCompetitions = competitions.filter(
    (competition) => competition.category === "standard",
  );

  return (
    <section className="round-map-screen relative isolate min-h-[calc(100svh-5rem)] overflow-hidden py-10 sm:py-14">
      <Image
        src="/assets/login-camp.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,6,5,0.9)_0%,rgba(4,6,5,0.74)_48%,rgba(4,6,5,0.56)_100%),radial-gradient(circle_at_70%_35%,rgba(242,181,68,0.14),transparent_25rem)]" />

      <div className="page-container">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-amber-400">
              Mesa do mapa
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-stone-100 sm:text-6xl">
              Mapa da Caçada
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
              Escolha as provas oficiais da noite e prepare o quadro do
              acampamento. Troféus diamante são conquistas avulsas da caçada e
              não entram em rodadas.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin" className="button-secondary bg-black/25">
              Posto de comando
            </Link>
            <form action={signOut}>
              <button type="submit" className="button-secondary bg-black/25">
                Sair do acampamento
              </button>
            </form>
          </div>
        </div>

        {session && (
          <div className="round-map-board mb-8 grid gap-5 p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-400">
                  Convocação atual
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold text-stone-100">
                  {session.title}
                </h2>
                <p className="mt-2 text-sm capitalize text-stone-500">
                  Status da vigília: {getStatusLabel(session.status)}
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
                      Acender fogueira
                    </button>
                  </form>
                )}
                <form action={finishGameplaySession}>
                  <input type="hidden" name="sessionId" value={session.id} />
                  <button
                    type="submit"
                    className="button-secondary bg-black/20"
                  >
                    Encerrar vigília
                  </button>
                </form>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {session.session_competitions.map((sessionCompetition, index) => {
                const winner = sessionCompetition.session_entries.find(
                  (entry) =>
                    entry.player_id === sessionCompetition.winner_player_id,
                );

                return (
                  <div
                    key={sessionCompetition.id}
                    className="round-pinned-note grid gap-4 p-4"
                  >
                    <form
                      action={setSessionCompetitionWinner}
                      className="grid gap-4"
                    >
                      <input
                        type="hidden"
                        name="sessionCompetitionId"
                        value={sessionCompetition.id}
                      />
                      <div>
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                          Prova pregada {String(index + 1).padStart(2, "0")}
                        </p>
                        <h3 className="mt-2 font-display text-2xl font-bold text-stone-100">
                          {sessionCompetition.competitions?.name ??
                            "Competição"}
                        </h3>
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-stone-500">
                          {winner?.players?.name
                            ? `Troféu reivindicado por ${winner.players.name}`
                            : "Troféu ainda sem dono"}
                        </p>
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <select
                          name="winnerPlayerId"
                          defaultValue={
                            sessionCompetition.winner_player_id ?? ""
                          }
                          className="min-h-11 flex-1 border border-white/10 bg-black/25 px-3 text-sm text-stone-100 outline-none transition focus:border-amber-400"
                        >
                          <option value="">Sem vencedor</option>
                          {sessionCompetition.session_entries.map((entry) => (
                            <option
                              key={entry.player_id}
                              value={entry.player_id}
                            >
                              {entry.players?.name ?? "Jogador"}
                            </option>
                          ))}
                        </select>
                        <button type="submit" className="button-primary">
                          Registrar vencedor
                        </button>
                      </div>
                    </form>

                    {sessionCompetition.winner_player_id && (
                      <form
                        action={createTrophyFromSessionCompetition}
                        className="grid gap-3 border border-amber-400/16 bg-amber-400/[0.035] p-4"
                      >
                        <input
                          type="hidden"
                          name="sessionCompetitionId"
                          value={sessionCompetition.id}
                        />
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-400">
                          Registro no acervo
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            name="trophyDate"
                            type="date"
                            required
                            defaultValue={today}
                            className="min-h-11 border border-white/10 bg-black/25 px-3 text-sm text-stone-100 outline-none transition focus:border-amber-400"
                          />
                          <input
                            name="reserve"
                            required
                            placeholder="Reserva"
                            className="min-h-11 border border-white/10 bg-black/25 px-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400"
                          />
                        </div>
                        <input
                          name="weapon"
                          required
                          placeholder="Arma usada"
                          className="min-h-11 border border-white/10 bg-black/25 px-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400"
                        />
                        <textarea
                          name="details"
                          required
                          rows={3}
                          placeholder="Relato da conquista"
                          className="resize-none border border-white/10 bg-black/25 px-3 py-2 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400"
                        />
                        <button
                          type="submit"
                          className="button-secondary justify-self-start bg-black/20"
                        >
                          Enviar para o acervo
                        </button>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <form
            action={createGameplaySession}
            className="round-map-board p-5 sm:p-7"
          >
            {session && (
              <div className="mb-5 border border-amber-400/20 bg-amber-400/[0.06] p-4 text-sm leading-6 text-stone-300">
                Há uma convocação ativa no quadro. Encerre a vigília antes de
                preparar outra.
              </div>
            )}
            <fieldset
              disabled={Boolean(session)}
              className="grid gap-6 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-amber-400">
                  Preparar quadro
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold text-stone-100">
                  Nova expedição
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-[1fr_12rem]">
                <label className="grid gap-2">
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                    Nome da expedição
                  </span>
                  <input
                    name="title"
                    required
                    defaultValue="Gameplay OCZ"
                    className="min-h-12 border border-white/10 bg-black/22 px-4 text-sm text-stone-100 outline-none transition focus:border-amber-400"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                    Duração da vigília
                  </span>
                  <input
                    name="durationMinutes"
                    type="number"
                    min={1}
                    defaultValue={30}
                    required
                    className="min-h-12 border border-white/10 bg-black/22 px-4 text-sm text-stone-100 outline-none transition focus:border-amber-400"
                  />
                </label>
              </div>

              <div>
                <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                  Provas oficiais
                </p>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {standardCompetitions.map((competition) => (
                    <label
                      key={competition.id}
                      className="round-competition-choice grid cursor-pointer gap-3 p-4"
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
                            Prova oficial
                          </span>
                        </span>
                      </span>
                      <span className="text-sm leading-6 text-stone-400">
                        {competition.objective}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="button-primary justify-self-start"
              >
                Preparar quadro
              </button>
            </fieldset>
          </form>

          <aside className="round-map-side p-6">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-400">
              Regras da noite
            </p>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-400">
              <p className="border border-white/8 bg-black/18 p-3">
                Apenas provas oficiais entram na rodada.
              </p>
              <p className="border border-white/8 bg-black/18 p-3">
                Troféus diamante são concedidos fora da vigília, quando um
                animal diamante aparece.
              </p>
              <p className="border border-white/8 bg-black/18 p-3">
                Encerre a rodada aberta antes de preparar uma nova convocação.
              </p>
              <p className="border border-white/8 bg-black/18 p-3">
                Ao final, registre o vencedor e envie a conquista para o acervo.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    draft: "quadro preparado",
    scheduled: "convocação preparada",
    running: "fogueira acesa",
    finished: "vigília encerrada",
    cancelled: "convocação cancelada",
  };

  return labels[status] ?? status;
}
