import { useEffect, useState } from 'react';
import { getCostByShipmentId } from '@/services/costService';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { formatCurrency } from '@/utils/currency';
import { getErrorMessage } from '@/utils/errors';
import type { Cost } from '@/types/cost';

interface Props {
  shipmentId: number;
}

interface CostRow {
  label: string;
  value: number;
}

export function CostDetailView({ shipmentId }: Props) {
  const [cost, setCost] = useState<Cost | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      setCost((await getCostByShipmentId(shipmentId)) ?? null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [shipmentId]);

  if (isLoading) return <LoadingSpinner label="Cargando costos..." />;
  if (error) return <ErrorState description={error} onRetry={load} />;
  if (!cost) {
    return (
      <div className="card">
        <EmptyState
          title="Este embarque no tiene costos registrados"
          description="Registra los costos para calcular la rentabilidad del embarque."
        />
      </div>
    );
  }

  const rows: CostRow[] = [
    { label: 'Costo de flor', value: cost.flowerCost },
    { label: 'Flete aéreo', value: cost.airFreight },
    { label: `Empaque (${cost.boxes} cajas × ${formatCurrency(cost.costPerBox)})`, value: cost.packing },
    { label: `Etiquetas (${cost.boxes} × ${formatCurrency(cost.costPerLabel)})`, value: cost.labels },
    { label: `Impuestos (${cost.taxPercentage}% de ${formatCurrency(cost.taxBase)})`, value: cost.taxes },
    { label: 'Transporte terrestre', value: cost.groundTransport },
    { label: 'Seguro', value: cost.insurance },
    { label: 'Manejo de carga', value: cost.handling },
    { label: cost.otherCostsDescription ? `Otros: ${cost.otherCostsDescription}` : 'Otros costos', value: cost.otherCosts },
  ];

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-primary-100 p-5 dark:border-primary-900/40">
        <p className="text-xs font-medium uppercase tracking-wide text-primary-500 dark:text-primary-400">{cost.shipmentNumber}</p>
        <h2 className="text-xl font-bold text-primary-900 dark:text-primary-50">Desglose de costos</h2>
      </div>
      <div className="divide-y divide-primary-50 dark:divide-primary-900/30">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-gray-600 dark:text-primary-300">{row.label}</span>
            <span className="text-sm font-medium text-primary-800 dark:text-primary-100">{formatCurrency(row.value)}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between bg-primary-50/60 px-5 py-4 dark:bg-primary-900/20">
        <span className="text-sm font-semibold text-primary-900 dark:text-primary-50">Costo total del embarque</span>
        <span className="text-xl font-bold text-primary-900 dark:text-primary-50">{formatCurrency(cost.totalCost)}</span>
      </div>
    </div>
  );
}
