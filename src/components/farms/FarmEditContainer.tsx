import { useEffect, useState } from 'react';
import { getFarmById } from '@/services/farmService';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorState } from '@/components/common/ErrorState';
import { getErrorMessage } from '@/utils/errors';
import { FarmForm } from './FarmForm';
import type { Farm } from '@/types/farm';

interface Props {
  farmId: number;
}

export function FarmEditContainer({ farmId }: Props) {
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

  return <FarmForm farm={farm} />;
}
