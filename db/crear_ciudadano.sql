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
--    Email:    usa un correo de prueba controlado por tu equipo
--    Password: genera una temporal en ese momento y no la guardes en Git
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
    id,
    nombre_completo,
    email,
    curp,
    estado_kyc,
    cuenta_stp_clabe
  )
  VALUES (
    v_auth_uid,
    'Ciudadano Demo',            -- ← CAMBIAR al nombre real
    'ciudadano.demo@example.com',-- ← CAMBIAR al email real
    'DEMO000000HVZXXX00',        -- ← CAMBIAR al CURP real (opcional)
    'Pendiente',
    '646180500001299999'         -- CLABE única (puedes cambiarla)
  )
  ON CONFLICT (id) DO UPDATE
    SET nombre_completo = EXCLUDED.nombre_completo,
        email = EXCLUDED.email,
        curp = EXCLUDED.curp,
        estado_kyc = EXCLUDED.estado_kyc,
        cuenta_stp_clabe = EXCLUDED.cuenta_stp_clabe
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
    'ciudadano.demo@example.com',-- ← CAMBIAR al email real
    'Ciudadano Demo',            -- ← CAMBIAR al nombre real
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
