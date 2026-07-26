import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'No se pudo cargar la información',
  description = 'Ocurrió un problema al consultar los datos. Intenta nuevamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/30 dark:text-red-400">
        <AlertCircle className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-primary-900 dark:text-primary-100">{title}</p>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-primary-400">{description}</p>
      </div>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
