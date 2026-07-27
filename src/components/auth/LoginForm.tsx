import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ShieldCheck, KeyRound } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import {
  loginWithMock,
  demoAccounts,
  InvalidCredentialsError,
  isUsingMocks,
  ensureAuthInitialized,
  loginWithKeycloak,
} from '@/services/authService';
import { setSession, authStore } from '@/stores/authStore';
import { ROLE_LABELS } from '@/utils/roleLabels';

const loginSchema = z.object({
  email: z.string().min(1, 'El correo es obligatorio').email('Ingresa un correo válido'),
  password: z.string().min(1, 'La contraseña es obligatoria').min(4, 'Mínimo 4 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function getRedirectTarget(): string {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect');
  return redirect && redirect.startsWith('/') ? redirect : '/dashboard';
}

export function LoginForm() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [isRedirectingToKeycloak, setIsRedirectingToKeycloak] = useState(false);
  const usingMocks = isUsingMocks();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    async function checkExistingSession() {
      await ensureAuthInitialized();
      if (authStore.get().isAuthenticated) {
        window.location.replace(getRedirectTarget());
        return;
      }
      setCheckingSession(false);
    }

    checkExistingSession();
  }, [usingMocks]);

  async function onSubmit(values: LoginFormValues) {
    try {
      const session = await loginWithMock(values.email, values.password);
      setSession(session);
      toast.success(`Bienvenido, ${session.user.name}`);
      window.location.href = getRedirectTarget();
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        toast.error(error.message);
      } else {
        toast.error('No se pudo iniciar sesión. Intenta nuevamente.');
      }
    }
  }

  function fillDemoAccount(email: string) {
    setValue('email', email, { shouldValidate: true });
    setValue('password', '123456', { shouldValidate: true });
  }

  function handleKeycloakLogin() {
    setIsRedirectingToKeycloak(true);
    loginWithKeycloak(getRedirectTarget());
  }

  if (checkingSession) {
    return <div className="h-[420px] w-full max-w-md animate-pulse rounded-2xl bg-primary-50 dark:bg-primary-900/20" />;
  }

  if (!usingMocks) {
    return (
      <div className="w-full max-w-md">
        <div className="card space-y-4 p-6 text-center sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
            <KeyRound className="h-6 w-6" />
          </div>
          <p className="text-sm text-gray-500 dark:text-primary-400">
            Serás redirigido a la página de inicio de sesión de Keycloak para autenticarte de forma segura.
          </p>
          <Button fullWidth size="lg" isLoading={isRedirectingToKeycloak} onClick={handleKeycloakLogin}>
            Iniciar sesión con Keycloak
          </Button>
          <p className="flex items-start gap-1.5 text-left text-xs text-gray-500 dark:text-primary-400/80">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Tus credenciales nunca son procesadas por esta aplicación; la autenticación ocurre íntegramente en el
            servidor de Keycloak mediante OAuth2 / OIDC (Authorization Code + PKCE).
          </p>
          <p className="text-xs text-gray-500 dark:text-primary-400/80">
            ¿No tienes cuenta?{' '}
            <a href="/register" className="font-medium text-primary-700 hover:underline dark:text-primary-300">
              Regístrate
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-4 p-6 sm:p-8">
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="nombre@agroflowers.com"
          required
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          required
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" fullWidth isLoading={isSubmitting} size="lg">
          Iniciar sesión con Keycloak
        </Button>

        <p className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-primary-400/80">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Modo demostración: la autenticación real se delega a Keycloak (OAuth2 / JWT) al conectar con los
          microservicios.
        </p>
        <p className="text-center text-xs text-gray-500 dark:text-primary-400/80">
          ¿No tienes cuenta?{' '}
          <a href="/register" className="font-medium text-primary-700 hover:underline dark:text-primary-300">
            Regístrate
          </a>
        </p>
      </form>

      <div className="mt-4 rounded-xl border border-dashed border-primary-300 p-4 dark:border-primary-800">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-300">
          Cuentas de prueba (entorno local)
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {demoAccounts.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => fillDemoAccount(account.email)}
              className="rounded-lg border border-primary-200 bg-white px-2 py-2 text-left text-[11px] transition-colors hover:border-primary-400 hover:bg-primary-50 dark:border-primary-800 dark:bg-surface-darkCard dark:hover:bg-primary-900/30"
            >
              <span className="block font-semibold text-primary-800 dark:text-primary-100">
                {ROLE_LABELS[account.role]}
              </span>
              <span className="block truncate text-gray-500 dark:text-primary-400">{account.email}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
