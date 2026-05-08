import Link from 'next/link';

export default function GobiernoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-toj-navy text-white">
      <header className="border-b border-white/10 bg-toj-navy-soft/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
          <Link href="/" className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-white">
            TOJ Gobierno
          </Link>
          <nav className="text-sm text-white/70">
            Admin
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
