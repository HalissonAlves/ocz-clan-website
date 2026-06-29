"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/browser";

type LiveEntryFieldProps = {
  entryId: string;
  currentPlayerId: string | null;
  playerId: string;
  playerName: string;
  initialScore: string;
  initialNotes: string;
};

export function LiveEntryField({
  entryId,
  currentPlayerId,
  playerId,
  playerName,
  initialScore,
  initialNotes,
}: LiveEntryFieldProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [score, setScore] = useState(initialScore);
  const [notes, setNotes] = useState(initialNotes);
  const canEdit = currentPlayerId === playerId;

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("live-entry-refresh")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "session_entries" },
        () => startTransition(() => router.refresh()),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  async function save() {
    if (!canEdit) return;

    // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include live tables.
    const supabase = createClient() as any;
    const { error } = await supabase
      .from("session_entries")
      .update({ score_text: score, notes })
      .eq("id", entryId);

    if (!error) {
      startTransition(() => router.refresh());
    }
  }

  return (
    <div className="grid gap-3 border border-white/8 bg-black/15 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-xl font-bold text-stone-100">
          {playerName}
        </p>
        {isPending && (
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-stone-500">
            Atualizando
          </span>
        )}
      </div>
      <input
        value={score}
        onChange={(event) => setScore(event.target.value)}
        onBlur={save}
        disabled={!canEdit}
        placeholder="Resultado"
        className="min-h-10 border border-white/10 bg-white/[0.04] px-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400 disabled:opacity-70"
      />
      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        onBlur={save}
        disabled={!canEdit}
        placeholder="Anotações"
        rows={3}
        className="resize-none border border-white/10 bg-white/[0.04] px-3 py-2 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400 disabled:opacity-70"
      />
    </div>
  );
}
