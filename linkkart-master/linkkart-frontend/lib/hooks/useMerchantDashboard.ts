import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export const useMerchantDashboard = () => {
  return useQuery({
    queryKey: ['merchant', 'dashboard', 'summary'],
    queryFn: async () => {
      return await api.get('/api/dashboard/merchant/summary');
    },
  });
};

export const useMerchantRevenueChart = () => {
  return useQuery({
    queryKey: ['merchant', 'dashboard', 'revenue'],
    queryFn: async () => {
      return await api.get('/api/dashboard/merchant/revenue');
    },
  });
};
