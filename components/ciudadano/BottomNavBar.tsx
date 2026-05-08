"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "home", label: "Inicio" },
  { href: "/pagos", icon: "receipt_long", label: "Pagos" },
  { href: "/ia", icon: "smart_toy", label: "IA TOJ" },
  { href: "/perfil", icon: "account_circle", label: "Perfil" },
] as const;

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-outline-variant bg-surface/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-[430px] items-center justify-around px-2 py-1">
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const isActive =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 min-w-[56px] py-2 transition-all"
              aria-label={label}
            >
              <div
                className={`flex h-8 w-14 items-center justify-center rounded-full transition-all ${
                  isActive ? "bg-primary/15" : ""
                }`}
              >
                <span
                  className={`material-symbols-outlined transition-all ${
                    isActive
                      ? "text-primary text-[26px]"
                      : "text-on-surface-variant text-[24px]"
                  }`}
                  style={
                    isActive ? { fontVariationSettings: "'FILL' 1" } : undefined
                  }
                >
                  {icon}
                </span>
              </div>
              <span
                className={`text-[10px] font-semibold leading-tight transition-colors ${
                  isActive ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
