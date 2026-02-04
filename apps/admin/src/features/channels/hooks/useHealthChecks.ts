import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { HealthCheck, HealthStatus } from '../types/domain';

const HEALTH_CHECKS_QUERY_KEY = 'healthChecks';

// Mock data
const mockHealthChecks: HealthCheck[] = [
  {
    id: 'hc_001',
    channel_id: 'chn_001',
    status: 'healthy',
    checked_at: '2026-02-03T20:00:00Z',
    response_time_ms: 245,
  },
  {
    id: 'hc_002',
    channel_id: 'chn_002',
    status: 'degraded',
    checked_at: '2026-02-03T19:55:00Z',
    response_time_ms: 1200,
    error_message: 'Response time exceeded threshold',
  },
];

let healthChecks: HealthCheck[] = [...mockHealthChecks];

// API functions (mock mode)
async function listHealthChecks(channelId?: string): Promise<HealthCheck[]> {
  if (channelId) {
    return healthChecks.filter(hc => hc.channel_id === channelId);
  }
  return healthChecks;
}

async function getHealthCheck(id: string): Promise<HealthCheck | undefined> {
  return healthChecks.find(hc => hc.id === id);
}

async function triggerHealthCheck(channelId: string): Promise<HealthCheck> {
  const newCheck: HealthCheck = {
    id: `hc_${Date.now()}`,
    channel_id: channelId,
    status: Math.random() > 0.3 ? 'healthy' : 'degraded',
    checked_at: new Date().toISOString(),
    response_time_ms: Math.floor(Math.random() * 500) + 100,
  };
  healthChecks = [newCheck, ...healthChecks];
  return newCheck;
}

async function getChannelHealthStatus(channelId: string): Promise<{ status: HealthStatus }> {
  const latest = healthChecks.find(hc => hc.channel_id === channelId);
  return { status: latest?.status || 'unknown' };
}

// Hooks
export function useHealthChecks(channelId?: string) {
  return useQuery({
    queryKey: [HEALTH_CHECKS_QUERY_KEY, channelId],
    queryFn: () => listHealthChecks(channelId),
    refetchInterval: 30000, // 30s auto refresh
  });
}

export function useHealthCheck(id: string | undefined) {
  return useQuery({
    queryKey: [HEALTH_CHECKS_QUERY_KEY, 'detail', id],
    queryFn: () => getHealthCheck(id!),
    enabled: !!id,
  });
}

export function useTriggerHealthCheck() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: triggerHealthCheck,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [HEALTH_CHECKS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [HEALTH_CHECKS_QUERY_KEY, data.channel_id] });
    },
  });
}

export function useChannelHealthStatus(channelId: string) {
  return useQuery({
    queryKey: [HEALTH_CHECKS_QUERY_KEY, 'status', channelId],
    queryFn: () => getChannelHealthStatus(channelId),
    refetchInterval: 30000,
  });
}
