import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { getSession, clearSession } from '@/stores/authStore';
import { ensureAuthInitialized } from '@/services/authService';

export const apiClient = axios.create({
  baseURL: import.meta.env.PUBLIC_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  await ensureAuthInitialized();
  const session = getSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

let isRedirectingToLogin = false;

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url;

    console.error(`[apiClient] ${status ?? 'network'} error calling ${url}`);

    if (status === 401 && !isRedirectingToLogin) {
      isRedirectingToLogin = true;
      clearSession();
      toast.error('Tu sesión expiró. Vuelve a iniciar sesión.');
      if (typeof window !== 'undefined') {
        const redirect = encodeURIComponent(window.location.pathname);
        window.location.href = `/login?redirect=${redirect}`;
      }
    }

    if (status === 403) {
      toast.error('No tienes permisos para realizar esta acción.');
    }

    if (!status) {
      toast.error('No se pudo conectar con el servidor. Verifica tu conexión.');
    }

    return Promise.reject(error);
  }
);
