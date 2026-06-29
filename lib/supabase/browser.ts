"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/db-types";
import { getSupabaseBrowserConfig } from "@/lib/supabase/config";

export function createClient() {
  const { url, publishableKey } = getSupabaseBrowserConfig();

  return createBrowserClient<Database>(url, publishableKey);
}
