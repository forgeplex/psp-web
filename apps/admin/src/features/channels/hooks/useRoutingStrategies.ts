import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getRoutingStrategies,
  getRoutingStrategyDetail,
  createRoutingStrategy,
  updateRoutingStrategy,
  deleteRoutingStrategy,
  moveRoutingStrategy,
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

// QA 验收: reorder API 未实现，使用带 priority 的 fallback
// TODO: 等待 BE 实现后移除 fallback
interface MoveStrategyData {
  targetId: string;
  priority: number;  // 新增：用于 fallback 更新
}

export function useMoveRoutingStrategy(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MoveStrategyData) => moveRoutingStrategy(id, {
      targetId: data.targetId,
      priority: data.priority
    } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTING_KEY] });
    },
  });
}
