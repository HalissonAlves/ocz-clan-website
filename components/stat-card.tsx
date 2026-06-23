type StatCardProps = {
  value: number;
  label: string;
  detail: string;
};

export function StatCard({ value, label, detail }: StatCardProps) {
  return (
    <div className="bg-[#0b0f0c] px-6 py-8 sm:px-10">
      <div className="flex items-baseline gap-3">
        <strong className="font-display text-4xl text-amber-400 sm:text-5xl">
          {String(value).padStart(2, "0")}
        </strong>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-stone-200">
          {label}
        </span>
      </div>
      <p className="mt-2 text-xs text-stone-600">{detail}</p>
    </div>
  );
}
