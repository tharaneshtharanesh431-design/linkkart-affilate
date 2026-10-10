import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

export interface PaymentMethodResponse {
  id: number;
  type: string;
  accountHolderName: string;
  maskedIdentifier: string;
  status: string;
  isDefault: boolean;
  providerDestinationStatus: string;
}

export function useMyPaymentMethods() {
  return useQuery({
    queryKey: ['myPaymentMethods'],
    queryFn: async () => {
      const res = await api.paymentMethods.list();
      return res; // Assuming `api` already unwrap ApiResponse
    },
  });
}

export function useAddPaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { type: string; accountHolderName: string; identifier: string }) => {
      return await api.paymentMethods.add(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPaymentMethods'] });
    },
  });
}

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return await api.paymentMethods.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPaymentMethods'] });
    },
  });
}
