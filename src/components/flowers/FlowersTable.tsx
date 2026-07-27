import { useEffect, useState } from 'react';
import { Pencil, Plus } from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/common/Button';
import { listFlowers } from '@/services/flowerService';
import { RECORD_STATUS_MAP } from '@/utils/statusMaps';
import { getErrorMessage } from '@/utils/errors';
import { usePermission } from '@/utils/permissions';
import { DEFAULT_PAGE_SIZE } from '@/types/common';
import type { Flower } from '@/types/flower';

export function FlowersTable() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canManage = usePermission('FLOWERS_MANAGE');

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const result = await listFlowers({ page, pageSize: DEFAULT_PAGE_SIZE, search });
      setFlowers(result.items);
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

  const columns: DataTableColumn<Flower>[] = [
    { key: 'code', header: 'Código', render: (row) => <span className="font-medium">{row.code}</span>, sortable: true, sortValue: (r) => r.code },
    { key: 'flowerType', header: 'Tipo', render: (row) => row.flowerType },
    { key: 'variety', header: 'Variedad', render: (row) => row.variety, sortable: true, sortValue: (r) => r.variety },
    { key: 'color', header: 'Color', render: (row) => row.color },
    { key: 'stemLength', header: 'Long. tallo', render: (row) => `${row.stemLength} cm` },
    { key: 'stemsPerBouquet', header: 'Tallos/ramo', render: (row) => row.stemsPerBouquet },
    { key: 'purchaseUnit', header: 'Unidad', render: (row) => row.purchaseUnit },
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
        data={flowers}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        error={error ?? undefined}
        onRetry={load}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por código, tipo, variedad..."
        emptyTitle="No hay variedades registradas"
        emptyDescription="Registra una nueva variedad de flor para comenzar."
        toolbarExtra={
          canManage && (
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => (window.location.href = '/flowers/new')}>
              Nueva variedad
            </Button>
          )
        }
        actions={
          canManage
            ? (row) => (
                <button
                  type="button"
                  onClick={() => (window.location.href = `/flowers/${row.id}/edit`)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/30"
                  aria-label={`Editar ${row.variety}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )
            : undefined
        }
      />
      <div className="card mt-0 rounded-t-none">
        <Pagination page={page} pageSize={DEFAULT_PAGE_SIZE} total={total} onPageChange={setPage} />
      </div>
    </>
  );
}
