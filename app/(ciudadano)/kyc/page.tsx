"use client";

import { useState, useTransition } from "react";
import { CameraCapture } from "@/components/ciudadano/kyc/CameraCapture";
import { DocumentUpload } from "@/components/ciudadano/kyc/DocumentUpload";
import { subirSelfieKyc, subirDocumentoKyc, completarKyc } from "./actions";

// ── Helper: dataURL → Blob ────────────────────────────────────────────────────

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
  const bytes = atob(data);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

// ── Stepper ───────────────────────────────────────────────────────────────────

const PASOS = [
  { numero: 1, label: "Identidad", sublabel: "Selfie + INE" },
  { numero: 2, label: "Domicilio", sublabel: "Comprobante" },
  { numero: 3, label: "Finalizar", sublabel: "Revisión" },
];

function Stepper({ pasoActual }: { pasoActual: number }) {
  return (
    <div className="flex items-start justify-between mb-8 px-4">
      {PASOS.map((paso, idx) => (
        <div key={paso.numero} className="flex items-start flex-1">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[15px] ${
                pasoActual >= paso.numero
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container border-2 border-outline-variant text-on-surface-variant"
              }`}
            >
              {pasoActual > paso.numero ? (
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check
                </span>
              ) : (
                paso.numero
              )}
            </div>
            <div className="text-center">
              <p
                className={`text-label-caps font-bold tracking-widest leading-tight ${
                  pasoActual >= paso.numero
                    ? "text-primary"
                    : "text-on-surface-variant"
                }`}
              >
                {paso.label}
              </p>
              <p className="text-[10px] text-on-surface-variant leading-tight">
                {paso.sublabel}
              </p>
            </div>
          </div>
          {idx < PASOS.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 mt-4 ${pasoActual > paso.numero ? "bg-primary" : "bg-outline-variant"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Paso 1: Selfie ────────────────────────────────────────────────────────────

function StepIdentidad({ onNext }: { onNext: (selfieUrl: string) => void }) {
  const [selfieDataUrl, setSelfieDataUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleContinuar() {
    if (!selfieDataUrl) return;
    setError("");
    startTransition(async () => {
      // Convertir el dataURL del canvas a Blob para enviarlo al servidor
      const blob = dataUrlToBlob(selfieDataUrl);
      const formData = new FormData();
      formData.append("selfie", blob, "selfie.jpg");

      const res = await subirSelfieKyc(formData);
      if ("error" in res) {
        setError(res.error);
      } else {
        onNext(res.url);
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-h2 font-bold text-on-surface">
          Verifica tu identidad
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Toma una selfie para confirmar que eres tú
        </p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6">
        <p className="text-label-caps text-on-surface-variant font-bold tracking-widest mb-5 uppercase text-center">
          Posiciona tu rostro en el círculo
        </p>
        <CameraCapture onCaptura={setSelfieDataUrl} />
      </div>

      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm text-red-500 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">error</span>
          {error}
        </div>
      )}

      <button
        onClick={handleContinuar}
        disabled={!selfieDataUrl || isPending}
        className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary rounded-2xl py-4 text-body-md font-bold hover:bg-primary-container transition-colors shadow-card disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <span className="material-symbols-outlined animate-spin text-[22px]">
              progress_activity
            </span>
            Subiendo selfie…
          </>
        ) : (
          <>
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              arrow_forward
            </span>
            Continuar
          </>
        )}
      </button>
    </div>
  );
}

// ── Paso 2: Comprobante de domicilio ──────────────────────────────────────────

function StepDomicilio({ onNext }: { onNext: (documentoUrl: string) => void }) {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleContinuar() {
    if (!archivo) return;
    setError("");
    startTransition(async () => {
      const formData = new FormData();
      formData.append("documento", archivo);

      const res = await subirDocumentoKyc(formData);
      if ("error" in res) {
        setError(res.error);
      } else {
        onNext(res.url);
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-h2 font-bold text-on-surface">
          Comprobante de domicilio
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Sube o fotografía tu comprobante reciente (menos de 3 meses)
        </p>
      </div>

      <DocumentUpload onArchivo={setArchivo} />

      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm text-red-500 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">error</span>
          {error}
        </div>
      )}

      <button
        onClick={handleContinuar}
        disabled={!archivo || isPending}
        className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary rounded-2xl py-4 text-body-md font-bold hover:bg-primary-container transition-colors shadow-card disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <span className="material-symbols-outlined animate-spin text-[22px]">
              progress_activity
            </span>
            Subiendo documento…
          </>
        ) : (
          <>
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              arrow_forward
            </span>
            Continuar
          </>
        )}
      </button>
    </div>
  );
}

// ── Paso 3: Finalizar ─────────────────────────────────────────────────────────

function StepFinalizar({
  selfieUrl,
  documentoUrl,
}: {
  selfieUrl: string | null;
  documentoUrl: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleCompletar() {
    setError("");
    startTransition(async () => {
      const res = await completarKyc({
        selfieUrl: selfieUrl ?? undefined,
        documentoUrl: documentoUrl ?? undefined,
      });
      if (res && "error" in res) setError(res.error);
    });
  }

  const items = [
    { label: "Selfie subida", done: !!selfieUrl },
    { label: "Comprobante subido", done: !!documentoUrl },
    { label: "Datos en revisión", done: false },
  ];

  return (
    <div className="space-y-6 py-4">
      {/* Selfie capturada (desde Storage, no dataURL local) */}
      {selfieUrl && (
        <div className="flex justify-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary shadow-lg">
            <img
              src={selfieUrl}
              alt="Tu selfie"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
              <span
                className="material-symbols-outlined text-on-primary text-[14px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <h1 className="text-h2 font-bold text-on-surface">¡Casi listo!</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Tu información está en revisión. Te notificaremos en las próximas 24
          horas.
        </p>
      </div>

      {/* Checklist */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span
              className={`material-symbols-outlined text-[20px] ${item.done ? "text-primary" : "text-outline"}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {item.done ? "check_circle" : "radio_button_unchecked"}
            </span>
            <span
              className={`text-body-sm ${item.done ? "text-on-surface font-medium" : "text-on-surface-variant"}`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm text-red-500 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">error</span>
          {error}
        </div>
      )}

      <button
        onClick={handleCompletar}
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 bg-primary text-on-primary rounded-2xl py-4 text-body-md font-bold hover:bg-primary-container transition-colors disabled:opacity-60"
      >
        {isPending ? (
          <>
            <span className="material-symbols-outlined animate-spin text-[22px]">
              progress_activity
            </span>
            Finalizando…
          </>
        ) : (
          <>
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              rocket_launch
            </span>
            Ir al Dashboard
          </>
        )}
      </button>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────

export default function KycPage() {
  const [pasoActual, setPasoActual] = useState(1);
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null);
  const [documentoUrl, setDocumentoUrl] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 bg-surface z-10 flex items-center justify-between px-5 py-4 border-b border-outline-variant">
        <span className="text-primary font-bold text-[18px]">TOJ Platform</span>
        <button aria-label="Ayuda">
          <span className="material-symbols-outlined text-on-surface-variant text-[24px]">
            help_outline
          </span>
        </button>
      </header>

      <div className="px-5 py-6">
        <Stepper pasoActual={pasoActual} />

        {pasoActual === 1 && (
          <StepIdentidad
            onNext={(url) => {
              setSelfieUrl(url);
              setPasoActual(2);
            }}
          />
        )}
        {pasoActual === 2 && (
          <StepDomicilio
            onNext={(url) => {
              setDocumentoUrl(url);
              setPasoActual(3);
            }}
          />
        )}
        {pasoActual === 3 && (
          <StepFinalizar selfieUrl={selfieUrl} documentoUrl={documentoUrl} />
        )}
      </div>
    </div>
  );
}
