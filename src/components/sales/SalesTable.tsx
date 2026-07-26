import { useEffect, useState } from 'react';
import { Eye, Plus } from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/common/Button';
import { listSales } from '@/services/saleService';
import { PAYMENT_STATUS_MAP } from '@/utils/statusMaps';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/dates';
import { getErrorMessage } from '@/utils/errors';
import { can } from '@/utils/permissions';
import { DEFAULT_PAGE_SIZE } from '@/types/common';
import type { Sale } from '@/types/sale';

export function SalesTable() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const result = await listSales({ page, pageSize: DEFAULT_PAGE_SIZE, search });
      setSales(result.items);
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

  const columns: DataTableColumn<Sale>[] = [
    { key: 'saleNumber', header: 'N° Venta', render: (row) => <span className="font-medium">{row.saleNumber}</span> },
    { key: 'shipmentNumber', header: 'Embarque', render: (row) => row.shipmentNumber },
    { key: 'customer', header: 'Cliente', render: (row) => row.customer },
    { key: 'saleDate', header: 'Fecha', render: (row) => formatDate(row.saleDate), sortable: true, sortValue: (r) => r.saleDate },
    { key: 'totalSale', header: 'Total', render: (row) => formatCurrency(row.totalSale), sortable: true, sortValue: (r) => r.totalSale },
    {
      key: 'paymentStatus',
      header: 'Estado de pago',
      render: (row) => {
        const meta = PAYMENT_STATUS_MAP[row.paymentStatus];
        return <StatusBadge label={meta.label} tone={meta.tone} />;
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={sales}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        error={error ?? undefined}
        onRetry={load}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por N° de venta, cliente, embarque..."
        emptyTitle="No hay ventas registradas"
        emptyDescription="Registra una nueva venta para comenzar."
        toolbarExtra={
          can('SALES_CREATE') && (
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => (window.location.href = '/sales/new')}>
              Nueva venta
            </Button>
          )
        }
        actions={(row) => (
          <button
            type="button"
            onClick={() => (window.location.href = `/sales/${row.id}`)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/30"
            aria-label={`Ver venta ${row.saleNumber}`}
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
