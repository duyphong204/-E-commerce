import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from './getAdminStats';
import { TimeRange } from '../types/admin-dashboard.types';

export function useAdminStats(timeRange: TimeRange) {
  return useQuery({
    queryKey: ['admin-stats', timeRange],
    queryFn: ({ signal }) => getAdminStats(timeRange, signal),
  });
}
