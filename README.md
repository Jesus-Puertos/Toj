# TOJ Platform

> Plataforma GovTech/Fintech para servicios municipales digitales — ciudadanos y gobierno.

---

## 🚀 Arranque rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# 3. Correr en desarrollo
npm run dev
# → http://localhost:3000
```

## 🗝️ Variables de entorno requeridas

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Anon/Public key de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role key (solo servidor) |
| `DATABASE_URL` | Connection string PostgreSQL |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (para Magic Link) |

---

## 🏗️ Arquitectura

```
app/
├── (auth)/         ← Login y registro (rutas públicas)
├── (ciudadano)/    ← Portal ciudadano (protegido por sesión)
│   ├── dashboard/  ← Home con wallet y obligaciones
│   ├── pagos/      ← Historial de pagos
│   ├── pagar/[id]/ ← Flujo de pago por obligación
│   ├── kyc/        ← Verificación de identidad
│   ├── ia/         ← Chat con asistente IA
│   └── perfil/     ← Perfil del ciudadano
└── (gobierno)/     ← Panel admin (protegido por rol)
    └── admin/
        ├── conciliacion/  ← Conciliación STP
        ├── etl/           ← Carga masiva CSV
        └── kyc/           ← Auditoría KYC

components/
├── ciudadano/      ← WalletCard, ObligacionCard, BottomNavBar, etc.
├── gobierno/       ← KpiCard, etc.
└── shared/         ← Componentes reutilizables entre roles

features/
├── ciudadano/      ← Hooks y actions del ciudadano (ver index.ts)
└── gobierno/       ← Hooks y actions del gobierno (ver index.ts)

lib/
├── supabase/       ← Clientes Supabase (browser, server, service)
│   ├── client.ts   ← Para componentes cliente
│   ├── server.ts   ← Para Server Components y Actions
│   └── actions.ts  ← Server Actions compartidas
└── types/          ← Tipos TypeScript globales

middleware.ts       ← Protección de rutas por sesión/rol
```

## 🔐 Auth y Roles

- **Login**: `/login` — email+contraseña o Magic Link
- **Registro**: `/registro` — solo ciudadanos
- El middleware protege automáticamente las rutas según sesión y rol
- El rol se guarda en `user.user_metadata.rol` (Supabase Auth)

## 📱 PWA

TOJ es instalable como app nativa:
- Android: "Agregar a pantalla de inicio" en Chrome
- iOS: Safari → Compartir → "Añadir a pantalla de inicio"
- Desktop: ícono de instalación en la barra de Chrome

## 🤝 Para el equipo

Cada módulo tiene un `index.ts` con instrucciones de qué implementar:
- `features/ciudadano/index.ts` → hooks y actions del ciudadano
- `features/gobierno/index.ts` → hooks y actions del panel admin

**Convenciones:**
- Tipos compartidos → `lib/types/index.ts`
- Server Actions → `'use server'` en archivo separado
- Componentes cliente → `'use client'` solo si necesitan interactividad
- Consultas a Supabase → siempre en Server Components o Server Actions (nunca en el cliente directamente)

## 🗄️ Base de datos

El esquema SQL completo está en `docs/ESQUEMA_FINAL_BD_TOJ_SUPABASE.sql`.
Las migraciones versionadas irán en `db/migrations/`.