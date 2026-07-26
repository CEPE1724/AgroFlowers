import clsx from 'clsx';

export type BadgeTone = 'green' | 'blue' | 'amber' | 'red' | 'gray' | 'violet';

interface StatusBadgeProps {
  label: string;
  tone: BadgeTone;
}

const toneClasses: Record<BadgeTone, string> = {
  green: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  red: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  violet: 'bg-accent-100 text-accent-700 dark:bg-accent-500/20 dark:text-accent-300',
};

export function StatusBadge({ label, tone }: StatusBadgeProps) {
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', toneClasses[tone])}>
      {label}
    </span>
  );
}
