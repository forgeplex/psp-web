// Adapter layer for Channels API
// Isolates API shape from domain models
// Based on Arch API Spec v1.0 (FINAL)

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

// API Spec v1.0: PATCH /channels/:id
export async function updateChannel(id: string, data: UpdateChannelRequest): Promise<Channel> {
  const response = await apiClient.patch(`${API_PREFIX}/channels/${id}`, data);
  return response.data.data;
}

export async function deleteChannel(id: string): Promise<void> {
  await apiClient.delete(`${API_PREFIX}/channels/${id}`);
}

// API Spec v1.0: POST /channels/:id/toggle
export async function toggleChannel(id: string, data: ToggleChannelRequest): Promise<Channel> {
  const response = await apiClient.post(`${API_PREFIX}/channels/${id}/toggle`, data);
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

// API Spec v1.0: PATCH /routing-strategies/:id
export async function updateRoutingStrategy(id: string, data: UpdateRoutingStrategyRequest): Promise<RoutingStrategy> {
  const response = await apiClient.patch(`${API_PREFIX}/routing-strategies/${id}`, data);
  return response.data.data;
}

export async function deleteRoutingStrategy(id: string): Promise<void> {
  await apiClient.delete(`${API_PREFIX}/routing-strategies/${id}`);
}

// API Spec v1.0: POST /routing-strategies/:id/move - 交换优先级（避免唯一约束冲突）
export async function moveRoutingStrategy(id: string, data: MoveRoutingStrategyRequest): Promise<void> {
  await apiClient.post(`${API_PREFIX}/routing-strategies/${id}/move`, data);
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

// API Spec v1.0: GET /channels/:id/health - 列表缓存 + 详情实时
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
