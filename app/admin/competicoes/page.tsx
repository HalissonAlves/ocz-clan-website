import type { Metadata } from "next";
import Link from "next/link";
import {
  createCompetition,
  toggleCompetitionActive,
} from "@/app/admin/competicoes/actions";
import { signOut } from "@/app/login/actions";
import { getAdminCompetitions } from "@/lib/admin-competitions";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Competicoes",
  description: "Administracao das competicoes oficiais do cla OCZ.",
};

export default async function AdminCompetitionsPage() {
  await requireAdmin();
  const competitions = await getAdminCompetitions();

  return (
    <section className="section-space">
      <div className="page-container">
        <div className="mb-10 flex flex-col gap-5 border-b border-white/8 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-stone-100 sm:text-5xl">
              Competicoes
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-400">
              Cadastre e mantenha o catalogo usado pelas paginas publicas e
              pelas rodadas ao vivo.
            </p>
          </div>
          <form action={signOut}>
            <button type="submit" className="button-secondary">
              Sair
            </button>
          </form>
        </div>

        <form
          action={createCompetition}
          className="mb-10 grid gap-5 border border-amber-400/20 bg-amber-400/[0.05] p-5"
        >
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-400">
              Nova competicao
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-stone-100">
              Criar no catalogo
            </h2>
          </div>

          <CompetitionFields />

          <button type="submit" className="button-primary justify-self-start">
            Criar competicao
          </button>
        </form>

        {competitions.length > 0 ? (
          <div className="grid gap-4">
            {competitions.map((competition) => (
              <article
                key={competition.id}
                className="grid gap-4 border border-white/10 bg-white/[0.025] p-5 md:grid-cols-[1fr_auto] md:items-start"
              >
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-400">
                    {competition.category} /{" "}
                    {competition.active ? "ativa" : "inativa"}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-stone-100">
                    {competition.name}
                  </h2>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-stone-500">
                    {competition.slug}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-stone-400">
                    {competition.objective}
                  </p>
                  <p className="mt-3 text-sm text-stone-500">
                    Trofeus vinculados: {competition.trophies.length}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 md:justify-end">
                  <Link
                    href={`/admin/competicoes/${competition.id}`}
                    className="button-secondary"
                  >
                    Editar
                  </Link>
                  <form action={toggleCompetitionActive}>
                    <input type="hidden" name="id" value={competition.id} />
                    <input
                      type="hidden"
                      name="active"
                      value={competition.active ? "false" : "true"}
                    />
                    <button type="submit" className="button-secondary">
                      {competition.active ? "Desativar" : "Ativar"}
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid min-h-72 place-items-center border border-dashed border-white/12 bg-white/[0.02] p-8 text-center">
            <div>
              <h2 className="font-display text-3xl font-bold text-stone-100">
                Nenhuma competicao cadastrada
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-stone-400">
                Crie a primeira competicao para libera-la no catalogo e nas
                rodadas.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CompetitionFields() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <AdminInput label="Nome" name="name" required />
        <AdminInput label="Slug" name="slug" placeholder="gerado pelo nome" />
      </div>
      <div className="grid gap-4 md:grid-cols-[12rem_1fr]">
        <label className="grid gap-2">
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
            Categoria
          </span>
          <select
            name="category"
            defaultValue="standard"
            className="min-h-12 border border-white/10 bg-[#0d120f] px-4 text-sm text-stone-100 outline-none transition focus:border-amber-400"
          >
            <option value="standard">standard</option>
            <option value="diamond">diamond</option>
          </select>
        </label>
        <AdminInput
          label="URL da imagem"
          name="trophyImageUrl"
          placeholder="Gerada automaticamente pelo upload"
        />
      </div>
      <AdminFileInput />
      <AdminTextarea label="Objetivo" name="objective" rows={3} required />
      <div className="grid gap-4 md:grid-cols-3">
        <TargetTypeSelect />
        <AdminInput label="Slug do alvo" name="targetSlug" />
        <AdminInput label="Label do alvo" name="targetLabel" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <AdminTextarea
          label="Armas permitidas"
          name="allowedWeapons"
          placeholder="Uma por linha ou separadas por virgula"
        />
        <AdminTextarea
          label="Condicoes especiais"
          name="specialConditions"
          placeholder="Uma por linha ou separadas por virgula"
        />
      </div>
      <label className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] text-stone-300">
        <input
          type="checkbox"
          name="active"
          defaultChecked
          className="size-4 accent-amber-400"
        />
        Ativa
      </label>
    </div>
  );
}

function AdminFileInput() {
  return (
    <label className="grid gap-2">
      <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
        Upload da imagem
      </span>
      <input
        type="file"
        name="trophyImageFile"
        accept="image/avif,image/jpeg,image/png,image/webp"
        className="min-h-12 border border-white/10 bg-[#0d120f] px-4 py-3 text-sm text-stone-100 file:mr-4 file:border-0 file:bg-amber-400 file:px-3 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-[0.12em] file:text-stone-950"
      />
      <span className="text-xs leading-5 text-stone-500">
        Maximo 500 KB. Use este campo para novas imagens no Supabase Storage.
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
        className="min-h-12 border border-white/10 bg-[#0d120f] px-4 text-sm text-stone-100 outline-none transition focus:border-amber-400"
      >
        <option value="">Sem alvo</option>
        <option value="general">general</option>
        <option value="group">group</option>
        <option value="species">species</option>
      </select>
    </label>
  );
}

function AdminInput({
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
        className="min-h-12 border border-white/10 bg-[#0d120f] px-4 text-sm text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400"
      />
    </label>
  );
}

function AdminTextarea({
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
        className="resize-none border border-white/10 bg-[#0d120f] px-4 py-3 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400"
      />
    </label>
  );
}
