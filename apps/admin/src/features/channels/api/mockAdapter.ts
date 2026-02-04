// Mock Adapter for Channels API
// Uses stub data when backend is not ready
// TODO: Remove this file once API is live

import {
  stubProviders,
  stubChannels,
  stubRoutingStrategies,
  stubHealthChecks,
} from '../data/stub';
import type {
  Provider,
  Channel,
  RoutingStrategy,
  HealthCheck,
  ListProvidersResponse,
  ListChannelsResponse,
  ListRoutingStrategiesResponse,
  ListHealthChecksResponse,
} from '../types/domain';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Providers API
export async function getProviders(): Promise<ListProvidersResponse['data']> {
  await delay(300);
  return {
    items: stubProviders,
    total: stubProviders.length,
    page: 1,
    size: 20,
  };
}

export async function getProviderDetail(id: string): Promise<Provider> {
  await delay(200);
  const provider = stubProviders.find((p) => p.id === id);
  if (!provider) throw new Error('Provider not found');
  return provider;
}

// Channels API
export async function getChannels(): Promise<ListChannelsResponse['data']> {
  await delay(300);
  return {
    items: stubChannels,
    total: stubChannels.length,
    page: 1,
    size: 20,
  };
}

export async function getChannelDetail(id: string): Promise<Channel> {
  await delay(200);
  const channel = stubChannels.find((c) => c.id === id);
  if (!channel) throw new Error('Channel not found');
  return channel;
}

// Routing Strategies API
export async function getRoutingStrategies(): Promise<ListRoutingStrategiesResponse['data']> {
  await delay(300);
  return {
    items: stubRoutingStrategies,
    total: stubRoutingStrategies.length,
    page: 1,
    size: 20,
  };
}

export async function getRoutingStrategyDetail(id: string): Promise<RoutingStrategy> {
  await delay(200);
  const strategy = stubRoutingStrategies.find((s) => s.id === id);
  if (!strategy) throw new Error('Routing strategy not found');
  return strategy;
}

// Health Checks API
export async function getHealthChecks(): Promise<ListHealthChecksResponse['data']> {
  await delay(300);
  return {
    items: stubHealthChecks,
    total: stubHealthChecks.length,
    page: 1,
    size: 20,
  };
}

export async function getHealthCheckDetail(id: string): Promise<HealthCheck> {
  await delay(200);
  const check = stubHealthChecks.find((h) => h.id === id);
  if (!check) throw new Error('Health check not found');
  return check;
}
