import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-50">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 dark:text-primary-400">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function ChartCardSkeleton() {
  return <div className="card h-[340px] animate-pulse p-5" />;
}
