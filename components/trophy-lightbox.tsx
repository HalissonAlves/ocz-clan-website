"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { CloseIcon } from "@/components/icons";

type TrophyLightboxProps = {
  image: string;
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children?: React.ReactNode;
};

export function TrophyLightbox({
  image,
  title,
  eyebrow = "Troféu em destaque",
  onClose,
  children,
}: TrophyLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop fixed inset-0 z-[100] grid place-items-center overflow-y-auto p-4 sm:p-8">
      <button
        type="button"
        className="absolute inset-0 cursor-zoom-out"
        aria-label="Fechar visualização ampliada"
        onClick={onClose}
      />
      <div
        className="modal-panel relative z-10 my-auto w-full max-w-5xl overflow-hidden border border-white/12 bg-[#0e130f] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="trophy-lightbox-title"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 grid size-11 place-items-center border border-white/15 bg-black/50 text-stone-200 backdrop-blur-sm transition hover:rotate-90 hover:border-amber-400 hover:text-amber-400"
          aria-label="Fechar visualização ampliada"
        >
          <CloseIcon className="size-5" />
        </button>

        <div className={children ? "grid md:grid-cols-[1.15fr_0.85fr]" : ""}>
          <div className="trophy-lightbox-image relative min-h-[24rem] overflow-hidden bg-[radial-gradient(circle_at_50%_52%,rgba(242,181,68,0.24),transparent_55%)] p-8 sm:min-h-[34rem] md:min-h-[42rem]">
            <div
              className="absolute inset-x-[18%] bottom-[8%] h-[10%] rounded-full bg-black/60 blur-2xl"
              aria-hidden="true"
            />
            <Image
              src={image}
              alt={`Troféu ${title} ampliado`}
              fill
              sizes={children ? "(max-width: 768px) 100vw, 58vw" : "90vw"}
              className="object-contain p-8 drop-shadow-[0_32px_30px_rgba(0,0,0,0.7)] sm:p-12"
            />
            {!children && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-7 pb-7 pt-20 sm:px-10 sm:pb-9">
                <p className="eyebrow">{eyebrow}</p>
                <h2
                  id="trophy-lightbox-title"
                  className="mt-3 font-display text-3xl font-bold text-stone-100 sm:text-4xl"
                >
                  {title}
                </h2>
              </div>
            )}
          </div>

          {children && (
            <div className="flex flex-col justify-center border-t border-white/8 p-7 sm:p-10 md:border-l md:border-t-0">
              <p className="eyebrow">{eyebrow}</p>
              <h2
                id="trophy-lightbox-title"
                className="mt-4 font-display text-4xl font-bold leading-tight text-stone-100"
              >
                {title}
              </h2>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
