import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getRoutingStrategies,
  getRoutingStrategyDetail,
  createRoutingStrategy,
  updateRoutingStrategy,
  deleteRoutingStrategy,
  moveRoutingStrategy,
  reorderRoutingStrategies,
  type MoveRoutingStrategyRequest,
  type ReorderRoutingStrategyRequest,
} from '../api/adapter';
import type {
  RoutingStrategy,
  ListRoutingStrategiesParams,
  CreateRoutingStrategyRequest,
  UpdateRoutingStrategyRequest,
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

// Spec v1.0: POST /:id/move - 交换两个策略优先级
export function useMoveRoutingStrategy(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MoveRoutingStrategyRequest) => moveRoutingStrategy(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTING_KEY] });
    },
  });
}

// 备用：批量 reorder（如果 move 未部署）
export function useReorderRoutingStrategies() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReorderRoutingStrategyRequest) => reorderRoutingStrategies(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTING_KEY] });
    },
  });
}
