import Link from "next/link";
import type { Route } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(auth)/login/actions";
import PhotoUpload from "./PhotoUpload";

const STATS = [
  { label: "Pagos", valor: "3", icon: "payments" },
  { label: "Docs", valor: "4", icon: "badge" },
  { label: "Saldo", valor: "$500", icon: "account_balance_wallet" },
];

const MENU = [
  {
    icon: "folder_open",
    label: "Mis documentos",
    sub: "4 documentos",
    href: "/dashboard" as Route,
  },
  {
    icon: "notifications",
    label: "Notificaciones",
    sub: "Todas activas",
    href: "/dashboard" as Route,
  },
  {
    icon: "lock",
    label: "Seguridad",
    sub: "PIN y biometría",
    href: "/kyc" as Route,
  },
  {
    icon: "help_outline",
    label: "Ayuda y soporte",
    sub: "Centro de ayuda TOJ",
    href: "/dashboard" as Route,
  },
];

export default async function PerfilPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const nombre: string =
    user?.user_metadata?.nombre_completo ??
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split("@")[0] ??
    "Ciudadano";

  const email = user?.email ?? "";

  // Google guarda la foto en avatar_url (Supabase lo mapea así para OAuth)
  const avatarUrl: string | null = user?.user_metadata?.avatar_url ?? null;

  return (
    <main className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 bg-surface z-10 flex items-center justify-between px-5 py-4 border-b border-outline-variant">
        <Link
          href={"/dashboard" as Route}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
          aria-label="Regresar"
        >
          <span className="material-symbols-outlined text-on-surface-variant">
            arrow_back
          </span>
        </Link>
        <span className="text-primary font-bold text-[18px]">Mi Perfil</span>
        <div className="w-10 h-10" /> {/* Espaciador para centrar el título */}
      </header>

      <div className="px-5 py-6 space-y-6">
        {/* ── Card principal ────────────────────────────────────── */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col items-center text-center gap-3">
          {/* Avatar con upload — componente cliente */}
          <div className="relative">
            <PhotoUpload avatarUrl={avatarUrl} nombre={nombre} />
            {/* Badge KYC sobre el avatar */}
            <div className="absolute bottom-10 -right-1 w-7 h-7 bg-primary border-2 border-surface rounded-full flex items-center justify-center">
              <span
                className="material-symbols-outlined text-on-primary text-[14px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
          </div>

          {/* Nombre y email reales */}
          <div>
            <h1 className="text-h3 font-bold text-on-surface">{nombre}</h1>
            {email && (
              <p className="text-body-sm text-on-surface-variant mt-0.5">
                {email}
              </p>
            )}
          </div>

          {/* Badge KYC */}
          <div className="flex items-center gap-1.5 bg-primary-fixed/40 text-primary px-4 py-1.5 rounded-full">
            <span
              className="material-symbols-outlined text-[14px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span className="text-label-caps font-bold tracking-widest uppercase">
              KYC Verificado
            </span>
          </div>
        </div>

        {/* ── Stats ────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 flex flex-col items-center gap-1.5 text-center"
            >
              <span
                className="material-symbols-outlined text-primary text-[24px]"
                style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
              >
                {s.icon}
              </span>
              <p className="text-body-sm font-bold text-on-surface tabular-nums">
                {s.valor}
              </p>
              <p className="text-[11px] text-on-surface-variant">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Menú ─────────────────────────────────────────────── */}
        <div className="space-y-1">
          <p className="text-label-caps font-bold text-on-surface-variant tracking-widest uppercase mb-3 px-1">
            Mi Cuenta
          </p>

          {MENU.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-4 px-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-2xl hover:bg-surface-container-low transition-colors mb-1.5"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-primary/10">
                <span
                  className="material-symbols-outlined text-[22px] text-primary"
                  style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
                >
                  {item.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-semibold text-on-surface">
                  {item.label}
                </p>
                <p className="text-[12px] text-on-surface-variant mt-0.5">
                  {item.sub}
                </p>
              </div>
              <span className="material-symbols-outlined text-outline text-[20px]">
                chevron_right
              </span>
            </Link>
          ))}

          {/* Cerrar sesión — form action */}
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-4 px-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-2xl hover:bg-error/5 transition-colors"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-error/10">
                <span
                  className="material-symbols-outlined text-[22px] text-error"
                  style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
                >
                  logout
                </span>
              </div>
              <span className="text-body-sm font-semibold text-error">
                Cerrar sesión
              </span>
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-on-surface-variant pb-2">
          TOJ Platform v0.1.0 — GovTech/Fintech Mexico
        </p>
      </div>
    </main>
  );
}
