"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  pendingLabel?: ReactNode;
};

export function SubmitButton({
  children,
  pendingLabel,
  className,
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      type="submit"
      className={`${className ?? ""} disabled:cursor-not-allowed disabled:opacity-70`}
      disabled={disabled || pending}
      aria-busy={pending}
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
