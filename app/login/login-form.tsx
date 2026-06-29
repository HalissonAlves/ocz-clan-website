"use client";

import { useActionState } from "react";
import { type LoginFormState, signIn } from "@/app/login/actions";

const initialState: LoginFormState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="mt-8 grid gap-5">
      <label className="grid gap-2">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
          E-mail
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="min-h-12 border border-white/10 bg-white/[0.04] px-4 text-sm text-stone-100 outline-none transition focus:border-amber-400"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
          Senha
        </span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="min-h-12 border border-white/10 bg-white/[0.04] px-4 text-sm text-stone-100 outline-none transition focus:border-amber-400"
        />
      </label>

      {state.error && (
        <p className="border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {state.error}
        </p>
      )}

      <button type="submit" className="button-primary" disabled={isPending}>
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
