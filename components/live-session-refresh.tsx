"use client";

import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { createClient } from "@/lib/supabase/browser";

export function LiveSessionRefresh() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  useEffect(() => {
    const refresh = () => startTransition(() => router.refresh());
    const supabase = createClient();
    const channel = supabase.channel("live:sessions", {
      config: { private: true },
    });

    channel
      .on("broadcast", { event: "INSERT" }, refresh)
      .on("broadcast", { event: "UPDATE" }, refresh)
      .on("broadcast", { event: "DELETE" }, refresh);

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
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
