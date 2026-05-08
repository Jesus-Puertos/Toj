// Mis Pagos -- historial de pagos del ciudadano
import Link from 'next/link';
import type { Route } from 'next';

type Pago = { id: string; concepto: string; monto: number; fecha: string; estado: 'Conciliado' | 'Pendiente' | 'Rechazado' };

const PAGOS: Pago[] = [
  { id: 'p-1', concepto: 'Predial 2025', monto: 2300, fecha: '12 Ene 2026', estado: 'Conciliado' },
  { id: 'p-2', concepto: 'Agua Potable', monto: 480,  fecha: '05 Feb 2026', estado: 'Conciliado' },
  { id: 'p-3', concepto: 'Licencia',     monto: 1200, fecha: '28 Feb 2026', estado: 'Pendiente'  },
];

const TOTAL = PAGOS.filter((p) => p.estado === 'Conciliado').reduce((a, p) => a + p.monto, 0);
const fmt = (n: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }).format(n);
const ESTADO_META: Record<Pago['estado'], { icon: string; cls: string }> = {
  Conciliado: { icon: 'check_circle', cls: 'bg-primary/10 text-primary' },
  Pendiente:  { icon: 'schedule',     cls: 'bg-secondary/10 text-secondary' },
  Rechazado:  { icon: 'cancel',       cls: 'bg-error/10 text-error' },
};
const iconoConcepto = (c: string) => c.includes('Predial') ? 'home' : c.includes('Agua') ? 'water_drop' : c.includes('Licencia') ? 'badge' : 'receipt_long';

export default function PagosPage() {
  return (
    <main className="min-h-screen bg-surface">
      <header className="sticky top-0 bg-surface z-10 flex items-center justify-between px-5 py-4 border-b border-outline-variant">
        <Link href={'/dashboard' as Route} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors" aria-label="Regresar">
          <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
        </Link>
        <span className="text-primary font-bold text-[18px]">Mis Pagos</span>
        <div className="w-10" />
      </header>
      <div className="px-5 py-6 space-y-5">
        <div className="bg-wallet-gradient rounded-2xl p-5 shadow-wallet">
          <p className="text-label-caps font-bold text-white/70 tracking-widest uppercase mb-1">Total Pagado 2026</p>
          <p className="text-h2 font-bold text-white tabular-nums">{fmt(TOTAL)}</p>
          <p className="text-body-sm text-white/60 mt-1">{PAGOS.filter((p) => p.estado === 'Conciliado').length} pagos conciliados este anio</p>
        </div>
        <div className="space-y-1.5">
          <p className="text-label-caps font-bold text-on-surface-variant tracking-widest uppercase mb-3">Historial Reciente</p>
          {PAGOS.map((pago) => {
            const m = ESTADO_META[pago.estado];
            return (
              <div key={pago.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl px-4 py-3.5 flex items-center gap-4">
                <div className="w-11 h-11 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>{iconoConcepto(pago.concepto)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-semibold text-on-surface truncate">{pago.concepto}</p>
                  <p className="text-[12px] text-on-surface-variant mt-0.5">{pago.fecha}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-body-sm font-bold text-on-surface tabular-nums">{fmt(pago.monto)}</p>
                  <span className={'inline-flex items-center gap-0.5 mt-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ' + m.cls}>
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
                    {pago.estado}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <button className="w-full border border-outline-variant rounded-2xl py-3.5 text-body-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors">Ver historial completo</button>
      </div>
    </main>
  );
}