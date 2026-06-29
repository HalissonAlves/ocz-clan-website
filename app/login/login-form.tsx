"use client";

import { useActionState, useRef } from "react";
import { type LoginFormState, signIn } from "@/app/login/actions";

const initialState: LoginFormState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);
  const gateSoundRef = useRef<HTMLAudioElement | null>(null);

  function handleSubmit() {
    gateSoundRef.current ??= new Audio("/assets/open-gate.mp3");
    gateSoundRef.current.currentTime = 0;
    gateSoundRef.current.volume = 1;
    gateSoundRef.current.play().catch(() => {});
  }

  return (
    <form
      action={formAction}
      className="mt-8 grid gap-5"
      onSubmit={handleSubmit}
    >
      <label className="grid gap-2">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
          Identificação
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="caçador@ocz"
          className="login-input min-h-12 border border-amber-400/15 bg-black/25 px-4 text-sm text-stone-100 outline-none transition placeholder:text-stone-700 focus:border-amber-400"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
          Chave de acesso
        </span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="login-input min-h-12 border border-amber-400/15 bg-black/25 px-4 text-sm text-stone-100 outline-none transition placeholder:text-stone-700 focus:border-amber-400"
        />
      </label>

      {state.error && (
        <p className="border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-100">
          A guarda não reconheceu essa chave. Confira a identificação e tente
          novamente.
        </p>
      )}

      <button
        type="submit"
        className="button-primary login-submit"
        disabled={isPending}
      >
        {isPending ? "Abrindo o portão..." : "Entrar no acampamento"}
      </button>
    </form>
  );
}
