import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useUser() {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      try {
        // Fetch CSRF token to ensure the XSRF-TOKEN cookie is set for future POST requests
        await api.csrf.fetch().catch(() => {});
        return await api.profile.me();
      } catch (err: any) {
        const msg = err.message?.toLowerCase() || '';
        if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('refresh token')) {
          return null; // Not logged in
        }
        throw err;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
