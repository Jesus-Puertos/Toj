"use server";

import { createSupabaseServerClient, createSupabaseServiceClient } from './server';

type ObligacionRow = {
  id: string;
  tipo_tramite: string;
  monto_total: number;
  fecha_vencimiento: string;
  estado_cumplimiento: 'Al corriente' | 'Por vencer' | 'Vencido' | 'Pagado';
};

export async function listarObligacionesCiudadano(ciudadanoId: string): Promise<ObligacionRow[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('obligaciones')
    .select('id, tipo_tramite, monto_total, fecha_vencimiento, estado_cumplimiento')
    .eq('ciudadano_id', ciudadanoId)
    .order('fecha_vencimiento', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as ObligacionRow[];
}

export async function crearPagoObligacion(input: {
  obligacionId: string;
  ciudadanoId: string;
  montoTransferido: number;
  claveRastreoStp: string;
}) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('pagos')
    .insert({
      obligacion_id: input.obligacionId,
      ciudadano_id: input.ciudadanoId,
      monto_transferido: input.montoTransferido,
      clave_rastreo_stp: input.claveRastreoStp,
      estado_conciliacion: 'Pendiente'
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function registrarEventoDominio(input: {
  aggregateType: string;
  aggregateId: string;
  tipoEvento: string;
  payload?: Record<string, unknown>;
}) {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from('eventos_dominio')
    .insert({
      aggregate_type: input.aggregateType,
      aggregate_id: input.aggregateId,
      tipo_evento: input.tipoEvento,
      payload: input.payload ?? {},
      origen: 'nextjs'
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}
