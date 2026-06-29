import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { TrophyShowcase } from "@/components/trophy-showcase";
import { getPlayersWithSupabase } from "@/lib/public-players";
import { getResolvedTrophiesWithSupabase } from "@/lib/public-trophies";

export const metadata: Metadata = {
  title: "Exposição",
  description: "Explore a sala de troféus de Pardal, Bode e Black Apple.",
};

export default async function ShowcasePage() {
  const [players, trophies] = await Promise.all([
    getPlayersWithSupabase(),
    getResolvedTrophiesWithSupabase(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Sala de troféus"
        title="Cada vitória merece"
        accent="ser lembrada."
        description="Escolha um integrante do clã e percorra as conquistas que marcaram cada edição das competições OCZ."
      />
      <TrophyShowcase players={players} trophies={trophies} />
    </>
  );
}
