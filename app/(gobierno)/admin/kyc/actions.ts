'use server';

import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * aprobarKyc — Marca a un ciudadano como Verificado biométricamente.
 * Emite evento KYC_APROBADO → dispara n8n → Telegram al ciudadano.
 */
export async function aprobarKyc(formData: FormData): Promise<{ error?: string }> {
  const ciudadanoId = formData.get('ciudadano_id') as string;
  const solicitudId = formData.get('solicitud_id') as string;

  if (!ciudadanoId) return { error: 'ID de ciudadano requerido' };

  const admin = createSupabaseServiceClient();

  // 1. Actualizar estado del ciudadano
  const { error: e1 } = await admin
    .from('ciudadanos')
    .update({
      estado_kyc: 'Verificado',
      timestamp_kyc_verificado: new Date().toISOString(),
    })
    .eq('id', ciudadanoId);

  if (e1) return { error: 'Error actualizando ciudadano: ' + e1.message };

  // 2. Actualizar la solicitud KYC
  if (solicitudId) {
    await admin
      .from('kyc_solicitudes')
      .update({ estado: 'Aprobado' })
      .eq('id', solicitudId);
  }

  // 3. Emitir evento KYC_APROBADO → n8n lo captura y manda Telegram
  await admin.from('eventos_dominio').insert({
    aggregate_type: 'ciudadano',
    aggregate_id: ciudadanoId,
    tipo_evento: 'KYC_APROBADO',
    payload: { solicitud_id: solicitudId },
    origen: 'admin_kyc',
  });

  revalidatePath('/admin/kyc');
  return {};
}

/**
 * rechazarKyc — Marca al ciudadano como Rechazado con motivo.
 * Emite evento KYC_RECHAZADO → n8n notifica al ciudadano.
 */
export async function rechazarKyc(formData: FormData): Promise<{ error?: string }> {
  const ciudadanoId = formData.get('ciudadano_id') as string;
  const solicitudId = formData.get('solicitud_id') as string;
  const motivo = (formData.get('motivo') as string) || 'Documentos ilegibles o no coinciden';

  if (!ciudadanoId) return { error: 'ID de ciudadano requerido' };

  const admin = createSupabaseServiceClient();

  // 1. Actualizar estado del ciudadano
  await admin
    .from('ciudadanos')
    .update({ estado_kyc: 'Rechazado' })
    .eq('id', ciudadanoId);

  // 2. Actualizar la solicitud KYC con el motivo
  if (solicitudId) {
    await admin
      .from('kyc_solicitudes')
      .update({ estado: 'Rechazado', motivo_rechazo: motivo })
      .eq('id', solicitudId);
  }

  // 3. Emitir evento KYC_RECHAZADO → n8n notifica
  await admin.from('eventos_dominio').insert({
    aggregate_type: 'ciudadano',
    aggregate_id: ciudadanoId,
    tipo_evento: 'DOCUMENTO_RECHAZADO',
    payload: { motivo, solicitud_id: solicitudId },
    origen: 'admin_kyc',
  });

  revalidatePath('/admin/kyc');
  return {};
}
