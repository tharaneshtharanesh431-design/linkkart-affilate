import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080');

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// Interceptor to handle refresh token rotation
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/api/auth/')) {
      originalRequest._retry = true;
      try {
        await axiosInstance.post('/api/auth/refresh');
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (typeof window !== 'undefined' && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // Convert fetch-style `init` to axios config
  const method = init?.method || 'GET';
  const data = init?.body ? JSON.parse(init.body as string) : undefined;
  
  const config: AxiosRequestConfig = {
    method,
    url: path,
    data,
    headers: init?.headers as Record<string, string>,
  };

  try {
    const response: AxiosResponse = await axiosInstance(config);
    return response.data.data ?? response.data; // Accommodate ApiResponse wrapper
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Request failed';
    throw new Error(message);
  }
}

export const api = {
  get: <T = any>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T = any>(path: string, body?: any) => request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T = any>(path: string, body?: any) => request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T = any>(path: string) => request<T>(path, { method: 'DELETE' }),
  
  auth: {
    login: (email: string, password: string) => request<any>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (payload: any) => request<any>('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    logout: () => request<any>('/api/auth/logout', { method: 'POST' }),
  },
  dashboard: {
    get: () => request<any>('/api/dashboard'),
    summary: () => request<any>('/api/dashboard/summary'),
    monthly: () => request<any>('/api/dashboard/monthly'),
    topProducts: () => request<any>('/api/dashboard/top-products'),
    activity: () => request<any>('/api/dashboard/activity'),
  },
  analytics: {
    affiliate: (params?: { range?: string, startDate?: string, endDate?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return request<any>(`/api/analytics/affiliate${q ? '?' + q : ''}`);
    },
    merchant: (params?: { range?: string, startDate?: string, endDate?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return request<any>(`/api/analytics/merchant${q ? '?' + q : ''}`);
    },
    admin: (params?: { range?: string, startDate?: string, endDate?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return request<any>(`/api/analytics/admin${q ? '?' + q : ''}`);
    }
  },
  campaigns: {
    list: () => request<any>('/api/campaigns'),
    create: (payload: any) => request<any>('/api/campaigns', { method: 'POST', body: JSON.stringify(payload) }),
  },
  chat: {
    ask: (message: string) => request<any>('/api/chat', { method: 'POST', body: JSON.stringify({ message }) }),
    generateLink: (payload: { productName: string; campaignName: string }) => request<any>('/api/chat/generate-link', { method: 'POST', body: JSON.stringify(payload) }),
  },
  products: {
    list: (params?: { search?: string, category?: string, minCommission?: number, sort?: string }) => {
      let url = '/api/products';
      if (params) {
        const q = new URLSearchParams();
        if (params.search) q.append('search', params.search);
        if (params.category) q.append('category', params.category);
        if (params.minCommission !== undefined) q.append('minCommission', params.minCommission.toString());
        if (params.sort) q.append('sort', params.sort);
        const str = q.toString();
        if (str) url += `?${str}`;
      }
      return request<any>(url, { method: 'GET' });
    },
    merchantList: () => request<any>('/api/products/merchant'),
    get: (id: number) => request<any>(`/api/products/${id}`),
    create: (payload: any) => request<any>('/api/products', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: number, payload: any) => request<any>(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    toggleStatus: (id: number, status: string) => request<any>(`/api/products/${id}/status?status=${encodeURIComponent(status)}`, { method: 'PATCH' }),
    delete: (id: number) => request<any>(`/api/products/${id}`, { method: 'DELETE' }),
  },
  categories: {
    list: () => request<any>('/api/categories'),
  },
  affiliateLinks: {
    list: () => request<any>('/api/affiliate-links'),
    generate: (productId: number) => request<any>('/api/affiliate-links', { method: 'POST', body: JSON.stringify({ productId }) }),
  },
  dev: {
    recordConversion: (payload: { trackingCode: string; orderAmount: number; customerEmail?: string; orderReference?: string }) =>
      request<any>('/api/dev/conversions', { method: 'POST', body: JSON.stringify(payload) }),
  },
  csrf: {
    fetch: () => request<any>('/api/csrf'),
  },
  profile: {
    me: () => request<any>('/api/profile/me'),
    onboardMerchant: (payload: any) => request<any>('/api/profile/merchant/onboarding', { method: 'POST', body: JSON.stringify(payload) }),
    onboardAffiliate: (payload: any) => request<any>('/api/profile/affiliate/onboarding', { method: 'POST', body: JSON.stringify(payload) }),
  },
  paymentMethods: {
    list: () => request<any>('/api/payment-methods'),
    add: (payload: { type: string; accountHolderName: string; identifier: string }) => request<any>('/api/payment-methods', { method: 'POST', body: JSON.stringify(payload) }),
    delete: (id: number) => request<any>(`/api/payment-methods/${id}`, { method: 'DELETE' }),
  },
  payouts: {
    list: () => request<any>('/api/payouts/my'),
    balance: () => request<any>('/api/payouts/my/balance'),
    request: (payload: { amount: number; paymentMethodId: number }) => request<any>('/api/payouts/request', { method: 'POST', body: JSON.stringify(payload) }),
  },
  admin: {
    dashboard: {
      summary: () => request<any>('/api/admin/dashboard/summary'),
      activity: () => request<any>('/api/admin/dashboard/activity'),
    },
    users: {
      list: (params?: Record<string, string | number>) => {
        const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
        return request<any>(`/api/admin/users${query}`);
      },
      get: (id: number) => request<any>(`/api/admin/users/${id}`),
      updateStatus: (id: number, status: string) => request<any>(`/api/admin/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),
    },
    merchants: {
      list: (params?: Record<string, string | number>) => {
        const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
        return request<any>(`/api/admin/merchants${query}`);
      },
      get: (id: number) => request<any>(`/api/admin/merchants/${id}`),
    },
    affiliates: {
      list: (params?: Record<string, string | number>) => {
        const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
        return request<any>(`/api/admin/affiliates${query}`);
      },
      get: (id: number) => request<any>(`/api/admin/affiliates/${id}`),
    },
    applications: {
      list: (params?: Record<string, string | number>) => {
        const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
        return request<any>(`/api/admin/applications${query}`);
      },
      approve: (campaignId: number, affiliateId: number) => request<any>(`/api/admin/applications/${campaignId}/${affiliateId}/approve`, { method: 'POST' }),
      reject: (campaignId: number, affiliateId: number) => request<any>(`/api/admin/applications/${campaignId}/${affiliateId}/reject`, { method: 'POST' }),
    },
    products: {
      list: (params?: Record<string, string | number>) => {
        const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
        return request<any>(`/api/admin/products${query}`);
      },
      get: (id: number) => request<any>(`/api/admin/products/${id}`),
      activate: (id: number) => request<any>(`/api/admin/products/${id}/activate`, { method: 'POST' }),
      deactivate: (id: number) => request<any>(`/api/admin/products/${id}/deactivate`, { method: 'POST' }),
    },
    ledger: {
      conversions: (params?: Record<string, string | number>) => {
        const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
        return request<any>(`/api/admin/ledger/conversions${query}`);
      },
      commissions: (params?: Record<string, string | number>) => {
        const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
        return request<any>(`/api/admin/ledger/commissions${query}`);
      },
      payouts: (params?: Record<string, string | number>) => {
        const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
        return request<any>(`/api/admin/ledger/payouts${query}`);
      },
      updatePayout: (id: number, status: string, notes?: string) => 
        request<any>(`/api/admin/ledger/payouts/${id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status, notes }),
        }),
    },
    campaigns: {
      list: (params?: Record<string, string | number>) => {
        const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
        return request<any>(`/api/admin/campaigns${query}`);
      },
      get: (id: number) => request<any>(`/api/admin/campaigns/${id}`),
      activate: (id: number) => request<any>(`/api/admin/campaigns/${id}/activate`, { method: 'POST' }),
      pause: (id: number) => request<any>(`/api/admin/campaigns/${id}/pause`, { method: 'POST' }),
      close: (id: number) => request<any>(`/api/admin/campaigns/${id}/close`, { method: 'POST' }),
    },
    conversions: {
      list: (params?: Record<string, string | number>) => {
        const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
        return request<any>(`/api/admin/conversions${query}`);
      },
      get: (id: number) => request<any>(`/api/admin/conversions/${id}`),
    },
    commissions: {
      list: (params?: Record<string, string | number>) => {
        const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
        return request<any>(`/api/admin/commissions${query}`);
      },
      get: (id: number) => request<any>(`/api/admin/commissions/${id}`),
    },
    payouts: {
      list: (params?: Record<string, string | number>) => {
        const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
        return request<any>(`/api/admin/payouts${query}`);
      },
      get: (id: number) => request<any>(`/api/admin/payouts/${id}`),
      process: (id: number) => request<any>(`/api/admin/payouts/${id}/process`, { method: 'POST' }),
      paid: (id: number) => request<any>(`/api/admin/payouts/${id}/paid`, { method: 'POST' }),
      reject: (id: number, reason: string) => request<any>(`/api/admin/payouts/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      }),
      fail: (id: number, reason: string) => request<any>(`/api/admin/payouts/${id}/fail`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      }),
    },
    auditLogs: {
      list: (params?: Record<string, string | number>) => {
        const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
        return request<any>(`/api/admin/audit-logs${query}`);
      },
    },
    fraud: {
      signals: () => request<any>('/api/admin/fraud/signals'),
      affiliateSignals: (id: number) => request<any>(`/api/admin/fraud/signals/affiliate/${id}`),
      review: (id: number, payload: { status: string; reviewNotes?: string }) => 
        request<any>(`/api/admin/fraud/signals/${id}/review`, { method: 'POST', body: JSON.stringify(payload) })
    }
  }
};
