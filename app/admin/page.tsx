import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin",
  description: "Painel administrativo do clÃ£ OCZ.",
};

export default async function AdminPage() {
  const profile = await requireAdmin();

  return (
    <section className="section-space">
      <div className="page-container">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-stone-100 sm:text-5xl">
          Painel OCZ
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-400">
          OlÃ¡, {profile.name}. ComeÃ§amos pelo fluxo de rodadas ao vivo; os
          mÃ³dulos de CMS entram nas prÃ³ximas fases.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <Link
            href="/admin/rodadas"
            className="border border-white/10 bg-white/[0.03] p-6 transition hover:border-amber-400/50"
          >
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-400">
              Gameplay
            </span>
            <span className="mt-3 block font-display text-3xl font-bold text-stone-100">
              Rodadas ao vivo
            </span>
            <span className="mt-4 block text-sm leading-7 text-stone-400">
              Monte uma rodada, escolha competiÃ§Ãµes e inicie o timer.
            </span>
          </Link>
          <Link
            href="/admin/trofeus"
            className="border border-white/10 bg-white/[0.03] p-6 transition hover:border-amber-400/50"
          >
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-400">
              CMS
            </span>
            <span className="mt-3 block font-display text-3xl font-bold text-stone-100">
              Trofeus
            </span>
            <span className="mt-4 block text-sm leading-7 text-stone-400">
              Confira os trofeus registrados no banco a partir das rodadas.
            </span>
          </Link>

          <Link
            href="/admin/competicoes"
            className="border border-white/10 bg-white/[0.03] p-6 transition hover:border-amber-400/50"
          >
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-400">
              CMS
            </span>
            <span className="mt-3 block font-display text-3xl font-bold text-stone-100">
              Competicoes
            </span>
            <span className="mt-4 block text-sm leading-7 text-stone-400">
              Crie, edite e desative competicoes sem alterar o codigo.
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
