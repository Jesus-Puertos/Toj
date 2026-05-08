'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/** Registro de ciudadano nuevo */
export async function signUp(input: {
  nombreCompleto: string;
  email: string;
  password: string;
}): Promise<{ error: string } | void> {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.signUp({
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

  // TODO: Crear registro en tabla `ciudadanos` vinculado al auth.user
  // await createCiudadanoProfile(user.id, input.nombreCompleto)

  redirect('/login?message=confirm_email');
}
