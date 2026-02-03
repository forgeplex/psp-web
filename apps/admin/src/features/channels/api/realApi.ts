// Real API adapter - ready for BE deployment
// Replace mock API calls with actual fetch

import type { Channel, ChannelListResponse, RoutingStrategy, MoveStrategyRequest } from '../types/domain';

const API_BASE = '/api/v1';

// Helper for API calls
async function apiCall<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

// Channels API
export const channelsApi = {
  list: (params?: { keyword?: string; status?: string; page?: number; pageSize?: number }) => {
    const query = new URLSearchParams();
    if (params?.keyword) query.set('keyword', params.keyword);
    if (params?.status) query.set('status', params.status);
    if (params?.page) query.set('page', String(params.page));
    if (params?.pageSize) query.set('pageSize', String(params.pageSize));
    
    return apiCall<ChannelListResponse>(`/channels?${query.toString()}`);
  },
  
  get: (id: string) => apiCall<Channel>(`/channels/${id}`),
  
  create: (payload: Partial<Channel>) => 
    apiCall<Channel>('/channels', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  
  update: (id: string, payload: Partial<Channel>) =>
    apiCall<Channel>(`/channels/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  
  setStatus: (id: string, status: Channel['status']) =>
    apiCall<Channel>(`/channels/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  
  delete: (id: string) =>
    apiCall<void>(`/channels/${id}`, {
      method: 'DELETE',
    }),
};

// Routing Strategies API (v1.0 with move)
export const strategiesApi = {
  list: () => apiCall<RoutingStrategy[]>('/routing-strategies'),
  
  get: (id: string) => apiCall<RoutingStrategy>(`/routing-strategies/${id}`),
  
  create: (payload: Partial<RoutingStrategy>) =>
    apiCall<RoutingStrategy>('/routing-strategies', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  
  update: (id: string, payload: Partial<RoutingStrategy>) =>
    apiCall<RoutingStrategy>(`/routing-strategies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  
  delete: (id: string) =>
    apiCall<void>(`/routing-strategies/${id}`, {
      method: 'DELETE',
    }),
  
  // v1.0 Move API - swap priority with target
  move: (id: string, request: MoveStrategyRequest) =>
    apiCall<void>(`/routing-strategies/${id}/move`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),
};
