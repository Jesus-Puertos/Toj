-- ════════════════════════════════════════════════════════════
-- TOJ — CREAR USUARIO ADMIN (GOBIERNO)
-- 
-- INSTRUCCIONES:
-- 1. Ve a Supabase → Authentication → Users → "Add user"
-- 2. Crea el usuario con:
--    Email:    admin@toj.gob.mx
--    Password: TojAdmin2026!
-- 3. Copia el UUID que te da Supabase
-- 4. Reemplaza 'PEGA-AQUI-EL-UUID-DEL-AUTH-USER' por ese UUID
-- 5. Ejecuta este script en SQL Editor
-- ════════════════════════════════════════════════════════════

-- REEMPLAZA AQUÍ EL UUID DE AUTH:
DO $$
DECLARE
  v_auth_uid UUID := 'PEGA-AQUI-EL-UUID-DEL-AUTH-USER'; -- ← CAMBIAR ESTO
  v_usuario_id UUID;
BEGIN

  -- 1. Registrar en usuarios_plataforma como ADMIN_GOBIERNO
  INSERT INTO public.usuarios_plataforma (
    auth_user_id,
    email,
    nombre_mostrar,
    tipo_usuario,
    estado
  )
  VALUES (
    v_auth_uid,
    'admin@toj.gob.mx',
    'Administrador TOJ',
    'ADMIN_GOBIERNO',
    'Activo'
  )
  ON CONFLICT (auth_user_id) DO UPDATE
    SET tipo_usuario = 'ADMIN_GOBIERNO',
        nombre_mostrar = 'Administrador TOJ',
        estado = 'Activo'
  RETURNING id INTO v_usuario_id;

  -- 2. Asignar al municipio de Zongolica con rol ADMIN
  INSERT INTO public.usuarios_instituciones (
    usuario_id,
    institucion_id,
    rol_institucion,
    activo
  )
  VALUES (
    v_usuario_id,
    'aaaaaaaa-0000-0000-0000-000000000001',
    'ADMIN',
    true
  )
  ON CONFLICT (usuario_id, institucion_id) DO UPDATE
    SET rol_institucion = 'ADMIN',
        activo = true;

  RAISE NOTICE '✅ Admin creado con ID: %', v_usuario_id;
END;
$$;
