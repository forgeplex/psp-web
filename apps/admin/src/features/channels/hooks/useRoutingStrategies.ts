import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { RoutingStrategy } from '../types/domain';

const ROUTING_STRATEGIES_QUERY_KEY = 'routingStrategies';

// Mock data - replace with real API when BE ready
const mockStrategies: RoutingStrategy[] = [
  {
    id: 'rs_001',
    name: '微信优先策略',
    description: '优先使用微信支付渠道',
    priority: 1,
    enabled: true,
    created_at: '2026-01-15T08:30:00Z',
    updated_at: '2026-01-15T08:30:00Z',
  },
  {
    id: 'rs_002',
    name: '支付宝备选策略',
    description: '支付宝作为备选渠道',
    priority: 2,
    enabled: true,
    created_at: '2026-01-16T10:00:00Z',
    updated_at: '2026-01-16T10:00:00Z',
  },
];

let strategies: RoutingStrategy[] = [...mockStrategies];

// API functions (mock mode - replace with real API)
async function listStrategies(): Promise<RoutingStrategy[]> {
  return strategies;
}

async function getStrategy(id: string): Promise<RoutingStrategy | undefined> {
  return strategies.find(s => s.id === id);
}

async function createStrategy(payload: Partial<RoutingStrategy>): Promise<RoutingStrategy> {
  const newStrategy: RoutingStrategy = {
    id: `rs_${Date.now()}`,
    name: payload.name || 'New Strategy',
    description: payload.description || '',
    priority: payload.priority || strategies.length + 1,
    enabled: payload.enabled ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  strategies = [newStrategy, ...strategies];
  return newStrategy;
}

async function updateStrategy(id: string, payload: Partial<RoutingStrategy>): Promise<RoutingStrategy> {
  const strategy = strategies.find(s => s.id === id);
  if (!strategy) throw new Error('Strategy not found');
  
  const updated = { ...strategy, ...payload, updated_at: new Date().toISOString() };
  strategies = strategies.map(s => s.id === id ? updated : s);
  return updated;
}

async function reorderStrategies(orderedIds: string[]): Promise<void> {
  const newOrder = orderedIds
    .map(id => strategies.find(s => s.id === id))
    .filter((s): s is RoutingStrategy => s !== undefined);
  
  strategies = newOrder.map((s, idx) => ({ ...s, priority: idx + 1 }));
}

// Hooks
export function useRoutingStrategies() {
  return useQuery({
    queryKey: [ROUTING_STRATEGIES_QUERY_KEY],
    queryFn: listStrategies,
  });
}

export function useRoutingStrategy(id: string | undefined) {
  return useQuery({
    queryKey: [ROUTING_STRATEGIES_QUERY_KEY, 'detail', id],
    queryFn: () => getStrategy(id!),
    enabled: !!id,
  });
}

export function useCreateRoutingStrategy() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createStrategy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTING_STRATEGIES_QUERY_KEY] });
    },
  });
}

export function useUpdateRoutingStrategy() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<RoutingStrategy> }) =>
      updateStrategy(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTING_STRATEGIES_QUERY_KEY] });
    },
  });
}

export function useReorderRoutingStrategies() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reorderStrategies,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTING_STRATEGIES_QUERY_KEY] });
    },
  });
}
