import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { LiveSessionBoard } from "@/components/live-session-board";
import { LiveSessionRefresh } from "@/components/live-session-refresh";
import { getCurrentProfile, requireUser } from "@/lib/auth";
import { getLatestOpenSession } from "@/lib/live-data";

export const metadata: Metadata = {
  title: "Quadro do Acampamento",
  description: "Quadro privado de competições em andamento do clã OCZ.",
};

export default async function LivePage() {
  await requireUser();
  const profile = await getCurrentProfile();
  const session = await getLatestOpenSession();

  if (!profile) {
    throw new Error("Profile nao configurado para o usuario atual.");
  }

  if (session) {
    return <LiveSessionBoard session={session} profile={profile} />;
  }

  return (
    <section className="live-camp-screen relative isolate min-h-[calc(100svh-5rem)] overflow-hidden py-10 sm:py-14">
      <Image
        src="/assets/login-camp.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,6,5,0.86)_0%,rgba(4,6,5,0.68)_48%,rgba(4,6,5,0.5)_100%),radial-gradient(circle_at_72%_34%,rgba(242,181,68,0.12),transparent_25rem)]" />
      <LiveSessionRefresh />

      <div className="page-container">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-amber-400">
              Quadro do acampamento
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-stone-100 sm:text-6xl">
              Nenhuma convocação no quadro.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
              A cabana está pronta, mas nenhuma rodada foi pregada para esta
              noite. Quando o admin preparar o quadro, os relatos de campo
              aparecem aqui em tempo real.
            </p>
          </div>

          <form action={signOut}>
            <button type="submit" className="button-secondary bg-black/25">
              Sair do acampamento
            </button>
          </form>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
          <div className="camp-notice-board min-h-[28rem] p-5 sm:p-8">
            <div className="grid min-h-[22rem] place-items-center border border-dashed border-amber-400/18 bg-black/18 p-6 text-center">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-amber-400">
                  Mural vazio
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold text-stone-100 sm:text-4xl">
                  A próxima caçada ainda não foi anunciada.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-400">
                  Fique por perto da fogueira. Assim que uma rodada for
                  preparada, este quadro recebe o timer, as competições e os
                  campos de anotação dos três caçadores.
                </p>
              </div>
            </div>
          </div>

          <aside className="camp-side-panel p-6">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
              Caçador no acampamento
            </p>
            <p className="mt-3 font-display text-2xl font-bold text-stone-100">
              {profile.name}
            </p>
            <p className="mt-2 text-sm capitalize text-stone-500">
              {profile.role}
            </p>
            {profile.role === "admin" && (
              <Link href="/admin" className="button-primary mt-6 w-full">
                Preparar quadro
              </Link>
            )}
            <Link
              href="/"
              className={`${profile.role === "admin" ? "mt-4" : "mt-6"} inline-flex text-xs font-bold uppercase tracking-[0.16em] text-stone-500 transition hover:text-amber-400`}
            >
              Voltar para a trilha
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
