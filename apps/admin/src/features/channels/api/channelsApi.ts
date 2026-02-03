import type { Channel } from '../types/domain';
import { stubChannels } from '../data/stub';

// TODO(openapi): Replace with real API calls + OpenAPI types

let channels: Channel[] = [...stubChannels];

export async function listChannels(params?: {
  providerId?: string;
  status?: Channel['status'];
  keyword?: string;
}): Promise<Channel[]> {
  const { providerId, status, keyword } = params ?? {};

  return channels.filter((item) => {
    if (providerId && item.provider_id !== providerId) return false;
    if (status && item.status !== status) return false;
    if (keyword) {
      const text = `${item.name} ${item.code}`.toLowerCase();
      if (!text.includes(keyword.toLowerCase())) return false;
    }
    return true;
  });
}

export async function getChannel(channelId: string): Promise<Channel | undefined> {
  return channels.find((item) => item.id === channelId);
}

export async function createChannel(payload: Partial<Channel>): Promise<Channel> {
  const next: Channel = {
    id: `chn-${Math.random().toString(36).slice(2, 8)}`,
    tenant_id: payload.tenant_id ?? 'tenant-001',
    provider_id: payload.provider_id ?? 'prov-001',
    code: payload.code ?? 'new-channel',
    name: payload.name ?? 'New Channel',
    description: payload.description ?? null,
    type: payload.type ?? 'payment',
    status: payload.status ?? 'inactive',
    priority: payload.priority ?? 100,
    health_status: payload.health_status ?? 'unknown',
    limits: payload.limits ?? {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  channels = [next, ...channels];
  return next;
}

export async function updateChannel(
  channelId: string,
  payload: Partial<Channel>
): Promise<Channel | undefined> {
  channels = channels.map((item) =>
    item.id === channelId
      ? { ...item, ...payload, updated_at: new Date().toISOString() }
      : item
  );
  return channels.find((item) => item.id === channelId);
}

export async function setChannelStatus(
  channelId: string,
  status: Channel['status']
): Promise<Channel | undefined> {
  return updateChannel(channelId, { status });
}
