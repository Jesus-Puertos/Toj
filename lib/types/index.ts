/**
 * lib/types/index.ts
 * Tipos TypeScript globales compartidos en todo el proyecto TOJ.
 * Importar con: import type { ... } from '@/lib/types'
 */

// ── Roles ────────────────────────────────────────────────────
export type Rol = 'ciudadano' | 'gobierno';

// ── Ciudadano ────────────────────────────────────────────────
export type Ciudadano = {
  id: string;
  auth_user_id: string;
  nombre_completo: string;
  curp?: string;
  email: string;
  rol: Rol;
  kyc_status: 'Pendiente' | 'En revisión' | 'Aprobado' | 'Rechazado';
  created_at: string;
};

// ── Obligación fiscal ─────────────────────────────────────────
export type EstadoCumplimiento = 'Al corriente' | 'Por vencer' | 'Vencido' | 'Pagado';

export type Obligacion = {
  id: string;
  ciudadano_id: string;
  tipo_tramite: string;
  monto_total: number;
  fecha_vencimiento: string;  // ISO date string YYYY-MM-DD
  estado_cumplimiento: EstadoCumplimiento;
};

// ── Pago ─────────────────────────────────────────────────────
export type EstadoConciliacion = 'Pendiente' | 'Conciliado' | 'Rechazado';

export type Pago = {
  id: string;
  obligacion_id: string;
  ciudadano_id: string;
  monto_transferido: number;
  clave_rastreo_stp?: string;
  estado_conciliacion: EstadoConciliacion;
  created_at: string;
};

// ── Wallet ────────────────────────────────────────────────────
export type Wallet = {
  id: string;
  ciudadano_id: string;
  saldo: number;
  clabe: string;
};

// ── KYC ───────────────────────────────────────────────────────
export type ExpedienteKyc = {
  id: string;
  ciudadano_id: string;
  selfie_url?: string;
  comprobante_url?: string;
  status: 'Pendiente' | 'Aprobado' | 'Rechazado';
  notas_revisor?: string;
  created_at: string;
};
