import type { Metadata } from "next";
import { signOut } from "@/app/login/actions";
import { getAdminTrophies } from "@/lib/admin-trophies";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/data";

export const metadata: Metadata = {
  title: "Troféus",
  description: "Administração dos troféus oficiais do clã OCZ.",
};

export default async function AdminTrophiesPage() {
  await requireAdmin();
  const trophies = await getAdminTrophies();

  return (
    <section className="section-space">
      <div className="page-container">
        <div className="mb-10 flex flex-col gap-5 border-b border-white/8 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-stone-100 sm:text-5xl">
              Troféus oficiais
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-400">
              Confira os troféus registrados no banco. A criação inicial vem a
              partir dos vencedores definidos em rodadas ao vivo.
            </p>
          </div>
          <form action={signOut}>
            <button type="submit" className="button-secondary">
              Sair
            </button>
          </form>
        </div>

        {trophies.length > 0 ? (
          <div className="grid gap-4">
            {trophies.map((trophy) => (
              <article
                key={trophy.id}
                className="grid gap-4 border border-white/10 bg-white/[0.025] p-5 md:grid-cols-[1fr_auto] md:items-start"
              >
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-400">
                    {formatDate(trophy.trophy_date)}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-stone-100">
                    {trophy.competitions?.name ?? "Competição"} {trophy.edition}
                  </h2>
                  <p className="mt-2 text-sm text-stone-500">
                    Campeão: {trophy.players?.name ?? "Jogador"}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-stone-400">
                    {trophy.details}
                  </p>
                </div>
                <div className="grid gap-2 text-sm text-stone-400 md:min-w-64">
                  <span className="border border-white/8 bg-black/20 px-3 py-2">
                    Reserva: {trophy.reserve}
                  </span>
                  <span className="border border-white/8 bg-black/20 px-3 py-2">
                    Arma: {trophy.weapon}
                  </span>
                  <span className="border border-white/8 bg-black/20 px-3 py-2 capitalize">
                    Categoria: {trophy.competitions?.category ?? "-"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid min-h-72 place-items-center border border-dashed border-white/12 bg-white/[0.02] p-8 text-center">
            <div>
              <h2 className="font-display text-3xl font-bold text-stone-100">
                Nenhum troféu no banco ainda
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-stone-400">
                Defina um vencedor em uma rodada e use a ação de criar troféu
                para registrar a primeira conquista pelo CMS.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
