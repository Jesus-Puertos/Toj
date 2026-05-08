'use client';

import { useRef, useEffect, useState } from 'react';

// FaceDetector es parte de la Shape Detection API (Chrome/Edge).
// No está en el estándar TypeScript lib, por eso la declaramos aquí.
declare global {
  class FaceDetector {
    constructor(options?: { maxDetectedFaces?: number; fastMode?: boolean });
    detect(
      image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
    ): Promise<{ boundingBox: DOMRectReadOnly }[]>;
  }
}

type Estado =
  | 'iniciando'
  | 'sin_permiso'
  | 'escaneando'
  | 'cara_detectada'
  | 'capturado';

interface Props {
  /** Recibe el dataURL de la selfie capturada (JPEG). */
  onCaptura: (dataUrl: string) => void;
}

export function CameraCapture({ onCaptura }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const [estado, setEstado] = useState<Estado>('iniciando');
  const [preview, setPreview] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0); // incrementar para reiniciar la cámara

  // ── Iniciar cámara + detección ──────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function start() {
      // Detener stream previo si existe (retry)
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
          audio: false,
        });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }

        streamRef.current = stream;
        const video = videoRef.current!;
        video.srcObject = stream;
        await video.play();
        if (!cancelled) setEstado('escaneando');

        // ── FaceDetector API (Chrome 74+ / Edge) ──────────────────────────
        if ('FaceDetector' in window) {
          const detector = new FaceDetector({ maxDetectedFaces: 1, fastMode: true });

          const tick = async () => {
            if (cancelled) return;
            if (video.readyState >= 2) {
              try {
                const faces = await detector.detect(video);
                if (!cancelled) {
                  setEstado(faces.length > 0 ? 'cara_detectada' : 'escaneando');
                }
              } catch {
                // Ignorar frames que no se pueden analizar
              }
            }
            if (!cancelled) {
              rafRef.current = requestAnimationFrame(() => {
                // ~5 fps para no saturar la CPU
                setTimeout(tick, 200);
              });
            }
          };
          tick();
        } else {
          // ── Fallback: habilitar captura tras 1.5 s ──────────────────────
          // El usuario ve la cámara real pero no hay detección automática.
          setTimeout(() => {
            if (!cancelled) setEstado('cara_detectada');
          }, 1500);
        }
      } catch {
        if (!cancelled) setEstado('sin_permiso');
      }
    }

    start();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [retryKey]); // se re-ejecuta al pedir retry

  // ── Capturar foto ───────────────────────────────────────────────────────
  function capturar() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d')!;

    // Efecto espejo: la selfie se ve natural al usuario
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setPreview(dataUrl);
    setEstado('capturado');
    onCaptura(dataUrl);

    // Liberar cámara
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }

  function reintentar() {
    setPreview(null);
    setEstado('iniciando');
    setRetryKey((k) => k + 1); // dispara el useEffect
  }

  // ── Estilos dinámicos ───────────────────────────────────────────────────
  const ringClass = {
    iniciando:       'border-outline-variant',
    sin_permiso:     'border-red-500',
    escaneando:      'border-primary/40',
    cara_detectada:  'border-primary',
    capturado:       'border-primary',
  }[estado];

  const pulsar = estado === 'escaneando' || estado === 'cara_detectada';

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-5">

      {/* ─── Visor ─────────────────────────────────────────────────── */}
      <div className="relative w-56 h-56">

        {/* Ring exterior animado */}
        <div
          className={`absolute inset-0 rounded-full border-4 transition-colors duration-500 ${ringClass} ${
            pulsar ? 'animate-pulse' : ''
          }`}
        />

        {/* Círculo interior con video/preview */}
        <div className="absolute inset-2 rounded-full overflow-hidden bg-[#0d2420]">
          {preview ? (
            // La foto se muestra sin espejo (ya está invertida en el canvas)
            <img
              src={preview}
              alt="Selfie capturada"
              className="w-full h-full object-cover"
            />
          ) : (
            // Video en espejo para que el usuario vea como un espejo
            <video
              ref={videoRef}
              className="w-full h-full object-cover scale-x-[-1]"
              playsInline
              muted
              aria-label="Cámara frontal"
            />
          )}

          {/* Overlay: iniciando */}
          {estado === 'iniciando' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 rounded-full">
              <span className="material-symbols-outlined animate-spin text-white text-[36px]">
                progress_activity
              </span>
              <span className="text-white/70 text-xs text-center px-4">
                Iniciando cámara…
              </span>
            </div>
          )}

          {/* Overlay: sin permiso */}
          {estado === 'sin_permiso' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 rounded-full px-4 text-center">
              <span className="material-symbols-outlined text-red-400 text-[40px]">
                no_photography
              </span>
              <span className="text-white/80 text-xs leading-tight">
                Permite el acceso a la cámara
              </span>
            </div>
          )}
        </div>

        {/* Esquinas estilo escáner */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2.5 left-2.5 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl" />
          <div className="absolute top-2.5 right-2.5 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr" />
          <div className="absolute bottom-2.5 left-2.5 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl" />
          <div className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br" />
        </div>

        {/* Badge de estado */}
        {estado === 'cara_detectada' && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md whitespace-nowrap">
            <span
              className="material-symbols-outlined text-[12px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              face
            </span>
            Cara detectada
          </div>
        )}
        {estado === 'capturado' && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md whitespace-nowrap">
            <span
              className="material-symbols-outlined text-[12px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            Selfie guardada
          </div>
        )}
      </div>

      {/* Canvas oculto para la captura */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ─── Tips ──────────────────────────────────────────────────── */}
      {estado !== 'capturado' && estado !== 'sin_permiso' && (
        <ul className="space-y-1.5 text-left w-full mt-3">
          {['Buena iluminación', 'Sin lentes oscuros', 'Mira de frente'].map((tip) => (
            <li key={tip} className="flex items-center gap-2 text-body-sm text-on-surface-variant">
              <span
                className="material-symbols-outlined text-primary text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              {tip}
            </li>
          ))}
        </ul>
      )}

      {/* ─── Botones ───────────────────────────────────────────────── */}
      {estado === 'capturado' ? (
        <button
          onClick={reintentar}
          className="text-sm text-on-surface-variant underline underline-offset-2"
        >
          Tomar otra foto
        </button>
      ) : estado === 'sin_permiso' ? (
        <button
          onClick={reintentar}
          className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary rounded-2xl py-4 text-body-md font-bold hover:bg-primary-container transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">refresh</span>
          Reintentar
        </button>
      ) : (
        <button
          onClick={capturar}
          disabled={estado !== 'cara_detectada'}
          className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary rounded-2xl py-4 text-body-md font-bold hover:bg-primary-container transition-colors shadow-card disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {estado === 'iniciando' || estado === 'escaneando'
              ? 'face_retouching_natural'
              : 'camera_alt'}
          </span>
          {estado === 'iniciando'
            ? 'Iniciando…'
            : estado === 'escaneando'
            ? 'Buscando cara…'
            : 'Tomar Selfie'}
        </button>
      )}
    </div>
  );
}
