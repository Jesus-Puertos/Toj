"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ── Subir selfie ──────────────────────────────────────────────────────────────

export async function subirSelfieKyc(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const archivo = formData.get("selfie") as File;
  if (!archivo || archivo.size === 0) return { error: "Sin archivo" };

  const buffer = await archivo.arrayBuffer();
  const path = `${user.id}/selfie.jpg`;

  const { error } = await supabase.storage
    .from("kyc-selfies")
    .upload(path, buffer, { upsert: true, contentType: "image/jpeg" });

  if (error) return { error: error.message };

  const { data } = supabase.storage.from("kyc-selfies").getPublicUrl(path);
  // Cache-bust para que el navegador no sirva una versión anterior
  return { url: `${data.publicUrl}?t=${Date.now()}` };
}

// ── Subir comprobante de domicilio ────────────────────────────────────────────

export async function subirDocumentoKyc(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const archivo = formData.get("documento") as File;
  if (!archivo || archivo.size === 0) return { error: "Sin archivo" };

  const ext =
    archivo.type === "application/pdf"
      ? "pdf"
      : archivo.type === "image/png"
        ? "png"
        : archivo.type === "image/webp"
          ? "webp"
          : "jpg";

  const path = `${user.id}/comprobante.${ext}`;
  const buffer = await archivo.arrayBuffer();

  const { error } = await supabase.storage
    .from("kyc-documentos")
    .upload(path, buffer, { upsert: true, contentType: archivo.type });

  if (error) return { error: error.message };

  const { data } = supabase.storage.from("kyc-documentos").getPublicUrl(path);
  return { url: `${data.publicUrl}?t=${Date.now()}` };
}

// ── Completar KYC ─────────────────────────────────────────────────────────────

export async function completarKyc(urls?: {
  selfieUrl?: string;
  documentoUrl?: string;
}): Promise<{ error: string } | void> {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.updateUser({
    data: {
      kyc_completado: true,
      ...(urls?.selfieUrl && { kyc_selfie_url: urls.selfieUrl }),
      ...(urls?.documentoUrl && { kyc_documento_url: urls.documentoUrl }),
    },
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
