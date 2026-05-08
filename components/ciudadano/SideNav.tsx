'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/app/(auth)/login/actions';

const NAV_ITEMS = [
  { href: '/dashboard', icon: 'home',          label: 'Inicio'  },
  { href: '/pagos',     icon: 'receipt_long',  label: 'Pagos'   },
  { href: '/ia',        icon: 'smart_toy',      label: 'IA TOJ'  },
  { href: '/perfil',    icon: 'account_circle', label: 'Perfil'  },
] as const;

/**
 * Barra de navegación lateral — solo visible en md+.
 * En mobile la navegación la gestiona BottomNavBar.
 */
export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen shrink-0 bg-surface border-r border-outline-variant px-3 py-6">

      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <div
          className="w-9 h-9 flex items-center justify-center rounded-xl shadow-sm"
          style={{ background: 'linear-gradient(135deg, #009B8D 0%, #007B70 100%)' }}
        >
          <span
            className="material-symbols-outlined text-white text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            account_balance
          </span>
        </div>
        <div>
          <p className="font-bold text-on-surface text-[15px] leading-tight">TOJ Platform</p>
          <p className="text-[10px] text-on-surface-variant leading-tight">Portal Ciudadano</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const isActive =
            pathname === href ||
            (href !== '/dashboard' && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {icon}
              </span>
              <span className="text-sm font-semibold">{label}</span>
              {/* Indicador activo */}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Cerrar sesión */}
      <div className="border-t border-outline-variant pt-4 mt-4">
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
            <span className="text-sm font-semibold">Cerrar sesión</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
