/**
 * Channels API Module
 * Real API implementation using generated types from OpenAPI
 */
import { apiClient } from './client';
import type { components } from './generated/admin';

// Re-export types for convenience
export type ChannelResponse = components['schemas']['psp_com_internal_channel_app.ChannelResponse'];
export type ChannelVerifyRequest = components['schemas']['psp_com_internal_channel_app.ChannelVerifyRequest'];
export type ChannelVerifyResponse = components['schemas']['psp_com_internal_channel_app.ChannelVerifyResponse'];
export type HealthCheckResultDTO = components['schemas']['psp_com_internal_channel_app.HealthCheckResultDTO'];

// List response type
export interface ChannelListResponse {
  data: ChannelResponse[];
  total: number;
  limit: number;
  offset: number;
}

// Query params for list
export interface ListChannelsParams {
  limit?: number;
  offset?: number;
  status?: string;
  provider_id?: string;
  payment_method?: string;
}

/**
 * List channels with pagination
 */
export async function listChannels(params?: ListChannelsParams): Promise<ChannelListResponse> {
  const { data } = await apiClient.get<ChannelListResponse>('/api/v1/channels', {
    params: {
      limit: params?.limit ?? 20,
      offset: params?.offset ?? 0,
      ...(params?.status && { status: params.status }),
      ...(params?.provider_id && { provider_id: params.provider_id }),
      ...(params?.payment_method && { payment_method: params.payment_method }),
    },
  });
  return data;
}

/**
 * Get single channel by ID
 */
export async function getChannel(channelId: string): Promise<ChannelResponse> {
  const { data } = await apiClient.get<ChannelResponse>(`/api/v1/channels/${channelId}`);
  return data;
}

/**
 * Enable a channel
 */
export async function enableChannel(channelId: string): Promise<ChannelResponse> {
  const { data } = await apiClient.post<ChannelResponse>(`/api/v1/channels/${channelId}/enable`);
  return data;
}

/**
 * Disable a channel
 */
export async function disableChannel(channelId: string): Promise<ChannelResponse> {
  const { data } = await apiClient.post<ChannelResponse>(`/api/v1/channels/${channelId}/disable`);
  return data;
}

/**
 * Get channel health status
 */
export async function getChannelHealth(channelId: string): Promise<HealthCheckResultDTO> {
  const { data } = await apiClient.get<HealthCheckResultDTO>(`/api/v1/channels/${channelId}/health`);
  return data;
}

/**
 * Verify channel (credentials, health, test transaction)
 */
export async function verifyChannel(
  channelId: string,
  request?: ChannelVerifyRequest
): Promise<ChannelVerifyResponse> {
  const { data } = await apiClient.post<ChannelVerifyResponse>(
    `/api/v1/channels/${channelId}/verify`,
    request ?? { verify_credentials: true, verify_health: true }
  );
  return data;
}

/**
 * Run test transaction on channel
 */
export async function testChannelTransaction(channelId: string): Promise<unknown> {
  const { data } = await apiClient.post(`/api/v1/channels/${channelId}/test-transaction`);
  return data;
}

/**
 * Update channel limits
 */
export interface UpdateChannelLimitsRequest {
  min_amount?: number;
  max_amount?: number;
  daily_limit?: number;
}

export async function updateChannelLimits(
  channelId: string,
  limits: UpdateChannelLimitsRequest
): Promise<ChannelResponse> {
  const { data } = await apiClient.put<ChannelResponse>(
    `/api/v1/channels/${channelId}/limits`,
    limits
  );
  return data;
}

/**
 * Get channel config
 */
export async function getChannelConfig(channelId: string): Promise<unknown> {
  const { data } = await apiClient.get(`/api/v1/channels/${channelId}/config`);
  return data;
}

/**
 * Update channel config
 */
export async function updateChannelConfig(
  channelId: string,
  config: Record<string, unknown>
): Promise<unknown> {
  const { data } = await apiClient.put(`/api/v1/channels/${channelId}/config`, config);
  return data;
}
