// Adapter layer to isolate API shape from domain models
// TODO(openapi): replace stub data sources with real API calls

import type {
  Channel,
  HealthCheck,
  Provider,
  RoutingStrategy,
  ChannelConfigMatrix,
  RoutingRuleSpec,
} from '../types/domain';
import {
  stubHealthChecks,
  stubProviders,
  stubRoutingStrategies,
  stubChannelConfigMatrices,
  stubRoutingRuleSpecs,
} from '../data/stub';
import { getChannel, listChannels } from './channelsApi';

export async function getProviders(): Promise<Provider[]> {
  return stubProviders;
}

export async function getChannels(): Promise<Channel[]> {
  const response = await listChannels();
  return response.items;
}

export async function getChannelsByProvider(providerId: string): Promise<Channel[]> {
  const response = await listChannels({ providerId });
  return response.items;
}

export async function getChannelDetail(channelId: string): Promise<Channel | undefined> {
  return getChannel(channelId);
}

export async function getRoutingStrategies(): Promise<RoutingStrategy[]> {
  return stubRoutingStrategies;
}

export async function getHealthChecks(channelId?: string): Promise<HealthCheck[]> {
  if (!channelId) return stubHealthChecks;
  return stubHealthChecks.filter((item) => item.channel_id === channelId);
}

export async function getChannelConfigMatrices(): Promise<ChannelConfigMatrix[]> {
  return stubChannelConfigMatrices;
}

export async function getRoutingRuleSpecs(): Promise<RoutingRuleSpec[]> {
  return stubRoutingRuleSpecs;
}
