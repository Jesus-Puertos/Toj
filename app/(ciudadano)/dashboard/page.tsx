// Dashboard principal del ciudadano TOJ — Server Component async
import Link from 'next/link';
import type { Route } from 'next';
import { WalletCard } from '@/components/ciudadano/WalletCard';
import { ObligacionCard } from '@/components/ciudadano/ObligacionCard';
import { CarpetaDigital } from '@/components/ciudadano/CarpetaDigital';
import type { Obligacion } from '@/components/ciudadano/ObligacionCard';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { signOut } from '@/app/(auth)/login/actions';

// Datos de demostración (usados si no hay datos en Supabase aún)
const MOCK_OBLIGACIONES: Obligacion[] = [
  { id: 'ob-1', tipo_tramite: 'Predial 2026 - Zongolica', monto_total: 2500, fecha_vencimiento: '2026-06-15', estado_cumplimiento: 'Por vencer' },
  { id: 'ob-2', tipo_tramite: 'Agua Potable', monto_total: 480, fecha_vencimiento: '2026-05-10', estado_cumplimiento: 'Vencido' },
  { id: 'ob-3', tipo_tramite: 'Licencia Municipal', monto_total: 1200, fecha_vencimiento: '2026-07-20', estado_cumplimiento: 'Pagado' },
];

export default async function CiudadanoDashboardPage() {
  // ── Sesión real desde Supabase ──────────────────────────────
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const nombreCompleto: string =
    user?.user_metadata?.nombre_completo ??
    user?.email?.split('@')[0] ??
    'Ciudadano';
  const iniciales = nombreCompleto.slice(0, 2).toUpperCase();

  // ── Obligaciones reales (con fallback a mock si la tabla está vacía) ──
  let obligaciones: Obligacion[] = MOCK_OBLIGACIONES;
  if (user) {
    const { data } = await supabase
      .from('obligaciones')
      .select('id, tipo_tramite, monto_total, fecha_vencimiento, estado_cumplimiento')
      .eq('ciudadano_id', user.id)
      .order('fecha_vencimiento', { ascending: true });
    if (data && data.length > 0) obligaciones = data as Obligacion[];
  }

  // TODO: obtener saldo y CLABE real desde tabla `wallets`
  const saldo = 500;
  const clabe = '646180 5000 0123 4567 89';

  return (
    <>
      <main className="px-5 pt-5 space-y-6">
        {/* TopAppBar */}
        <header className="sticky top-0 bg-surface z-10 flex items-center justify-between py-4 border-b border-outline-variant -mx-5 px-5">
          <span className="text-primary font-bold text-[18px] tracking-tight">TOJ Platform</span>
          <div className="flex items-center gap-3">
            <button aria-label="Notificaciones" className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant text-[24px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full" />
            </button>
            {/* Avatar + logout */}
            <form action={signOut}>
              <button
                type="submit"
                aria-label="Cerrar sesión"
                className="relative group"
                title="Cerrar sesión"
              >
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center group-hover:bg-primary/80 transition-colors">
                  <span className="text-on-primary font-bold text-[14px]">{iniciales}</span>
                </div>
                <span className="absolute -top-1 -right-1 bg-primary border-2 border-surface rounded-full px-1 py-0.5 text-[8px] font-bold text-on-primary leading-none">KYC</span>
              </button>
            </form>
          </div>
        </header>

        {/* Saludo */}
        <section className="space-y-2">
          <h1 className="text-h3 font-bold text-on-surface">
            Hola, {nombreCompleto.split(' ')[0]} 👋
          </h1>
          <div className="flex items-center gap-1.5 bg-primary-fixed/40 text-primary px-3 py-1 rounded-full w-fit">
            <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span className="text-label-caps font-bold tracking-widest uppercase">KYC Verificado</span>
          </div>
        </section>

        {/* Wallet */}
        <section>
          <WalletCard saldo={saldo} clabe={clabe} />
        </section>

        {/* Obligaciones */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-body-md font-bold text-on-surface">Obligaciones Pendientes</h2>
            <Link href={'/pagos' as Route} className="text-body-sm font-semibold text-primary hover:underline">Ver todo</Link>
          </div>
          <div className="space-y-3">
            {obligaciones.map((ob) => (
              <ObligacionCard key={ob.id} obligacion={ob} />
            ))}
          </div>
        </section>

        {/* Carpeta Digital */}
        <section className="space-y-3 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-body-md font-bold text-on-surface">Carpeta Digital</h2>
            <button className="text-body-sm font-semibold text-primary">Gestionar</button>
          </div>
          <CarpetaDigital />
        </section>
      </main>

      {/* FAB IA */}
      <Link
        href={'/ia' as Route}
        aria-label="Abrir asistente IA"
        className="fixed bottom-20 right-5 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-primary/80 transition-colors"
      >
        <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
      </Link>
    </>
  );
}