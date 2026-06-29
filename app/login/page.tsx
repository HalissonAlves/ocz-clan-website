import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
    <section className="login-camp relative isolate min-h-[calc(100svh-5rem)] overflow-hidden">
      <Image
        src="/assets/login-camp.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,5,4,0.72)_0%,rgba(3,5,4,0.48)_46%,rgba(3,5,4,0.18)_100%),radial-gradient(circle_at_74%_36%,rgba(242,181,68,0.16),transparent_24rem)]" />
      <div className="login-lantern absolute right-[12%] top-[16%] -z-10 hidden size-72 rounded-full bg-amber-300/10 blur-3xl md:block" />

      <div className="page-container grid min-h-[calc(100svh-5rem)] items-center gap-10 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:py-14">
        <div className="max-w-xl">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-stone-100 transition hover:text-amber-400"
          >
            <Image
              src="/assets/ocz_brasao.webp"
              alt=""
              width={54}
              height={54}
              className="size-14 object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.7)]"
            />
            <span>
              <span className="block font-display text-2xl font-bold tracking-[0.12em]">
                OCZ
              </span>
              <span className="mt-1 block text-[0.6rem] font-bold uppercase tracking-[0.24em] text-amber-400">
                Acampamento
              </span>
            </span>
          </Link>

          <div className="mt-12 hidden max-w-md border-l border-amber-400/35 pl-5 md:block">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-amber-400">
              Trilha encontrada
            </p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-[0.95] text-stone-100 lg:text-6xl">
              A fogueira ainda está acesa.
            </h1>
            <p className="mt-6 text-sm leading-7 text-stone-300">
              O caminho secreto leva ao registro dos caçadores. Identifique-se
              para atravessar o portão e entrar na noite de gameplay.
            </p>
          </div>
        </div>

        <div className="login-register relative mx-auto w-full max-w-[30rem] border border-amber-400/20 bg-[#130f0a]/62 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:ml-auto lg:mr-0">
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
          <div className="absolute -left-2 top-10 h-16 w-1 bg-amber-400/45 shadow-[0_0_24px_rgba(242,181,68,0.45)]" />

          <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-amber-400">
            Livro de registro
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-stone-100 sm:text-5xl">
            Entrada do acampamento
          </h1>
          <p className="mt-4 text-sm leading-7 text-stone-400">
            A trilha foi aberta. Use sua identificação e a chave de acesso para
            entrar na área restrita do clã.
          </p>

          <div className="mt-6 grid gap-2 border-y border-white/8 py-4 text-xs uppercase tracking-[0.16em] text-stone-500 sm:grid-cols-3">
            <span>Mapa encontrado</span>
            <span>Brasão reconhecido</span>
            <span className="text-amber-400">Registro pendente</span>
          </div>

          <LoginForm />

          <Link
            href="/"
            className="mt-7 inline-flex text-xs font-bold uppercase tracking-[0.16em] text-stone-500 transition hover:text-amber-400"
          >
            Voltar para a trilha
          </Link>
        </div>
      </div>
    </section>
  );
}
