import { BottomNavBar } from "@/components/ciudadano/BottomNavBar";
import { SideNav } from "@/components/ciudadano/SideNav";

/**
 * Layout ciudadano
 *
 * Mobile  → pantalla completa, BottomNavBar fija abajo.
 * Desktop → SideNav (240 px) a la izquierda + área de contenido flexible.
 *           El phone-frame desaparece: la app se comporta como un dashboard web.
 */
export default function CiudadanoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#e8f0ef] md:flex md:bg-surface">
      {/* ── Sidebar ── solo en desktop */}
      <SideNav />

      {/* ── Contenido principal ────────────────────────────────────── */}
      {/*
       *  Mobile:  max-w-[430px] centrado, overflow-hidden, con phone-frame
       *  Desktop: flex-1, sin límite, sin frame, scroll independiente
       */}
      <div
        className="
          relative w-full overflow-hidden bg-surface
          /* mobile: phone-frame */
          max-w-[430px] mx-auto min-h-screen
          /* desktop: full flexible */
          md:flex-1 md:max-w-none md:mx-0 md:overflow-auto
          md:border-l md:border-outline-variant
        "
      >
        <main
          className="
            /* mobile: padding para que el contenido no quede bajo la BottomNavBar */
            pb-[calc(68px+env(safe-area-inset-bottom))]
            /* desktop: sin ese padding, contenido centrado a un ancho legible */
            md:pb-10 md:max-w-3xl md:mx-auto
          "
        >
          {children}
        </main>

        {/* BottomNavBar: se oculta en desktop desde su propio componente */}
        <BottomNavBar />
      </div>
    </div>
  );
}
