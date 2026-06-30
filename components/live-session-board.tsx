import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { LiveCountdown } from "@/components/live-countdown";
import { LiveEntryField } from "@/components/live-entry-field";
import { LiveSessionRefresh } from "@/components/live-session-refresh";
import { SubmitButton } from "@/components/submit-button";
import type { LiveSession } from "@/lib/live-session";

type LiveSessionBoardProps = {
  session: LiveSession;
  profile: {
    name: string;
    role: string;
    player_id: string | null;
  };
};

export function LiveSessionBoard({ session, profile }: LiveSessionBoardProps) {
  const statusLabel = getStatusLabel(session.status);

  return (
    <section className="live-camp-screen relative isolate min-h-[calc(100svh-5rem)] overflow-hidden py-10 sm:py-14">
      <Image
        src="/assets/login-camp.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,6,5,0.88)_0%,rgba(4,6,5,0.72)_48%,rgba(4,6,5,0.56)_100%),radial-gradient(circle_at_72%_34%,rgba(242,181,68,0.14),transparent_25rem)]" />
      <LiveSessionRefresh />

      <div className="page-container">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-amber-400">
              Quadro do acampamento
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-stone-100 sm:text-6xl">
              {session.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
              A convocação da noite está pregada no mural. Registre os relatos
              de campo enquanto o timer da fogueira segue igual para todos.
            </p>
          </div>

          <form action={signOut}>
            <SubmitButton
              className="button-secondary bg-black/25"
              pendingLabel="Saindo..."
            >
              Sair do acampamento
            </SubmitButton>
          </form>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-5">
            <div className="camp-notice-board p-5 sm:p-7">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-amber-400">
                    Transmissão da cabana
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-bold text-stone-100">
                    Rodada em andamento
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-stone-500">
                    Status do quadro:{" "}
                    <span className="capitalize text-stone-300">
                      {statusLabel}
                    </span>
                  </p>
                </div>
                <div className="inline-flex border border-amber-400/20 bg-amber-400/[0.08] px-4 py-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-300">
                  {session.session_competitions.length} convocação
                  {session.session_competitions.length === 1 ? "" : "es"}
                </div>
              </div>
            </div>

            {session.session_competitions.map((sessionCompetition, index) => {
              const winner = sessionCompetition.session_entries.find(
                (entry) =>
                  entry.player_id === sessionCompetition.winner_player_id,
              );

              return (
                <article
                  key={sessionCompetition.id}
                  className="camp-competition-note p-5 sm:p-6"
                  data-category={sessionCompetition.competitions?.category}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      {sessionCompetition.competitions?.trophy_image_url && (
                        <div className="relative hidden size-20 shrink-0 overflow-hidden border border-white/10 bg-black/25 sm:block">
                          <Image
                            src={
                              sessionCompetition.competitions.trophy_image_url
                            }
                            alt=""
                            fill
                            sizes="80px"
                            className="object-contain p-3"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                          Ficha de campo {String(index + 1).padStart(2, "0")}
                        </p>
                        <h3 className="mt-2 font-display text-3xl font-bold text-stone-100">
                          {sessionCompetition.competitions?.name}
                        </h3>
                      </div>
                    </div>
                    {winner?.players?.name && (
                      <div className="camp-winner-stamp px-4 py-3 text-left sm:text-right">
                        <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-amber-300">
                          Troféu reivindicado
                        </p>
                        <p className="mt-1 font-display text-xl font-bold text-stone-100">
                          {winner.players.name}
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="mt-4 border-y border-white/8 py-4 text-sm leading-7 text-stone-400">
                    {sessionCompetition.competitions?.objective}
                  </p>

                  <div className="mt-5 grid gap-4">
                    {sessionCompetition.session_entries.map((entry) => (
                      <LiveEntryField
                        key={entry.id}
                        entryId={entry.id}
                        currentPlayerId={profile.player_id}
                        playerId={entry.player_id}
                        playerName={entry.players?.name ?? "Jogador"}
                        initialScore={entry.score_text}
                        initialNotes={entry.notes}
                      />
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="grid content-start gap-5">
            <LiveCountdown
              startsAt={session.starts_at}
              endsAt={session.ends_at}
              status={session.status}
            />
            <div className="camp-side-panel p-6">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                Caçador no acampamento
              </p>
              <p className="mt-3 font-display text-2xl font-bold text-stone-100">
                {profile.name}
              </p>
              <p className="mt-2 text-sm capitalize text-stone-500">
                {profile.role}
              </p>
              {profile.role === "admin" && (
                <Link href="/admin" className="button-primary mt-6 w-full">
                  Preparar quadro
                </Link>
              )}
              <Link
                href="/"
                className={`${profile.role === "admin" ? "mt-4" : "mt-6"} inline-flex text-xs font-bold uppercase tracking-[0.16em] text-stone-500 transition hover:text-amber-400`}
              >
                Voltar para a trilha
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    draft: "preparando o quadro",
    scheduled: "convocação preparada",
    running: "transmissão ativa",
    finished: "rodada encerrada",
    cancelled: "convocação cancelada",
  };

  return labels[status] ?? status;
}
