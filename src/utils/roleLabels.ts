import type { Role } from '@/types/auth';

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Administrador',
  SUPERVISOR: 'Supervisor',
  OPERADOR: 'Operador',
};

export const ROLE_BADGE_CLASSES: Record<Role, string> = {
  ADMIN: 'bg-primary-600 text-white',
  SUPERVISOR: 'bg-accent-500 text-white',
  OPERADOR: 'bg-gray-500 text-white',
};
