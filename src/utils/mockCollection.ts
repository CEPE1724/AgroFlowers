import type { PaginatedResult, TableQuery } from '@/types/common';
import { DEFAULT_PAGE_SIZE } from '@/types/common';

interface WithId {
  id: number;
}

export function createMockCollection<T extends WithId>(seed: T[]) {
  let data = [...seed];
  let nextId = seed.reduce((max, item) => Math.max(max, item.id), 0) + 1;

  function list(query: TableQuery = {}, searchFields: (keyof T)[] = []): PaginatedResult<T> {
    const { page = 1, pageSize = DEFAULT_PAGE_SIZE, search = '' } = query;

    let filtered = data;
    if (search.trim() && searchFields.length > 0) {
      const term = search.trim().toLowerCase();
      filtered = data.filter((item) =>
        searchFields.some((field) => String(item[field] ?? '').toLowerCase().includes(term))
      );
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return { items, total, page, pageSize };
  }

  function getById(id: number): T | undefined {
    return data.find((item) => item.id === id);
  }

  function create(values: Omit<T, 'id'>): T {
    const item = { ...values, id: nextId++ } as T;
    data = [item, ...data];
    return item;
  }

  function update(id: number, values: Partial<Omit<T, 'id'>>): T {
    const index = data.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error('Registro no encontrado');
    }
    data[index] = { ...data[index], ...values };
    return data[index];
  }

  function remove(id: number): void {
    data = data.filter((item) => item.id !== id);
  }

  function all(): T[] {
    return data;
  }

  return { list, getById, create, update, remove, all };
}

export async function simulateNetworkDelay(ms = 400): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
