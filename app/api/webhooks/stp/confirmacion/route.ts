import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/webhooks/stp/confirmacion
 * Diagrama 2 — Fase 2, paso 7: STP webhook: pago OK
 * STP llama a este endpoint cuando confirma un SPEI.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // TODO: Validar firma/secreto de STP en producción
    const { clave_rastreo, estado, monto, referencia } = body;

    if (!clave_rastreo) {
      return NextResponse.json({ error: 'clave_rastreo requerida' }, { status: 400 });
    }

    const admin = createSupabaseServiceClient();

    // Buscar el pago por clave de rastreo
    const { data: pago } = await admin
      .from('pagos')
      .select('id, obligacion_id, ciudadano_id')
      .eq('clave_rastreo_stp', clave_rastreo)
      .maybeSingle();

    if (!pago) {
      return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 });
    }

    // Actualizar estado del pago
    await admin
      .from('pagos')
      .update({ estado_conciliacion: 'Conciliado' })
      .eq('id', pago.id);

    // Actualizar obligacion como pagada
    await admin
      .from('obligaciones')
      .update({ estado_cumplimiento: 'Pagado' })
      .eq('id', pago.obligacion_id);

    // Registrar transacción STP
    await admin.from('transacciones_stp').insert({
      pago_id: pago.id,
      referencia_stp: referencia ?? clave_rastreo,
      estado_stp: 'SUCCESS',
      detalles_json: JSON.stringify(body),
    });

    // Emitir evento PAGO_CONFIRMADO → dispara n8n (Diagrama 6)
    await admin.from('eventos_dominio').insert({
      aggregate_type: 'pago',
      aggregate_id: pago.id,
      tipo_evento: 'PAGO_CONFIRMADO',
      payload: {
        ciudadano_id: pago.ciudadano_id,
        monto,
        clave_rastreo,
        referencia,
      },
      origen: 'stp_webhook',
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[STP webhook]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
