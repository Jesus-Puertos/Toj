-- ════════════════════════════════════════════════════════════
-- TOJ — SEED COMPLETO CON USUARIOS REALES
-- Ejecuta en: Supabase → SQL Editor
-- 
-- Usuarios registrados (de Auth):
--   c91c7e1c  226w0702@zongolica.tecnm.mx  (compañero / operador)
--   2749ea87  admin@toj.gob.mx             (admin — ya creado)
--   56fd9a8d  ivanry@gmail.com             (ciudadano)
--   f96b057f  janiebauch02@gmail.com       (ciudadano)
--   d597863e  joseortegahac@gmail.com      (ciudadano — Jose Ortega)
--   a3b0ef9c  juanrt@gmail.com             (ciudadano)
--   8b74085f  pedrogil23@gmail.com         (ciudadano)
--   7f9969cd  ramirezrj345@gmail.com       (ciudadano)
-- ════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────
-- ORDEN 1: INSTITUCIÓN (base de todo)
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.instituciones (id, nombre, municipio, estado_mexico, clave_inegi, tipo_institucion, slug, es_activa)
VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 'Municipio de Zongolica', 'Zongolica', 'Veracruz', '30207', 'Municipio', 'zongolica', true)
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- ORDEN 2: CIUDADANOS (registros del padrón municipal)
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.ciudadanos (id, nombre_completo, email, curp, telefono, cuenta_stp_clabe, estado_kyc)
VALUES
  -- Ivan
  ('cc000001-0000-0000-0000-000000000001', 'Iván Ramírez Yáñez',    'ivanry@gmail.com',           'RAYI001010HVZMXV01', '+52 272 100 1001', '646180500001110001', 'Verificado'),
  -- Janie
  ('cc000002-0000-0000-0000-000000000002', 'Janie Bauch Castellanos','janiebauch02@gmail.com',     'BACJ020202MVZNXN02', '+52 272 100 1002', '646180500001110002', 'EnProceso'),
  -- José Ortega (tú)
  ('cc000003-0000-0000-0000-000000000003', 'José Ortega Hernández',  'joseortegahac@gmail.com',    'ORHJ001003HVZRXS03', '+52 272 100 1003', '646180500001110003', 'Pendiente'),
  -- Juan
  ('cc000004-0000-0000-0000-000000000004', 'Juan Rodríguez Torres',  'juanrt@gmail.com',           'ROTJ990104HVZMXN04', '+52 272 100 1004', '646180500001110004', 'Verificado'),
  -- Pedro
  ('cc000005-0000-0000-0000-000000000005', 'Pedro Gil Morales',      'pedrogil23@gmail.com',       'GIMP001223HVZLXD05', '+52 272 100 1005', '646180500001110005', 'EnProceso'),
  -- Ramírez
  ('cc000006-0000-0000-0000-000000000006', 'Roberto Ramírez Juárez', 'ramirezrj345@gmail.com',     'RAJR030506HVZMXB06', '+52 272 100 1006', '646180500001110006', 'Pendiente')
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- ORDEN 3: USUARIOS PLATAFORMA (vincular Auth UUID → ciudadano)
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.usuarios_plataforma (auth_user_id, email, nombre_mostrar, tipo_usuario, estado, ciudadano_id)
VALUES
  -- Admin (226w0702 — compañero, operador de gobierno)
  ('c91c7e1c-5989-4151-befe-bd3263f28869', '226w0702@zongolica.tecnm.mx', 'Operador Gobierno',      'OPERADOR_GOBIERNO', 'Activo', NULL),
  -- Ivan → ciudadano
  ('56fd9a8d-18e4-4865-a239-8850505948ed', 'ivanry@gmail.com',           'Iván Ramírez',           'CIUDADANO', 'Activo', 'cc000001-0000-0000-0000-000000000001'),
  -- Janie → ciudadana
  ('f96b057f-e600-4dcd-8cde-aa45f311303d', 'janiebauch02@gmail.com',     'Janie Bauch',            'CIUDADANO', 'Activo', 'cc000002-0000-0000-0000-000000000002'),
  -- José Ortega → ciudadano (tú)
  ('d597863e-3ba2-4c07-932c-76bffe535b93', 'joseortegahac@gmail.com',    'José Ortega',            'CIUDADANO', 'Activo', 'cc000003-0000-0000-0000-000000000003'),
  -- Juan → ciudadano
  ('a3b0ef9c-645e-400a-8246-45c1cb1caa6d', 'juanrt@gmail.com',           'Juan Rodríguez',         'CIUDADANO', 'Activo', 'cc000004-0000-0000-0000-000000000004'),
  -- Pedro → ciudadano
  ('8b74085f-f0b3-4d60-a665-904d8a6c5bf9', 'pedrogil23@gmail.com',       'Pedro Gil',              'CIUDADANO', 'Activo', 'cc000005-0000-0000-0000-000000000005'),
  -- Ramírez → ciudadano
  ('7f9969cd-84da-4b1b-969d-0869ba2c641a', 'ramirezrj345@gmail.com',     'Roberto Ramírez',        'CIUDADANO', 'Activo', 'cc000006-0000-0000-0000-000000000006')
ON CONFLICT (auth_user_id) DO UPDATE
  SET tipo_usuario   = EXCLUDED.tipo_usuario,
      nombre_mostrar = EXCLUDED.nombre_mostrar,
      ciudadano_id   = EXCLUDED.ciudadano_id,
      estado         = 'Activo';

-- ─────────────────────────────────────────────────────────────
-- ORDEN 4: ROL INSTITUCIÓN para el operador de gobierno
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.usuarios_instituciones (usuario_id, institucion_id, rol_institucion, activo)
SELECT up.id, 'aaaaaaaa-0000-0000-0000-000000000001', 'OPERADOR', true
FROM public.usuarios_plataforma up
WHERE up.auth_user_id = 'c91c7e1c-5989-4151-befe-bd3263f28869'
ON CONFLICT (usuario_id, institucion_id) DO UPDATE SET rol_institucion = 'OPERADOR', activo = true;

-- ─────────────────────────────────────────────────────────────
-- ORDEN 5: OBLIGACIONES FISCALES (deudas para cada ciudadano)
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.obligaciones (
  ciudadano_id, institucion_id, tipo_tramite, identificador_externo,
  monto_original, monto_recargos, monto_total, monto_pendiente,
  fecha_vencimiento, estado_cumplimiento, ejercicio, periodo_referencia
) VALUES
  -- Iván: Predial vencido + Agua corriente
  ('cc000001-0000-0000-0000-000000000001','aaaaaaaa-0000-0000-0000-000000000001','Predial',        'PRED-IVAN-2024',  2400.00,480.00,2880.00,2880.00,'2024-12-31','Vencido',      2024,'Anual 2024'),
  ('cc000001-0000-0000-0000-000000000001','aaaaaaaa-0000-0000-0000-000000000001','Agua Potable',   'AGUA-IVAN-Q1-26',  360.00,  0.00, 360.00, 360.00,'2026-06-30','Al corriente', 2026,'Q1 2026'),

  -- Janie: Predial por vencer + Licencia pagada
  ('cc000002-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001','Predial',        'PRED-JANIE-2026', 1800.00,  0.00,1800.00,1800.00,'2026-05-30','Por vencer',   2026,'Anual 2026'),
  ('cc000002-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001','Licencia Comercial','LIC-JANIE-2025', 950.00,  0.00, 950.00,   0.00,'2025-12-31','Pagado',       2025,'Anual 2025'),

  -- José Ortega (tú): Predial al corriente + Agua
  ('cc000003-0000-0000-0000-000000000003','aaaaaaaa-0000-0000-0000-000000000001','Predial',        'PRED-JOSE-2026',  3200.00,  0.00,3200.00,3200.00,'2026-09-30','Al corriente', 2026,'Anual 2026'),
  ('cc000003-0000-0000-0000-000000000003','aaaaaaaa-0000-0000-0000-000000000001','Agua Potable',   'AGUA-JOSE-Q1-26',  420.00,  0.00, 420.00, 420.00,'2026-06-30','Al corriente', 2026,'Q1 2026'),

  -- Juan: Predial vencido alto + Agua
  ('cc000004-0000-0000-0000-000000000004','aaaaaaaa-0000-0000-0000-000000000001','Predial',        'PRED-JUAN-2024',  4500.00,900.00,5400.00,5400.00,'2024-12-31','Vencido',      2024,'Anual 2024'),
  ('cc000004-0000-0000-0000-000000000004','aaaaaaaa-0000-0000-0000-000000000001','Agua Potable',   'AGUA-JUAN-Q1-26',  480.00,  0.00, 480.00, 480.00,'2026-06-30','Al corriente', 2026,'Q1 2026'),

  -- Pedro: Solo predial al corriente
  ('cc000005-0000-0000-0000-000000000005','aaaaaaaa-0000-0000-0000-000000000001','Predial',        'PRED-PEDRO-2026', 2100.00,  0.00,2100.00,2100.00,'2026-09-30','Al corriente', 2026,'Anual 2026'),

  -- Ramírez: Predial + Licencia vencida
  ('cc000006-0000-0000-0000-000000000006','aaaaaaaa-0000-0000-0000-000000000001','Predial',        'PRED-RAMIREZ-2025',1600.00,320.00,1920.00,1920.00,'2025-12-31','Vencido',      2025,'Anual 2025'),
  ('cc000006-0000-0000-0000-000000000006','aaaaaaaa-0000-0000-0000-000000000001','Licencia Comercial','LIC-RAMIREZ-2025',700.00,140.00, 840.00, 840.00,'2025-06-30','Vencido',      2025,'Anual 2025')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- ORDEN 6: SOLICITUDES KYC
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.kyc_solicitudes (
  ciudadano_id, proveedor, tipo_validacion,
  estado, score_confianza, request_payload, response_payload, completed_at
) VALUES
  ('cc000001-0000-0000-0000-000000000001','demo','selfie_ine','Verificado', 97.5,'{}','{"aprobado":true}', NOW() - INTERVAL '10 days'),
  ('cc000002-0000-0000-0000-000000000002','demo','selfie_ine','EnProceso',  72.0,'{}','{"aprobado":null}', NULL),
  ('cc000003-0000-0000-0000-000000000003','demo','selfie_ine','Pendiente',   0.0,'{}','{}',                NULL),
  ('cc000004-0000-0000-0000-000000000004','demo','selfie_ine','Verificado', 99.1,'{}','{"aprobado":true}', NOW() - INTERVAL '5 days'),
  ('cc000005-0000-0000-0000-000000000005','demo','selfie_ine','EnProceso',  68.5,'{}','{"aprobado":null}', NULL),
  ('cc000006-0000-0000-0000-000000000006','demo','selfie_ine','Pendiente',   0.0,'{}','{}',                NULL)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- ORDEN 7: PAGO YA CONCILIADO (licencia de Janie pagada)
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.pagos (obligacion_id, ciudadano_id, monto_transferido, estado_conciliacion, clave_rastreo_stp, fecha_confirmacion)
SELECT o.id, o.ciudadano_id, 950.00, 'Conciliado', 'TOJ-DEMO-LIC-JANIE-001', NOW() - INTERVAL '30 days'
FROM public.obligaciones o
WHERE o.identificador_externo = 'LIC-JANIE-2025'
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- ✅ VERIFICAR resultados
-- ─────────────────────────────────────────────────────────────
SELECT 'ciudadanos' AS tabla, COUNT(*) FROM public.ciudadanos
UNION ALL
SELECT 'usuarios_plataforma', COUNT(*) FROM public.usuarios_plataforma
UNION ALL
SELECT 'obligaciones', COUNT(*) FROM public.obligaciones
UNION ALL
SELECT 'kyc_solicitudes', COUNT(*) FROM public.kyc_solicitudes
UNION ALL
SELECT 'pagos', COUNT(*) FROM public.pagos;
