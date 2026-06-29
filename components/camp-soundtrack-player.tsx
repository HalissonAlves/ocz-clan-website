"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const START_SOUNDTRACK_EVENT = "ocz:start-admin-soundtrack";
const DEFAULT_VOLUME = 1;

export function CampSoundtrackPlayer() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const isCampRoute =
    pathname === "/login" ||
    pathname === "/ao-vivo" ||
    pathname.startsWith("/admin");

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (isCampRoute || !audioRef.current) {
      return;
    }

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setIsVisible(false);
  }, [isCampRoute]);

  useEffect(() => {
    const startSoundtrack = () => {
      setIsVisible(true);

      if (!audioRef.current) {
        return;
      }

      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    };

    window.addEventListener(START_SOUNDTRACK_EVENT, startSoundtrack);
    return () =>
      window.removeEventListener(START_SOUNDTRACK_EVENT, startSoundtrack);
  }, []);

  function togglePlayback() {
    if (!audioRef.current) {
      return;
    }

    setIsVisible(true);

    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
      return;
    }

    audioRef.current.pause();
    setIsPlaying(false);
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/assets/admin-soundtrack.mp3"
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <track
          kind="captions"
          src="/assets/admin-soundtrack-captions.vtt"
          srcLang="pt-BR"
          label="Português"
        />
      </audio>
      {(isVisible || isCampRoute) && (
        <div className="fixed bottom-4 right-4 z-[140] flex w-[min(100%-2rem,18rem)] items-center gap-3 border border-amber-400/20 bg-[#070a08]/86 p-3 text-stone-100 shadow-2xl backdrop-blur-xl">
          <button
            type="button"
            onClick={togglePlayback}
            className="grid size-10 shrink-0 place-items-center border border-amber-400/25 bg-amber-400/[0.08] text-xs font-black uppercase tracking-[0.12em] text-amber-300 transition hover:border-amber-400 hover:bg-amber-400 hover:text-stone-950"
            aria-label={isPlaying ? "Pausar trilha" : "Tocar trilha"}
          >
            {isPlaying ? "II" : "▶"}
          </button>
          <label className="min-w-0 flex-1">
            <span className="block text-[0.56rem] font-bold uppercase tracking-[0.16em] text-stone-500">
              Trilha da cabana
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              className="mt-2 w-full accent-amber-400"
              aria-label="Volume da trilha sonora"
            />
          </label>
        </div>
      )}
    </>
  );
}
