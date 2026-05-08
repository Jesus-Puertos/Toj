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

  // ── Obligaciones y Datos del Ciudadano reales ────────────────
  let obligaciones: Obligacion[] = [];
  let saldo = 0;
  let clabe = 'Generando CLABE...';
  let estadoKyc = 'Pendiente';

  if (user) {
    // 1. Obtener el ciudadano_id vinculado al usuario de auth
    const { data: usuario } = await supabase
      .from('usuarios_plataforma')
      .select('ciudadano_id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    const ciudadanoId = usuario?.ciudadano_id;

    if (ciudadanoId) {
      // 2. Obtener datos del ciudadano (KYC, Saldo, CLABE)
      const { data: ciudadano } = await supabase
        .from('ciudadanos')
        .select('estado_kyc, saldo_wallet, cuenta_stp_clabe')
        .eq('id', ciudadanoId)
        .maybeSingle();

      if (ciudadano) {
        estadoKyc = ciudadano.estado_kyc ?? 'Pendiente';
        saldo = Number(ciudadano.saldo_wallet) || 0;
        clabe = ciudadano.cuenta_stp_clabe || 'No asignada';
      }

      // 3. Obtener obligaciones
      const { data } = await supabase
        .from('obligaciones')
        .select('id, tipo_tramite, monto_total, fecha_vencimiento, estado_cumplimiento')
        .eq('ciudadano_id', ciudadanoId)
        .order('fecha_vencimiento', { ascending: true });
      
      if (data) obligaciones = data as Obligacion[];
    }
  }

  // Si no hay obligaciones reales, mostrar mocks para la demo (opcional, mejor mostrar vacío si es producción)
  if (obligaciones.length === 0) {
    obligaciones = MOCK_OBLIGACIONES;
  }

  // Mapeo de estados KYC para la UI
  const kycConfig: Record<string, { label: string; icon: string; color: string }> = {
    Verificado: { label: 'KYC Verificado', icon: 'verified', color: 'text-primary bg-primary-fixed/40' },
    EnProceso:  { label: 'KYC en Revisión', icon: 'pending', color: 'text-amber-500 bg-amber-500/10' },
    Rechazado:  { label: 'KYC Rechazado', icon: 'error', color: 'text-red-500 bg-red-500/10' },
    Pendiente:  { label: 'Verificación Pendiente', icon: 'hourglass_empty', color: 'text-toj-text-secondary bg-surface-container' },
  };

  const currentKyc = kycConfig[estadoKyc] || kycConfig.Pendiente;

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
                <span className={`absolute -top-1 -right-1 border-2 border-surface rounded-full px-1 py-0.5 text-[8px] font-bold leading-none ${estadoKyc === 'Verificado' ? 'bg-primary text-on-primary' : 'bg-toj-terracotta text-white'}`}>
                  {estadoKyc === 'Verificado' ? 'OK' : '!'}
                </span>
              </button>
            </form>
          </div>
        </header>

        {/* Saludo */}
        <section className="space-y-2">
          <h1 className="text-h3 font-bold text-on-surface">
            Hola, {nombreCompleto.split(' ')[0]} 👋
          </h1>
          <Link href="/kyc" className={`flex items-center gap-1.5 px-3 py-1 rounded-full w-fit transition-opacity hover:opacity-80 ${currentKyc.color}`}>
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>{currentKyc.icon}</span>
            <span className="text-label-caps font-bold tracking-widest uppercase">{currentKyc.label}</span>
          </Link>
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
            {obligaciones.length > 0 ? (
              obligaciones.map((ob) => (
                <ObligacionCard key={ob.id} obligacion={ob} />
              ))
            ) : (
              <div className="p-8 text-center bg-surface-container rounded-3xl border border-dashed border-outline-variant">
                <p className="text-on-surface-variant text-body-sm italic">No tienes obligaciones pendientes por ahora.</p>
              </div>
            )}
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