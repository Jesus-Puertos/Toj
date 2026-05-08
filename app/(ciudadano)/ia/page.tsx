'use client';
// Chat TOJ Assistant IA
import Link from 'next/link';
import type { Route } from 'next';
import { useState } from 'react';

function ObligacionInlineCard() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 ml-12 mt-2">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
        </div>
        <div>
          <p className="font-bold text-on-surface text-body-sm">Impuesto Predial 2024</p>
          <p className="text-on-surface-variant text-[11px]">ID: PRD-9920-X</p>
        </div>
      </div>
      <div className="space-y-2 border-t border-outline-variant pt-3">
        <div className="flex justify-between text-body-sm"><span className="text-on-surface-variant">Monto Base</span><span className="text-on-surface font-medium tabular-nums">$2,400.00</span></div>
        <div className="flex justify-between text-body-sm"><span className="text-on-surface-variant">Descuento Pronto Pago</span><span className="text-primary font-medium tabular-nums">-$480.00</span></div>
        <div className="flex justify-between text-body-md font-bold border-t border-outline-variant pt-2"><span className="text-on-surface">Total a Pagar</span><span className="text-primary tabular-nums">$1,920.00</span></div>
      </div>
    </div>
  );
}

function BurbujaBot({ texto, hora, showCard = false }: { texto: string; hora: string; showCard?: boolean }) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-end gap-2">
        <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center shrink-0 mb-1">
          <span className="material-symbols-outlined text-on-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl rounded-tl-sm p-4 max-w-[85%]">
          <p className="text-body-sm text-on-surface leading-relaxed">{texto}</p>
          <p className="text-on-surface-variant text-[11px] mt-2">{hora}</p>
        </div>
      </div>
      {showCard && <ObligacionInlineCard />}
    </div>
  );
}

function BurbujaUser({ texto, hora }: { texto: string; hora: string }) {
  return (
    <div className="flex justify-end">
      <div className="bg-primary text-on-primary rounded-2xl rounded-tr-sm p-4 max-w-[80%]">
        <p className="text-body-sm leading-relaxed">{texto}</p>
        <div className="flex items-center justify-end gap-1 mt-2">
          <p className="text-on-primary/70 text-[11px]">{hora}</p>
          <span className="text-on-primary/70 text-[11px]">✓✓</span>
        </div>
      </div>
    </div>
  );
}

export default function IAPage() {
  const [inputValue, setInputValue] = useState('');
  const [chips, setChips] = useState(true);
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="sticky top-0 bg-surface z-10 px-5 py-3 border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <Link href={'/dashboard' as Route} aria-label="Regresar">
            <span className="material-symbols-outlined text-on-surface-variant text-[24px]">arrow_back</span>
          </Link>
          <div className="flex-1">
            <p className="font-bold text-on-surface text-body-md leading-tight">TOJ Assistant (IA)</p>
            <p className="text-label-caps text-primary font-bold tracking-widest">EN LINEA • CIUDADANO</p>
          </div>
          <button aria-label="Informacion">
            <span className="material-symbols-outlined text-on-surface-variant text-[24px]">info</span>
          </button>
        </div>
      </header>
      <div className="flex-1 px-4 py-5 space-y-5 overflow-y-auto" style={{ paddingBottom: 'calc(68px + 70px)' }}>
        <div className="text-label-caps text-on-surface-variant bg-surface-container rounded-full px-4 py-1 mx-auto w-fit tracking-widest">HOY</div>
        <BurbujaBot texto="Hola! Veo que tu predial vence pronto. Si ahorras $200 a la semana desde tu wallet, lo cubres sin recargos. Te creo una meta de ahorro?" hora="09:41 AM" />
        {chips && (
          <div className="flex gap-2 flex-wrap ml-12">
            <button onClick={() => setChips(false)} className="bg-primary text-on-primary rounded-full px-4 py-2 text-body-sm font-semibold hover:bg-primary-container transition-colors">Si, crear meta</button>
            <button onClick={() => setChips(false)} className="bg-surface-container-low border border-outline-variant rounded-full px-4 py-2 text-body-sm text-on-surface hover:bg-surface-container transition-colors">Ver detalles predial</button>
          </div>
        )}
        <BurbujaUser texto="Cuanto debo en total este anio?" hora="09:43 AM" />
        <BurbujaBot texto="Aqui esta el desglose de tu impuesto predial 2024. Con el descuento de pronto pago tienes un ahorro de $480:" hora="09:43 AM" showCard />
        <BurbujaBot texto="Recuerda que puedes pagar directamente desde la app con tu wallet TOJ o mediante transferencia STP. Deseas pagar ahora?" hora="09:44 AM" />
        <div className="flex gap-2 flex-wrap ml-12">
          <Link href={'/pagar/ob-1' as Route} className="bg-primary text-on-primary rounded-full px-4 py-2 text-body-sm font-semibold hover:bg-primary-container transition-colors">Pagar ahora</Link>
          <button className="bg-surface-container-low border border-outline-variant rounded-full px-4 py-2 text-body-sm text-on-surface">Recordarmelo manana</button>
        </div>
      </div>
      <div className="fixed bottom-[68px] left-0 right-0 max-w-[600px] mx-auto bg-surface border-t border-outline-variant px-4 py-3 flex items-center gap-3">
        <button aria-label="Adjuntar" className="w-9 h-9 bg-surface-container-low border border-outline-variant rounded-full flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">add</span>
        </button>
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Escribe un mensaje..." className="flex-1 bg-surface-container-low rounded-full px-4 py-2.5 text-body-sm text-on-surface placeholder:text-on-surface-variant border border-outline-variant outline-none focus:border-primary transition-colors" />
        <button aria-label="Enviar" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
        </button>
      </div>
    </div>
  );
}