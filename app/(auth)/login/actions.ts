"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/** Login con email y contraseña */
export async function signInWithPassword(
  email: string,
  password: string,
): Promise<{ error: string } | void> {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect("/dashboard");
}

/** Magic Link — envía email con link de acceso */
export async function signInWithMagicLink(
  email: string,
): Promise<{ error: string } | { success: true }> {
  const supabase = createSupabaseServerClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });
  if (error) return { error: error.message };
  return { success: true };
}

/** OAuth con Google — devuelve URL de autorización y redirige */
export async function signInWithGoogle(): Promise<{ error: string } | void> {
  const supabase = createSupabaseServerClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
      skipBrowserRedirect: true,
    },
  });
  if (error || !data.url)
    return { error: error?.message ?? "No se pudo iniciar con Google." };
  redirect(data.url);
}

/** Cerrar sesión */
export async function signOut(): Promise<void> {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
