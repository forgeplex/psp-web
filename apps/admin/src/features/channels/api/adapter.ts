// Adapter layer for Channels API
// Isolates API shape from domain models
// Based on Arch API Spec v1.0 (FINAL) + QA 验收调整

import { apiClient } from '@psp/api';
import type {
  Channel,
  CreateChannelRequest,
  ListChannelsParams,
  ListChannelsResponse,
  UpdateChannelRequest,
  ToggleChannelRequest,
  RoutingStrategy,
  CreateRoutingStrategyRequest,
  ListRoutingStrategiesParams,
  ListRoutingStrategiesResponse,
  UpdateRoutingStrategyRequest,
  MoveRoutingStrategyRequest,
  HealthCheck,
  ListHealthChecksParams,
  ListHealthChecksResponse,
  TriggerHealthCheckRequest,
  ChannelHealthStatus,
  Provider,
  ListProvidersParams,
  ListProvidersResponse,
} from '@psp/shared';

const API_PREFIX = '/api/v1';

// ========== Channels API (6 endpoints) ==========

export async function getChannels(params?: ListChannelsParams): Promise<ListChannelsResponse['data']> {
  const response = await apiClient.get(`${API_PREFIX}/channels`, { params });
  return response.data.data;
}

export async function getChannelDetail(id: string): Promise<Channel> {
  const response = await apiClient.get(`${API_PREFIX}/channels/${id}`);
  return response.data.data;
}

export async function createChannel(data: CreateChannelRequest): Promise<Channel> {
  const response = await apiClient.post(`${API_PREFIX}/channels`, data);
  return response.data.data;
}

// QA 验收: PUT /channels/:id (实际使用 PUT 而非 PATCH)
export async function updateChannel(id: string, data: UpdateChannelRequest): Promise<Channel> {
  const response = await apiClient.put(`${API_PREFIX}/channels/${id}`, data);
  return response.data.data;
}

export async function deleteChannel(id: string): Promise<void> {
  await apiClient.delete(`${API_PREFIX}/channels/${id}`);
}

// QA 验收: PUT /channels/:id/enable 和 PUT /channels/:id/disable (而非 POST toggle)
export async function toggleChannel(id: string, data: ToggleChannelRequest): Promise<Channel> {
  const action = data.enabled ? 'enable' : 'disable';
  const response = await apiClient.put(`${API_PREFIX}/channels/${id}/${action}`, {});
  return response.data.data;
}

// ========== Routing Strategies API (5 endpoints) ==========

export async function getRoutingStrategies(params?: ListRoutingStrategiesParams): Promise<ListRoutingStrategiesResponse['data']> {
  const response = await apiClient.get(`${API_PREFIX}/routing-strategies`, { params });
  return response.data.data;
}

export async function getRoutingStrategyDetail(id: string): Promise<RoutingStrategy> {
  const response = await apiClient.get(`${API_PREFIX}/routing-strategies/${id}`);
  return response.data.data;
}

export async function createRoutingStrategy(data: CreateRoutingStrategyRequest): Promise<RoutingStrategy> {
  const response = await apiClient.post(`${API_PREFIX}/routing-strategies`, data);
  return response.data.data;
}

// QA 验收: PUT /routing-strategies/:id (实际使用 PUT 而非 PATCH)
export async function updateRoutingStrategy(id: string, data: UpdateRoutingStrategyRequest): Promise<RoutingStrategy> {
  const response = await apiClient.put(`${API_PREFIX}/routing-strategies/${id}`, data);
  return response.data.data;
}

export async function deleteRoutingStrategy(id: string): Promise<void> {
  await apiClient.delete(`${API_PREFIX}/routing-strategies/${id}`);
}

// QA 验收: reorder API 未实现，临时用 PUT update 模拟
// TODO: 等待 BE 实现 POST /routing-strategies/reorder
export async function moveRoutingStrategy(id: string, data: MoveRoutingStrategyRequest): Promise<void> {
  // 临时方案：先获取目标策略，交换 priority，再更新
  // 实际应调用：POST /routing-strategies/reorder
  try {
    await apiClient.post(`${API_PREFIX}/routing-strategies/reorder`, {
      orders: [{ id, targetId: data.targetId }]
    });
  } catch (error) {
    console.warn('reorder API not available, using fallback:', error);
    // Fallback: 直接更新 priority
    await apiClient.put(`${API_PREFIX}/routing-strategies/${id}`, {
      priority: data.priority
    });
  }
}

// ========== Health Checks API (3 endpoints) ==========

export async function getHealthChecks(params?: ListHealthChecksParams): Promise<ListHealthChecksResponse['data']> {
  const response = await apiClient.get(`${API_PREFIX}/health-checks`, { params });
  return response.data.data;
}

export async function getHealthCheckDetail(id: string): Promise<HealthCheck> {
  const response = await apiClient.get(`${API_PREFIX}/health-checks/${id}`);
  return response.data.data;
}

export async function triggerHealthCheck(data: TriggerHealthCheckRequest): Promise<HealthCheck> {
  const response = await apiClient.post(`${API_PREFIX}/health-checks`, data);
  return response.data.data;
}

// QA 验收: GET /channels/:id/health
export async function getChannelHealthStatus(channelId: string): Promise<ChannelHealthStatus> {
  const response = await apiClient.get(`${API_PREFIX}/channels/${channelId}/health`);
  return response.data.data;
}

// ========== Providers API (1 endpoint) ==========

export async function getProviders(params?: ListProvidersParams): Promise<ListProvidersResponse['data']> {
  const response = await apiClient.get(`${API_PREFIX}/providers`, { params });
  return response.data.data;
}

export async function getProviderDetail(id: string): Promise<Provider> {
  const response = await apiClient.get(`${API_PREFIX}/providers/${id}`);
  return response.data.data;
}
