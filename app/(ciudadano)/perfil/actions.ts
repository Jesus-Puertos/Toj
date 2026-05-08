'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function actualizarFotoPerfil(
  formData: FormData,
): Promise<{ avatarUrl: string } | { error: string }> {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'No autenticado' };
  }

  const archivo = formData.get('avatar') as File;

  if (!archivo || archivo.size === 0) {
    return { error: 'Sin archivo' };
  }

  if (archivo.size > 2 * 1024 * 1024) {
    return { error: 'La imagen supera 2 MB.' };
  }

  const ext =
    archivo.type === 'image/png'
      ? 'png'
      : archivo.type === 'image/webp'
        ? 'webp'
        : 'jpg';

  const path = `${user.id}/avatar.${ext}`;

  const buffer = await archivo.arrayBuffer();

  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, buffer, { upsert: true, contentType: archivo.type });

  if (error) {
    return { error: error.message };
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  const avatarUrl = data.publicUrl + '?t=' + Date.now();

  await supabase.auth.updateUser({ data: { avatar_url: avatarUrl } });

  revalidatePath('/perfil');
  revalidatePath('/dashboard');

  return { avatarUrl };
}
