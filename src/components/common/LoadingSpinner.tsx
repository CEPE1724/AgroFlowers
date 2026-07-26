import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
};

export function LoadingSpinner({ label, size = 'md', fullScreen }: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 text-primary-600 dark:text-primary-300">
      <Loader2 className={clsx('animate-spin', sizeMap[size])} />
      {label && <p className="text-sm font-medium">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center" role="status" aria-live="polite">
        {content}
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite" className="flex w-full items-center justify-center py-8">
      {content}
    </div>
  );
}
