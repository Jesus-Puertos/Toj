// Pasarela de pago STP
import Link from 'next/link';
import type { Route } from 'next';

const MOCKS: Record<string, { titulo: string; monto: number; desc: string }> = {
  'ob-1': { titulo: 'Predial 2026 - Zongolica', monto: 2500, desc: 'Impuesto predial anual' },
  'ob-2': { titulo: 'Agua Potable',              monto: 480,  desc: 'Servicio mensual de agua' },
  'ob-3': { titulo: 'Licencia Municipal',         monto: 1200, desc: 'Licencia anual de operacion' },
};

const CLABE = '646180 5000 0123 4567 89';

function fmt(n: number) { return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }).format(n); }

export default function PagarPage({ params }: { params: { id: string } }) {
  const ob = MOCKS[params.id] ?? { titulo: 'Obligacion ' + params.id, monto: 0, desc: 'Detalle no disponible' };
  return (
    <main className="min-h-screen bg-surface">
      <header className="sticky top-0 bg-surface z-10 flex items-center justify-between px-5 py-4 border-b border-outline-variant">
        <Link href={'/dashboard' as Route} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors" aria-label="Regresar">
          <span className="material-symbols-outlined text-on-surface-variant text-[24px]">arrow_back</span>
        </Link>
        <span className="text-primary font-bold text-[18px]">TOJ Platform</span>
        <button aria-label="Mas opciones" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant text-[24px]">more_vert</span>
        </button>
      </header>
      <div className="px-5 py-6 space-y-5">
        <div>
          <p className="text-secondary text-label-caps font-bold tracking-widest uppercase">Resumen de Pago</p>
          <h1 className="text-h2 font-bold text-on-surface mt-1">{ob.titulo}</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">{ob.desc}</p>
        </div>
        <div className="bg-surface-container-low rounded-2xl px-5 py-4 flex items-center justify-between">
          <span className="text-on-surface-variant text-body-md">Monto Total</span>
          <span className="text-primary text-h3 font-bold tabular-nums">{fmt(ob.monto)}</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 space-y-4">
          <div className="text-center space-y-1">
            <p className="text-on-surface font-semibold text-body-md">Transferencia via STP</p>
            <p className="text-on-surface-variant text-body-sm">Escanea el codigo QR desde tu App bancaria</p>
          </div>
          <div className="mx-auto w-44 h-44 bg-surface-container rounded-xl border-2 border-outline-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '80px', fontVariationSettings: "'FILL' 0" }}>qr_code_2</span>
          </div>
          <p className="text-center text-label-caps text-on-surface-variant font-semibold tracking-wide">O realiza transferencia manual con la CLABE abajo</p>
        </div>
        <div className="space-y-2">
          <p className="text-label-caps text-on-surface-variant font-bold tracking-widest uppercase">CLABE Unica de Pago</p>
          <div className="bg-surface-container-low rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <span className="font-mono text-body-sm text-on-surface tracking-wider flex-1">{CLABE}</span>
            <button aria-label="Copiar CLABE" className="text-primary hover:bg-primary/10 rounded-lg p-1 transition-colors">
              <span className="material-symbols-outlined text-[20px]">content_copy</span>
            </button>
          </div>
        </div>
        <div className="bg-surface-container-low rounded-xl px-4 py-3 space-y-2">
          <div className="flex justify-between text-body-sm"><span className="text-on-surface-variant">Referencia</span><span className="font-mono text-on-surface font-medium">{params.id.toUpperCase()}-TOJ</span></div>
          <div className="flex justify-between text-body-sm"><span className="text-on-surface-variant">Banco receptor</span><span className="text-on-surface font-medium">STP (646)</span></div>
          <div className="flex justify-between text-body-sm"><span className="text-on-surface-variant">Beneficiario</span><span className="text-on-surface font-medium">TOJ Platform</span></div>
        </div>
        <div className="flex items-center gap-3 py-4">
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
          <p className="text-on-surface-variant text-body-sm italic">Esperando confirmacion de transferencia via STP...</p>
        </div>
        <button className="w-full bg-primary text-on-primary rounded-2xl py-4 font-bold text-body-md shadow-card hover:bg-primary-container transition-colors">
          Simular Confirmacion STP (Demo)
        </button>
        <p className="text-center text-[11px] text-on-surface-variant leading-relaxed pb-2">Los pagos son procesados de forma segura a traves de STP. El saldo se refleja en maximo 2 horas habiles.</p>
      </div>
    </main>
  );
}