/**
 * features/ciudadano/index.ts
 * ─────────────────────────────────────────────────────
 * Punto de entrada del módulo Ciudadano.
 *
 * Este directorio agrupa toda la lógica de negocio del portal
 * del ciudadano: hooks, server actions y tipos propios.
 *
 * ESTRUCTURA RECOMENDADA:
 *   features/ciudadano/
 *   ├── hooks/
 *   │   ├── useObligaciones.ts    ← TODO: hook para listar obligaciones del user
 *   │   ├── useWallet.ts          ← TODO: hook para saldo y movimientos
 *   │   └── useCarpeta.ts         ← TODO: hook para documentos del ciudadano
 *   ├── actions/
 *   │   ├── pagarObligacion.ts    ← TODO: action para iniciar un pago STP
 *   │   ├── subirDocumento.ts     ← TODO: action para subir a Supabase Storage
 *   │   └── actualizarPerfil.ts   ← TODO: action para actualizar datos del user
 *   └── index.ts                  ← (este archivo)
 *
 * CONVENCIÓN:
 *   - hooks/ → solo lógica de estado/fetch del cliente
 *   - actions/ → Server Actions ('use server') para mutar datos
 *   - Importar tipos desde @/lib/types
 */

export {};
