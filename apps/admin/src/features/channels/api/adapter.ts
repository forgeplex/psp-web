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
