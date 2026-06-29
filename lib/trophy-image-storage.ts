import { createAdminClient } from "@/lib/supabase/admin";

export const TROPHY_IMAGE_BUCKET = "trophy-images";

const MAX_TROPHY_IMAGE_SIZE = 500 * 1024;
const ALLOWED_TROPHY_IMAGE_TYPES = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function uploadTrophyImage(file: File, slug: string) {
  if (file.size === 0) {
    return null;
  }

  if (file.size > MAX_TROPHY_IMAGE_SIZE) {
    throw new Error("A imagem do trofeu deve ter no maximo 500 KB.");
  }

  if (!ALLOWED_TROPHY_IMAGE_TYPES.has(file.type)) {
    throw new Error("Use uma imagem AVIF, JPEG, PNG ou WebP.");
  }

  const extension = getFileExtension(file);
  const safeSlug = slugifyStoragePath(slug);
  const path = `competitions/${safeSlug}-${Date.now()}.${extension}`;
  const supabase = createAdminClient();
  const bytes = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from(TROPHY_IMAGE_BUCKET)
    .upload(path, bytes, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from(TROPHY_IMAGE_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

function getFileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension && /^[a-z0-9]+$/.test(extension)) {
    return extension;
  }

  return file.type.split("/")[1] ?? "webp";
}

function slugifyStoragePath(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
