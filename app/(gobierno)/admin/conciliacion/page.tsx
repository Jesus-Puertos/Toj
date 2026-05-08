import Link from 'next/link';

const pagos = [
  { folio: 'PAG-2401', obligacion: 'Predial 2026', ciudadano: 'Juan Martinez', monto: '$2,500.00', estado: 'Conciliado' },
  { folio: 'PAG-2402', obligacion: 'Agua Potable', ciudadano: 'Maria Lopez', monto: '$480.00', estado: 'Pendiente' },
  { folio: 'PAG-2403', obligacion: 'Licencia Municipal', ciudadano: 'Carlos Perez', monto: '$1,200.00', estado: 'Observado' },
];

const resumen = [
  { label: 'Conciliados', value: '126' },
  { label: 'Pendientes', value: '2' },
  { label: 'Observados', value: '4' },
];

export default function ConciliacionPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-toj-terracotta-light/80">Conciliación STP</p>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold md:text-4xl">Pagos, estado y trazabilidad</h1>
        </div>
        <Link href="/admin" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/5">
          Volver al panel
        </Link>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {resumen.map((item) => (
          <article key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/65">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">Movimientos recientes</h2>
        </div>
        <div className="divide-y divide-white/10">
          {pagos.map((pago) => (
            <article key={pago.folio} className="grid gap-3 px-5 py-4 md:grid-cols-[1.1fr_1.5fr_1fr_0.8fr] md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Folio</p>
                <p className="mt-1 font-semibold text-white">{pago.folio}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Obligación / Ciudadano</p>
                <p className="mt-1 text-sm text-white/85">{pago.obligacion}</p>
                <p className="text-sm text-white/55">{pago.ciudadano}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Monto</p>
                <p className="mt-1 font-semibold text-white">{pago.monto}</p>
              </div>
              <div className="md:text-right">
                <span className="inline-flex rounded-full bg-toj-terracotta/15 px-3 py-1 text-xs font-semibold text-toj-terracotta-light">
                  {pago.estado}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}