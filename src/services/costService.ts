import type { Cost, CostFormValues } from '@/types/cost';
import type { PaginatedResult, TableQuery } from '@/types/common';
import { mockCosts } from '@/mocks/costs';
import { mockShipments } from '@/mocks/shipments';
import { createMockCollection, simulateNetworkDelay } from '@/utils/mockCollection';
import { round2 } from '@/utils/currency';
import { apiClient } from './apiClient';

const USE_MOCKS = import.meta.env.PUBLIC_USE_MOCKS !== 'false';
const collection = createMockCollection<Cost>(mockCosts);

export function computeCostTotals(values: CostFormValues) {
  const packing = round2(values.boxes * values.costPerBox);
  const labels = round2(values.boxes * values.costPerLabel);
  const taxes = round2((values.taxBase * values.taxPercentage) / 100);
  const totalCost = round2(
    values.flowerCost +
      values.airFreight +
      packing +
      labels +
      taxes +
      values.groundTransport +
      values.insurance +
      values.handling +
      values.otherCosts
  );
  return { packing, labels, taxes, totalCost };
}

export async function listCosts(query: TableQuery = {}): Promise<PaginatedResult<Cost>> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    return collection.list(query, ['shipmentNumber']);
  }
  const { data } = await apiClient.get<PaginatedResult<Cost>>('/costs', { params: query });
  return data;
}

export async function getCostByShipmentId(shipmentId: number): Promise<Cost | undefined> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    return collection.all().find((item) => item.shipmentId === shipmentId);
  }
  const { data } = await apiClient.get<Cost>(`/costs/shipment/${shipmentId}`);
  return data;
}

export async function createCost(values: CostFormValues): Promise<Cost> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    const shipment = mockShipments.find((item) => item.id === values.shipmentId);
    const { packing, labels, taxes, totalCost } = computeCostTotals(values);
    return collection.create({
      shipmentId: values.shipmentId,
      shipmentNumber: shipment?.shipmentNumber ?? 'EMB-000000',
      flowerCost: values.flowerCost,
      airFreight: values.airFreight,
      boxes: values.boxes,
      costPerBox: values.costPerBox,
      packing,
      costPerLabel: values.costPerLabel,
      labels,
      taxBase: values.taxBase,
      taxPercentage: values.taxPercentage,
      taxes,
      groundTransport: values.groundTransport,
      insurance: values.insurance,
      handling: values.handling,
      otherCosts: values.otherCosts,
      otherCostsDescription: values.otherCostsDescription,
      totalCost,
    });
  }
  const { data } = await apiClient.post<Cost>('/costs', values);
  return data;
}

export async function listAllCosts(): Promise<Cost[]> {
  if (USE_MOCKS) {
    await simulateNetworkDelay(150);
    return collection.all();
  }
  const { data } = await apiClient.get<Cost[]>('/costs/all');
  return data;
}
