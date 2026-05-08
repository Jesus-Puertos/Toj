-- ════════════════════════════════════════════════════════════
-- TOJ — SCRIPT DE SEED COMPLETO PARA DEMO
-- Ejecuta esto en Supabase → SQL Editor
-- ════════════════════════════════════════════════════════════
--
-- ⚠️  ANTES DE EJECUTAR:
--    1. Ve a Supabase → Authentication → Users
--    2. Crea manualmente los usuarios de Auth con sus emails/contraseñas
--    3. Copia sus UUIDs y reemplaza los placeholders de abajo
--
-- ════════════════════════════════════════════════════════════

-- ── PASO 0: Institución base (Municipio de Zongolica) ─────────────────────────
INSERT INTO public.instituciones (
  id, nombre, municipio, estado_mexico, clave_inegi,
  tipo_institucion, slug, es_activa
)
VALUES (
  'aaaaaaaa-0000-0000-0000-000000000001',
  'Municipio de Zongolica',
  'Zongolica',
  'Veracruz',
  '30207',
  'Municipio',
  'zongolica',
  true
)
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- PASO 1: CIUDADANOS DE PRUEBA
-- (sin auth.users — son registros de padrón del municipio)
-- ════════════════════════════════════════════════════════════

INSERT INTO public.ciudadanos (
  id, nombre_completo, email, curp, rfc,
  telefono, fecha_nacimiento,
  cuenta_stp_clabe, estado_kyc,
  url_selfie_liveness, url_ine_frente
) VALUES
  -- Ciudadano 1: Juan — KYC Verificado
  (
    'c1000000-0000-0000-0000-000000000001',
    'Juan Martínez López',
    'juan.martinez@demo.toj.mx',
    'MALJ900101HVZRPN01',
    'MALJ900101ABC',
    '+52 272 100 0001',
    '1990-01-01',
    '646180500001234501',
    'Verificado',
    null, null
  ),
  -- Ciudadano 2: María — KYC En Proceso
  (
    'c2000000-0000-0000-0000-000000000002',
    'María López Hernández',
    'maria.lopez@demo.toj.mx',
    'LOHM920215MVZRSP09',
    'LOHM920215DEF',
    '+52 272 100 0002',
    '1992-02-15',
    '646180500001234502',
    'EnProceso',
    null, null
  ),
  -- Ciudadano 3: Carlos — KYC Pendiente
  (
    'c3000000-0000-0000-0000-000000000003',
    'Carlos Pérez García',
    'carlos.perez@demo.toj.mx',
    'PEGC880320HVZLRS05',
    'PEGC880320GHI',
    '+52 272 100 0003',
    '1988-03-20',
    '646180500001234503',
    'Pendiente',
    null, null
  ),
  -- Ciudadano 4: Ana — KYC Rechazado
  (
    'c4000000-0000-0000-0000-000000000004',
    'Ana Ramírez Torres',
    'ana.ramirez@demo.toj.mx',
    'RATA950610MVZRNS08',
    'RATA950610JKL',
    '+52 272 100 0004',
    '1995-06-10',
    '646180500001234504',
    'Rechazado',
    null, null
  )
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- PASO 2: OBLIGACIONES FISCALES (Deudas de los ciudadanos)
-- ════════════════════════════════════════════════════════════

INSERT INTO public.obligaciones (
  id, ciudadano_id, institucion_id,
  tipo_tramite, identificador_externo,
  monto_original, monto_recargos, monto_total, monto_pendiente,
  fecha_vencimiento, estado_cumplimiento,
  ejercicio, periodo_referencia
) VALUES
  -- Juan: Predial VENCIDO
  (
    'ob100000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Predial',
    'PRED-JUAN-2024',
    2400.00, 240.00, 2640.00, 2640.00,
    '2024-03-31', 'Vencido',
    2024, 'Anual 2024'
  ),
  -- Juan: Agua Potable AL CORRIENTE
  (
    'ob100000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Agua Potable',
    'AGUA-JUAN-2026-Q1',
    480.00, 0.00, 480.00, 480.00,
    '2026-06-30', 'Al corriente',
    2026, 'Q1 2026'
  ),
  -- Juan: Licencia PAGADA
  (
    'ob100000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Licencia Comercial',
    'LIC-JUAN-2025',
    1200.00, 0.00, 1200.00, 0.00,
    '2025-12-31', 'Pagado',
    2025, 'Anual 2025'
  ),
  -- María: Predial POR VENCER
  (
    'ob200000-0000-0000-0000-000000000001',
    'c2000000-0000-0000-0000-000000000002',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Predial',
    'PRED-MARIA-2026',
    1800.00, 0.00, 1800.00, 1800.00,
    '2026-05-31', 'Por vencer',
    2026, 'Anual 2026'
  ),
  -- María: Agua
  (
    'ob200000-0000-0000-0000-000000000002',
    'c2000000-0000-0000-0000-000000000002',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Agua Potable',
    'AGUA-MARIA-2026-Q1',
    350.00, 0.00, 350.00, 350.00,
    '2026-06-30', 'Al corriente',
    2026, 'Q1 2026'
  ),
  -- Carlos: Predial VENCIDO alto
  (
    'ob300000-0000-0000-0000-000000000001',
    'c3000000-0000-0000-0000-000000000003',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Predial',
    'PRED-CARLOS-2024',
    5500.00, 1100.00, 6600.00, 6600.00,
    '2024-12-31', 'Vencido',
    2024, 'Anual 2024'
  )
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- PASO 3: PAGOS CONCILIADOS (historial de pagos)
-- ════════════════════════════════════════════════════════════

INSERT INTO public.pagos (
  id, obligacion_id, ciudadano_id,
  monto_transferido, estado_conciliacion,
  clave_rastreo_stp, fecha_confirmacion, fecha_conciliacion
) VALUES
  -- La licencia de Juan ya está pagada
  (
    'pa100000-0000-0000-0000-000000000001',
    'ob100000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000001',
    1200.00, 'Conciliado',
    'TOJ-DEMO-LIC-001',
    '2025-01-15 10:30:00+00',
    '2025-01-15 10:31:00+00'
  )
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- PASO 4: SOLICITUDES KYC
-- ════════════════════════════════════════════════════════════

INSERT INTO public.kyc_solicitudes (
  id, ciudadano_id, proveedor, tipo_validacion,
  estado, score_confianza,
  request_payload, response_payload,
  completed_at
) VALUES
  -- Juan: Verificado
  (
    'kyc10000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'demo', 'selfie_ine',
    'Verificado', 97.50,
    '{}', '{"aprobado": true}',
    NOW() - INTERVAL '7 days'
  ),
  -- María: En Proceso
  (
    'kyc20000-0000-0000-0000-000000000002',
    'c2000000-0000-0000-0000-000000000002',
    'demo', 'selfie_ine',
    'EnProceso', 74.00,
    '{}', '{"aprobado": null}',
    null
  ),
  -- Carlos: Rechazado
  (
    'kyc30000-0000-0000-0000-000000000003',
    'c3000000-0000-0000-0000-000000000003',
    'demo', 'selfie_ine',
    'Rechazado', 41.00,
    '{}', '{"aprobado": false}',
    NOW() - INTERVAL '3 days'
  )
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- PASO 5: CARGAS MASIVAS (historial ETL)
-- ════════════════════════════════════════════════════════════

INSERT INTO public.cargas_masivas (
  id, institucion_id, nombre_archivo, tipo_datos,
  registros_total, registros_exitosos, registros_error, estado
) VALUES
  (
    'etl10000-0000-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Padron_Predial_2024.csv', 'Padrón Predial',
    1245, 1240, 5, 'Completada'
  ),
  (
    'etl20000-0000-0000-0000-000000000002',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Agua_Residencial_Q1_2026.csv', 'Agua Potable',
    820, 820, 0, 'Completada'
  )
ON CONFLICT (id) DO NOTHING;
