import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';

type PagoReal = {
  id: string;
  monto_transferido: number;
  estado_conciliacion: string;
  clave_rastreo_stp: string | null;
  created_at: string;
  obligaciones: {
    tipo_tramite: string;
  } | null;
  ciudadanos: {
    nombre_completo: string;
  } | null;
};

export default async function ConciliacionPage() {
  const supabase = createSupabaseServerClient();

  // 1. Obtener estadísticas reales
  const { data: stats } = await supabase
    .from('pagos')
    .select('estado_conciliacion');

  const totalConciliados = stats?.filter(p => p.estado_conciliacion === 'Conciliado').length || 0;
  const totalPendientes   = stats?.filter(p => p.estado_conciliacion === 'Pendiente').length || 0;
  const totalObservados   = stats?.filter(p => p.estado_conciliacion === 'Observado').length || 0;

  const resumen = [
    { label: 'Conciliados', value: totalConciliados.toString(), color: 'text-emerald-400' },
    { label: 'Pendientes', value: totalPendientes.toString(), color: 'text-amber-400' },
    { label: 'Observados', value: totalObservados.toString(), color: 'text-toj-terracotta' },
  ];

  // 2. Obtener movimientos recientes con JOINs
  const { data: pagosData } = await supabase
    .from('pagos')
    .select(`
      id,
      monto_transferido,
      estado_conciliacion,
      clave_rastreo_stp,
      created_at,
      obligaciones ( tipo_tramite ),
      ciudadanos ( nombre_completo )
    `)
    .order('created_at', { ascending: false })
    .limit(20);

  const pagos = (pagosData as any[] ?? []) as PagoReal[];

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
            <p className={`mt-3 text-3xl font-semibold ${item.color}`}>{item.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">Movimientos recientes</h2>
        </div>
        <div className="divide-y divide-white/10">
          {pagos.length > 0 ? (
            pagos.map((pago) => (
              <article key={pago.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1.1fr_1.5fr_1fr_0.8fr] md:items-center">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">Folio / STP</p>
                  <p className="mt-1 font-semibold text-white">{pago.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-[10px] font-mono text-white/30 truncate">{pago.clave_rastreo_stp || 'SIN CLAVE'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">Obligación / Ciudadano</p>
                  <p className="mt-1 text-sm text-white/85 font-medium">{pago.obligaciones?.tipo_tramite ?? 'N/A'}</p>
                  <p className="text-sm text-white/55">{pago.ciudadanos?.nombre_completo ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">Monto</p>
                  <p className="mt-1 font-semibold text-white">
                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(pago.monto_transferido)}
                  </p>
                </div>
                <div className="md:text-right">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                    pago.estado_conciliacion === 'Conciliado' ? 'bg-emerald-500/10 text-emerald-400' :
                    pago.estado_conciliacion === 'Pendiente' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {pago.estado_conciliacion}
                  </span>
                </div>
              </article>
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="text-white/40 italic">No se han registrado pagos aún.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}