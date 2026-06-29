import type { Metadata } from "next";
import { signOut } from "@/app/login/actions";
import { LiveSessionBoard } from "@/components/live-session-board";
import { LiveSessionRefresh } from "@/components/live-session-refresh";
import { getCurrentProfile, requireUser } from "@/lib/auth";
import { getLatestOpenSession } from "@/lib/live-data";

export const metadata: Metadata = {
  title: "Competições ao vivo",
  description: "Painel privado de competições em andamento do clã OCZ.",
};

export default async function LivePage() {
  await requireUser();
  const profile = await getCurrentProfile();
  const session = await getLatestOpenSession();

  if (!profile) {
    throw new Error("Profile nao configurado para o usuario atual.");
  }

  if (session) {
    return <LiveSessionBoard session={session} profile={profile} />;
  }

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
              Esta será a tela compartilhada da gameplay, com rodada ativa,
              timer sincronizado e anotações dos jogadores.
            </p>
          </div>

          <form action={signOut}>
            <button type="submit" className="button-secondary">
              Sair
            </button>
          </form>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
          <div className="border border-dashed border-white/12 bg-white/[0.02] p-8">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-400">
              Próxima etapa
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-stone-100">
              Rodada ainda não configurada
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-400">
              O login e a proteção da área privada já estão preparados. A
              próxima implementação cria as tabelas e o fluxo de rodadas para
              ativar competições, iniciar o timer e registrar resultados.
            </p>
          </div>

          <aside className="border border-white/10 bg-[#0d120f] p-6">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
              Usuário atual
            </p>
            <p className="mt-3 font-display text-2xl font-bold text-stone-100">
              {profile.name}
            </p>
            <p className="mt-2 text-sm capitalize text-stone-500">
              {profile.role}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
