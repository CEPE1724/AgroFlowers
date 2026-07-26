import { useEffect, useState } from 'react';
import { getSaleById } from '@/services/saleService';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorState } from '@/components/common/ErrorState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PAYMENT_STATUS_MAP } from '@/utils/statusMaps';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/dates';
import { getErrorMessage } from '@/utils/errors';
import type { Sale } from '@/types/sale';

interface Props {
  saleId: number;
}

export function SaleDetailView({ saleId }: Props) {
  const [sale, setSale] = useState<Sale | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      setSale(await getSaleById(saleId));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [saleId]);

  if (isLoading) return <LoadingSpinner label="Cargando venta..." />;
  if (error || !sale) return <ErrorState description={error ?? 'Venta no encontrada'} onRetry={load} />;

  const status = PAYMENT_STATUS_MAP[sale.paymentStatus];

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-primary-500 dark:text-primary-400">
              {formatDate(sale.saleDate)}
            </p>
            <h2 className="text-xl font-bold text-primary-900 dark:text-primary-50">{sale.saleNumber}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-primary-400">
              Embarque {sale.shipmentNumber} · Cliente: {sale.customer}
            </p>
          </div>
          <div className="text-right">
            <StatusBadge label={status.label} tone={status.tone} />
            <p className="mt-2 text-2xl font-bold text-primary-900 dark:text-primary-50">{formatCurrency(sale.totalSale)}</p>
          </div>
        </div>
        {sale.observation && (
          <p className="mt-3 rounded-lg bg-primary-50/60 p-3 text-sm text-gray-600 dark:bg-primary-900/20 dark:text-primary-300">
            {sale.observation}
          </p>
        )}
      </div>

      {sale.details && sale.details.length > 0 && (
        <div className="card overflow-hidden">
          <div className="border-b border-primary-100 p-4 dark:border-primary-900/40">
            <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-50">Productos vendidos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-primary-50/60 text-xs uppercase tracking-wide text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Producto</th>
                  <th className="px-4 py-3 font-semibold">Cantidad</th>
                  <th className="px-4 py-3 font-semibold">Precio unitario</th>
                  <th className="px-4 py-3 text-right font-semibold">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-50 dark:divide-primary-900/30">
                {sale.details.map((detail) => (
                  <tr key={detail.productId}>
                    <td className="px-4 py-3 text-gray-700 dark:text-primary-200">{detail.productName}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-primary-200">{detail.quantity}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-primary-200">{formatCurrency(detail.unitPrice)}</td>
                    <td className="px-4 py-3 text-right font-medium text-primary-800 dark:text-primary-100">
                      {formatCurrency(detail.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
