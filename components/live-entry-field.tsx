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
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const canEdit = currentPlayerId === playerId;
  const isSaving = saveState === "saving" || isPending;

  useEffect(() => {
    if (isDirty) {
      return;
    }

    setScore(initialScore);
    setNotes(initialNotes);
  }, [initialNotes, initialScore, isDirty]);

  async function save() {
    if (!canEdit || !isDirty || saveState === "saving") {
      return;
    }

    setSaveState("saving");

    // biome-ignore lint/suspicious/noExplicitAny: temporary until Supabase generated types include live tables.
    const supabase = createClient() as any;
    const { error } = await supabase
      .from("session_entries")
      .update({ score_text: score, notes })
      .eq("id", entryId);

    if (error) {
      setSaveState("error");
      return;
    }

    setIsDirty(false);
    setSaveState("saved");
    startTransition(() => router.refresh());
  }

  function getStatusLabel() {
    if (!canEdit) {
      return "Somente leitura";
    }

    if (isSaving) {
      return "Salvando";
    }

    if (saveState === "error") {
      return "Falha ao salvar";
    }

    if (isDirty) {
      return "Pendente";
    }

    if (saveState === "saved") {
      return "Sincronizado";
    }

    return "Pronto";
  }

  return (
    <div
      className="camp-entry-field grid gap-3 p-4"
      data-editable={canEdit}
      data-state={isDirty ? "dirty" : saveState}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-stone-600">
            Relato de campo
          </p>
          <p className="mt-1 truncate font-display text-xl font-bold text-stone-100">
            {playerName}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 text-[0.56rem] font-bold uppercase tracking-[0.14em] text-stone-500">
          {isSaving && (
            <span
              className="size-3 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
              aria-hidden="true"
            />
          )}
          {getStatusLabel()}
        </span>
      </div>
      <input
        value={score}
        onChange={(event) => {
          setScore(event.target.value);
          setIsDirty(true);
          setSaveState("idle");
        }}
        onBlur={save}
        disabled={!canEdit || isSaving}
        placeholder="Resultado da caçada"
        className="min-h-10 border border-white/10 bg-black/18 px-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400 disabled:opacity-70"
      />
      <textarea
        value={notes}
        onChange={(event) => {
          setNotes(event.target.value);
          setIsDirty(true);
          setSaveState("idle");
        }}
        onBlur={save}
        disabled={!canEdit || isSaving}
        placeholder="Anotações de campo"
        rows={4}
        className="min-h-32 resize-none border border-white/10 bg-black/18 px-3 py-2 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400 disabled:opacity-70"
      />
    </div>
  );
}
