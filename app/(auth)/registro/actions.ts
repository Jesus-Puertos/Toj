'use server';

import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/** Registro de ciudadano nuevo */
export async function signUp(input: {
  nombreCompleto: string;
  email: string;
  password: string;
}): Promise<{ error: string } | void> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        nombre_completo: input.nombreCompleto,
        rol: 'ciudadano',
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) return { error: error.message };

  const user = data.user;
  if (!user) return { error: 'No se pudo crear el usuario.' };

  const admin = createSupabaseServiceClient();

  const { error: ciudadanoError } = await admin
    .from('ciudadanos')
    .upsert(
      {
        id: user.id,
        nombre_completo: input.nombreCompleto,
        email: input.email,
        estado_kyc: 'Pendiente',
        es_activo: true,
      },
      { onConflict: 'id' }
    );

  if (ciudadanoError) return { error: ciudadanoError.message };

  const { error: usuarioError } = await admin
    .from('usuarios_plataforma')
    .upsert(
      {
        auth_user_id: user.id,
        email: user.email ?? input.email,
        nombre_mostrar: input.nombreCompleto,
        tipo_usuario: 'CIUDADANO',
        estado: 'Activo',
        ciudadano_id: user.id,
      },
      { onConflict: 'auth_user_id' }
    );

  if (usuarioError) return { error: usuarioError.message };

  redirect('/login?message=confirm_email');
}
