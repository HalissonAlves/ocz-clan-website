import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { getAdminTrophies } from "@/lib/admin-trophies";
import { requireAdmin } from "@/lib/auth";
import { formatDate, toRoman } from "@/lib/data";

export const metadata: Metadata = {
  title: "Acervo da Cabana",
  description: "Administração dos troféus oficiais do clã OCZ.",
};

export default async function AdminTrophiesPage() {
  await requireAdmin();
  const trophies = await getAdminTrophies();
  const standardCount = trophies.filter(
    (trophy) => trophy.competitions?.category === "standard",
  ).length;
  const diamondCount = trophies.filter(
    (trophy) => trophy.competitions?.category === "diamond",
  ).length;
  const latestTrophy = trophies[0];

  return (
    <section className="trophy-vault-screen relative isolate min-h-[calc(100svh-5rem)] overflow-hidden py-10 sm:py-14">
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
              Sala do acervo
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-stone-100 sm:text-6xl">
              Acervo da Cabana
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
              Revise as conquistas que já foram guardadas na história do clã.
              Cada ficha registra o caçador, o território e a ferramenta usada
              na caçada.
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

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-5">
            <div className="trophy-vault-ledger p-5 sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <VaultStat label="Total no acervo" value={trophies.length} />
                <VaultStat label="Provas oficiais" value={standardCount} />
                <VaultStat label="Diamantes" value={diamondCount} />
                <VaultStat
                  label="Última ficha"
                  value={
                    latestTrophy
                      ? formatDate(latestTrophy.trophy_date)
                      : "Aguardando"
                  }
                  compact
                />
              </div>
            </div>

            <div className="trophy-vault-ledger p-5 sm:p-7">
              <div className="mb-6 flex flex-col gap-3 border-b border-white/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-amber-400">
                    Inventário da cabana
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-bold text-stone-100">
                    Fichas de acervo
                  </h2>
                </div>
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
                  {trophies.length} conquista{trophies.length === 1 ? "" : "s"}
                </p>
              </div>

              {trophies.length > 0 ? (
                <div className="grid gap-4">
                  {trophies.map((trophy) => (
                    <article
                      key={trophy.id}
                      className="trophy-vault-card grid gap-4 p-5 md:grid-cols-[7rem_1fr_auto] md:items-start"
                      data-category={trophy.competitions?.category}
                    >
                      <div className="relative aspect-square overflow-hidden border border-white/10 bg-black/22">
                        {trophy.competitions?.trophy_image_url && (
                          <Image
                            src={trophy.competitions.trophy_image_url}
                            alt=""
                            fill
                            sizes="112px"
                            className="object-contain p-3"
                          />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="trophy-vault-pill"
                            data-category={trophy.competitions?.category}
                          >
                            {trophy.competitions?.category === "diamond"
                              ? "Diamante"
                              : "Prova oficial"}
                          </span>
                          <span className="border border-white/10 bg-black/20 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-500">
                            Registrado em {formatDate(trophy.trophy_date)}
                          </span>
                        </div>
                        <h3 className="mt-3 font-display text-2xl font-bold text-stone-100">
                          {trophy.competitions?.name ?? "Competição"}{" "}
                          <span className="text-amber-400">
                            {toRoman(trophy.edition)}
                          </span>
                        </h3>
                        <p className="mt-2 text-sm text-stone-500">
                          Caçador:{" "}
                          <span className="text-stone-300">
                            {trophy.players?.name ?? "Jogador"}
                          </span>
                        </p>
                        <p className="mt-4 text-sm leading-7 text-stone-400">
                          {trophy.details}
                        </p>
                      </div>

                      <div className="grid gap-2 text-sm text-stone-400 md:min-w-64">
                        <span className="border border-white/8 bg-black/20 px-3 py-2">
                          Território: {trophy.reserve}
                        </span>
                        <span className="border border-white/8 bg-black/20 px-3 py-2">
                          Ferramenta: {trophy.weapon}
                        </span>
                        <span className="border border-white/8 bg-black/20 px-3 py-2 capitalize">
                          Tipo: {trophy.competitions?.category ?? "-"}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="grid min-h-72 place-items-center border border-dashed border-white/12 bg-black/16 p-8 text-center">
                  <div>
                    <h2 className="font-display text-3xl font-bold text-stone-100">
                      O acervo ainda está vazio
                    </h2>
                    <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-stone-400">
                      Quando uma vigília gerar uma conquista, envie o troféu
                      pelo Mapa da Caçada para guardar a história aqui.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="trophy-vault-side p-6">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-400">
              Como o acervo cresce
            </p>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-400">
              <p className="border border-white/8 bg-black/18 p-3">
                Rodadas oficiais geram troféus quando o admin registra o
                vencedor.
              </p>
              <p className="border border-sky-300/14 bg-sky-300/[0.035] p-3">
                Troféus diamante serão registrados como conquistas avulsas.
              </p>
              <p className="border border-white/8 bg-black/18 p-3">
                O acervo preserva histórico, edição, território, arma e relato.
              </p>
              <p className="border border-white/8 bg-black/18 p-3">
                Evite apagar registros: eles contam a história do clã.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function VaultStat({
  label,
  value,
  compact,
}: {
  label: string;
  value: number | string;
  compact?: boolean;
}) {
  return (
    <div className="border border-white/8 bg-black/18 p-4">
      <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-stone-500">
        {label}
      </p>
      <p
        className={
          compact
            ? "mt-2 text-sm font-bold leading-6 text-stone-100"
            : "mt-2 font-display text-4xl font-bold text-stone-100"
        }
      >
        {value}
      </p>
    </div>
  );
}
