'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface CargaResult {
  success: boolean;
  total: number;
  exitosos: number;
  errores: number;
  erroresDetalle: { fila: number; motivo: string }[];
}

export default function EtlPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CargaResult | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/gobierno/carga-masiva', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar el archivo');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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

      {/* Upload Area */}
      <section className="mt-10">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer border-2 border-dashed rounded-[2rem] p-12 transition-all flex flex-col items-center justify-center text-center ${
            loading ? 'border-toj-terracotta/50 bg-toj-terracotta/5' : 'border-white/10 hover:border-toj-terracotta/40 hover:bg-white/5'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".csv" 
            className="hidden" 
          />
          
          <div className="w-20 h-20 bg-toj-terracotta/10 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-toj-terracotta text-[40px]">
              {loading ? 'sync' : 'upload_file'}
            </span>
          </div>
          
          <h2 className="text-xl font-bold text-white mb-2">
            {loading ? 'Procesando archivo...' : 'Sube tu padrón municipal'}
          </h2>
          <p className="text-white/50 max-w-md">
            Arrastra tu archivo CSV o haz clic para seleccionarlo. 
            El sistema mapeará automáticamente los CURPs y generará las obligaciones.
          </p>
          
          {loading && (
            <div className="mt-8 w-64 bg-white/5 rounded-full h-2 overflow-hidden">
              <div className="bg-toj-terracotta h-full animate-progress-bar" />
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      {result && (
        <section className="mt-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="rounded-[2rem] bg-white/5 border border-white/10 overflow-hidden">
            <div className="bg-green-500/10 border-b border-white/10 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-green-500">check_circle</span>
                <h3 className="font-bold text-white">Carga completada exitosamente</h3>
              </div>
              <span className="text-xs font-mono text-white/40">ETL-v2.0-SUCCESS</span>
            </div>
            
            <div className="p-8 grid gap-6 md:grid-cols-3">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-2">Total procesado</p>
                <p className="text-4xl font-bold text-white">{result.total}</p>
              </div>
              <div className="bg-green-500/5 rounded-2xl p-6 border border-green-500/10">
                <p className="text-green-500/60 text-xs uppercase tracking-widest font-bold mb-2">Exitosos</p>
                <p className="text-4xl font-bold text-green-500">{result.exitosos}</p>
              </div>
              <div className="bg-red-500/5 rounded-2xl p-6 border border-red-500/10">
                <p className="text-red-500/60 text-xs uppercase tracking-widest font-bold mb-2">Errores</p>
                <p className="text-4xl font-bold text-red-500">{result.errores}</p>
              </div>
            </div>

            {result.errores > 0 && (
              <div className="px-8 pb-8">
                <h4 className="text-sm font-bold text-white/80 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">report</span>
                  Detalle de errores ({result.errores})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {result.erroresDetalle.map((err, i) => (
                    <div key={i} className="bg-red-500/10 rounded-xl px-4 py-3 flex items-center justify-between text-sm">
                      <span className="text-red-300/80">Fila {err.fila}</span>
                      <span className="text-white/70">{err.motivo}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {error && (
        <section className="mt-8">
          <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6 flex items-center gap-4">
            <span className="material-symbols-outlined text-red-500 text-[32px]">error</span>
            <div>
              <h3 className="font-bold text-white text-lg">Error en la carga</h3>
              <p className="text-red-300/80">{error}</p>
            </div>
          </div>
        </section>
      )}

      {/* Stats Cards (Static/Mock for now) */}
      {!result && (
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { label: 'Registros procesados hoy', value: '2,475', color: 'text-toj-terracotta' },
            { label: 'Tasa de éxito promedio', value: '98.4%', color: 'text-green-500' },
            { label: 'Ahorro estimado (horas)', value: '142h', color: 'text-blue-400' },
          ].map((item) => (
            <article key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-6 flex flex-col justify-between h-40">
              <p className="text-sm text-white/65 font-medium">{item.label}</p>
              <p className={`text-4xl font-bold ${item.color}`}>{item.value}</p>
            </article>
          ))}
        </section>
      )}
      
      <style jsx>{`
        @keyframes progress-bar {
          0% { width: 0; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress-bar {
          animation: progress-bar 2s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}