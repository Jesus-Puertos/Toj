'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Marca el onboarding KYC como completado en los metadatos del usuario.
 * Después redirige al dashboard.
 */
export async function completarKyc(): Promise<{ error: string } | void> {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.updateUser({
    data: { kyc_completado: true },
  });

  if (error) return { error: error.message };

  redirect('/dashboard');
}
