import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { RoutingStrategy, ReorderStrategiesRequest, MoveStrategyRequest } from '../types/domain';

const ROUTING_STRATEGIES_QUERY_KEY = 'routingStrategies';

// Mock data - replace with real API when BE ready
const mockStrategies: RoutingStrategy[] = [
  {
    id: 'rs_001',
    name: '巴西大额优先',
    description: '优先使用 Stripe-Brazil 渠道',
    priority: 1,
    enabled: true,
    conditions: { amount_min: 5000, currency: ['BRL'], country: ['BR'] },
    target_channels: ['ch_abc123', 'ch_def456'],
    channel_weights: { ch_abc123: 70, ch_def456: 30 },
    created_at: '2026-01-15T08:30:00Z',
    updated_at: '2026-02-03T10:30:00Z',
  },
  {
    id: 'rs_002',
    name: '墨西哥标准路由',
    description: 'Adyen-Mexico 标准路由',
    priority: 2,
    enabled: true,
    conditions: { amount_min: 100, amount_max: 5000, currency: ['MXN'], country: ['MX'] },
    target_channels: ['ch_def456'],
    channel_weights: { ch_def456: 100 },
    created_at: '2026-01-16T10:00:00Z',
    updated_at: '2026-02-02T15:20:00Z',
  },
  {
    id: 'rs_003',
    name: 'VIP商户专用',
    description: 'VIP 商户专用通道',
    priority: 3,
    enabled: false,
    conditions: { merchant_id: ['mer_vip001', 'mer_vip002'] },
    target_channels: ['ch_abc123'],
    channel_weights: { ch_abc123: 100 },
    created_at: '2026-01-20T09:00:00Z',
    updated_at: '2026-02-01T09:00:00Z',
  },
];

let strategies: RoutingStrategy[] = [...mockStrategies];

// API functions (mock mode - replace with real API)
async function listStrategies(): Promise<RoutingStrategy[]> {
  return [...strategies].sort((a, b) => a.priority - b.priority);
}

async function getStrategy(id: string): Promise<RoutingStrategy | undefined> {
  return strategies.find(s => s.id === id);
}

async function createStrategy(payload: Partial<RoutingStrategy>): Promise<RoutingStrategy> {
  const newStrategy: RoutingStrategy = {
    id: `rs_${Date.now()}`,
    name: payload.name || 'New Strategy',
    description: payload.description || '',
    priority: strategies.length + 1,
    enabled: payload.enabled ?? true,
    conditions: payload.conditions || {},
    target_channels: payload.target_channels || [],
    channel_weights: payload.channel_weights || {},
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

async function deleteStrategy(id: string): Promise<void> {
  strategies = strategies.filter(s => s.id !== id);
  // Reorder priorities after delete
  strategies = strategies
    .sort((a, b) => a.priority - b.priority)
    .map((s, idx) => ({ ...s, priority: idx + 1 }));
}

// v1.0 Reorder API - batch update priorities
// POST /routing-strategies/reorder
async function reorderStrategies(request: ReorderStrategiesRequest): Promise<void> {
  // Update each strategy's priority based on the request
  strategies = strategies.map(s => {
    const order = request.orders.find(o => o.id === s.id);
    if (order) {
      return { ...s, priority: order.priority, updated_at: new Date().toISOString() };
    }
    return s;
  });
}

// Deprecated: Move API - swap priority with target
// Use reorderStrategies instead (POST /routing-strategies/reorder)
async function moveStrategy(id: string, request: MoveStrategyRequest): Promise<void> {
  const sourceIdx = strategies.findIndex(s => s.id === id);
  const targetIdx = strategies.findIndex(s => s.id === request.targetId);
  
  if (sourceIdx === -1 || targetIdx === -1) {
    throw new Error('Strategy not found');
  }
  
  // Swap priorities
  const sourcePriority = strategies[sourceIdx].priority;
  const targetPriority = strategies[targetIdx].priority;
  
  strategies = strategies.map((s, idx) => {
    if (idx === sourceIdx) return { ...s, priority: targetPriority, updated_at: new Date().toISOString() };
    if (idx === targetIdx) return { ...s, priority: sourcePriority, updated_at: new Date().toISOString() };
    return s;
  });
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

export function useDeleteRoutingStrategy() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteStrategy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTING_STRATEGIES_QUERY_KEY] });
    },
  });
}

// v1.0 Reorder API hook - batch update priorities
// POST /routing-strategies/reorder with { orders: [{ id, priority }] }
export function useReorderRoutingStrategies() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: ReorderStrategiesRequest) => reorderStrategies(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTING_STRATEGIES_QUERY_KEY] });
    },
  });
}

// Deprecated: use useReorderRoutingStrategies instead
// Move API (POST /:id/move) is being replaced by Reorder API (POST /reorder)
export function useMoveRoutingStrategy() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: MoveStrategyRequest }) =>
      moveStrategy(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTING_STRATEGIES_QUERY_KEY] });
    },
  });
}
