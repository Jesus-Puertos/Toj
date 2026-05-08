'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { signUp } from './actions';

export default function RegistroPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    setError('');
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    startTransition(async () => {
      const res = await signUp({ nombreCompleto: nombre, email, password });
      if (res?.error) setError(res.error);
    });
  };

  const fields = [
    { label: 'Nombre completo', icon: 'person', value: nombre, set: setNombre, type: 'text', placeholder: 'Juan Pérez García', autoComplete: 'name' },
    { label: 'Correo electrónico', icon: 'mail', value: email, set: setEmail, type: 'email', placeholder: 'correo@ejemplo.com', autoComplete: 'email' },
  ];

  return (
    <div className="w-full max-w-[400px]">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
          style={{ background: 'linear-gradient(135deg, #009B8D 0%, #007B70 100%)' }}
        >
          <span className="material-symbols-outlined text-white" style={{ fontSize: 36, fontVariationSettings: "'FILL' 1" }}>
            person_add
          </span>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">Crear cuenta</h1>
          <p className="mt-1 text-sm text-white/50">Regístrate para acceder a TOJ</p>
        </div>
      </div>

      {/* Card */}
      <div
        className="rounded-3xl border border-white/10 p-6 shadow-2xl backdrop-blur-md"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        <div className="space-y-4">
          {/* Nombre + Email */}
          {fields.map((f) => (
            <div key={f.label} className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-white/40">{f.label}</label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-toj-jade transition-colors">
                <span className="material-symbols-outlined text-white/30 text-[20px]">{f.icon}</span>
                <input
                  type={f.type}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  autoComplete={f.autoComplete}
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
                />
              </div>
            </div>
          ))}

          {/* Contraseña */}
          {(['Contraseña', 'Confirmar contraseña'] as const).map((lbl, i) => (
            <div key={lbl} className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-white/40">{lbl}</label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-toj-jade transition-colors">
                <span className="material-symbols-outlined text-white/30 text-[20px]">lock</span>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={i === 0 ? password : confirm}
                  onChange={(e) => (i === 0 ? setPassword : setConfirm)(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={i === 0 ? 'new-password' : 'new-password'}
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
                />
                {i === 0 && (
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-white/30 hover:text-white/60 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">{showPwd ? 'visibility_off' : 'visibility'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Crear cuenta */}
          <button
            onClick={handleSubmit}
            disabled={isPending || !nombre || !email || !password || !confirm}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #009B8D 0%, #007B70 100%)' }}
          >
            {isPending ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                Creando cuenta...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_reg</span>
                Crear mi cuenta
              </>
            )}
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-white/40">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-semibold text-toj-jade hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
