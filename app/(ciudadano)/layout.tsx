import { BottomNavBar } from '@/components/ciudadano/BottomNavBar';

/**
 * Layout ciudadano — mobile-first (max 430px) con BottomNavBar.
 * En desktop se centra con sombra simulando un teléfono.
 * Cada página maneja su propio sticky header interno.
 */
export default function CiudadanoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#e8f0ef] md:flex md:items-start md:justify-center md:pt-6">
      <div className="relative min-h-screen w-full max-w-[430px] overflow-hidden bg-surface md:min-h-[calc(100vh-48px)] md:rounded-3xl md:shadow-2xl">
        {/* Contenido de la página — padding-bottom para que no tape la BottomNavBar */}
        <main className="pb-[calc(68px+env(safe-area-inset-bottom))]">
          {children}
        </main>
        {/* Navegación inferior fija */}
        <BottomNavBar />
      </div>
    </div>
  );
}
