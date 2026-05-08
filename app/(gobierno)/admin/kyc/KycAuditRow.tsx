'use client';

import { useState, useTransition } from 'react';
import { aprobarKyc, rechazarKyc } from './actions';

interface Solicitud {
  id: string;
  ciudadano_id: string;
  estado: string;
  score_confianza: number;
  proveedor: string;
  created_at: string;
  motivo_rechazo: string | null;
  ciudadanos: {
    nombre_completo: string;
    email: string;
    curp: string | null;
    url_selfie_liveness: string | null;
    url_ine_frente: string | null;
    estado_kyc: string;
    chat_id_telegram: string | null;
  } | null;
}

export function KycAuditRow({ solicitud: sol }: { solicitud: Solicitud }) {
  const [showDocs, setShowDocs] = useState(false);
  const [showMotivo, setShowMotivo] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [isPending, startTransition] = useTransition();
  const [actionResult, setActionResult] = useState<'approved' | 'rejected' | null>(null);

  const ciudadano = sol.ciudadanos;
  const isPendingReview = sol.estado === 'EnProceso' || sol.estado === 'Pendiente';
  const hasTelegram = !!ciudadano?.chat_id_telegram;

  const handleAprobar = () => {
    startTransition(async () => {
      const fd = new FormData();
      fd.append('ciudadano_id', sol.ciudadano_id);
      fd.append('solicitud_id', sol.id);
      const res = await aprobarKyc(fd);
      if (!res.error) setActionResult('approved');
    });
  };

  const handleRechazar = () => {
    if (!showMotivo) { setShowMotivo(true); return; }
    startTransition(async () => {
      const fd = new FormData();
      fd.append('ciudadano_id', sol.ciudadano_id);
      fd.append('solicitud_id', sol.id);
      fd.append('motivo', motivo || 'Documentos ilegibles o no coinciden');
      const res = await rechazarKyc(fd);
      if (!res.error) setActionResult('rejected');
    });
  };

  const scoreColor = sol.score_confianza >= 80 ? 'text-emerald-400' : sol.score_confianza >= 60 ? 'text-amber-400' : 'text-red-400';

  if (actionResult === 'approved') {
    return (
      <article className="flex items-center gap-3 px-6 py-5 bg-emerald-500/5">
        <span className="material-symbols-outlined text-emerald-500 text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        <div>
          <p className="text-white font-semibold">{ciudadano?.nombre_completo}</p>
          <p className="text-emerald-400 text-sm">✅ KYC Aprobado — Se notificará al ciudadano vía Telegram</p>
        </div>
      </article>
    );
  }

  if (actionResult === 'rejected') {
    return (
      <article className="flex items-center gap-3 px-6 py-5 bg-red-500/5">
        <span className="material-symbols-outlined text-red-500 text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
        <div>
          <p className="text-white font-semibold">{ciudadano?.nombre_completo}</p>
          <p className="text-red-400 text-sm">❌ KYC Rechazado — Se notificará al ciudadano vía Telegram</p>
        </div>
      </article>
    );
  }

  return (
    <article className="px-6 py-5 space-y-4">
      {/* Fila principal */}
      <div className="grid gap-4 md:grid-cols-[1.8fr_1.2fr_0.6fr_0.6fr_auto] md:items-center">

        {/* Ciudadano */}
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40 font-bold mb-1">Ciudadano</p>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-toj-terracotta/20 flex items-center justify-center text-toj-terracotta font-bold text-sm shrink-0">
              {(ciudadano?.nombre_completo ?? '?').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white truncate">{ciudadano?.nombre_completo ?? '—'}</p>
              <p className="text-white/50 text-xs truncate">{ciudadano?.email ?? '—'}</p>
            </div>
          </div>
        </div>

        {/* CURP */}
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40 font-bold mb-1">CURP</p>
          <p className="font-mono text-sm text-white/80">{ciudadano?.curp ?? 'No registrado'}</p>
        </div>

        {/* Score */}
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40 font-bold mb-1">Score</p>
          <p className={`text-2xl font-bold tabular-nums ${scoreColor}`}>{sol.score_confianza}<span className="text-sm font-normal">%</span></p>
        </div>

        {/* Telegram */}
        <div className="flex flex-col items-start gap-1">
          <p className="text-xs uppercase tracking-widest text-white/40 font-bold">Telegram</p>
          <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${hasTelegram ? 'bg-sky-500/15 text-sky-400' : 'bg-white/10 text-white/40'}`}>
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: `'FILL' ${hasTelegram ? 1 : 0}` }}>
              {hasTelegram ? 'send' : 'block'}
            </span>
            {hasTelegram ? 'Vinculado' : 'Sin vincular'}
          </span>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Ver documentos */}
          <button
            onClick={() => setShowDocs(!showDocs)}
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            {showDocs ? 'Ocultar' : 'Ver docs'}
          </button>

          {isPendingReview && !actionResult && (
            <>
              <button
                onClick={handleAprobar}
                disabled={isPending}
                className="flex items-center gap-1 rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-3 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                {isPending ? 'Procesando...' : 'Aprobar'}
              </button>
              <button
                onClick={handleRechazar}
                disabled={isPending}
                className="flex items-center gap-1 rounded-xl bg-red-500/20 border border-red-500/30 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
                Rechazar
              </button>
            </>
          )}

          {!isPendingReview && (
            <span className={`text-xs font-bold px-3 py-2 rounded-xl border ${
              sol.estado === 'Aprobado' || sol.estado === 'Verificado'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {sol.estado === 'Aprobado' || sol.estado === 'Verificado' ? '✅ Aprobado' : '❌ Rechazado'}
            </span>
          )}
        </div>
      </div>

      {/* Input de motivo de rechazo */}
      {showMotivo && isPendingReview && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 space-y-3">
          <p className="text-red-300 text-sm font-semibold">Motivo del rechazo (se enviará al ciudadano)</p>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ej: La foto de la INE es ilegible, por favor sube una imagen más clara..."
            rows={3}
            className="w-full bg-black/30 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none resize-none focus:border-red-400/50 transition-colors"
          />
          <div className="flex gap-3">
            <button
              onClick={() => { setShowMotivo(false); setMotivo(''); }}
              className="flex-1 rounded-xl border border-white/10 py-2.5 text-xs font-semibold text-white/60 hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleRechazar}
              disabled={isPending}
              className="flex-1 rounded-xl bg-red-500/20 border border-red-500/30 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
            >
              {isPending ? 'Rechazando...' : '❌ Confirmar Rechazo'}
            </button>
          </div>
        </div>
      )}

      {/* Visor de documentos */}
      {showDocs && (
        <div className="grid gap-4 sm:grid-cols-2 bg-white/5 rounded-2xl p-4 border border-white/10">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Selfie / Liveness</p>
            {ciudadano?.url_selfie_liveness ? (
              <a href={ciudadano.url_selfie_liveness} target="_blank" rel="noopener noreferrer">
                <img
                  src={ciudadano.url_selfie_liveness}
                  alt="Selfie del ciudadano"
                  className="w-full rounded-xl object-cover max-h-48 border border-white/10 hover:opacity-80 transition-opacity"
                />
              </a>
            ) : (
              <div className="flex items-center justify-center h-32 bg-white/5 rounded-xl border border-dashed border-white/10">
                <span className="text-white/30 text-sm">No subida aún</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40 font-bold mb-2">INE / Comprobante</p>
            {ciudadano?.url_ine_frente ? (
              <a href={ciudadano.url_ine_frente} target="_blank" rel="noopener noreferrer">
                <img
                  src={ciudadano.url_ine_frente}
                  alt="INE del ciudadano"
                  className="w-full rounded-xl object-cover max-h-48 border border-white/10 hover:opacity-80 transition-opacity"
                />
              </a>
            ) : (
              <div className="flex items-center justify-center h-32 bg-white/5 rounded-xl border border-dashed border-white/10">
                <span className="text-white/30 text-sm">No subido aún</span>
              </div>
            )}
          </div>
          {sol.motivo_rechazo && (
            <div className="sm:col-span-2 bg-red-500/10 rounded-xl p-3 border border-red-500/20">
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Motivo de rechazo</p>
              <p className="text-sm text-red-300">{sol.motivo_rechazo}</p>
            </div>
          )}
          <div className="sm:col-span-2 flex gap-4 text-xs text-white/40">
            <span>Proveedor: <span className="text-white/60 font-semibold">{sol.proveedor}</span></span>
            <span>Fecha: <span className="text-white/60 font-semibold">{new Date(sol.created_at).toLocaleDateString('es-MX')}</span></span>
          </div>
        </div>
      )}
    </article>
  );
}
