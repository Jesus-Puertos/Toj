'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { actualizarFotoPerfil } from './actions';
import Avatar from '@/components/ciudadano/Avatar';

interface PhotoUploadProps {
  avatarUrl?: string | null;
  nombre: string;
}

export default function PhotoUpload({ avatarUrl, nombre }: PhotoUploadProps) {
  const router = useRouter();
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setLocalPreview(URL.createObjectURL(file));
    setPendingFile(file);
    // Resetear el input para permitir seleccionar el mismo archivo nuevamente
    e.target.value = '';
  }

  function handleGuardar() {
    if (!pendingFile) return;

    const formData = new FormData();
    formData.append('avatar', pendingFile);

    startTransition(async () => {
      const result = await actualizarFotoPerfil(formData);

      if ('error' in result) {
        setError(result.error);
      } else {
        if (localPreview?.startsWith('blob:')) {
          URL.revokeObjectURL(localPreview);
        }
        setLocalPreview(result.avatarUrl);
        // La preview local ya muestra la foto; limpiamos el archivo pendiente
        setPendingFile(null);
        setError('');
        router.refresh();
      }
    });
  }

  const displaySrc = localPreview ?? avatarUrl;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar con overlay en hover */}
      <div
        className="relative cursor-pointer group"
        onClick={() => inputRef.current?.click()}
      >
        <Avatar src={displaySrc} nombre={nombre} size="xl" />

        {/* Overlay semitransparente circular */}
        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="material-symbols-outlined text-white text-2xl select-none">
            photo_camera
          </span>
        </div>
      </div>

      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />

      {/* Texto debajo */}
      <p className="text-xs text-on-surface-variant">Toca para cambiar foto</p>

      {/* Botón guardar — visible solo si hay preview pendiente */}
      {pendingFile && (
        <button
          onClick={handleGuardar}
          disabled={isPending}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-on-primary text-sm font-medium transition-opacity disabled:opacity-60"
        >
          {isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-on-primary/40 border-t-on-primary rounded-full animate-spin" />
              Guardando…
            </>
          ) : (
            'Guardar foto'
          )}
        </button>
      )}

      {/* Mensaje de error */}
      {error && (
        <p className="text-xs text-error text-center">{error}</p>
      )}
    </div>
  );
}
