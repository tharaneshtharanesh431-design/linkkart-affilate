import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      return await api.dashboard.summary();
    },
  });
};

export const useDashboardActivity = () => {
  return useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: async () => {
      return await api.dashboard.activity();
    },
  });
};

export const useDashboardMonthly = () => {
  return useQuery({
    queryKey: ['dashboard', 'monthly'],
    queryFn: async () => {
      return await api.dashboard.monthly();
    },
  });
};
