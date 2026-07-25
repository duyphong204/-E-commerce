import apiClient from '@/shared/api/api-client';
import { AdminDashboardFullStats, TimeRange } from '../types/admin-dashboard.types';

export async function getAdminStats(timeRange: TimeRange, signal?: AbortSignal): Promise<AdminDashboardFullStats> {
  const { data } = await apiClient.get<AdminDashboardFullStats>('/api/admin/stats', {
    params: { timeRange },
    signal,
  });
  return data;
}
