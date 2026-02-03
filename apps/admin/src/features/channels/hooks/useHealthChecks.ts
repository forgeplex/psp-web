import { useQuery } from '@tanstack/react-query';
import { stubHealthChecks } from '../data/stub';
import type { HealthCheck } from '../types/domain';

// Query keys
export const healthKeys = {
  all: ['health-checks'] as const,
  lists: () => [...healthKeys.all, 'list'] as const,
  byChannel: (channelId: string) => [...healthKeys.all, 'channel', channelId] as const,
};

// Stub API - 等待真实 API
async function fetchHealthChecks(): Promise<HealthCheck[]> {
  // TODO: Replace with real API call
  return Promise.resolve(stubHealthChecks);
}

async function fetchHealthChecksByChannel(channelId: string): Promise<HealthCheck[]> {
  // TODO: Replace with real API call
  return Promise.resolve(stubHealthChecks.filter(h => h.channel_id === channelId));
}

// ==================== Queries ====================

/**
 * 获取健康检查列表
 */
export function useHealthChecks() {
  return useQuery({
    queryKey: healthKeys.lists(),
    queryFn: fetchHealthChecks,
  });
}

/**
 * 获取指定渠道的健康检查
 */
export function useChannelHealthChecks(channelId: string) {
  return useQuery({
    queryKey: healthKeys.byChannel(channelId),
    queryFn: () => fetchHealthChecksByChannel(channelId),
    enabled: !!channelId,
  });
}
