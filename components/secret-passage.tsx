"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/components/icons";

const SECRET_CODE = "ocz";
const REQUIRED_TAPS = 5;
const TAP_WINDOW_MS = 3600;

export function SecretPassage() {
  const [typedCode, setTypedCode] = useState("");
  const [tapCount, setTapCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const openPassage = useCallback(() => {
    setIsOpen(true);
    setIsAwake(true);
    setTapCount(0);
    setTypedCode("");
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      if (!/^[a-z]$/.test(key)) {
        return;
      }

      const nextCode = `${typedCode}${key}`.slice(-SECRET_CODE.length);
      setTypedCode(nextCode);

      if (nextCode === SECRET_CODE) {
        openPassage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openPassage, typedCode]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  function handleCrestPress() {
    setIsAwake(true);

    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    const nextTapCount = tapCount + 1;
    setTapCount(nextTapCount);

    tapTimerRef.current = setTimeout(() => {
      setTapCount(0);
      setIsAwake(false);
    }, TAP_WINDOW_MS);

    if (nextTapCount >= REQUIRED_TAPS) {
      openPassage();
    }
  }

  return (
    <>
      <div className="relative mx-auto aspect-square w-full max-w-md">
        <div
          className="secret-crest-ring absolute inset-[10%] rounded-full border border-amber-400/20"
          data-awake={isAwake}
        />
        <div
          className="secret-crest-ring secret-crest-ring-inner absolute inset-[20%] rounded-full border border-amber-400/10"
          data-awake={isAwake}
        />
        <button
          type="button"
          aria-label="Brasão oficial do clã OCZ"
          onClick={handleCrestPress}
          className="secret-crest group absolute inset-0 cursor-default touch-manipulation"
          data-awake={isAwake}
        >
          <span className="secret-crest-sigil" aria-hidden="true" />
          <Image
            src="/assets/ocz_brasao.webp"
            alt=""
            fill
            sizes="(max-width: 1024px) 80vw, 34vw"
            className="object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.65)] transition duration-500 group-active:scale-95"
          />
          <span className="secret-spark secret-spark-one" aria-hidden="true" />
          <span className="secret-spark secret-spark-two" aria-hidden="true" />
          <span
            className="secret-spark secret-spark-three"
            aria-hidden="true"
          />
        </button>
      </div>

      {isOpen && (
        <div className="secret-passage-backdrop fixed inset-0 z-[120] grid place-items-center overflow-y-auto p-4 sm:p-8">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Fechar passagem secreta"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="secret-passage-panel relative z-10 w-full max-w-3xl overflow-hidden border border-amber-400/25 bg-[#080b09] px-6 py-8 text-center shadow-2xl sm:px-10 sm:py-12"
            role="dialog"
            aria-modal="true"
            aria-labelledby="secret-passage-title"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 z-20 grid size-11 place-items-center border border-white/15 bg-black/45 text-stone-200 backdrop-blur-sm transition hover:rotate-90 hover:border-amber-400 hover:text-amber-400"
              aria-label="Fechar passagem secreta"
            >
              <CloseIcon className="size-5" />
            </button>

            <div className="secret-portal mx-auto grid size-52 place-items-center sm:size-64">
              <Image
                src="/assets/ocz_brasao.webp"
                alt=""
                width={188}
                height={188}
                className="relative z-10 size-32 object-contain drop-shadow-[0_22px_35px_rgba(0,0,0,0.75)] sm:size-40"
              />
            </div>

            <p className="mt-8 text-[0.65rem] font-bold uppercase tracking-[0.26em] text-amber-400">
              Passagem revelada
            </p>
            <h2
              id="secret-passage-title"
              className="mx-auto mt-3 max-w-xl font-display text-4xl font-bold leading-tight text-stone-100 sm:text-5xl"
            >
              A entrada reconheceu o clã.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-stone-400 sm:text-base">
              O acampamento está aberto para quem carrega a chave. Entre antes
              que a trilha desapareça.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/login" className="button-primary">
                Entrar no acampamento
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="button-secondary"
              >
                Fechar trilha
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
