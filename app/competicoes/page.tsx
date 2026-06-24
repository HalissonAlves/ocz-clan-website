import type { Metadata } from "next";
import { CompetitionTabs } from "@/components/competition-tabs";
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
          <CompetitionTabs competitions={competitions} />
        </div>
      </section>
    </>
  );
}
