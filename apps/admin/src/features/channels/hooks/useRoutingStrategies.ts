import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { RoutingStrategy, ReorderStrategiesRequest, MoveStrategyRequest } from '../types/domain';
import { strategiesApi } from '../api/realApi';

const ROUTING_STRATEGIES_QUERY_KEY = 'routingStrategies';

// Hooks
export function useRoutingStrategies() {
  return useQuery({
    queryKey: [ROUTING_STRATEGIES_QUERY_KEY],
    queryFn: () => strategiesApi.list(),
  });
}

export function useRoutingStrategy(id: string | undefined) {
  return useQuery({
    queryKey: [ROUTING_STRATEGIES_QUERY_KEY, 'detail', id],
    queryFn: () => strategiesApi.get(id!),
    enabled: !!id,
  });
}

export function useCreateRoutingStrategy() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: Partial<RoutingStrategy>) => strategiesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTING_STRATEGIES_QUERY_KEY] });
    },
  });
}

export function useUpdateRoutingStrategy() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<RoutingStrategy> }) =>
      strategiesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTING_STRATEGIES_QUERY_KEY] });
    },
  });
}

export function useDeleteRoutingStrategy() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => strategiesApi.delete(id),
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
    mutationFn: (request: ReorderStrategiesRequest) => strategiesApi.reorder(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTING_STRATEGIES_QUERY_KEY] });
    },
  });
}

// Move API (POST /:id/move) - swap priority with target
export function useMoveRoutingStrategy() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: MoveStrategyRequest }) =>
      strategiesApi.move(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTING_STRATEGIES_QUERY_KEY] });
    },
  });
}
