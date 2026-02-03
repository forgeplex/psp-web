import { useQuery } from '@tanstack/react-query';
import { stubProviders } from '../data/stub';
import type { Provider } from '../types/domain';

// Query keys
export const providerKeys = {
  all: ['providers'] as const,
  lists: () => [...providerKeys.all, 'list'] as const,
  detail: (id: string) => [...providerKeys.all, 'detail', id] as const,
};

// Stub API - 等待真实 API
async function fetchProviders(): Promise<Provider[]> {
  // TODO: Replace with real API call
  return Promise.resolve(stubProviders);
}

async function fetchProvider(id: string): Promise<Provider | undefined> {
  // TODO: Replace with real API call
  return Promise.resolve(stubProviders.find(p => p.id === id));
}

// ==================== Queries ====================

/**
 * 获取提供商列表
 */
export function useProviders() {
  return useQuery({
    queryKey: providerKeys.lists(),
    queryFn: fetchProviders,
  });
}

/**
 * 获取提供商详情
 */
export function useProvider(id: string) {
  return useQuery({
    queryKey: providerKeys.detail(id),
    queryFn: () => fetchProvider(id),
    enabled: !!id,
  });
}
