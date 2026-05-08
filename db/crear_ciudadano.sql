-- ════════════════════════════════════════════════════════════
-- TOJ — CREAR USUARIO CIUDADANO CON AUTH
--
-- Usa este script DESPUÉS de crear el usuario en:
--   Supabase → Authentication → Users → Add user
--
-- El flujo normal es que el ciudadano se registra en /registro
-- pero para demo puedes crear usuarios manualmente.
-- ════════════════════════════════════════════════════════════

-- INSTRUCCIONES:
-- 1. Crea el usuario en Supabase Auth con:
--    Email:    jose@demo.toj.mx
--    Password: TojDemo2026!
--    (O el email que quieras)
-- 2. Copia el UUID del usuario creado
-- 3. Reemplaza 'UUID-DEL-AUTH-USER' y 'UUID-CIUDADANO-EXISTENTE'
--    (si el ciudadano ya existe en la tabla ciudadanos) 
--    O deja que se cree uno nuevo
-- 4. Ejecuta en SQL Editor

DO $$
DECLARE
  v_auth_uid UUID  := 'PEGA-AQUI-EL-UUID-DEL-AUTH-USER'; -- ← CAMBIAR
  v_ciudadano_id UUID;
BEGIN

  -- Opción A: Crear nuevo ciudadano (si no existe en el padrón)
  INSERT INTO public.ciudadanos (
    nombre_completo,
    email,
    curp,
    estado_kyc,
    cuenta_stp_clabe
  )
  VALUES (
    'José Demo Usuario',         -- ← CAMBIAR al nombre real
    'jose@demo.toj.mx',          -- ← CAMBIAR al email real
    'DEMO000000HVZXXX00',        -- ← CAMBIAR al CURP real (opcional)
    'Pendiente',
    '646180500001299999'         -- CLABE única (puedes cambiarla)
  )
  ON CONFLICT (email) DO UPDATE
    SET nombre_completo = EXCLUDED.nombre_completo
  RETURNING id INTO v_ciudadano_id;

  -- Registrar en usuarios_plataforma como CIUDADANO
  INSERT INTO public.usuarios_plataforma (
    auth_user_id,
    email,
    nombre_mostrar,
    tipo_usuario,
    estado,
    ciudadano_id
  )
  VALUES (
    v_auth_uid,
    'jose@demo.toj.mx',          -- ← CAMBIAR al email real
    'José Demo',                 -- ← CAMBIAR al nombre real
    'CIUDADANO',
    'Activo',
    v_ciudadano_id
  )
  ON CONFLICT (auth_user_id) DO UPDATE
    SET ciudadano_id = v_ciudadano_id,
        tipo_usuario = 'CIUDADANO',
        estado = 'Activo';

  -- Asignar una obligación demo al nuevo ciudadano
  INSERT INTO public.obligaciones (
    ciudadano_id, institucion_id,
    tipo_tramite, identificador_externo,
    monto_original, monto_recargos, monto_total, monto_pendiente,
    fecha_vencimiento, estado_cumplimiento,
    ejercicio, periodo_referencia
  ) VALUES (
    v_ciudadano_id,
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Predial',
    'PRED-DEMO-' || LEFT(v_ciudadano_id::text, 8),
    1500.00, 0.00, 1500.00, 1500.00,
    '2026-06-30', 'Al corriente',
    2026, 'Anual 2026'
  );

  RAISE NOTICE '✅ Ciudadano registrado. ciudadano_id = %', v_ciudadano_id;
END;
$$;
