type KpiCardProps = {
  title: string;
  value: string;
  note: string;
};

export function KpiCard({ title, value, note }: KpiCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
      <p className="text-sm font-medium text-white/70">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-white/60">{note}</p>
    </article>
  );
}
