import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-toj-hero px-6 py-10 text-on-surface md:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-between gap-10 rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-soft backdrop-blur md:p-10">
        <section className="max-w-3xl space-y-6">
          <div className="inline-flex rounded-full border border-primary/20 bg-primary-fixed/30 px-4 py-2 text-sm font-semibold text-primary">
            TOJ · Base inicial
          </div>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-on-surface md:text-6xl">
              Plataforma GovTech/Fintech lista para crecer sin enredarse.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-on-surface-variant md:text-lg">
              Arranque con estructura modular, Supabase conectado desde el
              inicio y rutas separadas para ciudadano y gobierno.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:bg-primary-container"
              href="/dashboard"
            >
              Abrir dashboard ciudadano
            </Link>
            <Link
              className="rounded-full border border-on-surface/15 bg-white px-5 py-3 text-sm font-semibold text-on-surface transition hover:border-primary hover:text-primary"
              href="/admin"
            >
              Abrir panel gobierno
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            [
              "Ciudadano",
              "KYC biométrico, wallet, obligaciones, pagos y notificaciones Telegram.",
            ],
            [
              "Gobierno",
              "Carga masiva ETL, auditoría KYC, conciliación STP y bitácora n8n.",
            ],
            [
              "n8n",
              "Automatización por eventos sin mezclarla con la UI — event-driven puro.",
            ],
          ].map(([title, description]) => (
            <article
              key={title}
              className="rounded-3xl border border-white/70 bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-on-surface">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                {description}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
