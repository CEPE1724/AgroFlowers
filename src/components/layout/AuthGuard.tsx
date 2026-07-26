import { useEffect, useState } from 'react';
import { initAuth, authStore } from '@/stores/authStore';
import { can, type PERMISSIONS } from '@/utils/permissions';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface AuthGuardProps {
  requiredPermission?: keyof typeof PERMISSIONS;
}

type GuardStatus = 'checking' | 'ok';

export function AuthGuard({ requiredPermission }: AuthGuardProps) {
  const [status, setStatus] = useState<GuardStatus>('checking');

  useEffect(() => {
    initAuth();
    const { isAuthenticated } = authStore.get();

    if (!isAuthenticated) {
      const redirectTo = encodeURIComponent(window.location.pathname);
      window.location.replace(`/login?redirect=${redirectTo}`);
      return;
    }

    if (requiredPermission && !can(requiredPermission)) {
      window.location.replace('/unauthorized');
      return;
    }

    setStatus('ok');
  }, [requiredPermission]);

  if (status === 'checking') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-light dark:bg-surface-dark">
        <LoadingSpinner label="Verificando sesión..." size="lg" />
      </div>
    );
  }

  return null;
}
