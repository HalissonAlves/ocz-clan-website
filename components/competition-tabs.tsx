"use client";

import Image from "next/image";
import { useState } from "react";
import { CrosshairIcon, RifleIcon } from "@/components/icons";
import { TrophyLightbox } from "@/components/trophy-lightbox";
import type { Competition, CompetitionStat } from "@/lib/types";

type CompetitionCategory = Competition["category"];
type CompetitionTarget = NonNullable<Competition["target"]>;

type CompetitionTargetTab = {
  id: "all" | string;
  label: string;
  count: number;
  type?: CompetitionTarget["type"];
};

type CompetitionTabsProps = {
  competitions: CompetitionStat[];
};

const categories: {
  id: CompetitionCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "standard",
    label: "Competições padrão",
    description: "Desafios oficiais de distância, precisão e armamento.",
  },
  {
    id: "diamond",
    label: "Competições diamante",
    description: "Troféus especiais concedidos por animais Diamante.",
  },
];

const targetTypeOrder: Record<CompetitionTarget["type"], number> = {
  general: 0,
  group: 1,
  species: 2,
};

function getStandardTargetTabs(competitions: CompetitionStat[]) {
  const targets = new Map<string, Omit<CompetitionTargetTab, "id">>();

  for (const { competition } of competitions) {
    if (competition.category !== "standard" || !competition.target) {
      continue;
    }

    const currentTarget = targets.get(competition.target.slug);

    targets.set(competition.target.slug, {
      label: competition.target.label,
      type: competition.target.type,
      count: (currentTarget?.count ?? 0) + 1,
    });
  }

  const targetTabs = Array.from(targets.entries())
    .map(([id, target]) => ({ id, ...target }))
    .sort((first, second) => {
      const orderDifference =
        targetTypeOrder[first.type ?? "species"] -
        targetTypeOrder[second.type ?? "species"];

      if (orderDifference !== 0) {
        return orderDifference;
      }

      return first.label.localeCompare(second.label, "pt-BR");
    });

  return [
    { id: "all", label: "Todas", count: competitions.length },
    ...targetTabs,
  ];
}
export function CompetitionTabs({ competitions }: CompetitionTabsProps) {
  const [activeCategory, setActiveCategory] =
    useState<CompetitionCategory>("standard");
  const [activeTarget, setActiveTarget] = useState("all");
  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);
  const categoryCompetitions = competitions.filter(
    ({ competition }) => competition.category === activeCategory,
  );
  const targetTabs =
    activeCategory === "standard"
      ? getStandardTargetTabs(categoryCompetitions)
      : [];
  const activeCompetitions =
    activeCategory === "standard" && activeTarget !== "all"
      ? categoryCompetitions.filter(
          ({ competition }) => competition.target?.slug === activeTarget,
        )
      : categoryCompetitions;
  const activeCategoryData = categories.find(
    (category) => category.id === activeCategory,
  );

  return (
    <div>
      <div className="mb-10 border-b border-white/8">
        <nav
          className="flex gap-2 overflow-x-auto pb-px"
          aria-label="Categorias de competições"
        >
          {categories.map((category) => {
            const count = competitions.filter(
              ({ competition }) => competition.category === category.id,
            ).length;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setActiveCategory(category.id);
                  setActiveTarget("all");
                }}
                className={
                  "group relative flex min-h-14 shrink-0 items-center gap-3 px-4 text-left text-[0.68rem] font-bold uppercase tracking-[0.14em] transition-colors sm:px-6 " +
                  (isActive
                    ? "text-amber-400"
                    : "text-stone-500 hover:text-stone-200")
                }
              >
                <span>{category.label}</span>
                <span
                  className={
                    "flex size-6 items-center justify-center rounded-full text-[0.6rem] transition-colors " +
                    (isActive
                      ? "bg-amber-400 text-stone-950"
                      : "bg-white/6 text-stone-500 group-hover:text-stone-200")
                  }
                >
                  {count}
                </span>
                <span
                  className={
                    "absolute inset-x-0 bottom-0 h-px transition-colors " +
                    (isActive ? "bg-amber-400" : "bg-transparent")
                  }
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </nav>
      </div>

      {activeCategory === "standard" && targetTabs.length > 1 && (
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible md:pb-0">
          {targetTabs.map((target) => {
            const isActive = activeTarget === target.id;

            return (
              <button
                key={target.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveTarget(target.id)}
                className={
                  "flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[0.62rem] font-bold uppercase tracking-[0.14em] transition-colors " +
                  (isActive
                    ? "border-amber-400 bg-amber-400 text-stone-950"
                    : "border-white/10 bg-white/4 text-stone-500 hover:border-white/20 hover:text-stone-200")
                }
              >
                <span>{target.label}</span>
                <span
                  className={
                    "flex size-5 items-center justify-center rounded-full text-[0.56rem] transition-colors " +
                    (isActive
                      ? "bg-stone-950/15 text-stone-950"
                      : "bg-white/6 text-stone-500")
                  }
                >
                  {target.count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="text-sm leading-6 text-stone-400">
            {activeCategoryData?.description}
          </p>
          <p className="mt-1 text-xs text-stone-600">
            {activeCompetitions.length}{" "}
            {activeCompetitions.length === 1
              ? "modalidade registrada"
              : "modalidades registradas"}
          </p>
        </div>
        <p className="hidden text-[0.6rem] font-bold uppercase tracking-[0.2em] text-stone-600 sm:block">
          Catálogo oficial OCZ
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {activeCompetitions.map(({ competition, trophyCount }, index) => (
          <article
            key={competition.id}
            data-card-variant={competition.category}
            className="competition-card grid sm:grid-cols-[13rem_1fr]"
          >
            <button
              type="button"
              onClick={() => setSelectedCompetition(competition)}
              data-glow-variant={competition.category}
              className="group trophy-glow relative min-h-64 cursor-zoom-in overflow-hidden border-b border-white/8 text-left sm:min-h-full sm:border-b-0 sm:border-r"
              aria-label={`Ampliar troféu da competição ${competition.name}`}
            >
              <span className="absolute left-4 top-4 z-10 font-display text-3xl font-bold text-white/10">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Image
                src={competition.trophyImage}
                alt={`Troféu da competição ${competition.name}`}
                fill
                sizes="(max-width: 640px) 100vw, 208px"
                className="object-contain p-7 drop-shadow-[0_18px_20px_rgba(0,0,0,0.55)] transition duration-300 group-hover:scale-110"
              />
              <span className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 translate-y-2 whitespace-nowrap border border-white/15 bg-black/50 px-3 py-2 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-stone-200 opacity-0 backdrop-blur-sm transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                Ver ampliado
              </span>
            </button>
            <div className="flex flex-col p-6 sm:p-7">
              <div>
                <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-amber-400">
                  {trophyCount}{" "}
                  {trophyCount === 1 ? "edição premiada" : "edições premiadas"}
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
                    {competition.specialConditions.length > 0 ? (
                      <ul className="mt-2 space-y-1.5 text-sm leading-6 text-stone-300">
                        {competition.specialConditions.map((condition) => (
                          <li
                            key={condition}
                            className="flex items-start gap-2"
                          >
                            <span
                              className="mt-[0.65rem] size-1 shrink-0 rounded-full bg-amber-400"
                              aria-hidden="true"
                            />
                            <span>{condition}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-sm leading-6 text-stone-300">
                        Sem condições especiais.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedCompetition && (
        <TrophyLightbox
          image={selectedCompetition.trophyImage}
          glowVariant={selectedCompetition.category}
          title={selectedCompetition.name}
          eyebrow="Troféu da competição"
          onClose={() => setSelectedCompetition(null)}
        />
      )}
    </div>
  );
}
