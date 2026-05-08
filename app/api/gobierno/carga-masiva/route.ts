import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/gobierno/carga-masiva
 * Diagrama 9 — Fase 2-3: Procesa CSV y hace bulk insert de obligaciones.
 *
 * Body: multipart/form-data con campo `file` (CSV)
 * y `mapping` (JSON con configuración de columnas)
 */
export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // TODO: Verificar que el usuario tiene rol 'gobierno'

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Archivo CSV requerido' }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const rows = lines.slice(1);

    const admin = createSupabaseServiceClient();

    let exitosos = 0;
    let errores = 0;
    const erroresDetalle: { fila: number; motivo: string }[] = [];

    // Registrar la carga masiva
    const { data: carga } = await admin
      .from('cargas_masivas')
      .insert({
        nombre_archivo: file.name,
        tipo_datos: 'Padrón Predial',
        registros_total: rows.length,
        registros_exitosos: 0,
        registros_error: 0,
        estado: 'Procesando',
      })
      .select('id')
      .single();

    const cargaId = carga?.id;

    // Procesar cada fila
    for (let i = 0; i < rows.length; i++) {
      const cols = rows[i].split(',').map((c) => c.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => { row[h] = cols[idx] ?? ''; });

      try {
        // Buscar ciudadano por CURP
        const { data: ciudadano } = await admin
          .from('ciudadanos')
          .select('id')
          .eq('curp', row['curp'] ?? '')
          .maybeSingle();

        if (!ciudadano) {
          errores++;
          erroresDetalle.push({ fila: i + 2, motivo: `CURP ${row['curp']} no encontrado` });
          continue;
        }

        // Insertar obligación
        await admin.from('obligaciones').insert({
          ciudadano_id: ciudadano.id,
          carga_masiva_id: cargaId,
          tipo_tramite: row['tipo_tramite'] ?? 'Predial',
          identificador_externo: row['clave_catastral'] ?? row['id_externo'] ?? null,
          monto_original: parseFloat(row['monto'] ?? '0'),
          monto_recargos: 0,
          monto_total: parseFloat(row['monto'] ?? '0'),
          monto_pendiente: parseFloat(row['monto'] ?? '0'),
          fecha_vencimiento: row['fecha_vencimiento'] ?? null,
          estado_cumplimiento: 'Al corriente',
        });

        exitosos++;
      } catch {
        errores++;
        erroresDetalle.push({ fila: i + 2, motivo: 'Error de inserción' });
      }
    }

    // Actualizar resumen de carga
    await admin
      .from('cargas_masivas')
      .update({
        registros_exitosos: exitosos,
        registros_error: errores,
        estado: 'Completada',
      })
      .eq('id', cargaId);

    // Emitir evento CARGA_MASIVA_TERMINADA → n8n (Diagrama 9, paso 14-15)
    await admin.from('eventos_dominio').insert({
      aggregate_type: 'carga_masiva',
      aggregate_id: cargaId,
      tipo_evento: 'CARGA_MASIVA_TERMINADA',
      payload: {
        archivo: file.name,
        total: rows.length,
        exitosos,
        errores,
      },
      origen: 'nextjs',
    });

    return NextResponse.json({
      success: true,
      total: rows.length,
      exitosos,
      errores,
      erroresDetalle: erroresDetalle.slice(0, 20), // Max 20 errores en respuesta
    });
  } catch (err) {
    console.error('[carga-masiva]', err);
    return NextResponse.json({ error: 'Error procesando CSV' }, { status: 500 });
  }
}
