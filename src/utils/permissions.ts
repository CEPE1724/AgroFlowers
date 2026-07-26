import type { Role } from '@/types/auth';
import { authStore } from '@/stores/authStore';

export function hasRole(role: Role): boolean {
  const { session } = authStore.get();
  return session?.user.role === role;
}

export function hasAnyRole(roles: Role[]): boolean {
  const { session } = authStore.get();
  if (!session) return false;
  return roles.includes(session.user.role);
}

export const PERMISSIONS = {
  FARMS_MANAGE: ['ADMIN'] as Role[],
  FARMS_VIEW: ['ADMIN', 'SUPERVISOR'] as Role[],
  FLOWERS_MANAGE: ['ADMIN'] as Role[],
  FLOWERS_VIEW: ['ADMIN', 'SUPERVISOR', 'OPERADOR'] as Role[],
  PURCHASES_CREATE: ['ADMIN', 'OPERADOR'] as Role[],
  PURCHASES_VIEW: ['ADMIN', 'SUPERVISOR', 'OPERADOR'] as Role[],
  SHIPMENTS_CREATE: ['ADMIN', 'OPERADOR'] as Role[],
  SHIPMENTS_VIEW: ['ADMIN', 'SUPERVISOR', 'OPERADOR'] as Role[],
  COSTS_CREATE: ['ADMIN', 'OPERADOR'] as Role[],
  COSTS_VIEW: ['ADMIN', 'SUPERVISOR', 'OPERADOR'] as Role[],
  SALES_CREATE: ['ADMIN'] as Role[],
  SALES_VIEW: ['ADMIN', 'SUPERVISOR'] as Role[],
  PROFITABILITY_VIEW: ['ADMIN', 'SUPERVISOR'] as Role[],
  AI_ASSISTANT: ['ADMIN', 'SUPERVISOR'] as Role[],
  SETTINGS_MANAGE: ['ADMIN'] as Role[],
  DELETE_RECORDS: ['ADMIN'] as Role[],
} as const;

export function can(permission: keyof typeof PERMISSIONS): boolean {
  return hasAnyRole(PERMISSIONS[permission]);
}
