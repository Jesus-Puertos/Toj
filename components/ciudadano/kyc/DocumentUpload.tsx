"use client";

import { useRef, useState } from "react";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const TIPOS_ACEPTADOS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

interface Props {
  /** Se llama cuando hay un archivo válido seleccionado. */
  onArchivo: (file: File) => void;
}

export function DocumentUpload({ onArchivo }: Props) {
  const inputGaleriaRef = useRef<HTMLInputElement>(null);
  const inputCamaraRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [esPdf, setEsPdf] = useState(false);
  const [error, setError] = useState("");

  function procesarArchivo(file: File) {
    setError("");

    if (!TIPOS_ACEPTADOS.includes(file.type)) {
      setError("Tipo de archivo no válido. Usa JPG, PNG o PDF.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("El archivo supera los 5 MB.");
      return;
    }

    setFileName(file.name);
    setEsPdf(file.type === "application/pdf");

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null); // PDF: no hay preview de imagen
    }

    onArchivo(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) procesarArchivo(file);
    // Reset el input para que se pueda seleccionar el mismo archivo de nuevo
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) procesarArchivo(file);
  }

  function limpiar() {
    setPreview(null);
    setFileName(null);
    setEsPdf(false);
    setError("");
  }

  return (
    <div className="w-full space-y-4">
      {/* ─── Vista previa o zona de drop ────────────────────────────── */}
      {preview ? (
        // Preview de imagen
        <div className="relative rounded-2xl overflow-hidden border border-outline-variant bg-surface-container-lowest">
          <img
            src={preview}
            alt="Comprobante de domicilio"
            className="w-full max-h-52 object-contain"
          />
          <button
            onClick={limpiar}
            className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-surface/80 backdrop-blur-sm shadow"
            aria-label="Quitar archivo"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface">
              close
            </span>
          </button>
          <div className="px-4 py-2 flex items-center gap-2">
            <span
              className="material-symbols-outlined text-primary text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <span className="text-body-sm text-on-surface truncate">
              {fileName}
            </span>
          </div>
        </div>
      ) : fileName && esPdf ? (
        // Preview de PDF (sin miniatura)
        <div className="flex items-center gap-3 rounded-2xl border border-outline-variant bg-surface-container-lowest px-4 py-4">
          <span className="material-symbols-outlined text-primary text-[36px]">
            picture_as_pdf
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-body-sm font-semibold text-on-surface truncate">
              {fileName}
            </p>
            <p className="text-[11px] text-on-surface-variant">
              PDF seleccionado
            </p>
          </div>
          <button onClick={limpiar} aria-label="Quitar PDF">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
              close
            </span>
          </button>
        </div>
      ) : (
        <>
          {/* Drag and drop — solo desktop (md+) */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputGaleriaRef.current?.click()}
            className="hidden md:flex cursor-pointer rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-lowest p-10 flex-col items-center gap-3 transition-colors hover:border-primary hover:bg-primary/5"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[48px]">
              upload_file
            </span>
            <p className="text-body-sm text-on-surface-variant text-center">
              Arrastra tu comprobante o haz clic para seleccionar
            </p>
            <span className="text-label-caps text-outline font-bold tracking-wide text-[10px]">
              PDF, JPG o PNG — Máx. 5 MB
            </span>
          </div>

          {/* Hint compacto — solo mobile */}
          <div className="md:hidden flex items-center gap-3 rounded-2xl border border-outline-variant bg-surface-container-lowest px-4 py-4">
            <span className="material-symbols-outlined text-on-surface-variant text-[32px]">
              upload_file
            </span>
            <div>
              <p className="text-body-sm font-medium text-on-surface">
                Comprobante de domicilio
              </p>
              <p className="text-[11px] text-on-surface-variant">
                Selecciona desde galería o fotografía el documento
              </p>
            </div>
          </div>
        </>
      )}

      {/* ─── Error ──────────────────────────────────────────────────── */}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">error</span>
          {error}
        </p>
      )}

      {/* ─── Botones de selección ────────────────────────────────────── */}
      {!preview && !fileName && (
        <div className="grid grid-cols-2 gap-3">
          {/* Galería / Explorador de archivos */}
          <button
            onClick={() => inputGaleriaRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded-2xl border border-outline-variant bg-surface-container-lowest py-3 text-body-sm text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              folder_open
            </span>
            Galería
          </button>

          {/* Cámara trasera (ideal para documentos físicos) */}
          <button
            onClick={() => inputCamaraRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded-2xl border border-outline-variant bg-surface-container-lowest py-3 text-body-sm text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              photo_camera
            </span>
            Cámara
          </button>
        </div>
      )}

      {/* Inputs ocultos */}
      {/* Galería: acepta imagen y PDF, sin captura directa */}
      <input
        ref={inputGaleriaRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={handleChange}
        className="hidden"
        aria-hidden="true"
      />
      {/* Cámara: apunta a la cámara trasera (environment) para fotografiar documentos */}
      <input
        ref={inputCamaraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}
