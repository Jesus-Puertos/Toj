import Link from 'next/link';
import type { Route } from 'next';
import { KpiCard } from '@/components/gobierno/KpiCard';

const indicadores = [
  { title: 'Recaudación hoy', value: '$48,250', note: '+12% vs ayer' },
  { title: 'Pagos conciliados', value: '126', note: '2 pendientes' },
  { title: 'Cargas masivas', value: '14', note: '1 con errores' }
];

const accesos = [
  {
    href: '/admin/conciliacion',
    title: 'Conciliación STP',
    description: 'Revisa pagos, estatus y confirmaciones de transferencia.',
    icon: 'currency_exchange',
  },
  {
    href: '/admin/etl',
    title: 'ETL Masivo',
    description: 'Carga CSV, procesa errores y controla la ingesta histórica.',
    icon: 'database_upload',
  },
  {
    href: '/admin/kyc',
    title: 'Auditoría KYC',
    description: 'Consulta validaciones, rechazos y bitácora biométrica.',
    icon: 'verified_user',
  },
];

export default function GobiernoAdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-10">
      <section className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-toj-terracotta-light/80">Panel de gobierno</p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold md:text-5xl">
          Control operativo de recaudación y expedientes
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-white/70 md:text-base">
          La capa administrativa arranca con KPIs, luego añadimos tablas, conciliación y carga masiva conectada a Supabase.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {indicadores.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </section>

      <section className="mt-10 space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold md:text-2xl">Accesos operativos</h2>
            <p className="mt-1 text-sm text-white/60">Cada bloque abre una pantalla especializada para trabajar sin mezclar flujos.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {accesos.map((item) => (
            <Link
              key={item.href}
              href={item.href as Route}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-toj-terracotta/15 text-toj-terracotta">
                <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/65">{item.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-toj-terracotta-light">
                Abrir módulo
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
