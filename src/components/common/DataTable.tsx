import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import clsx from 'clsx';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  actions?: (row: T) => ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  toolbarExtra?: ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading,
  error,
  onRetry,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  actions,
  emptyTitle,
  emptyDescription,
  toolbarExtra,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const column = columns.find((col) => col.key === sortKey);
    if (!column?.sortValue) return data;

    return [...data].sort((a, b) => {
      const valueA = column.sortValue!(a);
      const valueB = column.sortValue!(b);
      const comparison = typeof valueA === 'number' && typeof valueB === 'number' ? valueA - valueB : String(valueA).localeCompare(String(valueB));
      return sortDir === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortDir, columns]);

  function toggleSort(column: DataTableColumn<T>) {
    if (!column.sortable) return;
    if (sortKey !== column.key) {
      setSortKey(column.key);
      setSortDir('asc');
    } else {
      setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    }
  }

  return (
    <div className="card overflow-hidden">
      {(onSearchChange || toolbarExtra) && (
        <div className="flex flex-col gap-3 border-b border-primary-100 p-4 dark:border-primary-900/40 sm:flex-row sm:items-center sm:justify-between">
          {onSearchChange && (
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={searchPlaceholder}
                className="input-base pl-9"
                aria-label="Buscar en la tabla"
              />
            </div>
          )}
          {toolbarExtra}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-primary-50/60 text-xs uppercase tracking-wide text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={clsx('px-4 py-3 font-semibold', column.className)}>
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(column)}
                      className="inline-flex items-center gap-1 hover:text-primary-800 dark:hover:text-primary-100"
                    >
                      {column.header}
                      {sortKey === column.key ? (
                        sortDir === 'asc' ? (
                          <ArrowUp className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-right font-semibold">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-50 dark:divide-primary-900/30">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)}>
                  <LoadingSpinner label="Cargando registros..." />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)}>
                  <ErrorState description={error} onRetry={onRetry} />
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)}>
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              sortedData.map((row) => (
                <tr key={keyExtractor(row)} className="transition-colors hover:bg-primary-50/40 dark:hover:bg-primary-900/20">
                  {columns.map((column) => (
                    <td key={column.key} className={clsx('px-4 py-3 text-gray-700 dark:text-primary-200', column.className)}>
                      {column.render(row)}
                    </td>
                  ))}
                  {actions && <td className="px-4 py-3 text-right">{actions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
