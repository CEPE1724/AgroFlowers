import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Sprout,
  Flower2,
  ShoppingCart,
  Plane,
  DollarSign,
  TrendingUp,
  Bot,
  Settings,
  User,
} from 'lucide-react';
import { PERMISSIONS } from '@/utils/permissions';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: keyof typeof PERMISSIONS;
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Fincas', href: '/farms', icon: Sprout, permission: 'FARMS_VIEW' },
  { label: 'Flores y variedades', href: '/flowers', icon: Flower2, permission: 'FLOWERS_VIEW' },
  { label: 'Compras', href: '/purchases', icon: ShoppingCart, permission: 'PURCHASES_VIEW' },
  { label: 'Embarques', href: '/shipments', icon: Plane, permission: 'SHIPMENTS_VIEW' },
  { label: 'Costos', href: '/costs', icon: DollarSign, permission: 'COSTS_VIEW' },
  { label: 'Ventas', href: '/sales', icon: TrendingUp, permission: 'SALES_VIEW' },
  { label: 'Rentabilidad', href: '/profitability', icon: TrendingUp, permission: 'PROFITABILITY_VIEW' },
  { label: 'Asistente IA', href: '/ai-assistant', icon: Bot, permission: 'AI_ASSISTANT' },
  { label: 'Configuración', href: '/settings', icon: Settings, permission: 'SETTINGS_MANAGE' },
  { label: 'Mi perfil', href: '/profile', icon: User },
];
