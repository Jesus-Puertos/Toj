import { BottomNavBar } from "@/components/ciudadano/BottomNavBar";
import { SideNav } from "@/components/ciudadano/SideNav";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function CiudadanoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const nombre: string =
    user?.user_metadata?.nombre_completo ??
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split("@")[0] ??
    "Usuario";

  const email = user?.email ?? "";
  const avatarUrl: string | null = user?.user_metadata?.avatar_url ?? null;

  return (
    <div className="min-h-screen bg-[#e8f0ef] md:flex md:bg-surface">
      {/* ── Sidebar ── solo en desktop */}
      <SideNav nombre={nombre} email={email} avatarUrl={avatarUrl} />

      {/* ── Contenido principal ── */}
      <div
        className="
          relative w-full overflow-hidden bg-surface
          max-w-[430px] mx-auto min-h-screen
          md:flex-1 md:max-w-none md:mx-0 md:overflow-auto
          md:border-l md:border-outline-variant
        "
      >
        <main
          className="
            pb-[calc(68px+env(safe-area-inset-bottom))]
            md:pb-10 md:max-w-3xl md:mx-auto
          "
        >
          {children}
        </main>
        <BottomNavBar />
      </div>
    </div>
  );
}
