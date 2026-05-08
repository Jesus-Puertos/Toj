"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signUp, signInWithGoogle } from "./actions";

export default function RegistroPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();

  const handleGoogleSignUp = () => {
    setError("");
    startGoogleTransition(async () => {
      const res = await signInWithGoogle();
      if (res && "error" in res) setError(res.error);
    });
  };

  const handleSubmit = () => {
    setError("");
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    startTransition(async () => {
      const res = await signUp({ nombreCompleto: nombre, email, password });
      if (res?.error) setError(res.error);
    });
  };

  const fields = [
    {
      label: "Nombre completo",
      icon: "person",
      value: nombre,
      set: setNombre,
      type: "text",
      placeholder: "Juan Pérez García",
      autoComplete: "name",
    },
    {
      label: "Correo electrónico",
      icon: "mail",
      value: email,
      set: setEmail,
      type: "email",
      placeholder: "correo@ejemplo.com",
      autoComplete: "email",
    },
  ];

  return (
    <div className="w-full max-w-[400px]">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
          style={{
            background: "linear-gradient(135deg, #009B8D 0%, #007B70 100%)",
          }}
        >
          <span
            className="material-symbols-outlined text-white"
            style={{ fontSize: 36, fontVariationSettings: "'FILL' 1" }}
          >
            person_add
          </span>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Crear cuenta
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Regístrate para acceder a TOJ
          </p>
        </div>
      </div>

      {/* Card */}
      <div
        className="rounded-3xl border border-white/10 p-6 shadow-2xl backdrop-blur-md"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div className="space-y-4">
          {/* Nombre + Email */}
          {fields.map((f) => (
            <div key={f.label} className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-white/40">
                {f.label}
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-toj-jade transition-colors">
                <span className="material-symbols-outlined text-white/30 text-[20px]">
                  {f.icon}
                </span>
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
          {(["Contraseña", "Confirmar contraseña"] as const).map((lbl, i) => (
            <div key={lbl} className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-white/40">
                {lbl}
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-toj-jade transition-colors">
                <span className="material-symbols-outlined text-white/30 text-[20px]">
                  lock
                </span>
                <input
                  type={showPwd ? "text" : "password"}
                  value={i === 0 ? password : confirm}
                  onChange={(e) =>
                    (i === 0 ? setPassword : setConfirm)(e.target.value)
                  }
                  placeholder="••••••••"
                  autoComplete={i === 0 ? "new-password" : "new-password"}
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
                />
                {i === 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="text-white/30 hover:text-white/60 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPwd ? "visibility_off" : "visibility"}
                    </span>
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
            disabled={
              isPending ||
              isGooglePending ||
              !nombre ||
              !email ||
              !password ||
              !confirm
            }
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition-all disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #009B8D 0%, #007B70 100%)",
            }}
          >
            {isPending ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">
                  progress_activity
                </span>
                Creando cuenta...
              </>
            ) : (
              <>
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  how_to_reg
                </span>
                Crear mi cuenta
              </>
            )}
          </button>

          {/* Separador */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-white/30 font-medium">
              O regístrate con
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleSignUp}
            disabled={isPending || isGooglePending}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/20 disabled:opacity-50"
          >
            {isGooglePending ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">
                  progress_activity
                </span>
                Conectando con Google...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continuar con Google
              </>
            )}
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-white/40">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="font-semibold text-toj-jade hover:underline"
        >
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
