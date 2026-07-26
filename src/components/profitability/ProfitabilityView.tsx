import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { DataTable, type DataTableColumn } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ProfitabilityFiltersForm } from './ProfitabilityFiltersForm';
import { listProfitability, exportProfitabilityToCsv, downloadCsv } from '@/services/profitabilityService';
import { PROFITABILITY_CLASSIFICATION_MAP } from '@/utils/statusMaps';
import { formatCurrency, formatPercentage } from '@/utils/currency';
import { formatDate } from '@/utils/dates';
import { getErrorMessage } from '@/utils/errors';
import type { ProfitabilityFilters, ProfitabilityRecord } from '@/types/profitability';

export function ProfitabilityView() {
  const [filters, setFilters] = useState<ProfitabilityFilters>({});
  const [records, setRecords] = useState<ProfitabilityRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      setRecords(await listProfitability(filters));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const summary = useMemo(() => {
    if (records.length === 0) return null;
    const totalSale = records.reduce((sum, r) => sum + r.totalSale, 0);
    const totalCost = records.reduce((sum, r) => sum + r.totalCost, 0);
    const totalProfit = records.reduce((sum, r) => sum + r.profit, 0);
    const averageMargin = records.reduce((sum, r) => sum + r.profitMargin, 0) / records.length;
    return { totalSale, totalCost, totalProfit, averageMargin };
  }, [records]);

  function handleExport() {
    if (records.length === 0) return;
    const csv = exportProfitabilityToCsv(records);
    downloadCsv(csv, `rentabilidad_${new Date().toISOString().slice(0, 10)}.csv`);
    toast.success('Archivo CSV generado correctamente');
  }

  const columns: DataTableColumn<ProfitabilityRecord>[] = [
    { key: 'shipmentNumber', header: 'Embarque', render: (row) => <span className="font-medium">{row.shipmentNumber}</span> },
    { key: 'shipmentDate', header: 'Fecha', render: (row) => formatDate(row.shipmentDate), sortable: true, sortValue: (r) => r.shipmentDate },
    { key: 'farmName', header: 'Finca', render: (row) => row.farmName },
    { key: 'customer', header: 'Cliente', render: (row) => row.customer },
    { key: 'totalSale', header: 'Venta total', render: (row) => formatCurrency(row.totalSale) },
    { key: 'totalCost', header: 'Costo total', render: (row) => formatCurrency(row.totalCost) },
    { key: 'profit', header: 'Utilidad', render: (row) => formatCurrency(row.profit), sortable: true, sortValue: (r) => r.profit },
    {
      key: 'profitMargin',
      header: 'Margen',
      render: (row) => formatPercentage(row.profitMargin),
      sortable: true,
      sortValue: (r) => r.profitMargin,
    },
    {
      key: 'classification',
      header: 'Clasificación',
      render: (row) => {
        const meta = PROFITABILITY_CLASSIFICATION_MAP[row.classification];
        return <StatusBadge label={meta.label} tone={meta.tone} />;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <ProfitabilityFiltersForm filters={filters} onChange={setFilters} onExport={handleExport} hasResults={records.length > 0} />

      {summary && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="card p-4">
            <p className="text-xs text-gray-500 dark:text-primary-400">Venta total filtrada</p>
            <p className="text-lg font-bold text-primary-900 dark:text-primary-50">{formatCurrency(summary.totalSale)}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-gray-500 dark:text-primary-400">Costo total filtrado</p>
            <p className="text-lg font-bold text-primary-900 dark:text-primary-50">{formatCurrency(summary.totalCost)}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-gray-500 dark:text-primary-400">Utilidad total</p>
            <p className="text-lg font-bold text-primary-900 dark:text-primary-50">{formatCurrency(summary.totalProfit)}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-gray-500 dark:text-primary-400">Margen promedio</p>
            <p className="text-lg font-bold text-primary-900 dark:text-primary-50">{formatPercentage(summary.averageMargin)}</p>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={records}
        keyExtractor={(row) => row.shipmentId}
        isLoading={isLoading}
        error={error ?? undefined}
        onRetry={load}
        emptyTitle="No hay resultados"
        emptyDescription="Ajusta los filtros para ver embarques con rentabilidad calculada."
      />
    </div>
  );
}
