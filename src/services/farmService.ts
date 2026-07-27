import type { Farm, FarmFormValues } from '@/types/farm';
import type { PaginatedResult, TableQuery } from '@/types/common';
import { mockFarms } from '@/mocks/farms';
import { createMockCollection, simulateNetworkDelay } from '@/utils/mockCollection';
import { apiClient } from './apiClient';

const USE_MOCKS = import.meta.env.PUBLIC_USE_MOCKS !== 'false';
const collection = createMockCollection<Farm>(mockFarms);

export async function listFarms(query: TableQuery = {}): Promise<PaginatedResult<Farm>> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    return collection.list(query, ['code', 'name', 'ruc', 'city', 'contactName']);
  }
  const { data } = await apiClient.get<PaginatedResult<Farm>>('/farms', { params: query });
  return data;
}

export async function getFarmById(id: number): Promise<Farm> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    const farm = collection.getById(id);
    if (!farm) throw new Error('Finca no encontrada');
    return farm;
  }
  const { data } = await apiClient.get<Farm>(`/farms/${id}`);
  return data;
}

function generateMockFarmCode(): string {
  const next = collection.all().length + 1;
  return `FIN-${String(next).padStart(3, '0')}`;
}

export async function createFarm(values: FarmFormValues): Promise<Farm> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    return collection.create({ ...values, code: generateMockFarmCode(), profitMargin: 0 });
  }
  const { data } = await apiClient.post<Farm>('/farms', values);
  return data;
}

export async function updateFarm(id: number, values: FarmFormValues): Promise<Farm> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    return collection.update(id, values);
  }
  const { data } = await apiClient.put<Farm>(`/farms/${id}`, values);
  return data;
}

export async function deactivateFarm(id: number): Promise<void> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    collection.update(id, { status: 'INACTIVE' });
    return;
  }
  await apiClient.patch(`/farms/${id}/deactivate`);
}

export async function listAllFarms(): Promise<Farm[]> {
  if (USE_MOCKS) {
    await simulateNetworkDelay(150);
    return collection.all();
  }
  const { data } = await apiClient.get<Farm[]>('/farms/all');
  return data;
}
