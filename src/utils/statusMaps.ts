import type { BadgeTone } from '@/components/common/StatusBadge';
import type { ShipmentStatus } from '@/types/shipment';
import type { PurchaseStatus } from '@/types/purchase';
import type { PaymentStatus } from '@/types/sale';
import type { RecordStatus, FarmRating } from '@/types/farm';
import type { ProfitabilityClassification } from '@/types/profitability';

interface StatusMeta {
  label: string;
  tone: BadgeTone;
}

export const SHIPMENT_STATUS_MAP: Record<ShipmentStatus, StatusMeta> = {
  DRAFT: { label: 'Borrador', tone: 'gray' },
  READY: { label: 'Listo', tone: 'blue' },
  SHIPPED: { label: 'Embarcado', tone: 'amber' },
  DELIVERED: { label: 'Entregado', tone: 'green' },
  CANCELLED: { label: 'Cancelado', tone: 'red' },
};

export const PURCHASE_STATUS_MAP: Record<PurchaseStatus, StatusMeta> = {
  DRAFT: { label: 'Borrador', tone: 'gray' },
  REGISTERED: { label: 'Registrada', tone: 'green' },
  CANCELLED: { label: 'Cancelada', tone: 'red' },
};

export const PAYMENT_STATUS_MAP: Record<PaymentStatus, StatusMeta> = {
  PAID: { label: 'Pagado', tone: 'green' },
  PENDING: { label: 'Pendiente', tone: 'amber' },
  OVERDUE: { label: 'Vencido', tone: 'red' },
};

export const RECORD_STATUS_MAP: Record<RecordStatus, StatusMeta> = {
  ACTIVE: { label: 'Activo', tone: 'green' },
  INACTIVE: { label: 'Inactivo', tone: 'gray' },
};

export const FARM_RATING_MAP: Record<FarmRating, StatusMeta> = {
  EXCELENTE: { label: 'Excelente', tone: 'green' },
  BUENA: { label: 'Buena', tone: 'blue' },
  REGULAR: { label: 'Regular', tone: 'amber' },
  MALA: { label: 'Mala', tone: 'red' },
};

export const PROFITABILITY_CLASSIFICATION_MAP: Record<ProfitabilityClassification, StatusMeta> = {
  EXCELLENT: { label: 'Excelente', tone: 'green' },
  GOOD: { label: 'Buena', tone: 'blue' },
  ACCEPTABLE: { label: 'Aceptable', tone: 'amber' },
  LOW: { label: 'Baja', tone: 'red' },
};

export function classifyProfitMargin(margin: number): ProfitabilityClassification {
  if (margin >= 20) return 'EXCELLENT';
  if (margin >= 15) return 'GOOD';
  if (margin >= 10) return 'ACCEPTABLE';
  return 'LOW';
}
