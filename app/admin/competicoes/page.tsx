import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  createCompetition,
  toggleCompetitionActive,
} from "@/app/admin/competicoes/actions";
import { signOut } from "@/app/login/actions";
import { SubmitButton } from "@/components/submit-button";
import { getAdminCompetitions } from "@/lib/admin-competitions";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Fichário de Desafios",
  description: "Administração das competições oficiais do clã OCZ.",
};

export default async function AdminCompetitionsPage() {
  await requireAdmin();
  const competitions = await getAdminCompetitions();

  return (
    <section className="challenge-archive-screen relative isolate min-h-[calc(100svh-5rem)] overflow-hidden py-10 sm:py-14">
      <Image
        src="/assets/login-camp.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,6,5,0.9)_0%,rgba(4,6,5,0.74)_48%,rgba(4,6,5,0.56)_100%),radial-gradient(circle_at_70%_35%,rgba(242,181,68,0.14),transparent_25rem)]" />

      <div className="page-container">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-amber-400">
              Fichário da cabana
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-stone-100 sm:text-6xl">
              Fichário de Desafios
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
              Catalogue as provas oficiais e os troféus diamante do clã. As
              fichas oficiais entram no mapa da caçada; as fichas diamante
              guardam conquistas avulsas da floresta.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin" className="button-secondary bg-black/25">
              Posto de comando
            </Link>
            <form action={signOut}>
              <SubmitButton
                className="button-secondary bg-black/25"
                pendingLabel="Saindo..."
              >
                Sair do acampamento
              </SubmitButton>
            </form>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <form
            action={createCompetition}
            className="challenge-ledger p-5 sm:p-7"
          >
            <div className="mb-6 border-b border-white/8 pb-5">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-amber-400">
                Nova ficha de desafio
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-stone-100">
                Catalogar nova prova
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone-400">
                Guarde uma nova ficha no arquivo. Use{" "}
                <strong className="font-semibold text-stone-200">
                  standard
                </strong>{" "}
                para provas de rodada e{" "}
                <strong className="font-semibold text-sky-200">diamond</strong>{" "}
                para conquistas avulsas.
              </p>
            </div>

            <CompetitionFields />

            <SubmitButton
              className="button-primary mt-6 justify-self-start"
              pendingLabel="Guardando..."
            >
              Guardar no fichário
            </SubmitButton>
          </form>

          <aside className="challenge-archive-side p-6">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-400">
              Notas do fichário
            </p>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-400">
              <p className="border border-white/8 bg-black/18 p-3">
                Provas oficiais entram no Mapa da Caçada e podem ser escolhidas
                em rodadas.
              </p>
              <p className="border border-sky-300/14 bg-sky-300/[0.035] p-3">
                Troféus diamante são conquistas fora da rodada, dadas quando um
                animal diamante aparece.
              </p>
              <p className="border border-white/8 bg-black/18 p-3">
                Arquivar uma ficha remove ela dos fluxos ativos sem apagar o
                histórico.
              </p>
              <p className="border border-white/8 bg-black/18 p-3">
                Imagens novas devem ir para o Storage e ter no máximo 500 KB.
              </p>
            </div>
          </aside>
        </div>

        <div className="challenge-ledger mt-6 p-5 sm:p-7">
          <div className="mb-6 flex flex-col gap-3 border-b border-white/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-amber-400">
                Arquivo do clã
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-stone-100">
                Fichas catalogadas
              </h2>
            </div>
            <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
              {competitions.length} ficha{competitions.length === 1 ? "" : "s"}
            </p>
          </div>

          {competitions.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {competitions.map((competition) => (
                <article
                  key={competition.id}
                  className="challenge-file-card grid gap-4 p-5 md:grid-cols-[6rem_1fr] md:items-start"
                  data-category={competition.category}
                >
                  <div className="relative aspect-square overflow-hidden border border-white/10 bg-black/22">
                    <Image
                      src={competition.trophy_image_url}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-contain p-3"
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="challenge-category-pill"
                        data-category={competition.category}
                      >
                        {competition.category === "diamond"
                          ? "Troféu diamante"
                          : "Prova oficial"}
                      </span>
                      <span className="border border-white/10 bg-black/20 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-500">
                        {competition.active ? "ativa" : "arquivada"}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-2xl font-bold text-stone-100">
                      {competition.name}
                    </h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-stone-500">
                      {competition.slug}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-stone-400">
                      {competition.objective}
                    </p>
                    <p className="mt-3 text-sm text-stone-500">
                      Conquistas vinculadas: {competition.trophies.length}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        href={`/admin/competicoes/${competition.id}`}
                        className="button-secondary bg-black/20"
                      >
                        Editar ficha
                      </Link>
                      <form action={toggleCompetitionActive}>
                        <input type="hidden" name="id" value={competition.id} />
                        <input
                          type="hidden"
                          name="active"
                          value={competition.active ? "false" : "true"}
                        />
                        <SubmitButton
                          className="button-secondary bg-black/20"
                          pendingLabel={
                            competition.active
                              ? "Arquivando..."
                              : "Reabrindo..."
                          }
                        >
                          {competition.active
                            ? "Arquivar ficha"
                            : "Reabrir ficha"}
                        </SubmitButton>
                      </form>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="grid min-h-72 place-items-center border border-dashed border-white/12 bg-black/16 p-8 text-center">
              <div>
                <h2 className="font-display text-3xl font-bold text-stone-100">
                  Nenhuma ficha no arquivo
                </h2>
                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-stone-400">
                  Abra a primeira ficha para começar o catálogo do clã.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CompetitionFields() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <ArchiveInput label="Nome da ficha" name="name" required />
        <ArchiveInput
          label="Código da ficha"
          name="slug"
          placeholder="gerado pelo nome"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-[14rem_1fr]">
        <label className="grid gap-2">
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
            Tipo de ficha
          </span>
          <select
            name="category"
            defaultValue="standard"
            className="min-h-12 border border-white/10 bg-black/25 px-4 text-sm text-stone-100 outline-none transition focus:border-amber-400"
          >
            <option value="standard">Prova oficial</option>
            <option value="diamond">Troféu diamante</option>
          </select>
          <span className="text-xs leading-5 text-stone-500">
            Diamond não entra em rodadas.
          </span>
        </label>
        <ArchiveInput
          label="URL da imagem"
          name="trophyImageUrl"
          placeholder="Gerada automaticamente pelo upload"
        />
      </div>
      <ArchiveFileInput label="Upload da imagem" />
      <ArchiveTextarea
        label="Objetivo da ficha"
        name="objective"
        rows={3}
        required
      />
      <div className="grid gap-4 md:grid-cols-3">
        <TargetTypeSelect />
        <ArchiveInput label="Código do alvo" name="targetSlug" />
        <ArchiveInput label="Nome do alvo" name="targetLabel" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ArchiveTextarea
          label="Armas permitidas"
          name="allowedWeapons"
          placeholder="Uma por linha ou separadas por vírgula"
        />
        <ArchiveTextarea
          label="Condições especiais"
          name="specialConditions"
          placeholder="Uma por linha ou separadas por vírgula"
        />
      </div>
      <label className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] text-stone-300">
        <input
          type="checkbox"
          name="active"
          defaultChecked
          className="size-4 accent-amber-400"
        />
        Ficha ativa
      </label>
    </div>
  );
}

function ArchiveFileInput({ label }: { label: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
        {label}
      </span>
      <input
        type="file"
        name="trophyImageFile"
        accept="image/avif,image/jpeg,image/png,image/webp"
        className="min-h-12 border border-white/10 bg-black/25 px-4 py-3 text-sm text-stone-100 file:mr-4 file:border-0 file:bg-amber-400 file:px-3 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-[0.12em] file:text-stone-950"
      />
      <span className="text-xs leading-5 text-stone-500">
        Máximo 500 KB. Use este campo para novas imagens no Supabase Storage.
      </span>
    </label>
  );
}

function TargetTypeSelect() {
  return (
    <label className="grid gap-2">
      <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
        Tipo de alvo
      </span>
      <select
        name="targetType"
        defaultValue=""
        className="min-h-12 border border-white/10 bg-black/25 px-4 text-sm text-stone-100 outline-none transition focus:border-amber-400"
      >
        <option value="">Sem alvo</option>
        <option value="general">Geral</option>
        <option value="group">Grupo</option>
        <option value="species">Espécie</option>
      </select>
    </label>
  );
}

function ArchiveInput({
  label,
  name,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
        {label}
      </span>
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="min-h-12 border border-white/10 bg-black/25 px-4 text-sm text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400"
      />
    </label>
  );
}

function ArchiveTextarea({
  label,
  name,
  placeholder,
  rows = 4,
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
        {label}
      </span>
      <textarea
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className="resize-none border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400"
      />
    </label>
  );
}
