import { signOut } from "@/app/login/actions";
import { LiveCountdown } from "@/components/live-countdown";
import { LiveEntryField } from "@/components/live-entry-field";
import { LiveSessionRefresh } from "@/components/live-session-refresh";
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
  return (
    <section className="section-space">
      <LiveSessionRefresh />
      <div className="page-container">
        <div className="mb-10 flex flex-col gap-5 border-b border-white/8 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Painel privado</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-stone-100 sm:text-5xl">
              Competições ao vivo
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-400">
              Esta é a tela compartilhada da gameplay, com rodada ativa, timer
              sincronizado e anotações dos jogadores.
            </p>
          </div>

          <form action={signOut}>
            <button type="submit" className="button-secondary">
              Sair
            </button>
          </form>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
          <div className="grid gap-5">
            <div className="border border-white/10 bg-white/[0.025] p-6">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-400">
                Rodada atual
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-stone-100">
                {session.title}
              </h2>
              <p className="mt-2 text-sm capitalize text-stone-500">
                Status: {session.status}
              </p>
            </div>

            {session.session_competitions.map((sessionCompetition) => (
              <article
                key={sessionCompetition.id}
                className="border border-white/10 bg-[#0d120f] p-6"
              >
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                  Competição ativa
                </p>
                <h3 className="mt-2 font-display text-3xl font-bold text-stone-100">
                  {sessionCompetition.competitions?.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-400">
                  {sessionCompetition.competitions?.objective}
                </p>
                <div className="mt-6 grid gap-4">
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
            ))}
          </div>

          <aside className="grid content-start gap-5">
            <LiveCountdown
              startsAt={session.starts_at}
              endsAt={session.ends_at}
              status={session.status}
            />
            <div className="border border-white/10 bg-[#0d120f] p-6">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                Usuário atual
              </p>
              <p className="mt-3 font-display text-2xl font-bold text-stone-100">
                {profile.name}
              </p>
              <p className="mt-2 text-sm capitalize text-stone-500">
                {profile.role}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
