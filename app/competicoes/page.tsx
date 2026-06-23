import type { Metadata } from "next";
import Image from "next/image";
import { CrosshairIcon, RifleIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { getCompetitionStats } from "@/lib/data";

export const metadata: Metadata = {
  title: "Competições",
  description:
    "Conheça as modalidades, objetivos e regras das competições do clã OCZ.",
};

export default function CompetitionsPage() {
  const competitions = getCompetitionStats();

  return (
    <>
      <PageHero
        eyebrow="As provas"
        title="Toda caçada precisa de"
        accent="um desafio."
        description="Estas são as modalidades oficiais do OCZ. As regras permanecem; cada nova edição escreve um capítulo diferente na nossa história."
      />
      <section className="section-space">
        <div className="page-container">
          <div className="mb-10 flex items-end justify-between gap-6 border-b border-white/8 pb-6">
            <p className="text-sm text-stone-500">
              {competitions.length} modalidades registradas
            </p>
            <p className="hidden text-[0.6rem] font-bold uppercase tracking-[0.2em] text-stone-600 sm:block">
              Catálogo oficial OCZ
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {competitions.map(({ competition, trophyCount }, index) => (
              <article
                key={competition.id}
                className="competition-card grid sm:grid-cols-[13rem_1fr]"
              >
                <div className="relative min-h-64 overflow-hidden border-b border-white/8 bg-[radial-gradient(circle_at_50%_55%,rgba(242,181,68,0.16),transparent_58%)] sm:min-h-full sm:border-b-0 sm:border-r">
                  <span className="absolute left-4 top-4 z-10 font-display text-3xl font-bold text-white/10">
                    0{index + 1}
                  </span>
                  <Image
                    src={competition.trophyImage}
                    alt={`Troféu da competição ${competition.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 208px"
                    className="object-contain p-7 drop-shadow-[0_18px_20px_rgba(0,0,0,0.55)]"
                  />
                </div>
                <div className="flex flex-col p-6 sm:p-7">
                  <div>
                    <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-amber-400">
                      {trophyCount}{" "}
                      {trophyCount === 1
                        ? "edição premiada"
                        : "edições premiadas"}
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-bold text-stone-100">
                      {competition.name}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-stone-400">
                      {competition.objective}
                    </p>
                  </div>
                  <div className="mt-6 space-y-4 border-t border-white/8 pt-5">
                    <div className="flex gap-3">
                      <RifleIcon className="mt-0.5 size-5 shrink-0 text-amber-400" />
                      <div>
                        <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-stone-600">
                          Armas permitidas
                        </p>
                        <p className="mt-1 text-sm text-stone-300">
                          {competition.allowedWeapons.join(" · ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CrosshairIcon className="mt-0.5 size-5 shrink-0 text-amber-400" />
                      <div>
                        <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-stone-600">
                          Condições especiais
                        </p>
                        <p className="mt-1 text-sm leading-6 text-stone-300">
                          {competition.specialConditions ??
                            "Sem condições especiais."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
