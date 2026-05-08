import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/obligaciones/[id]/generar-pago
 * Diagrama 2 — Paso 2: Genera CLABE para pagar una obligación.
 * Crea el registro en `pagos` con estado PENDIENTE y devuelve la CLABE.
 */
export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const admin = createSupabaseServiceClient();

    // Obtener la obligación
    const { data: obligacion, error: oblError } = await admin
      .from('obligaciones')
      .select('id, monto_total, monto_pendiente, ciudadano_id, estado_cumplimiento')
      .eq('id', params.id)
      .maybeSingle();

    if (oblError || !obligacion) {
      return NextResponse.json({ error: 'Obligación no encontrada' }, { status: 404 });
    }

    if (obligacion.estado_cumplimiento === 'Pagado') {
      return NextResponse.json({ error: 'Esta obligación ya fue pagada' }, { status: 400 });
    }

    // Obtener CLABE del ciudadano (para que el pago llegue a TOJ)
    const { data: ciudadano } = await admin
      .from('ciudadanos')
      .select('cuenta_stp_clabe')
      .eq('id', obligacion.ciudadano_id)
      .maybeSingle();

    const clabeDestino = ciudadano?.cuenta_stp_clabe ?? '646180500001234567';

    // Crear clave de rastreo única
    const claveRastreo = `TOJ-${Date.now()}-${params.id.slice(0, 8).toUpperCase()}`;

    // Crear registro de pago en estado Pendiente
    const { data: pago, error: pagoError } = await admin
      .from('pagos')
      .insert({
        obligacion_id: params.id,
        ciudadano_id: obligacion.ciudadano_id,
        monto_transferido: obligacion.monto_pendiente ?? obligacion.monto_total,
        clave_rastreo_stp: claveRastreo,
        estado_conciliacion: 'Pendiente',
      })
      .select('id')
      .single();

    if (pagoError) {
      return NextResponse.json({ error: 'Error creando pago' }, { status: 500 });
    }

    return NextResponse.json({
      pago_id: pago.id,
      clabe: clabeDestino,
      clave_rastreo: claveRastreo,
      monto: obligacion.monto_pendiente ?? obligacion.monto_total,
      concepto: `TOJ Pago ${params.id.slice(0, 8).toUpperCase()}`,
    });
  } catch (err) {
    console.error('[generar-pago]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
