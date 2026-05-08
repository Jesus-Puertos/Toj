-- ════════════════════════════════════════════════════════════
-- TOJ — CREAR USUARIO ADMIN (GOBIERNO)
-- Versión corregida: crea la institución si no existe
-- ════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_auth_uid   UUID := 'PEGA-AQUI-EL-UUID-DEL-AUTH-USER'; -- ← CAMBIAR
  v_inst_id    UUID := 'aaaaaaaa-0000-0000-0000-000000000001';
  v_usuario_id UUID;
BEGIN

  -- 0. Crear la institución si no existe (independiente del seed)
  INSERT INTO public.instituciones (id, nombre_municipio, clave_municipal, contacto_email)
  VALUES (
    v_inst_id,
    'Municipio de Zongolica',
    '30207',
    'contacto@toj.gob.mx'
  )
  ON CONFLICT (id) DO UPDATE
    SET nombre_municipio = EXCLUDED.nombre_municipio,
        clave_municipal  = EXCLUDED.clave_municipal,
        contacto_email   = EXCLUDED.contacto_email;

  -- 1. Registrar en usuarios_plataforma como ADMIN_GOBIERNO
  INSERT INTO public.usuarios_plataforma (
    auth_user_id, email, nombre_mostrar, tipo_usuario, estado
  )
  VALUES (
    v_auth_uid,
    'admin@toj.gob.mx',
    'Administrador TOJ',
    'ADMIN_GOBIERNO',
    'Activo'
  )
  ON CONFLICT (auth_user_id) DO UPDATE
    SET tipo_usuario   = 'ADMIN_GOBIERNO',
        nombre_mostrar = 'Administrador TOJ',
        estado         = 'Activo'
  RETURNING id INTO v_usuario_id;

  -- 2. Asignar al municipio con rol ADMIN
  INSERT INTO public.usuarios_instituciones (
    usuario_id, institucion_id, rol_institucion, activo
  )
  VALUES (v_usuario_id, v_inst_id, 'ADMIN', true)
  ON CONFLICT (usuario_id, institucion_id) DO UPDATE
    SET rol_institucion = 'ADMIN', activo = true;

  RAISE NOTICE '✅ Admin creado OK. usuario_id = %', v_usuario_id;
END;
$$;
