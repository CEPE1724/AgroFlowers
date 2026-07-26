import { useEffect, useState } from 'react';
import { initAuth, authStore, setSession } from '@/stores/authStore';
import { isUsingMocks, initKeycloakSession, loginWithKeycloak } from '@/services/authService';
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
      if (isUsingMocks()) {
        initAuth();
        if (!authStore.get().isAuthenticated) {
          const redirectTo = encodeURIComponent(window.location.pathname);
          window.location.replace(`/login?redirect=${redirectTo}`);
          return;
        }
      } else {
        try {
          const session = await initKeycloakSession();
          if (cancelled) return;

          if (!session) {
            loginWithKeycloak(window.location.pathname);
            return;
          }
          setSession(session);
        } catch {
          loginWithKeycloak(window.location.pathname);
          return;
        }
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
