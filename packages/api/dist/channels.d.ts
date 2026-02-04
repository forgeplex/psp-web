import type { components } from './generated/admin';
export type ChannelResponse = components['schemas']['psp_com_internal_channel_app.ChannelResponse'];
export type ChannelVerifyRequest = components['schemas']['psp_com_internal_channel_app.ChannelVerifyRequest'];
export type ChannelVerifyResponse = components['schemas']['psp_com_internal_channel_app.ChannelVerifyResponse'];
export type HealthCheckResultDTO = components['schemas']['psp_com_internal_channel_app.HealthCheckResultDTO'];
export interface ChannelListResponse {
    data: ChannelResponse[];
    total: number;
    limit: number;
    offset: number;
}
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
export declare function listChannels(params?: ListChannelsParams): Promise<ChannelListResponse>;
/**
 * Get single channel by ID
 */
export declare function getChannel(channelId: string): Promise<ChannelResponse>;
/**
 * Enable a channel
 */
export declare function enableChannel(channelId: string): Promise<ChannelResponse>;
/**
 * Disable a channel
 */
export declare function disableChannel(channelId: string): Promise<ChannelResponse>;
/**
 * Get channel health status
 */
export declare function getChannelHealth(channelId: string): Promise<HealthCheckResultDTO>;
/**
 * Verify channel (credentials, health, test transaction)
 */
export declare function verifyChannel(channelId: string, request?: ChannelVerifyRequest): Promise<ChannelVerifyResponse>;
/**
 * Run test transaction on channel
 */
export declare function testChannelTransaction(channelId: string): Promise<unknown>;
/**
 * Update channel limits
 */
export interface UpdateChannelLimitsRequest {
    min_amount?: number;
    max_amount?: number;
    daily_limit?: number;
}
export declare function updateChannelLimits(channelId: string, limits: UpdateChannelLimitsRequest): Promise<ChannelResponse>;
/**
 * Get channel config
 */
export declare function getChannelConfig(channelId: string): Promise<unknown>;
/**
 * Update channel config
 */
export declare function updateChannelConfig(channelId: string, config: Record<string, unknown>): Promise<unknown>;
//# sourceMappingURL=channels.d.ts.map