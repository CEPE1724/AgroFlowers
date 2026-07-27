import { useEffect, useState } from 'react';
import { Pencil, Plane, Package } from 'lucide-react';
import { getShipmentById } from '@/services/shipmentService';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorState } from '@/components/common/ErrorState';
import { SHIPMENT_STATUS_MAP } from '@/utils/statusMaps';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/dates';
import { getErrorMessage } from '@/utils/errors';
import { usePermission } from '@/utils/permissions';
import type { Shipment } from '@/types/shipment';

interface Props {
  shipmentId: number;
}

export function ShipmentDetail({ shipmentId }: Props) {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const canEdit = usePermission('SHIPMENTS_CREATE');

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      setShipment(await getShipmentById(shipmentId));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [shipmentId]);

  if (isLoading) return <LoadingSpinner label="Cargando embarque..." />;
  if (error || !shipment) return <ErrorState description={error ?? 'Embarque no encontrado'} onRetry={load} />;

  const status = SHIPMENT_STATUS_MAP[shipment.status];

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-primary-500 dark:text-primary-400">
              {formatDate(shipment.shipmentDate)}
            </p>
            <h2 className="text-xl font-bold text-primary-900 dark:text-primary-50">{shipment.shipmentNumber}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500 dark:text-primary-400">
              <Plane className="h-4 w-4" /> {shipment.origin} → {shipment.destination} · {shipment.airline} {shipment.flightNumber}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge label={status.label} tone={status.tone} />
            {canEdit && (
              <Button leftIcon={<Pencil className="h-4 w-4" />} onClick={() => (window.location.href = `/shipments/${shipment.id}/edit`)}>
                Editar
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card space-y-2 p-5">
          <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-50">Logística</h3>
          <p className="text-sm text-gray-600 dark:text-primary-300">Finca: {shipment.farmName}</p>
          <p className="text-sm text-gray-600 dark:text-primary-300">Carguera: {shipment.freightCompany}</p>
          <p className="text-sm text-gray-600 dark:text-primary-300">Guía aérea: {shipment.airWaybill}</p>
          <p className="text-sm text-gray-600 dark:text-primary-300">Cliente: {shipment.customer}</p>
        </div>

        <div className="card space-y-2 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-primary-900 dark:text-primary-50">
            <Package className="h-4 w-4" /> Peso y cajas
          </h3>
          <p className="text-sm text-gray-600 dark:text-primary-300">{shipment.boxes} cajas</p>
          <p className="text-sm text-gray-600 dark:text-primary-300">Peso real: {shipment.actualWeight} kg</p>
          <p className="text-sm text-gray-600 dark:text-primary-300">Peso volumétrico: {shipment.volumetricWeight} kg</p>
          <p className="text-sm font-medium text-primary-800 dark:text-primary-100">Peso facturable: {shipment.billableWeight} kg</p>
        </div>

        <div className="card space-y-2 p-5">
          <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-50">Flete</h3>
          <p className="text-sm text-gray-600 dark:text-primary-300">Tarifa: {formatCurrency(shipment.ratePerKg)} / kg</p>
          <p className="text-2xl font-bold text-primary-700 dark:text-primary-200">{formatCurrency(shipment.estimatedFreight)}</p>
          <p className="text-xs text-gray-500 dark:text-primary-400">Flete estimado total</p>
        </div>
      </div>
    </div>
  );
}
