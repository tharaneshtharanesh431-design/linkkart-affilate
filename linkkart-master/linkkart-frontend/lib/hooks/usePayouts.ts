import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

export interface PayoutResponse {
  id: number;
  amount: number;
  status: string;
  requestedAt: string;
  processedAt?: string;
  failureReason?: string;
  rejectionReason?: string;
}

export interface AdminPayoutResponse extends PayoutResponse {
  affiliateId: number;
  affiliateEmail: string;
  paymentEmail: string;
}

export interface AffiliateBalanceResponse {
  approvedEarnings: number;
  pendingEarnings: number;
  paidAmount: number;
  requestedAmount: number;
  processingAmount: number;
  availableBalance: number;
  minimumPayout: number;
}

export function useMyBalance() {
  return useQuery({
    queryKey: ['myBalance'],
    queryFn: async () => {
      return await api.payouts.balance();
    },
  });
}

export function useMyPayouts() {
  return useQuery({
    queryKey: ['myPayouts'],
    queryFn: async () => {
      return await api.payouts.list();
    },
  });
}

export function useRequestPayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ amount, paymentMethodId }: { amount: number; paymentMethodId: number }) => {
      return await api.payouts.request({ amount, paymentMethodId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBalance'] });
      queryClient.invalidateQueries({ queryKey: ['myPayouts'] });
    },
  });
}

export function useAdminPayouts() {
  return useQuery({
    queryKey: ['adminPayouts'],
    queryFn: async () => {
      const response = await api.get('/api/admin/payouts');
      return response.data;
    },
  });
}

export function useProcessPayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/api/admin/payouts/${id}/process`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPayouts'] });
    },
  });
}

export function useMarkPayoutPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/api/admin/payouts/${id}/paid`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPayouts'] });
    },
  });
}

export function useRejectPayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      const response = await api.post(`/api/admin/payouts/${id}/reject`, { reason });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPayouts'] });
    },
  });
}

export function useFailPayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      const response = await api.post(`/api/admin/payouts/${id}/fail`, { reason });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPayouts'] });
    },
  });
}
