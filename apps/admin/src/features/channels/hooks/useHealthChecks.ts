import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getHealthChecks,
  getHealthCheckDetail,
  triggerHealthCheck,
  getChannelHealthStatus,
} from '../api/adapter';
import type { ListHealthChecksParams, TriggerHealthCheckRequest } from '@psp/shared';

const HEALTH_KEY = 'health-checks';

export function useHealthChecks(params?: ListHealthChecksParams) {
  return useQuery({
    queryKey: [HEALTH_KEY, params],
    queryFn: () => getHealthChecks(params),
  });
}

export function useHealthCheckDetail(id: string) {
  return useQuery({
    queryKey: [HEALTH_KEY, id],
    queryFn: () => getHealthCheckDetail(id),
    enabled: !!id,
  });
}

export function useTriggerHealthCheck() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: triggerHealthCheck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HEALTH_KEY] });
    },
  });
}

export function useChannelHealthStatus(channelId: string) {
  return useQuery({
    queryKey: [HEALTH_KEY, 'status', channelId],
    queryFn: () => getChannelHealthStatus(channelId),
    enabled: !!channelId,
    refetchInterval: 30000, // 30s 自动刷新
  });
}
