import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: 'primary' | 'accent' | 'neutral' | 'warning';
}

const toneClasses = {
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
  accent: 'bg-accent-100 text-accent-700 dark:bg-accent-500/20 dark:text-accent-300',
  neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
};

export function StatCard({ icon: Icon, label, value, tone = 'primary' }: StatCardProps) {
  return (
    <div className="card flex items-center gap-4 p-4">
      <div className={clsx('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', toneClasses[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-gray-500 dark:text-primary-400">{label}</p>
        <p className="truncate text-lg font-bold text-primary-900 dark:text-primary-50">{value}</p>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return <div className="card h-[76px] animate-pulse p-4" />;
}
