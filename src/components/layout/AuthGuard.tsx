import { useEffect, useState } from 'react';
import { authStore } from '@/stores/authStore';
import { isUsingMocks, ensureAuthInitialized, loginWithKeycloak } from '@/services/authService';
import { can, type PERMISSIONS } from '@/utils/permissions';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface AuthGuardProps {
  requiredPermission?: keyof typeof PERMISSIONS;
}

type GuardStatus = 'checking' | 'ok';

export function AuthGuard({ requiredPermission }: AuthGuardProps) {
  const [status, setStatus] = useState<GuardStatus>('checking');

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      await ensureAuthInitialized();
      if (cancelled) return;

      const { isAuthenticated } = authStore.get();

      if (!isAuthenticated) {
        if (isUsingMocks()) {
          const redirectTo = encodeURIComponent(window.location.pathname);
          window.location.replace(`/login?redirect=${redirectTo}`);
        } else {
          loginWithKeycloak(window.location.pathname);
        }
        return;
      }

      if (requiredPermission && !can(requiredPermission)) {
        window.location.replace('/unauthorized');
        return;
      }

      if (!cancelled) setStatus('ok');
    }

    verify();
    return () => {
      cancelled = true;
    };
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
