import type { Flower, FlowerFormValues } from '@/types/flower';
import type { PaginatedResult, TableQuery } from '@/types/common';
import { mockFlowers } from '@/mocks/flowers';
import { createMockCollection, simulateNetworkDelay } from '@/utils/mockCollection';
import { apiClient } from './apiClient';

const USE_MOCKS = import.meta.env.PUBLIC_USE_MOCKS !== 'false';
const collection = createMockCollection<Flower>(mockFlowers);

export async function listFlowers(query: TableQuery = {}): Promise<PaginatedResult<Flower>> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    return collection.list(query, ['code', 'flowerType', 'variety', 'color']);
  }
  const { data } = await apiClient.get<PaginatedResult<Flower>>('/flowers', { params: query });
  return data;
}

export async function getFlowerById(id: number): Promise<Flower> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    const flower = collection.getById(id);
    if (!flower) throw new Error('Variedad no encontrada');
    return flower;
  }
  const { data } = await apiClient.get<Flower>(`/flowers/${id}`);
  return data;
}

function generateMockFlowerCode(values: FlowerFormValues): string {
  const part = (value: string) => value.trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
  const base = `${part(values.flowerType)}-${part(values.variety)}-${values.stemLength}`;

  let code = base;
  let suffix = 1;
  while (collection.all().some((flower) => flower.code === code)) {
    suffix++;
    code = `${base}-${suffix}`;
  }
  return code;
}

export async function createFlower(values: FlowerFormValues): Promise<Flower> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    return collection.create({ ...values, code: generateMockFlowerCode(values) });
  }
  const { data } = await apiClient.post<Flower>('/flowers', values);
  return data;
}

export async function updateFlower(id: number, values: FlowerFormValues): Promise<Flower> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    return collection.update(id, values);
  }
  const { data } = await apiClient.put<Flower>(`/flowers/${id}`, values);
  return data;
}

export async function listAllFlowers(): Promise<Flower[]> {
  if (USE_MOCKS) {
    await simulateNetworkDelay(150);
    return collection.all();
  }
  const { data } = await apiClient.get<Flower[]>('/flowers/all');
  return data;
}
