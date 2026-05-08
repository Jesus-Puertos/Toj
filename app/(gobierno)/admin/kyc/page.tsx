import Link from 'next/link';

const solicitudes = [
  { ciudadano: 'Juan Martinez', curp: 'MART900101HVZLXN01', estado: 'Verificado', score: '98' },
  { ciudadano: 'Maria Lopez', curp: 'LOPM920215MVZRSP09', estado: 'EnProceso', score: '74' },
  { ciudadano: 'Carlos Perez', curp: 'PERC880320HVZLRS05', estado: 'Rechazado', score: '41' },
];

export default function KycAdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-toj-terracotta-light/80">Auditoría KYC</p>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold md:text-4xl">Validaciones biométricas y RENAPO</h1>
        </div>
        <Link href="/admin" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/5">
          Volver al panel
        </Link>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { label: 'Verificados', value: '842' },
          { label: 'En proceso', value: '19' },
          { label: 'Rechazados', value: '31' },
        ].map((item) => (
          <article key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/65">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">Últimas solicitudes KYC</h2>
        </div>
        <div className="divide-y divide-white/10">
          {solicitudes.map((solicitud) => (
            <article key={solicitud.curp} className="grid gap-3 px-5 py-4 md:grid-cols-[1.4fr_1.3fr_0.7fr_0.8fr] md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Ciudadano</p>
                <p className="mt-1 font-semibold text-white">{solicitud.ciudadano}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">CURP</p>
                <p className="mt-1 font-mono text-sm text-white/80">{solicitud.curp}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Score</p>
                <p className="mt-1 text-white/85">{solicitud.score}</p>
              </div>
              <div className="md:text-right">
                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                  {solicitud.estado}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}