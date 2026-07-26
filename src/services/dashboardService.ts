import type { DashboardSummary, DashboardChartsData } from '@/types/dashboard';
import { mockDashboardSummary, mockDashboardCharts, mockRecentShipments, type RecentShipmentRow } from '@/mocks/dashboard';
import { simulateNetworkDelay } from '@/utils/mockCollection';
import { apiClient } from './apiClient';

const USE_MOCKS = import.meta.env.PUBLIC_USE_MOCKS !== 'false';

export async function getDashboardSummary(): Promise<DashboardSummary> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    return mockDashboardSummary;
  }
  const { data } = await apiClient.get<DashboardSummary>('/dashboard/summary');
  return data;
}

export async function getDashboardCharts(): Promise<DashboardChartsData> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    return mockDashboardCharts;
  }
  const { data } = await apiClient.get<DashboardChartsData>('/dashboard/charts');
  return data;
}

export async function getRecentShipments(): Promise<RecentShipmentRow[]> {
  if (USE_MOCKS) {
    await simulateNetworkDelay();
    return mockRecentShipments;
  }
  const { data } = await apiClient.get<RecentShipmentRow[]>('/dashboard/recent-shipments');
  return data;
}
