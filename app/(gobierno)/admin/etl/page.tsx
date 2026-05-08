import Link from 'next/link';

const cargas = [
  { archivo: 'Padron_Predial_2024.csv', registros: '1,245', estado: 'Completada', errores: '5' },
  { archivo: 'Agua_Residencial_Q1.csv', registros: '820', estado: 'Procesando', errores: '0' },
  { archivo: 'Licencias_2026.xlsx', registros: '410', estado: 'CompletadaConErrores', errores: '11' },
];

export default function EtlPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-toj-terracotta-light/80">ETL masivo</p>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold md:text-4xl">Carga de padrones y normalización de datos</h1>
        </div>
        <Link href="/admin" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/5">
          Volver al panel
        </Link>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { label: 'Registros procesados hoy', value: '2,475' },
          { label: 'Errores detectados', value: '16' },
          { label: 'Cargas activas', value: '1' },
        ].map((item) => (
          <article key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/65">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">Últimas cargas</h2>
          <button className="rounded-full bg-toj-terracotta px-4 py-2 text-sm font-semibold text-white transition hover:bg-toj-terracotta/90">
            Subir archivo
          </button>
        </div>
        <div className="divide-y divide-white/10">
          {cargas.map((carga) => (
            <article key={carga.archivo} className="grid gap-3 px-5 py-4 md:grid-cols-[1.7fr_0.8fr_0.9fr_0.8fr] md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Archivo</p>
                <p className="mt-1 font-semibold text-white">{carga.archivo}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Registros</p>
                <p className="mt-1 text-white/85">{carga.registros}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Errores</p>
                <p className="mt-1 text-white/85">{carga.errores}</p>
              </div>
              <div className="md:text-right">
                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                  {carga.estado}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}