import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export interface AffiliateCommissionResponse {
  id: number;
  conversionId: number;
  amount: number;
  status: string;
  clearsAt: string;
  createdAt: string;
}

export interface CommissionSummaryResponse {
  totalEarnings: number;
  pendingEarnings: number;
  approvedEarnings: number;
  reversedEarnings: number;
}

export function useMyCommissions() {
  return useQuery({
    queryKey: ['myCommissions'],
    queryFn: async () => {
      const response = await api.get('/api/commissions/my');
      return response.data;
    },
  });
}

export function useCommissionSummary() {
  return useQuery({
    queryKey: ['myCommissionSummary'],
    queryFn: async () => {
      const response = await api.get('/api/commissions/my/summary');
      return response.data;
    },
  });
}
