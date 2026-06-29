import type { Metadata } from "next";
import { CompetitionTabs } from "@/components/competition-tabs";
import { PageHero } from "@/components/page-hero";
import { getCompetitionStatsWithSupabase } from "@/lib/public-competitions";

export const metadata: Metadata = {
  title: "Competições",
  description:
    "Conheça as modalidades, objetivos e regras das competições do clã OCZ.",
};

export default async function CompetitionsPage() {
  const competitions = await getCompetitionStatsWithSupabase();

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
