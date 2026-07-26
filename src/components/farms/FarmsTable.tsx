import { useEffect, useState } from 'react';
import { Eye, Pencil, Power, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable, type DataTableColumn } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/common/Button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { listFarms, deactivateFarm } from '@/services/farmService';
import { FARM_RATING_MAP, RECORD_STATUS_MAP } from '@/utils/statusMaps';
import { formatPercentage } from '@/utils/currency';
import { getErrorMessage } from '@/utils/errors';
import { can } from '@/utils/permissions';
import { DEFAULT_PAGE_SIZE } from '@/types/common';
import type { Farm } from '@/types/farm';

export function FarmsTable() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [farmToDeactivate, setFarmToDeactivate] = useState<Farm | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const canManage = can('FARMS_MANAGE');

  async function loadFarms() {
    setIsLoading(true);
    setError(null);
    try {
      const result = await listFarms({ page, pageSize: DEFAULT_PAGE_SIZE, search });
      setFarms(result.items);
      setTotal(result.total);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadFarms();
  }, [page, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  async function handleDeactivate() {
    if (!farmToDeactivate) return;
    setIsDeactivating(true);
    try {
      await deactivateFarm(farmToDeactivate.id);
      toast.success(`Finca ${farmToDeactivate.name} desactivada`);
      setFarmToDeactivate(null);
      loadFarms();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsDeactivating(false);
    }
  }

  const columns: DataTableColumn<Farm>[] = [
    { key: 'code', header: 'Código', render: (row) => <span className="font-medium">{row.code}</span>, sortable: true, sortValue: (row) => row.code },
    { key: 'name', header: 'Finca', render: (row) => row.name, sortable: true, sortValue: (row) => row.name },
    { key: 'city', header: 'Ciudad', render: (row) => `${row.city}, ${row.province}` },
    { key: 'contactName', header: 'Contacto', render: (row) => row.contactName },
    {
      key: 'rating',
      header: 'Calificación',
      render: (row) => {
        const meta = FARM_RATING_MAP[row.rating];
        return <StatusBadge label={meta.label} tone={meta.tone} />;
      },
    },
    { key: 'profitMargin', header: 'Margen', render: (row) => formatPercentage(row.profitMargin), sortable: true, sortValue: (row) => row.profitMargin },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => {
        const meta = RECORD_STATUS_MAP[row.status];
        return <StatusBadge label={meta.label} tone={meta.tone} />;
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={farms}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        error={error ?? undefined}
        onRetry={loadFarms}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por código, nombre, ciudad..."
        emptyTitle="No hay fincas registradas"
        emptyDescription="Registra una nueva finca proveedora para comenzar."
        toolbarExtra={
          canManage && (
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => (window.location.href = '/farms/new')}>
              Nueva finca
            </Button>
          )
        }
        actions={(row) => (
          <div className="flex justify-end gap-1">
            <button
              type="button"
              onClick={() => (window.location.href = `/farms/${row.id}`)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/30"
              aria-label={`Ver ${row.name}`}
            >
              <Eye className="h-4 w-4" />
            </button>
            {canManage && (
              <>
                <button
                  type="button"
                  onClick={() => (window.location.href = `/farms/${row.id}/edit`)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/30"
                  aria-label={`Editar ${row.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                {row.status === 'ACTIVE' && (
                  <button
                    type="button"
                    onClick={() => setFarmToDeactivate(row)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                    aria-label={`Desactivar ${row.name}`}
                  >
                    <Power className="h-4 w-4" />
                  </button>
                )}
              </>
            )}
          </div>
        )}
      />
      <div className="card mt-0 rounded-t-none">
        <Pagination page={page} pageSize={DEFAULT_PAGE_SIZE} total={total} onPageChange={setPage} />
      </div>

      <ConfirmDialog
        isOpen={Boolean(farmToDeactivate)}
        onClose={() => setFarmToDeactivate(null)}
        onConfirm={handleDeactivate}
        title="Desactivar finca"
        description={`¿Confirmas que deseas desactivar la finca "${farmToDeactivate?.name}"? Podrás reactivarla más tarde editando el registro.`}
        confirmLabel="Desactivar"
        isLoading={isDeactivating}
      />
    </>
  );
}
