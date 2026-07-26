import { useEffect, useState } from 'react';
import { Eye, Pencil, Plus } from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/common/Button';
import { listShipments } from '@/services/shipmentService';
import { SHIPMENT_STATUS_MAP } from '@/utils/statusMaps';
import { formatDate } from '@/utils/dates';
import { getErrorMessage } from '@/utils/errors';
import { can } from '@/utils/permissions';
import { DEFAULT_PAGE_SIZE } from '@/types/common';
import type { Shipment } from '@/types/shipment';

export function ShipmentsTable() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const result = await listShipments({ page, pageSize: DEFAULT_PAGE_SIZE, search });
      setShipments(result.items);
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

  const columns: DataTableColumn<Shipment>[] = [
    { key: 'shipmentNumber', header: 'Embarque', render: (row) => <span className="font-medium">{row.shipmentNumber}</span> },
    { key: 'shipmentDate', header: 'Fecha', render: (row) => formatDate(row.shipmentDate), sortable: true, sortValue: (r) => r.shipmentDate },
    { key: 'destination', header: 'Destino', render: (row) => row.destination },
    { key: 'customer', header: 'Cliente', render: (row) => row.customer },
    { key: 'boxes', header: 'Cajas', render: (row) => row.boxes },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => {
        const meta = SHIPMENT_STATUS_MAP[row.status];
        return <StatusBadge label={meta.label} tone={meta.tone} />;
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={shipments}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        error={error ?? undefined}
        onRetry={load}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por embarque, cliente, destino..."
        emptyTitle="No hay embarques registrados"
        emptyDescription="Registra un nuevo embarque para comenzar."
        toolbarExtra={
          can('SHIPMENTS_CREATE') && (
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => (window.location.href = '/shipments/new')}>
              Nuevo embarque
            </Button>
          )
        }
        actions={(row) => (
          <div className="flex justify-end gap-1">
            <button
              type="button"
              onClick={() => (window.location.href = `/shipments/${row.id}`)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/30"
              aria-label={`Ver ${row.shipmentNumber}`}
            >
              <Eye className="h-4 w-4" />
            </button>
            {can('SHIPMENTS_CREATE') && (
              <button
                type="button"
                onClick={() => (window.location.href = `/shipments/${row.id}/edit`)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/30"
                aria-label={`Editar ${row.shipmentNumber}`}
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      />
      <div className="card mt-0 rounded-t-none">
        <Pagination page={page} pageSize={DEFAULT_PAGE_SIZE} total={total} onPageChange={setPage} />
      </div>
    </>
  );
}
