import type { ShipmentStatus } from './shipment';

export interface DashboardSummary {
  shipmentsThisMonth: number;
  salesThisMonth: number;
  totalCostThisMonth: number;
  totalProfit: number;
  averageMargin: number;
  mostProfitableFarm: string;
  bestSellingVariety: string;
  lowMarginShipments: number;
}

export interface FarmProfitabilityPoint {
  farmName: string;
  profitMargin: number;
}

export interface CostByCategoryPoint {
  category: string;
  amount: number;
}

export interface SalesByVarietyPoint {
  variety: string;
  totalSold: number;
}

export interface MonthlyTrendPoint {
  month: string;
  sales: number;
  costs: number;
}

export interface ShipmentsByStatusPoint {
  status: ShipmentStatus;
  count: number;
}

export interface DashboardChartsData {
  farmProfitability: FarmProfitabilityPoint[];
  costsByCategory: CostByCategoryPoint[];
  salesByVariety: SalesByVarietyPoint[];
  monthlyTrend: MonthlyTrendPoint[];
  shipmentsByStatus: ShipmentsByStatusPoint[];
}
