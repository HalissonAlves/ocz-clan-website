import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { SubmitButton } from "@/components/submit-button";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Posto de Comando",
  description: "Posto de comando administrativo do clã OCZ.",
};

const commandStations = [
  {
    href: "/admin/rodadas",
    index: "01",
    eyebrow: "Mapa da caçada",
    title: "Organizar rodada",
    description:
      "Monte a rodada da noite, escolha as competições e acenda o timer do quadro.",
  },
  {
    href: "/admin/competicoes",
    index: "02",
    eyebrow: "Fichário de desafios",
    title: "Catalogar competições",
    description:
      "Cadastre, ajuste e arquive as provas oficiais que entram nas gameplays.",
  },
  {
    href: "/admin/trofeus",
    index: "03",
    eyebrow: "Caixa de conquistas",
    title: "Conferir troféus",
    description:
      "Revise os troféus registrados depois das disputas e acompanhe o acervo.",
  },
];

const checklist = [
  "Escolher competições",
  "Preparar rodada",
  "Acender timer",
  "Registrar vencedores",
];

export default async function AdminPage() {
  const profile = await requireAdmin();

  return (
    <section className="admin-cabin-screen relative isolate min-h-[calc(100svh-5rem)] overflow-hidden py-10 sm:py-14">
      <Image
        src="/assets/login-camp.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,6,5,0.9)_0%,rgba(4,6,5,0.72)_48%,rgba(4,6,5,0.52)_100%),radial-gradient(circle_at_70%_35%,rgba(242,181,68,0.14),transparent_25rem)]" />

      <div className="page-container">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-amber-400">
              Posto de comando
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-stone-100 sm:text-6xl">
              Prepare a noite antes da fogueira acender.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
              Bem-vindo, {profile.name}. A mesa da cabana reúne os mapas,
              fichários e registros usados para guiar a gameplay do clã.
            </p>
          </div>

          <form action={signOut}>
            <SubmitButton
              className="button-secondary bg-black/25"
              pendingLabel="Saindo..."
            >
              Sair do acampamento
            </SubmitButton>
          </form>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="admin-command-table p-5 sm:p-7">
            <div className="mb-6 flex flex-col gap-3 border-b border-white/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-amber-400">
                  Preparação da noite
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold text-stone-100">
                  Estações da cabana
                </h2>
              </div>
              <Link
                href="/ao-vivo"
                className="inline-flex text-xs font-bold uppercase tracking-[0.16em] text-stone-500 transition hover:text-amber-400"
              >
                Ver quadro do acampamento
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {commandStations.map((station) => (
                <Link
                  key={station.href}
                  href={station.href}
                  className="admin-command-card group p-5"
                >
                  <span className="font-display text-5xl font-bold text-white/[0.08] transition group-hover:text-amber-400/20">
                    {station.index}
                  </span>
                  <span className="mt-6 block text-[0.62rem] font-bold uppercase tracking-[0.18em] text-amber-400">
                    {station.eyebrow}
                  </span>
                  <span className="mt-3 block font-display text-2xl font-bold leading-tight text-stone-100">
                    {station.title}
                  </span>
                  <span className="mt-4 block text-sm leading-7 text-stone-400">
                    {station.description}
                  </span>
                  <span className="mt-6 inline-flex text-[0.65rem] font-bold uppercase tracking-[0.16em] text-stone-500 transition group-hover:text-amber-400">
                    Abrir estação
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <aside className="grid content-start gap-5">
            <div className="admin-command-side p-6">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                Guardião da noite
              </p>
              <p className="mt-3 font-display text-2xl font-bold text-stone-100">
                {profile.name}
              </p>
              <p className="mt-2 text-sm capitalize text-stone-500">
                {profile.role}
              </p>
            </div>

            <div className="admin-command-side p-6">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-400">
                Checklist da cabana
              </p>
              <div className="mt-5 grid gap-3">
                {checklist.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 border border-white/8 bg-black/18 px-3 py-3"
                  >
                    <span className="grid size-7 shrink-0 place-items-center border border-amber-400/25 text-[0.6rem] font-bold text-amber-400">
                      {index + 1}
                    </span>
                    <span className="text-sm text-stone-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
