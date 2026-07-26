import { useEffect, useState } from 'react';
import { getShipmentById } from '@/services/shipmentService';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorState } from '@/components/common/ErrorState';
import { getErrorMessage } from '@/utils/errors';
import { ShipmentForm } from './ShipmentForm';
import type { Shipment } from '@/types/shipment';

interface Props {
  shipmentId: number;
}

export function ShipmentEditContainer({ shipmentId }: Props) {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return <ShipmentForm shipment={shipment} />;
}
