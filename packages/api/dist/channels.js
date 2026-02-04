/**
 * Channels API Module
 * Real API implementation using generated types from OpenAPI
 * API Spec v1.1: 列表响应统一 { items: [...], total, limit, offset } (扁平结构)
 */
import { apiClient } from './client';
/**
 * List channels with pagination
 */
export async function listChannels(params) {
    const { data } = await apiClient.get('/api/v1/channels', {
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
export async function getChannel(channelId) {
    const { data } = await apiClient.get(`/api/v1/channels/${channelId}`);
    return data;
}
/**
 * Enable a channel
 */
export async function enableChannel(channelId) {
    const { data } = await apiClient.post(`/api/v1/channels/${channelId}/enable`);
    return data;
}
/**
 * Disable a channel
 */
export async function disableChannel(channelId) {
    const { data } = await apiClient.post(`/api/v1/channels/${channelId}/disable`);
    return data;
}
/**
 * Get channel health status
 */
export async function getChannelHealth(channelId) {
    const { data } = await apiClient.get(`/api/v1/channels/${channelId}/health`);
    return data;
}
/**
 * Verify channel (credentials, health, test transaction)
 */
export async function verifyChannel(channelId, request) {
    const { data } = await apiClient.post(`/api/v1/channels/${channelId}/verify`, request ?? { verify_credentials: true, verify_health: true });
    return data;
}
/**
 * Run test transaction on channel
 */
export async function testChannelTransaction(channelId) {
    const { data } = await apiClient.post(`/api/v1/channels/${channelId}/test-transaction`);
    return data;
}
export async function updateChannelLimits(channelId, limits) {
    const { data } = await apiClient.put(`/api/v1/channels/${channelId}/limits`, limits);
    return data;
}
/**
 * Get channel config
 */
export async function getChannelConfig(channelId) {
    const { data } = await apiClient.get(`/api/v1/channels/${channelId}/config`);
    return data;
}
/**
 * Update channel config
 */
export async function updateChannelConfig(channelId, config) {
    const { data } = await apiClient.put(`/api/v1/channels/${channelId}/config`, config);
    return data;
}
//# sourceMappingURL=channels.js.map