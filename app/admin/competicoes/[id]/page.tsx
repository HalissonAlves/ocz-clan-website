import type { Metadata } from "next";
import Link from "next/link";
import { updateCompetition } from "@/app/admin/competicoes/actions";
import { signOut } from "@/app/login/actions";
import { getAdminCompetition } from "@/lib/admin-competitions";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Editar competicao",
  description: "Edicao de competicao oficial do cla OCZ.",
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminCompetitionEditPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const competition = await getAdminCompetition(id);

  return (
    <section className="section-space">
      <div className="page-container">
        <div className="mb-10 flex flex-col gap-5 border-b border-white/8 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-stone-100 sm:text-5xl">
              Editar competicao
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-400">
              Atualize o catalogo sem editar arquivos JSON ou fazer deploy.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/competicoes" className="button-secondary">
              Voltar
            </Link>
            <form action={signOut}>
              <button type="submit" className="button-secondary">
                Sair
              </button>
            </form>
          </div>
        </div>

        <form
          action={updateCompetition}
          className="grid gap-5 border border-white/10 bg-white/[0.025] p-5"
        >
          <input type="hidden" name="id" value={competition.id} />

          <div className="grid gap-4 md:grid-cols-2">
            <AdminInput
              label="Nome"
              name="name"
              required
              defaultValue={competition.name}
            />
            <AdminInput
              label="Slug"
              name="slug"
              required
              defaultValue={competition.slug}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-[12rem_1fr]">
            <label className="grid gap-2">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                Categoria
              </span>
              <select
                name="category"
                defaultValue={competition.category}
                className="min-h-12 border border-white/10 bg-[#0d120f] px-4 text-sm text-stone-100 outline-none transition focus:border-amber-400"
              >
                <option value="standard">standard</option>
                <option value="diamond">diamond</option>
              </select>
            </label>
            <AdminInput
              label="URL da imagem"
              name="trophyImageUrl"
              required
              defaultValue={competition.trophy_image_url}
            />
          </div>

          <AdminFileInput />

          <AdminTextarea
            label="Objetivo"
            name="objective"
            rows={3}
            required
            defaultValue={competition.objective}
          />

          <div className="grid gap-4 md:grid-cols-3">
            <TargetTypeSelect defaultValue={competition.target_type ?? ""} />
            <AdminInput
              label="Slug do alvo"
              name="targetSlug"
              defaultValue={competition.target_slug ?? ""}
            />
            <AdminInput
              label="Label do alvo"
              name="targetLabel"
              defaultValue={competition.target_label ?? ""}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AdminTextarea
              label="Armas permitidas"
              name="allowedWeapons"
              defaultValue={competition.allowed_weapons.join("\n")}
            />
            <AdminTextarea
              label="Condicoes especiais"
              name="specialConditions"
              defaultValue={competition.special_conditions.join("\n")}
            />
          </div>

          <label className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] text-stone-300">
            <input
              type="checkbox"
              name="active"
              defaultChecked={competition.active}
              className="size-4 accent-amber-400"
            />
            Ativa
          </label>

          <button type="submit" className="button-primary justify-self-start">
            Salvar competicao
          </button>
        </form>
      </div>
    </section>
  );
}

function AdminFileInput() {
  return (
    <label className="grid gap-2">
      <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
        Trocar imagem
      </span>
      <input
        type="file"
        name="trophyImageFile"
        accept="image/avif,image/jpeg,image/png,image/webp"
        className="min-h-12 border border-white/10 bg-[#0d120f] px-4 py-3 text-sm text-stone-100 file:mr-4 file:border-0 file:bg-amber-400 file:px-3 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-[0.12em] file:text-stone-950"
      />
      <span className="text-xs leading-5 text-stone-500">
        Opcional. Ao enviar uma nova imagem, a URL sera substituida pela URL
        publica do Storage.
      </span>
    </label>
  );
}

function TargetTypeSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
        Tipo de alvo
      </span>
      <select
        name="targetType"
        defaultValue={defaultValue}
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
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        className="min-h-12 border border-white/10 bg-[#0d120f] px-4 text-sm text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400"
      />
    </label>
  );
}

function AdminTextarea({
  label,
  name,
  defaultValue,
  rows = 4,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        className="resize-none border border-white/10 bg-[#0d120f] px-4 py-3 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400"
      />
    </label>
  );
}
