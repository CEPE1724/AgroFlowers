import type { Purchase, PurchaseFormValues, PurchaseDetail } from '@/types/purchase';
import type { PaginatedResult, TableQuery } from '@/types/common';
import { mockPurchases } from '@/mocks/purchases';
import { mockFarms } from '@/mocks/farms';
import { mockFlowers } from '@/mocks/flowers';
import { createMockCollection, simulateNetworkDelay } from '@/utils/mockCollection';
import { round2 } from '@/utils/currency';
import { apiClient } from './apiClient';

const USE_MOCKS = import.meta.env.PUBLIC_USE_MOCKS !== 'false';
const collection = createMockCollection<Purchase>(mockPurchases);
let purchaseSequence = mockPurchases.length + 1;

function buildDetails(values: PurchaseFormValues): { details: PurchaseDetail[]; total: number } {
  const details: PurchaseDetail[] = values.details.map((detail) => {
    const flower = mockFlowers.find((item) => item.id === detail.flowerId);
    const totalStems = detail.quantityBouquets * detail.stemsPerBouquet;
    const subtotal = round2(detail.quantityBouquets * detail.unitPrice);
    return {
      flowerId: detail.flowerId,
      flowerName: flower ? `${flower.flowerType} ${flower.variety} ${flower.stemLength} cm` : 'Variedad',
      quantityBouquets: detail.quantityBouquets,
      stemsPerBouquet: detail.stemsPerBouquet,
      totalStems,
      unitPrice: detail.unitPrice,
      subtotal,
    };
  });
  const total = round2(details.reduce((sum, item) => sum + item.subtotal, 0));
  return { details, total };
}

export async function listPurchases(query: TableQuery = {}): Promise<PaginatedResult<Purchase>> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    return collection.list(query, ['purchaseNumber', 'farmName', 'responsible']);
  }
  const { data } = await apiClient.get<PaginatedResult<Purchase>>('/purchases', { params: query });
  return data;
}

export async function getPurchaseById(id: number): Promise<Purchase> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    const purchase = collection.getById(id);
    if (!purchase) throw new Error('Compra no encontrada');
    return purchase;
  }
  const { data } = await apiClient.get<Purchase>(`/purchases/${id}`);
  return data;
}

export async function createPurchase(values: PurchaseFormValues): Promise<Purchase> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    const farm = mockFarms.find((item) => item.id === values.farmId);
    const { details, total } = buildDetails(values);
    const purchaseNumber = `CMP-${String(purchaseSequence++).padStart(6, '0')}`;
    return collection.create({
      purchaseNumber,
      purchaseDate: values.purchaseDate,
      farmId: values.farmId,
      farmName: farm?.name ?? 'Finca',
      status: 'REGISTERED',
      responsible: values.responsible,
      observation: values.observation,
      total,
      details,
    });
  }
  const { data } = await apiClient.post<Purchase>('/purchases', values);
  return data;
}
