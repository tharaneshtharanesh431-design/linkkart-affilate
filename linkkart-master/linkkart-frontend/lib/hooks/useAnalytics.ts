import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface AnalyticsParams {
  range?: string;
  startDate?: string;
  endDate?: string;
}

export function useAffiliateAnalytics(params?: AnalyticsParams) {
  return useQuery({
    queryKey: ['analytics', 'affiliate', params],
    queryFn: () => api.analytics.affiliate(params),
  });
}

export function useMerchantAnalytics(params?: AnalyticsParams) {
  return useQuery({
    queryKey: ['analytics', 'merchant', params],
    queryFn: () => api.analytics.merchant(params),
  });
}

export function useAdminAnalytics(params?: AnalyticsParams) {
  return useQuery({
    queryKey: ['analytics', 'admin', params],
    queryFn: () => api.analytics.admin(params),
  });
}
