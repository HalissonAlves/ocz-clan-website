"use client";

import Image from "next/image";
import { useState } from "react";
import {
  CalendarIcon,
  MapPinIcon,
  RifleIcon,
  TrophyIcon,
} from "@/components/icons";
import { TrophyLightbox } from "@/components/trophy-lightbox";
import type { Player, ResolvedTrophy } from "@/lib/types";

type TrophyShowcaseProps = {
  players: Player[];
  trophies: ResolvedTrophy[];
};

export function TrophyShowcase({ players, trophies }: TrophyShowcaseProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState(
    players[0]?.id ?? "",
  );
  const [selectedTrophy, setSelectedTrophy] = useState<ResolvedTrophy | null>(
    null,
  );
  const selectedPlayer = players.find(
    (player) => player.id === selectedPlayerId,
  );
  const visibleTrophies = trophies.filter(
    (trophy) => trophy.winnerId === selectedPlayerId,
  );

  return (
    <>
      <section className="border-b border-white/6 bg-[#0c100d]">
        <div className="page-container py-8 sm:py-10">
          <p className="mb-5 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-stone-500">
            Escolha um caçador
          </p>
          <div
            className="grid gap-3 sm:grid-cols-3"
            role="tablist"
            aria-label="Integrantes do clã"
          >
            {players.map((player) => {
              const isSelected = player.id === selectedPlayerId;
              const count = trophies.filter(
                (trophy) => trophy.winnerId === player.id,
              ).length;
              return (
                <button
                  key={player.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls="trophy-gallery"
                  onClick={() => setSelectedPlayerId(player.id)}
                  className={`group flex min-h-24 items-center gap-4 border p-3 text-left transition ${isSelected ? "border-amber-400 bg-amber-400/[0.08]" : "border-white/8 bg-white/[0.02] hover:border-white/20"}`}
                >
                  <span className="relative h-20 w-16 shrink-0 overflow-hidden bg-[#151b16]">
                    <Image
                      src={player.avatar}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover object-top transition duration-300 group-hover:scale-105"
                    />
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block font-display text-xl font-bold ${isSelected ? "text-amber-400" : "text-stone-200"}`}
                    >
                      {player.name}
                    </span>
                    <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.14em] text-stone-500">
                      {count} {count === 1 ? "troféu" : "troféus"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="section-space min-h-[38rem]"
        id="trophy-gallery"
        role="tabpanel"
      >
        <div className="page-container">
          {selectedPlayer && (
            <div className="mb-12 grid gap-5 border-b border-white/8 pb-9 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="eyebrow">Acervo de {selectedPlayer.name}</p>
                <h2 className="mt-3 font-display text-3xl font-bold text-stone-100 sm:text-4xl">
                  Conquistas registradas
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-400">
                  {selectedPlayer.bio}
                </p>
              </div>
              <p className="font-display text-6xl font-bold text-white/[0.06]">
                {String(visibleTrophies.length).padStart(2, "0")}
              </p>
            </div>
          )}

          {visibleTrophies.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleTrophies.map((trophy) => (
                <button
                  key={trophy.id}
                  type="button"
                  onClick={() => setSelectedTrophy(trophy)}
                  data-card-variant={trophy.competition.category}
                  className="trophy-card group cursor-zoom-in text-left"
                  aria-label={`Ampliar troféu ${trophy.displayName}`}
                >
                  <span
                    className="relative block aspect-[4/3] overflow-hidden trophy-glow p-7"
                    data-glow-variant={trophy.competition.category}
                  >
                    <Image
                      src={trophy.competition.trophyImage}
                      alt={`Troféu ${trophy.displayName}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-7 drop-shadow-[0_18px_20px_rgba(0,0,0,0.5)] transition duration-300 group-hover:scale-105"
                    />
                  </span>
                  <span className="block border-t border-white/8 p-6">
                    <span className="block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-amber-400">
                      {trophy.formattedDate}
                    </span>
                    <span className="mt-2 block font-display text-2xl font-bold text-stone-100">
                      {trophy.displayName}
                    </span>
                    <span className="mt-3 flex items-center gap-2 text-xs text-stone-500">
                      <MapPinIcon className="size-3.5" />
                      {trophy.reserve}
                    </span>
                    <span className="mt-5 inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-stone-300">
                      Ver detalhes <span aria-hidden="true">→</span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid min-h-80 place-items-center border border-dashed border-white/12 bg-white/[0.015] p-8 text-center">
              <div>
                <TrophyIcon className="mx-auto size-12 text-stone-700" />
                <h3 className="mt-5 font-display text-2xl font-bold text-stone-300">
                  A vitrine aguarda a próxima conquista
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-stone-500">
                  Este caçador ainda não possui troféus registrados. A próxima
                  noite de competição pode mudar isso.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {selectedTrophy && (
        <TrophyLightbox
          image={selectedTrophy.competition.trophyImage}
          glowVariant={selectedTrophy.competition.category}
          title={selectedTrophy.displayName}
          eyebrow="Troféu conquistado"
          onClose={() => setSelectedTrophy(null)}
        >
          <p className="mt-3 text-sm text-stone-500">
            Campeão:{" "}
            <strong className="font-semibold text-amber-400">
              {selectedTrophy.winner.name}
            </strong>
          </p>
          <div className="mt-8 grid gap-5 border-y border-white/8 py-6 sm:grid-cols-2">
            <Detail
              icon={<CalendarIcon className="size-5" />}
              label="Data"
              value={selectedTrophy.formattedDate}
            />
            <Detail
              icon={<MapPinIcon className="size-5" />}
              label="Reserva"
              value={selectedTrophy.reserve}
            />
            <Detail
              icon={<RifleIcon className="size-5" />}
              label="Arma"
              value={selectedTrophy.weapon}
            />
            <Detail
              icon={<TrophyIcon className="size-5" />}
              label="Edição"
              value={`${selectedTrophy.edition}ª disputa`}
            />
          </div>
          <p className="mt-7 text-sm leading-7 text-stone-400">
            {selectedTrophy.details}
          </p>
        </TrophyLightbox>
      )}
    </>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-amber-400">{icon}</span>
      <span>
        <span className="block text-[0.58rem] font-bold uppercase tracking-[0.18em] text-stone-600">
          {label}
        </span>
        <span className="mt-1 block text-sm text-stone-200">{value}</span>
      </span>
    </div>
  );
}
