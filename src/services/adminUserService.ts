import type { AdminUserSchemaValues } from '@/schemas/adminUserSchema';
import { simulateNetworkDelay } from '@/utils/mockCollection';
import { apiClient } from './apiClient';

const USE_MOCKS = import.meta.env.PUBLIC_USE_MOCKS !== 'false';

export async function createUserByAdmin(values: AdminUserSchemaValues): Promise<void> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    return;
  }
  await apiClient.post('/admin/users', values);
}
