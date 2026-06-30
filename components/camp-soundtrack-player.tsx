"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
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
  const radioStyle = {
    "--radio-volume": `${-128 + volume * 256}deg`,
  } as CSSProperties;

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
        <div className="camp-radio" data-playing={isPlaying} style={radioStyle}>
          <span className="camp-radio-antenna" aria-hidden="true" />
          <div className="camp-radio-face">
            <div className="camp-radio-speaker" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="camp-radio-body">
              <div className="camp-radio-display">
                <span>{isPlaying ? "Transmitindo" : "Em espera"}</span>
                <strong>OCZ-FM</strong>
                <small>Cabana norte</small>
              </div>

              <div className="camp-radio-controls">
                <button
                  type="button"
                  onClick={togglePlayback}
                  className="camp-radio-button"
                  aria-label={isPlaying ? "Pausar trilha" : "Tocar trilha"}
                >
                  {isPlaying ? "II" : "▶"}
                </button>

                <label className="camp-radio-volume">
                  <span>Volume</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(event) => setVolume(Number(event.target.value))}
                    aria-label="Volume da trilha sonora"
                  />
                </label>
              </div>
            </div>

            <div className="camp-radio-knob" aria-hidden="true">
              <span />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
