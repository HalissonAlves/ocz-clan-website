import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { updateCompetition } from "@/app/admin/competicoes/actions";
import { signOut } from "@/app/login/actions";
import { SubmitButton } from "@/components/submit-button";
import { getAdminCompetition } from "@/lib/admin-competitions";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Editar ficha",
  description: "Edição de competição oficial do clã OCZ.",
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
              Ficha aberta
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-stone-100 sm:text-6xl">
              {competition.name}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
              Ajuste os dados desta ficha sem mexer no código. Fichas diamond
              seguem fora das rodadas e representam conquistas avulsas.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/competicoes"
              className="button-secondary bg-black/25"
            >
              Voltar ao fichário
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
            action={updateCompetition}
            className="challenge-ledger p-5 sm:p-7"
          >
            <input type="hidden" name="id" value={competition.id} />

            <div className="mb-6 grid gap-4 border-b border-white/8 pb-5 md:grid-cols-[8rem_1fr] md:items-center">
              <div className="relative aspect-square overflow-hidden border border-white/10 bg-black/22">
                <Image
                  src={competition.trophy_image_url}
                  alt=""
                  fill
                  sizes="128px"
                  className="object-contain p-4"
                />
              </div>
              <div>
                <span
                  className="challenge-category-pill"
                  data-category={competition.category}
                >
                  {competition.category === "diamond"
                    ? "Troféu diamante"
                    : "Prova oficial"}
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold text-stone-100">
                  Editar ficha do arquivo
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Conquistas vinculadas: {competition.trophies.length}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ArchiveInput
                label="Nome da ficha"
                name="name"
                required
                defaultValue={competition.name}
              />
              <ArchiveInput
                label="Código da ficha"
                name="slug"
                required
                defaultValue={competition.slug}
              />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[14rem_1fr]">
              <label className="grid gap-2">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                  Tipo de ficha
                </span>
                <select
                  name="category"
                  defaultValue={competition.category}
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
                required
                defaultValue={competition.trophy_image_url}
              />
            </div>

            <div className="mt-4">
              <ArchiveFileInput />
            </div>

            <div className="mt-4">
              <ArchiveTextarea
                label="Objetivo da ficha"
                name="objective"
                rows={3}
                required
                defaultValue={competition.objective}
              />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <TargetTypeSelect defaultValue={competition.target_type ?? ""} />
              <ArchiveInput
                label="Código do alvo"
                name="targetSlug"
                defaultValue={competition.target_slug ?? ""}
              />
              <ArchiveInput
                label="Nome do alvo"
                name="targetLabel"
                defaultValue={competition.target_label ?? ""}
              />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <ArchiveTextarea
                label="Armas permitidas"
                name="allowedWeapons"
                defaultValue={competition.allowed_weapons.join("\n")}
              />
              <ArchiveTextarea
                label="Condições especiais"
                name="specialConditions"
                defaultValue={competition.special_conditions.join("\n")}
              />
            </div>

            <label className="mt-5 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] text-stone-300">
              <input
                type="checkbox"
                name="active"
                defaultChecked={competition.active}
                className="size-4 accent-amber-400"
              />
              Ficha ativa
            </label>

            <SubmitButton
              className="button-primary mt-6 justify-self-start"
              pendingLabel="Salvando..."
            >
              Salvar ficha
            </SubmitButton>
          </form>

          <aside className="challenge-archive-side p-6">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-400">
              Leitura da ficha
            </p>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-400">
              <p className="border border-white/8 bg-black/18 p-3">
                Prova oficial: entra no Mapa da Caçada.
              </p>
              <p className="border border-sky-300/14 bg-sky-300/[0.035] p-3">
                Troféu diamante: conquista fora da rodada.
              </p>
              <p className="border border-white/8 bg-black/18 p-3">
                Trocar imagem envia um novo arquivo para o Storage e substitui a
                URL.
              </p>
              <p className="border border-white/8 bg-black/18 p-3">
                Arquivar mantém histórico e troféus vinculados preservados.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function ArchiveFileInput() {
  return (
    <label className="grid gap-2">
      <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
        Trocar imagem
      </span>
      <input
        type="file"
        name="trophyImageFile"
        accept="image/avif,image/jpeg,image/png,image/webp"
        className="min-h-12 border border-white/10 bg-black/25 px-4 py-3 text-sm text-stone-100 file:mr-4 file:border-0 file:bg-amber-400 file:px-3 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-[0.12em] file:text-stone-950"
      />
      <span className="text-xs leading-5 text-stone-500">
        Opcional. Ao enviar uma nova imagem, a URL será substituída pela URL
        pública do Storage.
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
  defaultValue,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="min-h-12 border border-white/10 bg-black/25 px-4 text-sm text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400"
      />
    </label>
  );
}

function ArchiveTextarea({
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
        className="resize-none border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400"
      />
    </label>
  );
}
