import { useEffect, useState } from 'react';
import { Plane, DollarSign, TrendingUp, Percent, Award, Flower2, AlertTriangle, ShoppingBag } from 'lucide-react';
import type { DashboardSummary, DashboardChartsData } from '@/types/dashboard';
import type { RecentShipmentRow } from '@/mocks/dashboard';
import { getDashboardSummary, getDashboardCharts, getRecentShipments } from '@/services/dashboardService';
import { formatCurrency, formatPercentage } from '@/utils/currency';
import { getErrorMessage } from '@/utils/errors';
import { StatCard, StatCardSkeleton } from './StatCard';
import { ChartCard, ChartCardSkeleton } from './ChartCard';
import { FarmProfitabilityChart } from './FarmProfitabilityChart';
import { CostsByCategoryChart } from './CostsByCategoryChart';
import { SalesByVarietyChart } from './SalesByVarietyChart';
import { MonthlyTrendChart } from './MonthlyTrendChart';
import { ShipmentsByStatusChart } from './ShipmentsByStatusChart';
import { RecentShipmentsTable } from './RecentShipmentsTable';
import { ErrorState } from '@/components/common/ErrorState';

interface DashboardData {
  summary: DashboardSummary;
  charts: DashboardChartsData;
  recentShipments: RecentShipmentRow[];
}

export function DashboardView() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadDashboard() {
    setIsLoading(true);
    setError(null);
    try {
      const [summary, charts, recentShipments] = await Promise.all([
        getDashboardSummary(),
        getDashboardCharts(),
        getRecentShipments(),
      ]);
      setData({ summary, charts, recentShipments });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (error) {
    return <ErrorState description={error} onRetry={loadDashboard} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading || !data ? (
          Array.from({ length: 8 }).map((_, index) => <StatCardSkeleton key={index} />)
        ) : (
          <>
            <StatCard icon={Plane} label="Embarques del mes" value={String(data.summary.shipmentsThisMonth)} />
            <StatCard icon={DollarSign} label="Ventas del mes" value={formatCurrency(data.summary.salesThisMonth)} tone="accent" />
            <StatCard icon={ShoppingBag} label="Costo total del mes" value={formatCurrency(data.summary.totalCostThisMonth)} tone="neutral" />
            <StatCard icon={TrendingUp} label="Utilidad total" value={formatCurrency(data.summary.totalProfit)} />
            <StatCard icon={Percent} label="Margen promedio" value={formatPercentage(data.summary.averageMargin)} tone="accent" />
            <StatCard icon={Award} label="Finca más rentable" value={data.summary.mostProfitableFarm} />
            <StatCard icon={Flower2} label="Variedad más vendida" value={data.summary.bestSellingVariety} tone="neutral" />
            <StatCard
              icon={AlertTriangle}
              label="Embarques con margen < 10%"
              value={String(data.summary.lowMarginShipments)}
              tone="warning"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {isLoading || !data ? (
          Array.from({ length: 5 }).map((_, index) => <ChartCardSkeleton key={index} />)
        ) : (
          <>
            <ChartCard title="Rentabilidad por finca" subtitle="Margen de utilidad promedio por proveedor">
              <FarmProfitabilityChart data={data.charts.farmProfitability} />
            </ChartCard>
            <ChartCard title="Costos por categoría" subtitle="Distribución del costo total de exportación">
              <CostsByCategoryChart data={data.charts.costsByCategory} />
            </ChartCard>
            <ChartCard title="Ventas por variedad" subtitle="Ingresos generados por variedad de flor">
              <SalesByVarietyChart data={data.charts.salesByVariety} />
            </ChartCard>
            <ChartCard title="Tendencia mensual" subtitle="Ventas vs. costos en los últimos 6 meses">
              <MonthlyTrendChart data={data.charts.monthlyTrend} />
            </ChartCard>
            <div className="lg:col-span-2">
              <ChartCard title="Embarques por estado" subtitle="Distribución del estado actual de los embarques">
                <ShipmentsByStatusChart data={data.charts.shipmentsByStatus} />
              </ChartCard>
            </div>
          </>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-primary-900 dark:text-primary-50">Últimos embarques</h2>
        <RecentShipmentsTable data={data?.recentShipments ?? []} isLoading={isLoading} />
      </div>
    </div>
  );
}
