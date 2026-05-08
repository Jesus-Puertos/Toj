/**
 * features/gobierno/index.ts
 * ─────────────────────────────────────────────────────
 * Punto de entrada del módulo Gobierno/Admin.
 *
 * ESTRUCTURA RECOMENDADA:
 *   features/gobierno/
 *   ├── hooks/
 *   │   ├── useKpis.ts              ← TODO: KPIs de recaudación en tiempo real
 *   │   ├── useConciliacion.ts      ← TODO: pagos STP pendientes de conciliar
 *   │   └── useAuditoriaKyc.ts      ← TODO: expedientes KYC por revisar
 *   ├── actions/
 *   │   ├── aprobarKyc.ts           ← TODO: aprobar/rechazar expediente biométrico
 *   │   ├── conciliarPago.ts        ← TODO: marcar pago STP como conciliado
 *   │   └── importarCsvEtl.ts       ← TODO: procesar CSV de carga masiva
 *   └── index.ts
 *
 * CONVENCIÓN:
 *   - Solo personal con rol = 'gobierno' puede acceder (middleware lo verifica)
 *   - Las actions usan createSupabaseServiceClient() para bypassear RLS
 */

export {};
