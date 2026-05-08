// Perfil del ciudadano
import Link from 'next/link';
import type { Route } from 'next';

const MENU = [
  { icon: 'folder_open',   label: 'Mis documentos',        sub: '4 documentos',       href: '/dashboard' as Route },
  { icon: 'notifications', label: 'Notificaciones',         sub: 'Todas activas',      href: '/dashboard' as Route },
  { icon: 'lock',          label: 'Seguridad',              sub: 'PIN y biometria',    href: '/kyc'       as Route },
  { icon: 'help_outline',  label: 'Ayuda y soporte',        sub: 'Centro de ayuda TOJ',href: '/dashboard' as Route },
  { icon: 'logout',        label: 'Cerrar sesion',          sub: undefined,            href: '/dashboard' as Route, danger: true },
];
const STATS = [
  { label: 'Pagos', valor: '3', icon: 'payments' },
  { label: 'Docs',  valor: '4', icon: 'badge' },
  { label: 'Saldo', valor: '$500', icon: 'account_balance_wallet' },
];

export default function PerfilPage() {
  return (
    <main className="min-h-screen bg-surface">
      <header className="sticky top-0 bg-surface z-10 flex items-center justify-between px-5 py-4 border-b border-outline-variant">
        <Link href={'/dashboard' as Route} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors" aria-label="Regresar">
          <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
        </Link>
        <span className="text-primary font-bold text-[18px]">Mi Perfil</span>
        <button aria-label="Mas opciones" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
        </button>
      </header>
      <div className="px-5 py-6 space-y-6">
        {/* Card perfil */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col items-center text-center gap-3">
          <div className="relative">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-wallet">
              <span className="text-on-primary font-bold text-[28px]">JM</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary border-2 border-surface rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
          </div>
          <div>
            <h1 className="text-h3 font-bold text-on-surface">Juan Martinez</h1>
            <p className="text-body-sm text-on-surface-variant mt-0.5">juan.martinez@email.com</p>
          </div>
          <div className="flex items-center gap-1.5 bg-primary-fixed/40 text-primary px-4 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span className="text-label-caps font-bold tracking-widest uppercase">KYC Verificado</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {STATS.map((s) => (
            <div key={s.label} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 flex flex-col items-center gap-1.5 text-center">
              <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>{s.icon}</span>
              <p className="text-body-sm font-bold text-on-surface tabular-nums">{s.valor}</p>
              <p className="text-[11px] text-on-surface-variant">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="space-y-1">
          <p className="text-label-caps font-bold text-on-surface-variant tracking-widest uppercase mb-3 px-1">Mi Cuenta</p>
          {MENU.map((link) => (
            <Link key={link.label} href={link.href} className={'flex items-center gap-4 px-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-2xl hover:bg-surface-container-low transition-colors mb-1.5 ' + (link.danger ? 'hover:bg-error/5' : '')}>
              <div className={'w-10 h-10 rounded-full flex items-center justify-center shrink-0 ' + (link.danger ? 'bg-error/10' : 'bg-primary/10')}>
                <span className={'material-symbols-outlined text-[22px] ' + (link.danger ? 'text-error' : 'text-primary')} style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>{link.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={'text-body-sm font-semibold ' + (link.danger ? 'text-error' : 'text-on-surface')}>{link.label}</p>
                {link.sub && <p className="text-[12px] text-on-surface-variant mt-0.5">{link.sub}</p>}
              </div>
              {!link.danger && <span className="material-symbols-outlined text-outline text-[20px]">chevron_right</span>}
            </Link>
          ))}
        </div>

        <p className="text-center text-[11px] text-on-surface-variant pb-2">TOJ Platform v0.1.0 — GovTech/Fintech Mexico</p>
      </div>
    </main>
  );
}