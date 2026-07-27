import { useEffect, useState } from 'react';
import { Eye, Plus } from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/common/Button';
import { listPurchases } from '@/services/purchaseService';
import { PURCHASE_STATUS_MAP } from '@/utils/statusMaps';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/dates';
import { getErrorMessage } from '@/utils/errors';
import { usePermission } from '@/utils/permissions';
import { DEFAULT_PAGE_SIZE } from '@/types/common';
import type { Purchase } from '@/types/purchase';

export function PurchasesTable() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canCreate = usePermission('PURCHASES_CREATE');

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const result = await listPurchases({ page, pageSize: DEFAULT_PAGE_SIZE, search });
      setPurchases(result.items);
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

  const columns: DataTableColumn<Purchase>[] = [
    { key: 'purchaseNumber', header: 'N° Compra', render: (row) => <span className="font-medium">{row.purchaseNumber}</span> },
    { key: 'purchaseDate', header: 'Fecha', render: (row) => formatDate(row.purchaseDate), sortable: true, sortValue: (r) => r.purchaseDate },
    { key: 'farmName', header: 'Finca', render: (row) => row.farmName },
    { key: 'responsible', header: 'Responsable', render: (row) => row.responsible },
    { key: 'total', header: 'Total', render: (row) => formatCurrency(row.total), sortable: true, sortValue: (r) => r.total },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => {
        const meta = PURCHASE_STATUS_MAP[row.status];
        return <StatusBadge label={meta.label} tone={meta.tone} />;
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={purchases}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        error={error ?? undefined}
        onRetry={load}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por N° de compra, finca, responsable..."
        emptyTitle="No hay compras registradas"
        emptyDescription="Registra una nueva compra de flores para comenzar."
        toolbarExtra={
          canCreate && (
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => (window.location.href = '/purchases/new')}>
              Nueva compra
            </Button>
          )
        }
        actions={(row) => (
          <button
            type="button"
            onClick={() => (window.location.href = `/purchases/${row.id}`)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/30"
            aria-label={`Ver compra ${row.purchaseNumber}`}
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
