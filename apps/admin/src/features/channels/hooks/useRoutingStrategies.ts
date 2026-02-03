import { useQuery } from '@tanstack/react-query';
import { stubRoutingStrategies } from '../data/stub';
import type { RoutingStrategy } from '../types/domain';

// Query keys
export const routingKeys = {
  all: ['routing-strategies'] as const,
  lists: () => [...routingKeys.all, 'list'] as const,
  detail: (id: string) => [...routingKeys.all, 'detail', id] as const,
};

// Stub API - 等待真实 API
async function fetchRoutingStrategies(): Promise<RoutingStrategy[]> {
  // TODO: Replace with real API call
  return Promise.resolve(stubRoutingStrategies);
}

async function fetchRoutingStrategy(id: string): Promise<RoutingStrategy | undefined> {
  // TODO: Replace with real API call
  return Promise.resolve(stubRoutingStrategies.find(r => r.id === id));
}

// ==================== Queries ====================

/**
 * 获取路由策略列表
 */
export function useRoutingStrategies() {
  return useQuery({
    queryKey: routingKeys.lists(),
    queryFn: fetchRoutingStrategies,
  });
}

/**
 * 获取路由策略详情
 */
export function useRoutingStrategy(id: string) {
  return useQuery({
    queryKey: routingKeys.detail(id),
    queryFn: () => fetchRoutingStrategy(id),
    enabled: !!id,
  });
}
