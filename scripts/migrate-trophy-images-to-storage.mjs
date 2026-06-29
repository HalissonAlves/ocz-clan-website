import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "trophy-images";
const MAX_SIZE = 500 * 1024;
const MIME_BY_EXTENSION = new Map([
  [".avif", "image/avif"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".webp", "image/webp"],
]);

await loadEnvFile(".env.local");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !secretKey) {
  throw new Error(
    "Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SECRET_KEY antes de migrar.",
  );
}

const supabase = createClient(supabaseUrl, secretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { data: competitions, error } = await supabase
  .from("competitions")
  .select("id, name, slug, trophy_image_url")
  .like("trophy_image_url", "/assets/%")
  .order("name", { ascending: true });

if (error) {
  throw new Error(error.message);
}

if (!competitions || competitions.length === 0) {
  console.log("Nenhuma competicao com imagem local em /assets encontrada.");
  process.exit(0);
}

for (const competition of competitions) {
  const publicPath = competition.trophy_image_url.replace(/^\/+/, "");
  const localPath = path.join(process.cwd(), "public", publicPath);
  const extension = path.extname(localPath).toLowerCase();
  const contentType = MIME_BY_EXTENSION.get(extension);

  if (!contentType) {
    throw new Error(`Tipo de imagem nao suportado: ${localPath}`);
  }

  const file = await readFile(localPath);

  if (file.byteLength > MAX_SIZE) {
    throw new Error(
      `${localPath} possui ${file.byteLength} bytes, acima do limite de 500 KB.`,
    );
  }

  const storagePath = `competitions/${slugify(competition.slug)}${extension}`;
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      contentType,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  const { error: updateError } = await supabase
    .from("competitions")
    .update({ trophy_image_url: data.publicUrl })
    .eq("id", competition.id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  console.log(`${competition.name}: ${data.publicUrl}`);
}

async function loadEnvFile(filePath) {
  try {
    const envFile = await readFile(filePath, "utf8");

    for (const line of envFile.split(/\r?\n/)) {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmedLine.indexOf("=");

      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmedLine.slice(0, separatorIndex).trim();
      const value = trimmedLine
        .slice(separatorIndex + 1)
        .trim()
        .replace(/^["']|["']$/g, "");

      process.env[key] ??= value;
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
