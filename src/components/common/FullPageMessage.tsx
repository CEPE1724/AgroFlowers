import type { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface FullPageMessageProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  tone?: 'neutral' | 'danger';
}

export function FullPageMessage({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  tone = 'neutral',
}: FullPageMessageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-light px-4 text-center dark:bg-surface-dark">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
          tone === 'danger'
            ? 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400'
            : 'bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300'
        }`}
      >
        <Icon className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-50">{title}</h1>
      <p className="max-w-sm text-sm text-gray-500 dark:text-primary-400">{description}</p>
      {actionLabel && actionHref && (
        <Button onClick={() => (window.location.href = actionHref)}>{actionLabel}</Button>
      )}
    </div>
  );
}
