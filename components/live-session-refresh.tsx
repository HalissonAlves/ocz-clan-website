"use client";

import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { createClient } from "@/lib/supabase/browser";

const LIVE_REFRESH_DEBOUNCE_MS = 700;

export function LiveSessionRefresh() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  useEffect(() => {
    let refreshTimeout: number | null = null;
    const refresh = () => {
      if (refreshTimeout) {
        window.clearTimeout(refreshTimeout);
      }

      refreshTimeout = window.setTimeout(() => {
        startTransition(() => router.refresh());
        refreshTimeout = null;
      }, LIVE_REFRESH_DEBOUNCE_MS);
    };
    const supabase = createClient();
    const channel = supabase.channel("live:sessions", {
      config: { private: true },
    });

    channel
      .on("broadcast", { event: "INSERT" }, refresh)
      .on("broadcast", { event: "UPDATE" }, refresh)
      .on("broadcast", { event: "DELETE" }, refresh)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "gameplay_sessions" },
        refresh,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "session_competitions" },
        refresh,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "session_entries" },
        refresh,
      );

    let isSubscribed = false;

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session?.access_token || isSubscribed) {
        return;
      }

      supabase.realtime.setAuth(data.session.access_token);
      channel.subscribe();
      isSubscribed = true;
    });

    return () => {
      if (refreshTimeout) {
        window.clearTimeout(refreshTimeout);
      }

      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
