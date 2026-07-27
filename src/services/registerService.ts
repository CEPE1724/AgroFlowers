import type { RegisterSchemaValues } from '@/schemas/registerSchema';
import { simulateNetworkDelay } from '@/utils/mockCollection';
import { apiClient } from './apiClient';

const USE_MOCKS = import.meta.env.PUBLIC_USE_MOCKS !== 'false';

export async function registerUser(values: RegisterSchemaValues): Promise<void> {
  const { confirmPassword: _confirmPassword, ...payload } = values;

  if (USE_MOCKS) {
    await simulateNetworkDelay();
    return;
  }
  await apiClient.post('/auth/register', payload);
}
