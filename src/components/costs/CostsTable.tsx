import { useEffect, useState } from 'react';
import { Eye, Plus } from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/components/common/DataTable';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/common/Button';
import { listCosts } from '@/services/costService';
import { formatCurrency } from '@/utils/currency';
import { getErrorMessage } from '@/utils/errors';
import { usePermission } from '@/utils/permissions';
import { DEFAULT_PAGE_SIZE } from '@/types/common';
import type { Cost } from '@/types/cost';

export function CostsTable() {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canCreate = usePermission('COSTS_CREATE');

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const result = await listCosts({ page, pageSize: DEFAULT_PAGE_SIZE, search });
      setCosts(result.items);
      setTotal(result.total);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const columns: DataTableColumn<Cost>[] = [
    { key: 'shipmentNumber', header: 'Embarque', render: (row) => <span className="font-medium">{row.shipmentNumber}</span> },
    { key: 'flowerCost', header: 'Costo flor', render: (row) => formatCurrency(row.flowerCost) },
    { key: 'airFreight', header: 'Flete aéreo', render: (row) => formatCurrency(row.airFreight) },
    { key: 'taxes', header: 'Impuestos', render: (row) => formatCurrency(row.taxes) },
    {
      key: 'totalCost',
      header: 'Costo total',
      render: (row) => <span className="font-semibold text-primary-800 dark:text-primary-100">{formatCurrency(row.totalCost)}</span>,
      sortable: true,
      sortValue: (r) => r.totalCost,
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={costs}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        error={error ?? undefined}
        onRetry={load}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por embarque..."
        emptyTitle="No hay costos registrados"
        emptyDescription="Registra los costos de un embarque para comenzar."
        toolbarExtra={
          canCreate && (
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => (window.location.href = '/costs/new')}>
              Nuevo costo
            </Button>
          )
        }
        actions={(row) => (
          <button
            type="button"
            onClick={() => (window.location.href = `/costs/${row.shipmentId}`)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/30"
            aria-label={`Ver costos de ${row.shipmentNumber}`}
          >
            <Eye className="h-4 w-4" />
          </button>
        )}
      />
      <div className="card mt-0 rounded-t-none">
        <Pagination page={page} pageSize={DEFAULT_PAGE_SIZE} total={total} onPageChange={setPage} />
      </div>
    </>
  );
}
