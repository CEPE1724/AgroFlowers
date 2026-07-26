import type { Shipment, ShipmentFormValues } from '@/types/shipment';
import type { PaginatedResult, TableQuery } from '@/types/common';
import { mockShipments } from '@/mocks/shipments';
import { createMockCollection, simulateNetworkDelay } from '@/utils/mockCollection';
import { round2 } from '@/utils/currency';
import { apiClient } from './apiClient';

const USE_MOCKS = import.meta.env.PUBLIC_USE_MOCKS !== 'false';
const collection = createMockCollection<Shipment>(mockShipments);
let shipmentSequence =
  mockShipments.reduce((max, item) => {
    const numeric = Number(item.shipmentNumber.split('-')[1]);
    return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
  }, 0) + 1;

function computeFreight(values: ShipmentFormValues) {
  const billableWeight = Math.max(values.actualWeight, values.volumetricWeight);
  const estimatedFreight = round2(billableWeight * values.ratePerKg);
  return { billableWeight, estimatedFreight };
}

export async function listShipments(query: TableQuery = {}): Promise<PaginatedResult<Shipment>> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    return collection.list(query, ['shipmentNumber', 'customer', 'destination', 'airline']);
  }
  const { data } = await apiClient.get<PaginatedResult<Shipment>>('/shipments', { params: query });
  return data;
}

export async function getShipmentById(id: number): Promise<Shipment> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    const shipment = collection.getById(id);
    if (!shipment) throw new Error('Embarque no encontrado');
    return shipment;
  }
  const { data } = await apiClient.get<Shipment>(`/shipments/${id}`);
  return data;
}

export async function createShipment(values: ShipmentFormValues): Promise<Shipment> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    const { billableWeight, estimatedFreight } = computeFreight(values);
    const shipmentNumber = `EMB-${String(shipmentSequence++).padStart(6, '0')}`;
    return collection.create({ ...values, shipmentNumber, billableWeight, estimatedFreight });
  }
  const { data } = await apiClient.post<Shipment>('/shipments', values);
  return data;
}

export async function updateShipment(id: number, values: ShipmentFormValues): Promise<Shipment> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    const { billableWeight, estimatedFreight } = computeFreight(values);
    return collection.update(id, { ...values, billableWeight, estimatedFreight });
  }
  const { data } = await apiClient.put<Shipment>(`/shipments/${id}`, values);
  return data;
}

export async function listAllShipments(): Promise<Shipment[]> {
  if (USE_MOCKS) {
    await simulateNetworkDelay(150);
    return collection.all();
  }
  const { data } = await apiClient.get<Shipment[]>('/shipments/all');
  return data;
}
