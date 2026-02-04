import type { Provider, Channel, RoutingStrategy, HealthCheck } from '../types/domain';

export const stubProviders: Provider[] = [
  {
    id: 'prov-001',
    code: 'stripe',
    name: 'Stripe',
    status: 'active',
    description: 'Global payment provider',
  },
  {
    id: 'prov-002',
    code: 'paypal',
    name: 'PayPal',
    status: 'inactive',
    description: 'Legacy provider (paused)',
  },
];

export const stubChannels: Channel[] = [
  {
    id: 'chn-001',
    tenant_id: 'tenant-001',
    provider_id: 'prov-001',
    code: 'stripe-main',
    name: 'Stripe 主通道',
    description: '默认收款通道',
    type: 'payment',
    status: 'active',
    priority: 10,
    health_status: 'healthy',
    limits: { min_amount: 1, max_amount: 5000000, daily_amount: 10000000 },
  },
  {
    id: 'chn-002',
    tenant_id: 'tenant-001',
    provider_id: 'prov-001',
    code: 'stripe-backup',
    name: 'Stripe 备通道',
    description: '备用收款通道',
    type: 'payment',
    status: 'maintenance',
    priority: 20,
    health_status: 'degraded',
    limits: { min_amount: 1, max_amount: 2000000, daily_amount: 3000000 },
  },
];

export const stubRoutingStrategies: RoutingStrategy[] = [
  {
    id: 'rs-001',
    tenant_id: 'tenant-001',
    name: '默认路由',
    status: 'active',
    priority: 1,
    conditions: { logic: 'AND', conditions: [] },
  },
];

export const stubHealthChecks: HealthCheck[] = [
  {
    id: 'hc-001',
    channel_id: 'chn-001',
    check_type: 'scheduled',
    result: 'healthy',
    latency_ms: 120,
    details: { connectivity: 'ok', auth: 'ok' },
  },
  {
    id: 'hc-002',
    channel_id: 'chn-002',
    check_type: 'scheduled',
    result: 'degraded',
    latency_ms: 450,
    details: { connectivity: 'slow', auth: 'ok' },
  },
];
