// Adapter layer for Channels API
// Isolates API shape from domain models
// Based on Arch API Spec v0.9

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
  ReorderRoutingStrategiesRequest,
  HealthCheck,
  ListHealthChecksParams,
  ListHealthChecksResponse,
  TriggerHealthCheckRequest,
  ChannelHealthStatus,
  Provider,
  ListProvidersParams,
  ListProvidersResponse,
} from '@psp/shared';

// ========== Channels API (6 endpoints) ==========

export async function getChannels(params?: ListChannelsParams): Promise<ListChannelsResponse['data']> {
  const response = await apiClient.get('/channels', { params });
  return response.data.data;
}

export async function getChannelDetail(id: string): Promise<Channel> {
  const response = await apiClient.get(`/channels/${id}`);
  return response.data.data;
}

export async function createChannel(data: CreateChannelRequest): Promise<Channel> {
  const response = await apiClient.post('/channels', data);
  return response.data.data;
}

// API Spec v0.9: PATCH /channels/:id
export async function updateChannel(id: string, data: UpdateChannelRequest): Promise<Channel> {
  const response = await apiClient.patch(`/channels/${id}`, data);
  return response.data.data;
}

export async function deleteChannel(id: string): Promise<void> {
  await apiClient.delete(`/channels/${id}`);
}

// API Spec v0.9: POST /channels/:id/toggle
export async function toggleChannel(id: string, data: ToggleChannelRequest): Promise<Channel> {
  const response = await apiClient.post(`/channels/${id}/toggle`, data);
  return response.data.data;
}

// ========== Routing Strategies API (5 endpoints) ==========

export async function getRoutingStrategies(params?: ListRoutingStrategiesParams): Promise<ListRoutingStrategiesResponse['data']> {
  const response = await apiClient.get('/routing-strategies', { params });
  return response.data.data;
}

export async function getRoutingStrategyDetail(id: string): Promise<RoutingStrategy> {
  const response = await apiClient.get(`/routing-strategies/${id}`);
  return response.data.data;
}

export async function createRoutingStrategy(data: CreateRoutingStrategyRequest): Promise<RoutingStrategy> {
  const response = await apiClient.post('/routing-strategies', data);
  return response.data.data;
}

// API Spec v0.9: PATCH /routing-strategies/:id
export async function updateRoutingStrategy(id: string, data: UpdateRoutingStrategyRequest): Promise<RoutingStrategy> {
  const response = await apiClient.patch(`/routing-strategies/${id}`, data);
  return response.data.data;
}

export async function deleteRoutingStrategy(id: string): Promise<void> {
  await apiClient.delete(`/routing-strategies/${id}`);
}

// API Spec v0.9: POST /routing-strategies/reorder - 批量排序
export async function reorderRoutingStrategies(data: ReorderRoutingStrategiesRequest): Promise<void> {
  await apiClient.post('/routing-strategies/reorder', data);
}

// ========== Health Checks API (3 endpoints) ==========

export async function getHealthChecks(params?: ListHealthChecksParams): Promise<ListHealthChecksResponse['data']> {
  const response = await apiClient.get('/health-checks', { params });
  return response.data.data;
}

export async function getHealthCheckDetail(id: string): Promise<HealthCheck> {
  const response = await apiClient.get(`/health-checks/${id}`);
  return response.data.data;
}

export async function triggerHealthCheck(data: TriggerHealthCheckRequest): Promise<HealthCheck> {
  const response = await apiClient.post('/health-checks', data);
  return response.data.data;
}

// API Spec v0.9: GET /channels/:id/health - 轮询健康状态
export async function getChannelHealthStatus(channelId: string): Promise<ChannelHealthStatus> {
  const response = await apiClient.get(`/channels/${channelId}/health`);
  return response.data.data;
}

// ========== Providers API (1 endpoint) ==========

export async function getProviders(params?: ListProvidersParams): Promise<ListProvidersResponse['data']> {
  const response = await apiClient.get('/providers', { params });
  return response.data.data;
}

export async function getProviderDetail(id: string): Promise<Provider> {
  const response = await apiClient.get(`/providers/${id}`);
  return response.data.data;
}
