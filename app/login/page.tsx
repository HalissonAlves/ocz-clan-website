import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/login/login-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Login",
  description: "Área privada dos jogadores do clã OCZ.",
};

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/ao-vivo");
  }

  return (
    <section className="section-space">
      <div className="page-container grid min-h-[34rem] place-items-center">
        <div className="w-full max-w-md border border-white/10 bg-[#0d120f] p-7 shadow-2xl sm:p-9">
          <p className="eyebrow">Área privada</p>
          <h1 className="mt-4 font-display text-4xl font-bold text-stone-100">
            Entrar no painel OCZ
          </h1>
          <p className="mt-4 text-sm leading-7 text-stone-400">
            Use o acesso criado no Supabase para acompanhar e administrar as
            competições ao vivo.
          </p>
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
