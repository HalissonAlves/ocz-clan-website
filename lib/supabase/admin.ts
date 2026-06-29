import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/db-types";
import { getSupabaseSecretConfig } from "@/lib/supabase/config";

export function createAdminClient() {
  const { url, secretKey } = getSupabaseSecretConfig();

  return createClient<Database>(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
