"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { markRoundScrollToTop } from "@/components/round-scroll-restorer";

type CompetitionSelectionSubmitButtonProps = {
  children: ReactNode;
  pendingLabel?: ReactNode;
  className?: string;
};

export function CompetitionSelectionSubmitButton({
  children,
  pendingLabel,
  className,
}: CompetitionSelectionSubmitButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [hasSelection, setHasSelection] = useState(false);
  const { pending } = useFormStatus();

  useEffect(() => {
    const form = buttonRef.current?.closest("form");

    if (!form) {
      return;
    }

    const updateSelection = () => {
      setHasSelection(
        Boolean(form.querySelector('input[name="competitionIds"]:checked')),
      );
    };

    updateSelection();
    form.addEventListener("change", updateSelection);

    return () => form.removeEventListener("change", updateSelection);
  }, []);

  function handleClick() {
    markRoundScrollToTop();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      ref={buttonRef}
      type="submit"
      className={`${className ?? ""} disabled:cursor-not-allowed disabled:opacity-70`}
      disabled={!hasSelection || pending}
      aria-busy={pending}
      onClick={handleClick}
    >
      {pending && (
        <span
          className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden="true"
        />
      )}
      <span>{pending ? (pendingLabel ?? children) : children}</span>
    </button>
  );
}
