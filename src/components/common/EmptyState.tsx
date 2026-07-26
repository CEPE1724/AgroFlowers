import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Inbox,
  title = 'Sin registros',
  description = 'Aún no hay información para mostrar aquí.',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-400 dark:bg-primary-900/30 dark:text-primary-500">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-primary-900 dark:text-primary-100">{title}</p>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-primary-400">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button size="sm" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
