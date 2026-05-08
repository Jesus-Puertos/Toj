/** Layout para páginas de autenticación (login, registro)
 *  Fondo navy oscuro con gradiente jade/terracota — mobile-first
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: '#0D1B2A' }}>
      {/* Gradientes decorativos de fondo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 10% 0%, rgba(0,155,141,0.28) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 100%, rgba(226,109,74,0.18) 0%, transparent 55%)',
        }}
      />
      {/* Contenedor centrado */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10">
        {children}
      </div>
    </div>
  );
}
