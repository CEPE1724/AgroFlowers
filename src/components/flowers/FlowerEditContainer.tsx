import { useEffect, useState } from 'react';
import { getFlowerById } from '@/services/flowerService';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorState } from '@/components/common/ErrorState';
import { getErrorMessage } from '@/utils/errors';
import { FlowerForm } from './FlowerForm';
import type { Flower } from '@/types/flower';

interface Props {
  flowerId: number;
}

export function FlowerEditContainer({ flowerId }: Props) {
  const [flower, setFlower] = useState<Flower | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      setFlower(await getFlowerById(flowerId));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [flowerId]);

  if (isLoading) return <LoadingSpinner label="Cargando variedad..." />;
  if (error || !flower) return <ErrorState description={error ?? 'Variedad no encontrada'} onRetry={load} />;

  return <FlowerForm flower={flower} />;
}
