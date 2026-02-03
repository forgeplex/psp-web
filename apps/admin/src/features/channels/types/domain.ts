// Domain models for Channels module
// Based on Arch API Spec v0.9
// TODO(openapi): reconcile with generated types once API stabilizes

// Re-export all stub types
export * from './stub/channels';
export * from './stub/routing-strategies';
export * from './stub/health-checks';
export * from './stub/providers';

// Domain-specific types (if different from API types)
export interface ChannelFormData {
  code: string;
  name: string;
  description?: string;
  provider_id: string;
  type: 'payment' | 'payout' | 'combined';
  priority: number;
  limits: {
    min_amount: number;
    max_amount: number;
    daily_limit: number;
    monthly_limit: number;
  };
  config: Record<string, any>;
}

export interface RoutingStrategyFormData {
  name: string;
  description?: string;
  priority: number;
  rules: {
    conditions: Array<{
      field: string;
      operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in';
      value: any;
    }>;
    logic: 'AND' | 'OR';
  };
  failover_config: {
    enabled: boolean;
    max_retries: number;
    retry_interval_ms: number;
  };
  targets: Array<{
    channel_id: string;
    weight: number;
    display_order: number;
    failover_to_channel_id?: string;
  }>;
}

// Tab types for ChannelDetailPage
export type ChannelDetailTab = 'config' | 'routing' | 'health';
