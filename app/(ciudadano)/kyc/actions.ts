"use server";

import { redirect } from 'next/navigation';
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server';

export async function finalizarKyc(): Promise<void> {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const admin = createSupabaseServiceClient();

  const { data: usuario } = await admin
    .from('usuarios_plataforma')
    .select('ciudadano_id')
    .eq('auth_user_id', user.id)
    .maybeSingle();

  const ciudadanoId = usuario?.ciudadano_id ?? user.id;

  await admin
    .from('ciudadanos')
    .update({
      estado_kyc: 'Verificado',
      timestamp_kyc_verificado: new Date().toISOString(),
    })
    .eq('id', ciudadanoId);

  await admin
    .from('kyc_solicitudes')
    .insert({
      ciudadano_id: ciudadanoId,
      proveedor: 'demo',
      tipo_validacion: 'selfie_ine',
      estado: 'Verificado',
      score_confianza: 96,
      request_payload: {},
      response_payload: { aprobado: true },
      motivo_rechazo: null,
      correlation_id: null,
      completed_at: new Date().toISOString(),
    });

  redirect('/dashboard');
}