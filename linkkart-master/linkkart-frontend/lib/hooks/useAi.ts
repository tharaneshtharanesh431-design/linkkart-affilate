import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useAiAssistant() {
  return useMutation({
    mutationFn: async (message: string) => {
      const response = await api.post<{ reply: string }>('/api/ai/assistant', { message });
      return response;
    },
  });
}

export function useAffiliateRecommendations() {
  return useMutation({
    mutationFn: async ({ niche, category }: { niche: string; category?: string }) => {
      const response = await api.post<{ reply: string }>('/api/ai/affiliate/recommendations', { niche, category });
      return response;
    },
  });
}

export function useAffiliateContent() {
  return useMutation({
    mutationFn: async ({ productId, platform, tone }: { productId: number; platform: string; tone: string }) => {
      const response = await api.post<{ reply: string }>('/api/ai/affiliate/content', { productId, platform, tone });
      return response;
    },
  });
}

export function useMerchantProductContent() {
  return useMutation({
    mutationFn: async ({ productName, features, tone }: { productName: string; features: string; tone: string }) => {
      const response = await api.post<{ reply: string }>('/api/ai/merchant/product-content', { productName, features, tone });
      return response;
    },
  });
}

export function useCampaignInsights() {
  return useMutation({
    mutationFn: async ({ campaignId, dateRange }: { campaignId: number; dateRange: string }) => {
      const response = await api.post<{ reply: string }>('/api/ai/merchant/campaign-insights', { campaignId, dateRange });
      return response;
    },
  });
}

export function useAffiliatePerformanceSummary() {
  return useMutation({
    mutationFn: async (dateRange: string) => {
      const response = await api.post<{ reply: string }>('/api/ai/affiliate/performance-summary', { dateRange });
      return response;
    },
  });
}
