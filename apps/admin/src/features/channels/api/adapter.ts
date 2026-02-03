// Adapter layer to isolate API shape from domain models
// TODO(openapi): replace stub data sources with real API calls

import type { Channel, HealthCheck, Provider, RoutingStrategy } from '../types/domain';
import { stubChannels, stubHealthChecks, stubProviders, stubRoutingStrategies } from '../data/stub';

export async function getProviders(): Promise<Provider[]> {
  return stubProviders;
}

export async function getChannels(): Promise<Channel[]> {
  return stubChannels;
}

export async function getChannelsByProvider(providerId: string): Promise<Channel[]> {
  return stubChannels.filter((item) => item.provider_id === providerId);
}

export async function getChannelDetail(channelId: string): Promise<Channel | undefined> {
  return stubChannels.find((item) => item.id === channelId);
}

export async function getRoutingStrategies(): Promise<RoutingStrategy[]> {
  return stubRoutingStrategies;
}

export async function getHealthChecks(channelId?: string): Promise<HealthCheck[]> {
  if (!channelId) return stubHealthChecks;
  return stubHealthChecks.filter((item) => item.channel_id === channelId);
}

// Channel Config Matrix (mock implementation)
export interface ChannelConfigMatrix {
  channel_id: string;
  channel_name: string;
  confirm_required: boolean;
  audit_required: boolean;
  updated_at: string;
  fields: {
    key: string;
    label: string;
    type: string;
    required: boolean;
    masked: boolean;
    write_only: boolean;
    patch_strategy: string;
    description?: string;
  }[];
}

const mockChannelConfigMatrices: ChannelConfigMatrix[] = [
  {
    channel_id: 'chn_001',
    channel_name: '微信支付',
    confirm_required: true,
    audit_required: false,
    updated_at: '2026-02-03T10:00:00Z',
    fields: [
      { key: 'app_id', label: 'App ID', type: 'string', required: true, masked: false, write_only: false, patch_strategy: 'replace', description: '微信开放平台AppID' },
      { key: 'mch_id', label: '商户号', type: 'string', required: true, masked: false, write_only: false, patch_strategy: 'replace' },
      { key: 'api_key', label: 'API密钥', type: 'secret', required: true, masked: true, write_only: true, patch_strategy: 'replace' },
    ],
  },
  {
    channel_id: 'chn_002',
    channel_name: '支付宝',
    confirm_required: false,
    audit_required: true,
    updated_at: '2026-02-02T15:30:00Z',
    fields: [
      { key: 'app_id', label: 'App ID', type: 'string', required: true, masked: false, write_only: false, patch_strategy: 'replace' },
      { key: 'private_key', label: '私钥', type: 'secret', required: true, masked: true, write_only: true, patch_strategy: 'replace' },
      { key: 'alipay_public_key', label: '支付宝公钥', type: 'string', required: true, masked: false, write_only: false, patch_strategy: 'replace' },
    ],
  },
];

export async function getChannelConfigMatrices(): Promise<ChannelConfigMatrix[]> {
  return mockChannelConfigMatrices;
}
