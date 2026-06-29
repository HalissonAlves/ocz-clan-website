"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { uploadTrophyImage } from "@/lib/trophy-image-storage";
import type { CompetitionTarget } from "@/lib/types";

export async function createCompetition(formData: FormData) {
  await requireAdmin();
  const values = await parseCompetitionForm(formData);
  // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include competitions.
  const supabase = (await createClient()) as any;

  const { error } = await supabase.from("competitions").insert(values);

  if (error) {
    throw new Error(error.message);
  }

  revalidateCompetitionPaths();
  redirect("/admin/competicoes");
}

export async function updateCompetition(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Competicao nao informada.");
  }

  const values = await parseCompetitionForm(formData);
  // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include competitions.
  const supabase = (await createClient()) as any;

  const { error } = await supabase
    .from("competitions")
    .update(values)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateCompetitionPaths();
  redirect("/admin/competicoes");
}

export async function toggleCompetitionActive(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const active = String(formData.get("active") ?? "") === "true";

  if (!id) {
    throw new Error("Competicao nao informada.");
  }

  // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include competitions.
  const supabase = (await createClient()) as any;

  const { error } = await supabase
    .from("competitions")
    .update({ active })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateCompetitionPaths();
}

async function parseCompetitionForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const providedSlug = String(formData.get("slug") ?? "").trim();
  const category = String(formData.get("category") ?? "standard");
  const objective = String(formData.get("objective") ?? "").trim();
  const providedTrophyImageUrl = String(
    formData.get("trophyImageUrl") ?? "",
  ).trim();
  const trophyImageFile = formData.get("trophyImageFile");
  const targetType = String(formData.get("targetType") ?? "").trim();
  const targetSlug = String(formData.get("targetSlug") ?? "").trim();
  const targetLabel = String(formData.get("targetLabel") ?? "").trim();
  const allowedWeapons = splitItems(formData.get("allowedWeapons"));
  const specialConditions = splitItems(formData.get("specialConditions"));
  const slug = providedSlug || slugify(name);

  const uploadedTrophyImageUrl =
    trophyImageFile instanceof File
      ? await uploadTrophyImage(trophyImageFile, slug)
      : null;
  const trophyImageUrl = uploadedTrophyImageUrl ?? providedTrophyImageUrl;

  if (!name || !slug || !objective || !trophyImageUrl) {
    throw new Error("Informe nome, slug, objetivo e imagem do trofeu.");
  }

  if (trophyImageUrl.startsWith("/assets/")) {
    throw new Error("Envie a imagem para o Storage antes de salvar.");
  }

  if (category !== "standard" && category !== "diamond") {
    throw new Error("Categoria invalida.");
  }

  const target =
    category === "standard"
      ? parseTarget(targetType, targetSlug, targetLabel)
      : null;

  return {
    legacy_id: slug,
    name,
    slug,
    category,
    target_type: target?.type ?? null,
    target_slug: target?.slug ?? null,
    target_label: target?.label ?? null,
    objective,
    allowed_weapons: allowedWeapons,
    special_conditions: specialConditions,
    trophy_image_url: trophyImageUrl,
    active: formData.get("active") === "on",
  };
}

function parseTarget(type: string, slug: string, label: string) {
  if (!type && !slug && !label) {
    return null;
  }

  if (type !== "general" && type !== "group" && type !== "species") {
    throw new Error("Tipo de alvo invalido.");
  }

  if (!slug || !label) {
    throw new Error("Informe slug e label do alvo.");
  }

  return {
    type: type as CompetitionTarget["type"],
    slug,
    label,
  };
}

function splitItems(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function revalidateCompetitionPaths() {
  revalidatePath("/admin/competicoes");
  revalidatePath("/admin/rodadas");
  revalidatePath("/competicoes");
  revalidatePath("/");
}
