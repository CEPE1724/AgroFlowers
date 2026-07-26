import { useEffect, useState } from 'react';
import { Pencil, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import { getFarmById } from '@/services/farmService';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorState } from '@/components/common/ErrorState';
import { FARM_RATING_MAP, RECORD_STATUS_MAP } from '@/utils/statusMaps';
import { formatPercentage } from '@/utils/currency';
import { getErrorMessage } from '@/utils/errors';
import { can } from '@/utils/permissions';
import type { Farm } from '@/types/farm';

interface Props {
  farmId: number;
}

export function FarmDetail({ farmId }: Props) {
  const [farm, setFarm] = useState<Farm | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      setFarm(await getFarmById(farmId));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [farmId]);

  if (isLoading) return <LoadingSpinner label="Cargando finca..." />;
  if (error || !farm) return <ErrorState description={error ?? 'Finca no encontrada'} onRetry={load} />;

  const rating = FARM_RATING_MAP[farm.rating];
  const status = RECORD_STATUS_MAP[farm.status];

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-primary-500 dark:text-primary-400">{farm.code}</p>
            <h2 className="text-xl font-bold text-primary-900 dark:text-primary-50">{farm.name}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusBadge label={rating.label} tone={rating.tone} />
              <StatusBadge label={status.label} tone={status.tone} />
            </div>
          </div>
          {can('FARMS_MANAGE') && (
            <Button leftIcon={<Pencil className="h-4 w-4" />} onClick={() => (window.location.href = `/farms/${farm.id}/edit`)}>
              Editar finca
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card space-y-3 p-5">
          <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-50">Contacto</h3>
          <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-primary-300">
            <span className="font-medium text-primary-800 dark:text-primary-100">{farm.contactName}</span>
          </p>
          <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-primary-300">
            <Mail className="h-4 w-4 text-primary-500" /> {farm.email}
          </p>
          <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-primary-300">
            <Phone className="h-4 w-4 text-primary-500" /> {farm.phone}
          </p>
        </div>

        <div className="card space-y-3 p-5">
          <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-50">Ubicación</h3>
          <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-primary-300">
            <MapPin className="h-4 w-4 text-primary-500" /> {farm.city}, {farm.province}
          </p>
          {farm.address && <p className="text-sm text-gray-600 dark:text-primary-300">{farm.address}</p>}
        </div>

        <div className="card space-y-3 p-5">
          <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-50">Condiciones comerciales</h3>
          <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-primary-300">
            <CreditCard className="h-4 w-4 text-primary-500" /> {farm.creditDays} días de crédito
          </p>
          <p className="text-sm text-gray-600 dark:text-primary-300">
            RUC: <span className="font-mono">{farm.ruc}</span>
          </p>
        </div>

        <div className="card space-y-3 p-5">
          <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-50">Desempeño</h3>
          <p className="text-2xl font-bold text-primary-700 dark:text-primary-200">{formatPercentage(farm.profitMargin)}</p>
          <p className="text-xs text-gray-500 dark:text-primary-400">Margen de utilidad promedio histórico</p>
        </div>
      </div>

      {farm.observation && (
        <div className="card p-5">
          <h3 className="mb-2 text-sm font-semibold text-primary-900 dark:text-primary-50">Observación</h3>
          <p className="text-sm text-gray-600 dark:text-primary-300">{farm.observation}</p>
        </div>
      )}
    </div>
  );
}
