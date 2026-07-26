import type { DashboardSummary, DashboardChartsData } from '@/types/dashboard';

export const mockDashboardSummary: DashboardSummary = {
  shipmentsThisMonth: 18,
  salesThisMonth: 58450.8,
  totalCostThisMonth: 46970.25,
  totalProfit: 11480.55,
  averageMargin: 19.64,
  mostProfitableFarm: 'Rosas del Valle',
  bestSellingVariety: 'Freedom',
  lowMarginShipments: 3,
};

export const mockDashboardCharts: DashboardChartsData = {
  farmProfitability: [
    { farmName: 'Rosas del Valle', profitMargin: 22.4 },
    { farmName: 'Flor Andina', profitMargin: 17.8 },
    { farmName: 'Ecuadorian Blooms', profitMargin: 11.25 },
  ],
  costsByCategory: [
    { category: 'Flor', amount: 21500 },
    { category: 'Flete aéreo', amount: 12800 },
    { category: 'Empaque y etiquetas', amount: 3200 },
    { category: 'Impuestos', amount: 6100 },
    { category: 'Transporte terrestre', amount: 1450 },
    { category: 'Seguro', amount: 620 },
    { category: 'Manejo de carga', amount: 980 },
    { category: 'Otros', amount: 320.25 },
  ],
  salesByVariety: [
    { variety: 'Freedom', totalSold: 21500 },
    { variety: 'Explorer', totalSold: 15200 },
    { variety: 'Mondial', totalSold: 12800 },
    { variety: 'Million Stars', totalSold: 8950.8 },
  ],
  monthlyTrend: [
    { month: 'Feb', sales: 41200, costs: 33800 },
    { month: 'Mar', sales: 45600, costs: 36900 },
    { month: 'Abr', sales: 39800, costs: 32100 },
    { month: 'May', sales: 52300, costs: 41500 },
    { month: 'Jun', sales: 49700, costs: 39800 },
    { month: 'Jul', sales: 58450.8, costs: 46970.25 },
  ],
  shipmentsByStatus: [
    { status: 'DELIVERED', count: 9 },
    { status: 'SHIPPED', count: 4 },
    { status: 'READY', count: 3 },
    { status: 'DRAFT', count: 1 },
    { status: 'CANCELLED', count: 1 },
  ],
};

export interface RecentShipmentRow {
  id: number;
  shipmentNumber: string;
  shipmentDate: string;
  destination: string;
  customer: string;
  status: string;
}

export const mockRecentShipments: RecentShipmentRow[] = [
  { id: 1, shipmentNumber: 'EMB-000075', shipmentDate: '2026-07-08', destination: 'Miami', customer: 'Flowers Market USA', status: 'DELIVERED' },
  { id: 2, shipmentNumber: 'EMB-000076', shipmentDate: '2026-07-12', destination: 'New York', customer: 'NY Flower Imports', status: 'SHIPPED' },
  { id: 3, shipmentNumber: 'EMB-000077', shipmentDate: '2026-07-18', destination: 'Miami', customer: 'Miami Premium Flowers', status: 'READY' },
];
