import { useStore } from '@nanostores/react';
import { User, Mail, ShieldCheck, Clock } from 'lucide-react';
import { authStore } from '@/stores/authStore';
import { ROLE_LABELS, ROLE_BADGE_CLASSES } from '@/utils/roleLabels';
import { formatDateTime } from '@/utils/dates';

export function ProfileCard() {
  const { session, isLoading } = useStore(authStore);

  if (isLoading) {
    return <div className="card h-48 w-full max-w-lg animate-pulse" />;
  }

  if (!session) {
    return null;
  }

  const { user, expiresAt } = session;

  return (
    <div className="card max-w-lg p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-100">
          <User className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-50">{user.name}</h2>
          <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_BADGE_CLASSES[user.role]}`}>
            {ROLE_LABELS[user.role]}
          </span>
        </div>
      </div>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-primary-300">
          <Mail className="h-4 w-4 text-primary-500" />
          <dt className="sr-only">Correo</dt>
          <dd>{user.email}</dd>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-primary-300">
          <ShieldCheck className="h-4 w-4 text-primary-500" />
          <dt className="sr-only">Rol</dt>
          <dd>Rol asignado en Keycloak: {ROLE_LABELS[user.role]}</dd>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-primary-300">
          <Clock className="h-4 w-4 text-primary-500" />
          <dt className="sr-only">Sesión expira</dt>
          <dd>Sesión activa hasta {formatDateTime(new Date(expiresAt))}</dd>
        </div>
      </dl>
    </div>
  );
}
