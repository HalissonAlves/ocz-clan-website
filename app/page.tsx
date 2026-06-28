import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CrosshairIcon, TrophyIcon } from "@/components/icons";
import { StatCard } from "@/components/stat-card";
import {
  getCompetitionStats,
  getPlayerStats,
  getResolvedTrophies,
} from "@/lib/data";

export default function HomePage() {
  const trophies = getResolvedTrophies();
  const playerStats = getPlayerStats();
  const competitionStats = getCompetitionStats();
  const leader = [...playerStats].sort(
    (first, second) => second.trophyCount - first.trophyCount,
  )[0];

  return (
    <>
      <section className="hero-shell relative isolate overflow-hidden">
        <div className="forest-glow absolute inset-0 -z-10" />
        <div className="page-container grid min-h-[calc(100svh-5rem)] items-center gap-10 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
          <div className="relative z-10 max-w-2xl">
            <div className="eyebrow mb-6">
              <span className="eyebrow-line" />
              The Hunter: Call of the Wild
            </div>
            <h1 className="display-title text-5xl leading-[0.95] text-stone-50 sm:text-6xl lg:text-7xl xl:text-[5.4rem]">
              Três caçadores.
              <span className="block text-amber-400">Uma lenda.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-stone-300 sm:text-lg">
              O clã OCZ transforma cada noite de gameplay em uma disputa pela
              glória. Competições, histórias e troféus conquistados no coração
              da natureza selvagem.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/exposicao" className="button-primary">
                Visitar exposição
                <ArrowRightIcon className="size-4" />
              </Link>
              <Link href="/competicoes" className="button-secondary">
                Ver competições
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[42rem] self-end lg:mx-0">
            <div className="portrait-halo absolute inset-x-[15%] bottom-[8%] h-[68%] rounded-full" />
            <Image
              src="/assets/ocz_portrait.png"
              alt="Os três integrantes do clã OCZ"
              width={1024}
              height={1536}
              priority
              className="relative z-10 mx-auto h-[36rem] w-auto max-w-full object-contain object-bottom sm:h-[43rem] lg:h-[calc(100svh-8rem)] lg:max-h-[48rem]"
            />
            <div className="absolute bottom-4 left-0 z-20 hidden rounded-sm border border-white/10 bg-black/55 px-5 py-4 backdrop-blur-md sm:block">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-amber-400">
                Formação OCZ
              </p>
              <p className="mt-1 text-sm text-stone-200">
                Pardal · Bode · Black Apple
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#0b0f0c]">
        <div className="page-container grid gap-px bg-white/5 sm:grid-cols-3">
          <StatCard
            value={competitionStats.length}
            label="Competições"
            detail="modalidades oficiais"
          />
          <StatCard
            value={trophies.length}
            label="Troféus"
            detail="conquistas registradas"
          />
          <StatCard
            value={leader?.trophyCount ?? 0}
            label="Recorde atual"
            detail={leader?.player.name ?? "A definir"}
          />
        </div>
      </section>

      <section className="section-space relative overflow-hidden">
        <div className="topographic-pattern absolute inset-0 opacity-25" />
        <div className="page-container relative grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-[10%] rounded-full border border-amber-400/20" />
            <div className="absolute inset-[20%] rounded-full border border-amber-400/10" />
            <Image
              src="/assets/ocz_brasao.webp"
              alt="Brasão oficial do clã OCZ"
              fill
              sizes="(max-width: 1024px) 80vw, 34vw"
              className="object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.65)]"
            />
          </div>
          <div>
            <p className="eyebrow">O clã</p>
            <h2 className="section-title mt-4">
              Onde a rivalidade termina em{" "}
              <span className="text-amber-400">memória.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-400 sm:text-lg">
              O OCZ nasceu da amizade de três jogadores e da vontade de tornar
              cada caçada inesquecível. A cada encontro, novas provas são
              escolhidas e cada vitória ganha um lugar permanente nesta
              exposição.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <article className="feature-card">
                <CrosshairIcon className="size-7 text-amber-400" />
                <h3 className="mt-5 font-display text-xl text-stone-100">
                  Competições próprias
                </h3>
                <p className="mt-2 text-sm leading-7 text-stone-400">
                  Regras, armas e objetivos que colocam técnica e estratégia à
                  prova.
                </p>
              </article>
              <article className="feature-card">
                <TrophyIcon className="size-7 text-amber-400" />
                <h3 className="mt-5 font-display text-xl text-stone-100">
                  História preservada
                </h3>
                <p className="mt-2 text-sm leading-7 text-stone-400">
                  Cada edição, vencedor e momento marcante guardado na sala de
                  troféus.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-amber-400 text-[#101410]">
        <div className="page-container flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em]">
              A caçada continua
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Conheça as provas do clã.
            </h2>
          </div>
          <Link
            href="/competicoes"
            className="inline-flex min-h-12 items-center gap-2 border border-[#101410] px-6 text-sm font-bold uppercase tracking-[0.12em] transition hover:bg-[#101410] hover:text-amber-400"
          >
            Explorar competições
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
