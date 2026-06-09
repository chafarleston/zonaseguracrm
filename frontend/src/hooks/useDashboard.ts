import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/services/api';

const DASHBOARD_KEY = ['dashboard'];

export function useDashboard(userId?: string) {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [DASHBOARD_KEY, userId],
    queryFn: () => dashboardApi.getData(userId),
  });

  return {
    data,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
    metrics: data?.metrics,
    upcomingAppointments: data?.upcomingAppointments ?? [],
    pendingTasks: data?.pendingTasks ?? [],
    pipelineSummary: data?.pipelineSummary ?? [],
    monthlyDeals: data?.monthlyDeals ?? [],
  };
}
