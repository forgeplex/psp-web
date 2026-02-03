import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getRoutingStrategies,
  getRoutingStrategyDetail,
  createRoutingStrategy,
  updateRoutingStrategy,
  deleteRoutingStrategy,
  reorderRoutingStrategies,
} from '../api/adapter';
import type {
  RoutingStrategy,
  ListRoutingStrategiesParams,
  CreateRoutingStrategyRequest,
  UpdateRoutingStrategyRequest,
  ReorderRoutingStrategiesRequest,
} from '@psp/shared';

const ROUTING_KEY = 'routing-strategies';

export function useRoutingStrategies(params?: ListRoutingStrategiesParams) {
  return useQuery({
    queryKey: [ROUTING_KEY, params],
    queryFn: () => getRoutingStrategies(params),
  });
}

export function useRoutingStrategyDetail(id: string) {
  return useQuery({
    queryKey: [ROUTING_KEY, id],
    queryFn: () => getRoutingStrategyDetail(id),
    enabled: !!id,
  });
}

export function useCreateRoutingStrategy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRoutingStrategy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTING_KEY] });
    },
  });
}

export function useUpdateRoutingStrategy(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateRoutingStrategyRequest) => updateRoutingStrategy(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTING_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [ROUTING_KEY] });
    },
  });
}

export function useDeleteRoutingStrategy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRoutingStrategy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTING_KEY] });
    },
  });
}

export function useReorderRoutingStrategies() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderRoutingStrategies,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTING_KEY] });
    },
  });
}
