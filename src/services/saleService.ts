import type { Sale, SaleFormValues } from '@/types/sale';
import type { PaginatedResult, TableQuery } from '@/types/common';
import { mockSales } from '@/mocks/sales';
import { mockShipments } from '@/mocks/shipments';
import { createMockCollection, simulateNetworkDelay } from '@/utils/mockCollection';
import { round2 } from '@/utils/currency';
import { apiClient } from './apiClient';

const USE_MOCKS = import.meta.env.PUBLIC_USE_MOCKS !== 'false';
const collection = createMockCollection<Sale>(mockSales);
let saleSequence =
  mockSales.reduce((max, item) => {
    const numeric = Number(item.saleNumber.split('-')[1]);
    return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
  }, 0) + 1;

export async function listSales(query: TableQuery = {}): Promise<PaginatedResult<Sale>> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    return collection.list(query, ['saleNumber', 'customer', 'shipmentNumber']);
  }
  const { data } = await apiClient.get<PaginatedResult<Sale>>('/sales', { params: query });
  return data;
}

export async function getSaleById(id: number): Promise<Sale> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    const sale = collection.getById(id);
    if (!sale) throw new Error('Venta no encontrada');
    return sale;
  }
  const { data } = await apiClient.get<Sale>(`/sales/${id}`);
  return data;
}

export async function createSale(values: SaleFormValues): Promise<Sale> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    const shipment = mockShipments.find((item) => item.id === values.shipmentId);
    const details = values.details.map((detail) => ({
      ...detail,
      subtotal: round2(detail.quantity * detail.unitPrice),
    }));
    const totalSale = round2(details.reduce((sum, item) => sum + item.subtotal, 0));
    const saleNumber = `VTA-${String(saleSequence++).padStart(6, '0')}`;
    return collection.create({
      saleNumber,
      shipmentId: values.shipmentId,
      shipmentNumber: shipment?.shipmentNumber ?? 'EMB-000000',
      customer: values.customer,
      saleDate: values.saleDate,
      currency: values.currency,
      paymentStatus: values.paymentStatus,
      observation: values.observation,
      totalSale,
      details,
    });
  }
  const { data } = await apiClient.post<Sale>('/sales', values);
  return data;
}

export async function listAllSales(): Promise<Sale[]> {
  if (USE_MOCKS) {
    await simulateNetworkDelay(150);
    return collection.all();
  }
  const { data } = await apiClient.get<Sale[]>('/sales/all');
  return data;
}
