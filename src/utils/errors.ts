import axios from 'axios';

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const serverMessage = (error.response?.data as { message?: string } | undefined)?.message;

    if (status === 400) return serverMessage ?? 'Los datos enviados no son válidos.';
    if (status === 401) return 'Tu sesión expiró. Vuelve a iniciar sesión.';
    if (status === 403) return 'No tienes permisos para realizar esta acción.';
    if (status === 404) return 'El recurso solicitado no existe.';
    if (status === 500) return 'Ocurrió un error en el servidor. Intenta más tarde.';
    if (error.code === 'ERR_NETWORK') return 'No se pudo conectar con el servidor. Verifica tu conexión.';

    return serverMessage ?? 'Ocurrió un error inesperado.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocurrió un error inesperado.';
}
