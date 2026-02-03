import type { Provider, Channel, RoutingStrategy, HealthCheck, HealthCheckDetails } from '../types/domain';

export const stubProviders: Provider[] = [
  {
    id: 'prov-001',
    code: 'stripe',
    name: 'Stripe',
    status: 'active',
    description: 'Global payment provider',
    supported_types: ['payment', 'payout'],
    config_schema: [
      { name: 'api_key', type: 'string', required: true, description: 'API Key', sensitive: true },
      { name: 'webhook_secret', type: 'string', required: false, description: 'Webhook Secret', sensitive: true },
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prov-002',
    code: 'paypal',
    name: 'PayPal',
    status: 'inactive',
    description: 'Legacy provider (paused)',
    supported_types: ['payment'],
    config_schema: [
      { name: 'client_id', type: 'string', required: true, description: 'Client ID', sensitive: false },
      { name: 'client_secret', type: 'string', required: true, description: 'Client Secret', sensitive: true },
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
  },
];

export const stubChannels: Channel[] = [
  {
    id: 'chn-001',
    code: 'stripe-main',
    name: 'Stripe 主通道',
    description: '默认收款通道',
    provider_id: 'prov-001',
    provider_name: 'Stripe',
    type: 'payment',
    status: 'active',
    priority: 10,
    health_status: 'healthy',
    limits: { min_amount: 1, max_amount: 5000000, daily_limit: 10000000, monthly_limit: 100000000 },
    config: {},
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'chn-002',
    code: 'stripe-backup',
    name: 'Stripe 备通道',
    description: '备用收款通道',
    provider_id: 'prov-001',
    provider_name: 'Stripe',
    type: 'payment',
    status: 'maintenance',
    priority: 20,
    health_status: 'degraded',
    limits: { min_amount: 1, max_amount: 2000000, daily_limit: 3000000, monthly_limit: 50000000 },
    config: {},
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
];

export const stubRoutingStrategies: RoutingStrategy[] = [
  {
    id: 'rs-001',
    name: '默认路由',
    description: '默认路由策略',
    status: 'active',
    priority: 1,
    rules: { logic: 'AND', conditions: [] },
    failover_config: { enabled: true, max_retries: 3, retry_interval_ms: 1000 },
    targets: [
      { id: 'rt-001', channel_id: 'chn-001', channel_name: 'Stripe 主通道', weight: 80, display_order: 1 },
      { id: 'rt-002', channel_id: 'chn-002', channel_name: 'Stripe 备通道', weight: 20, display_order: 2, failover_to_channel_id: 'chn-001' },
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

const healthCheckDetails: HealthCheckDetails = {
  connectivity: { passed: true, response_ms: 120, details: {} },
  auth: { passed: true, response_ms: 50, details: {} },
};

const healthCheckDetailsDegraded: HealthCheckDetails = {
  connectivity: { passed: true, response_ms: 450, details: {} },
  auth: { passed: true, response_ms: 80, details: {} },
};

export const stubHealthChecks: HealthCheck[] = [
  {
    id: 'hc-001',
    channel_id: 'chn-001',
    channel_name: 'Stripe 主通道',
    check_type: 'scheduled',
    status: 'healthy',
    response_time_ms: 120,
    details: healthCheckDetails,
    created_at: '2024-02-03T12:00:00Z',
  },
  {
    id: 'hc-002',
    channel_id: 'chn-002',
    channel_name: 'Stripe 备通道',
    check_type: 'scheduled',
    status: 'degraded',
    response_time_ms: 450,
    details: healthCheckDetailsDegraded,
    created_at: '2024-02-03T12:00:00Z',
  },
];
