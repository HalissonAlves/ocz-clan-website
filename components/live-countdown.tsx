"use client";

import { useEffect, useMemo, useState } from "react";

type LiveCountdownProps = {
  startsAt: string | null;
  endsAt: string | null;
  status: string;
};

function formatRemaining(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function LiveCountdown({
  startsAt,
  endsAt,
  status,
}: LiveCountdownProps) {
  const [now, setNow] = useState(() => Date.now());
  const startsAtMs = useMemo(
    () => (startsAt ? new Date(startsAt).getTime() : null),
    [startsAt],
  );
  const endsAtMs = useMemo(
    () => (endsAt ? new Date(endsAt).getTime() : null),
    [endsAt],
  );

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);

    return () => window.clearInterval(interval);
  }, []);

  if (status !== "running" || !startsAtMs || !endsAtMs) {
    return (
      <div className="border border-white/10 bg-white/[0.03] p-6">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500">
          Timer
        </p>
        <p className="mt-3 font-display text-4xl font-bold text-stone-100">
          Aguardando início
        </p>
      </div>
    );
  }

  const remaining = endsAtMs - now;
  const elapsed = now >= endsAtMs;

  return (
    <div className="border border-amber-400/20 bg-amber-400/[0.06] p-6">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-400">
        {elapsed ? "Tempo encerrado" : "Tempo restante"}
      </p>
      <p className="mt-3 font-display text-6xl font-bold text-stone-100">
        {formatRemaining(remaining)}
      </p>
    </div>
  );
}
