import type { ProfitabilityRecord, ProfitabilityFilters } from '@/types/profitability';
import { mockProfitability } from '@/mocks/profitability';
import { simulateNetworkDelay } from '@/utils/mockCollection';
import { apiClient } from './apiClient';

const USE_MOCKS = import.meta.env.PUBLIC_USE_MOCKS !== 'false';

function applyFilters(records: ProfitabilityRecord[], filters: ProfitabilityFilters): ProfitabilityRecord[] {
  return records.filter((record) => {
    if (filters.dateFrom && record.shipmentDate < filters.dateFrom) return false;
    if (filters.dateTo && record.shipmentDate > filters.dateTo) return false;
    if (filters.farmName && !record.farmName.toLowerCase().includes(filters.farmName.toLowerCase())) return false;
    if (filters.customer && !record.customer.toLowerCase().includes(filters.customer.toLowerCase())) return false;
    if (
      filters.shipmentNumber &&
      !record.shipmentNumber.toLowerCase().includes(filters.shipmentNumber.toLowerCase())
    )
      return false;
    if (filters.classification && record.classification !== filters.classification) return false;
    if (typeof filters.minMargin === 'number' && record.profitMargin < filters.minMargin) return false;
    if (typeof filters.maxMargin === 'number' && record.profitMargin > filters.maxMargin) return false;
    return true;
  });
}

export async function listProfitability(filters: ProfitabilityFilters = {}): Promise<ProfitabilityRecord[]> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    return applyFilters(mockProfitability, filters);
  }
  const { data } = await apiClient.get<ProfitabilityRecord[]>('/profitability', { params: filters });
  return data;
}

export function exportProfitabilityToCsv(records: ProfitabilityRecord[]): string {
  const headers = [
    'Embarque',
    'Fecha',
    'Finca',
    'Cliente',
    'Venta total',
    'Costo total',
    'Utilidad',
    'Margen (%)',
    'Clasificación',
  ];

  const rows = records.map((record) => [
    record.shipmentNumber,
    record.shipmentDate,
    record.farmName,
    record.customer,
    record.totalSale.toFixed(2),
    record.totalCost.toFixed(2),
    record.profit.toFixed(2),
    record.profitMargin.toFixed(2),
    record.classification,
  ]);

  return [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
}

export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([`﻿${content}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
