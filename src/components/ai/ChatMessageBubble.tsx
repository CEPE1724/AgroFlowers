import { AlertTriangle, Bot, User } from 'lucide-react';
import clsx from 'clsx';
import type { ChatMessage } from '@/types/ai';

interface Props {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={clsx('flex gap-3', isUser && 'flex-row-reverse')}>
      <div
        className={clsx(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser
            ? 'bg-primary-600 text-white'
            : 'bg-accent-100 text-accent-700 dark:bg-accent-500/20 dark:text-accent-300'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={clsx(
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm',
          isUser
            ? 'rounded-tr-sm bg-primary-600 text-white'
            : message.isWarning
              ? 'rounded-tl-sm border border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200'
              : 'rounded-tl-sm border border-primary-100 bg-white text-gray-700 dark:border-primary-900/40 dark:bg-surface-darkCard dark:text-primary-200'
        )}
      >
        {!isUser && message.isWarning && (
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" /> Alerta de rentabilidad
          </p>
        )}
        <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
}
