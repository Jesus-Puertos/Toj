'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { finalizarKyc } from './actions';

type Paso = { numero: number; label: string; sublabel: string };

const PASOS: Paso[] = [
  { numero: 1, label: 'Identidad', sublabel: 'Selfie + INE' },
  { numero: 2, label: 'Domicilio', sublabel: 'Comprobante' },
  { numero: 3, label: 'Finalizar', sublabel: 'Revisión' },
];

function Stepper({ pasoActual }: { pasoActual: number }) {
  return (
    <div className="flex items-start justify-between mb-8 px-4">
      {PASOS.map((paso, idx) => (
        <div key={paso.numero} className="flex items-start flex-1">
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[15px] ${pasoActual >= paso.numero ? 'bg-primary text-on-primary' : 'bg-surface-container border-2 border-outline-variant text-on-surface-variant'}`}>
              {pasoActual > paso.numero ? <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span> : paso.numero}
            </div>
            <div className="text-center">
              <p className={`text-label-caps font-bold tracking-widest leading-tight ${pasoActual >= paso.numero ? 'text-primary' : 'text-on-surface-variant'}`}>{paso.label}</p>
              <p className="text-[10px] text-on-surface-variant leading-tight">{paso.sublabel}</p>
            </div>
          </div>
          {idx < PASOS.length - 1 && <div className={`flex-1 h-0.5 mx-2 mt-4 ${pasoActual > paso.numero ? 'bg-primary' : 'bg-outline-variant'}`} />}
        </div>
      ))}
    </div>
  );
}

function StepIdentidad({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center">
      <h1 className="text-h2 font-bold text-on-surface">Verifica tu identidad</h1>
      <p className="text-body-md text-on-surface-variant mt-2">Toma una selfie para confirmar que eres tú</p>
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 mt-6">
        <p className="text-label-caps text-on-surface-variant font-bold tracking-widest mb-5 uppercase">Posiciona tu rostro en el círculo</p>
        <div className="relative mx-auto w-56 h-56 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-primary animate-pulse-ring opacity-60" />
          <div className="absolute inset-4 rounded-full border border-primary/40" />
          <div className="w-full h-full rounded-full bg-[#0d2420] flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-primary/60" style={{ fontSize: '80px', fontVariationSettings: "'FILL' 0, 'wght' 200" }}>person</span>
          </div>
        </div>
        <div className="relative mx-auto w-56 h-0 -mt-56 pointer-events-none">
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-sm" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-sm" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-sm" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-sm" />
        </div>
        <div className="mt-56 pt-1" />
        <ul className="mt-4 space-y-1.5 text-left">
          {['Buena iluminación', 'Sin lentes oscuros', 'Mira de frente'].map((tip) => (
            <li key={tip} className="flex items-center gap-2 text-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={onNext} className="w-full mt-6 bg-primary text-on-primary rounded-2xl py-4 text-body-md font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors shadow-card">
        <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>camera_alt</span>
        Tomar Selfie
      </button>
    </div>
  );
}

function StepDomicilio({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-h2 font-bold text-on-surface">Comprobante de domicilio</h1>
      <p className="text-body-md text-on-surface-variant">Sube o fotografía tu comprobante de domicilio reciente (menos de 3 meses).</p>
      <div className="bg-surface-container-lowest border-2 border-dashed border-outline-variant rounded-2xl p-10 flex flex-col items-center gap-3">
        <span className="material-symbols-outlined text-on-surface-variant text-[48px]">upload_file</span>
        <p className="text-body-sm text-on-surface-variant">Toca para subir archivo</p>
        <span className="text-label-caps text-outline font-bold tracking-wide">PDF, JPG o PNG — Máx. 5 MB</span>
      </div>
      <button onClick={onNext} className="w-full bg-primary text-on-primary rounded-2xl py-4 text-body-md font-bold hover:bg-primary-container transition-colors">Continuar</button>
    </div>
  );
}

function StepFinalizar() {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
        <span className="material-symbols-outlined text-primary text-[56px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
      </div>
      <div>
        <h1 className="text-h2 font-bold text-on-surface">¡Casi listo!</h1>
        <p className="text-body-md text-on-surface-variant mt-2">Tu información está en revisión. Te notificaremos en las próximas 24 horas.</p>
      </div>
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-left space-y-2">
        {['Selfie capturada', 'Comprobante subido', 'Datos en revisión'].map((item, i) => (
          <div key={item} className="flex items-center gap-3">
            <span className={`material-symbols-outlined text-[20px] ${i < 2 ? 'text-primary' : 'text-outline'}`} style={{ fontVariationSettings: "'FILL' 1" }}>{i < 2 ? 'check_circle' : 'radio_button_unchecked'}</span>
            <span className={`text-body-sm ${i < 2 ? 'text-on-surface font-medium' : 'text-on-surface-variant'}`}>{item}</span>
          </div>
        ))}
      </div>
      <form action={finalizarKyc}>
        <button type="submit" className="w-full bg-primary text-on-primary rounded-2xl py-4 text-body-md font-bold hover:bg-primary-container transition-colors">
          Ir al Dashboard
        </button>
      </form>
    </div>
  );
}

export default function KycPage() {
  const [pasoActual, setPasoActual] = useState(1);
  const avanzar = () => setPasoActual((p) => Math.min(p + 1, 3));

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 bg-surface z-10 flex items-center justify-between px-5 py-4 border-b border-outline-variant">
        <span className="text-primary font-bold text-[18px]">TOJ Platform</span>
        <button aria-label="Ayuda">
          <span className="material-symbols-outlined text-on-surface-variant text-[24px]">help_outline</span>
        </button>
      </header>
      <div className="px-5 py-6">
        <Stepper pasoActual={pasoActual} />
        {pasoActual === 1 && <StepIdentidad onNext={avanzar} />}
        {pasoActual === 2 && <StepDomicilio onNext={avanzar} />}
        {pasoActual === 3 && <StepFinalizar />}
      </div>
    </div>
  );
}
