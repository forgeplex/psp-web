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
  Provider,
  ListProvidersParams,
  ListProvidersResponse,
  ChannelHealthStatus,
} from '@psp/shared';

const API_PREFIX = '/api/v1';

// ========== Channels API ==========

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

// QA 验收: PUT /channels/:id
export async function updateChannel(id: string, data: UpdateChannelRequest): Promise<Channel> {
  const response = await apiClient.put(`${API_PREFIX}/channels/${id}`, data);
  return response.data.data;
}

export async function deleteChannel(id: string): Promise<void> {
  await apiClient.delete(`${API_PREFIX}/channels/${id}`);
}

// QA 验收: PUT /channels/:id/enable 和 PUT /channels/:id/disable
export async function toggleChannel(id: string, data: ToggleChannelRequest): Promise<Channel> {
  const action = data.enabled ? 'enable' : 'disable';
  const response = await apiClient.put(`${API_PREFIX}/channels/${id}/${action}`, {});
  return response.data.data;
}

// ========== Routing Strategies API ==========

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

// QA 验收: PUT /routing-strategies/:id
export async function updateRoutingStrategy(id: string, data: UpdateRoutingStrategyRequest): Promise<RoutingStrategy> {
  const response = await apiClient.put(`${API_PREFIX}/routing-strategies/${id}`, data);
  return response.data.data;
}

export async function deleteRoutingStrategy(id: string): Promise<void> {
  await apiClient.delete(`${API_PREFIX}/routing-strategies/${id}`);
}

// Spec v1.0: POST /routing-strategies/:id/move
// Body: { "targetId": "uuid-string" }
export interface MoveRoutingStrategyRequest {
  targetId: string;
}

export async function moveRoutingStrategy(id: string, data: MoveRoutingStrategyRequest): Promise<void> {
  await apiClient.post(`${API_PREFIX}/routing-strategies/${id}/move`, data);
}

// 备用：reorder API（如果 move 未部署时使用）
export interface ReorderRoutingStrategyRequest {
  orderedIds: string[];
}

export async function reorderRoutingStrategies(data: ReorderRoutingStrategyRequest): Promise<void> {
  await apiClient.post(`${API_PREFIX}/routing-strategies/reorder`, data);
}

// ========== Health Checks API ==========

export async function getChannelHealthStatus(channelId: string): Promise<ChannelHealthStatus> {
  const response = await apiClient.get(`${API_PREFIX}/channels/${channelId}/health`);
  return response.data.data;
}

// ========== Providers API ==========

export async function getProviders(params?: ListProvidersParams): Promise<ListProvidersResponse['data']> {
  const response = await apiClient.get(`${API_PREFIX}/providers`, { params });
  return response.data.data;
}

export async function getProviderDetail(id: string): Promise<Provider> {
  const response = await apiClient.get(`${API_PREFIX}/providers/${id}`);
  return response.data.data;
}
