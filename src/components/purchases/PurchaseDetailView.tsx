import { useEffect, useState } from 'react';
import { getPurchaseById } from '@/services/purchaseService';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorState } from '@/components/common/ErrorState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PURCHASE_STATUS_MAP } from '@/utils/statusMaps';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/dates';
import { getErrorMessage } from '@/utils/errors';
import type { Purchase } from '@/types/purchase';

interface Props {
  purchaseId: number;
}

export function PurchaseDetailView({ purchaseId }: Props) {
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      setPurchase(await getPurchaseById(purchaseId));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [purchaseId]);

  if (isLoading) return <LoadingSpinner label="Cargando compra..." />;
  if (error || !purchase) return <ErrorState description={error ?? 'Compra no encontrada'} onRetry={load} />;

  const status = PURCHASE_STATUS_MAP[purchase.status];

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-primary-500 dark:text-primary-400">
              {formatDate(purchase.purchaseDate)}
            </p>
            <h2 className="text-xl font-bold text-primary-900 dark:text-primary-50">{purchase.purchaseNumber}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-primary-400">
              {purchase.farmName} · Responsable: {purchase.responsible}
            </p>
          </div>
          <div className="text-right">
            <StatusBadge label={status.label} tone={status.tone} />
            <p className="mt-2 text-2xl font-bold text-primary-900 dark:text-primary-50">{formatCurrency(purchase.total)}</p>
          </div>
        </div>
        {purchase.observation && (
          <p className="mt-3 rounded-lg bg-primary-50/60 p-3 text-sm text-gray-600 dark:bg-primary-900/20 dark:text-primary-300">
            {purchase.observation}
          </p>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-primary-100 p-4 dark:border-primary-900/40">
          <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-50">Detalle de flores</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-primary-50/60 text-xs uppercase tracking-wide text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Flor</th>
                <th className="px-4 py-3 font-semibold">Ramos</th>
                <th className="px-4 py-3 font-semibold">Tallos/ramo</th>
                <th className="px-4 py-3 font-semibold">Total tallos</th>
                <th className="px-4 py-3 font-semibold">Precio unitario</th>
                <th className="px-4 py-3 text-right font-semibold">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-50 dark:divide-primary-900/30">
              {purchase.details.map((detail) => (
                <tr key={detail.flowerId}>
                  <td className="px-4 py-3 text-gray-700 dark:text-primary-200">{detail.flowerName}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-primary-200">{detail.quantityBouquets}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-primary-200">{detail.stemsPerBouquet}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-primary-200">{detail.totalStems}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-primary-200">{formatCurrency(detail.unitPrice)}</td>
                  <td className="px-4 py-3 text-right font-medium text-primary-800 dark:text-primary-100">
                    {formatCurrency(detail.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-primary-100 dark:border-primary-900/40">
                <td colSpan={5} className="px-4 py-3 text-right text-sm font-semibold text-primary-900 dark:text-primary-50">
                  Total de la compra
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-primary-900 dark:text-primary-50">
                  {formatCurrency(purchase.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
