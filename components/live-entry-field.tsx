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
  const [isDirty, setIsDirty] = useState(false);
  const canEdit = currentPlayerId === playerId;

  useEffect(() => {
    if (isDirty) {
      return;
    }

    setScore(initialScore);
    setNotes(initialNotes);
  }, [initialNotes, initialScore, isDirty]);

  async function save() {
    if (!canEdit) return;

    // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include live tables.
    const supabase = createClient() as any;
    const { error } = await supabase
      .from("session_entries")
      .update({ score_text: score, notes })
      .eq("id", entryId);

    if (!error) {
      setIsDirty(false);
      startTransition(() => router.refresh());
    }
  }

  return (
    <div className="camp-entry-field grid gap-3 p-4" data-editable={canEdit}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-stone-600">
            Relato de campo
          </p>
          <p className="mt-1 font-display text-xl font-bold text-stone-100">
            {playerName}
          </p>
        </div>
        {isPending && (
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-amber-400">
            Registrando
          </span>
        )}
      </div>
      <input
        value={score}
        onChange={(event) => {
          setScore(event.target.value);
          setIsDirty(true);
        }}
        onBlur={save}
        disabled={!canEdit}
        placeholder="Resultado da caçada"
        className="min-h-10 border border-white/10 bg-black/18 px-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400 disabled:opacity-70"
      />
      <textarea
        value={notes}
        onChange={(event) => {
          setNotes(event.target.value);
          setIsDirty(true);
        }}
        onBlur={save}
        disabled={!canEdit}
        placeholder="Anotações de campo"
        rows={3}
        className="resize-none border border-white/10 bg-black/18 px-3 py-2 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400 disabled:opacity-70"
      />
    </div>
  );
}
