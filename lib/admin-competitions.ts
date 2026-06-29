import { createClient } from "@/lib/supabase/server";

export type AdminCompetition = {
  id: string;
  legacy_id: string | null;
  name: string;
  slug: string;
  category: "standard" | "diamond";
  target_type: "general" | "group" | "species" | null;
  target_slug: string | null;
  target_label: string | null;
  objective: string;
  allowed_weapons: string[];
  special_conditions: string[];
  trophy_image_url: string;
  active: boolean;
  trophies: { id: string }[];
};

export async function getAdminCompetitions() {
  // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include competitions.
  const supabase = (await createClient()) as any;
  const { data, error } = await supabase
    .from("competitions")
    .select(`
      id,
      legacy_id,
      name,
      slug,
      category,
      target_type,
      target_slug,
      target_label,
      objective,
      allowed_weapons,
      special_conditions,
      trophy_image_url,
      active,
      trophies (
        id
      )
    `)
    .order("active", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as AdminCompetition[];
}

export async function getAdminCompetition(id: string) {
  // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include competitions.
  const supabase = (await createClient()) as any;
  const { data, error } = await supabase
    .from("competitions")
    .select(`
      id,
      legacy_id,
      name,
      slug,
      category,
      target_type,
      target_slug,
      target_label,
      objective,
      allowed_weapons,
      special_conditions,
      trophy_image_url,
      active,
      trophies (
        id
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as AdminCompetition;
}
