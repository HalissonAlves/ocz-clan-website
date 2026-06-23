import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { TrophyShowcase } from "@/components/trophy-showcase";
import { getPlayers, getResolvedTrophies } from "@/lib/data";

export const metadata: Metadata = {
  title: "Exposição",
  description: "Explore a sala de troféus de Pardal, Bode e Black Apple.",
};

export default function ShowcasePage() {
  return (
    <>
      <PageHero
        eyebrow="Sala de troféus"
        title="Cada vitória merece"
        accent="ser lembrada."
        description="Escolha um integrante do clã e percorra as conquistas que marcaram cada edição das competições OCZ."
      />
      <TrophyShowcase players={getPlayers()} trophies={getResolvedTrophies()} />
    </>
  );
}
