'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  pagoData: {
    obligacion_id: string;
    monto: number;
    referencia: string;
    clave_rastreo: string;
  };
}

export function SimularPagoBtn({ pagoData }: Props) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'generating' | 'simulating' | 'success' | 'error'>('idle');
  const router = useRouter();

  const handleSimulacion = async () => {
    setLoading(true);
    setStatus('generating');

    try {
      // 1. Generar el registro de pago en la DB (Step 2 del Diagrama)
      const resGen = await fetch(`/api/obligaciones/${pagoData.obligacion_id}/generar-pago`, {
        method: 'POST',
      });
      const dataGen = await resGen.json();

      if (!resGen.ok) throw new Error(dataGen.error || 'Error generando intención de pago');

      const { clave_rastreo } = dataGen;
      setStatus('simulating');

      // 2. Simular el Webhook de STP (Step 7 del Diagrama)
      const resWeb = await fetch('/api/webhooks/stp/confirmacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clave_rastreo: clave_rastreo,
          monto: pagoData.monto,
          referencia: pagoData.referencia,
          estado: 'EXITOSO'
        }),
      });

      if (!resWeb.ok) throw new Error('Error simulando confirmación STP');

      setStatus('success');
      
      // Notificar al usuario y volver al dashboard
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 2000);

    } catch (err) {
      console.error(err);
      setStatus('error');
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="w-full bg-green-100 border border-green-200 text-green-700 rounded-2xl py-4 font-bold text-center flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-[24px]">check_circle</span>
        ¡Pago Confirmado Exitosamente!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleSimulacion}
        disabled={loading}
        className="w-full bg-primary text-on-primary rounded-2xl py-4 font-bold text-body-md shadow-card hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            {status === 'generating' ? 'Generando intención...' : 'Simulando STP...'}
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>send_to_mobile</span>
            Simular Pago SPEI (STP Demo)
          </>
        )}
      </button>
      
      {status === 'error' && (
        <p className="text-center text-red-500 text-xs font-semibold">
          Error en la simulación. Intenta de nuevo.
        </p>
      )}
    </div>
  );
}
