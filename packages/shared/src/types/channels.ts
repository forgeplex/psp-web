// Channels module shared types
// Based on DBA Schema + Arch API Spec v0.9
// NON-FROZEN: will be replaced by openapi-typescript codegen

export type ChannelType = 'payment' | 'payout' | 'combined';
export type ChannelStatus = 'inactive' | 'active' | 'maintenance';
export type HealthStatus = 'unknown' | 'healthy' | 'degraded' | 'failed';
export type RoutingStrategyStatus = 'active' | 'inactive';
export type RuleLogic = 'AND' | 'OR';
export type Operator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in';
export type ProviderStatus = 'active' | 'inactive';
export type HealthCheckType = 'scheduled' | 'manual' | 'auto_failover';
export type HealthCheckStatus = 'healthy' | 'degraded' | 'failed';

// Channel types
export interface ChannelLimits {
  min_amount: number;
  max_amount: number;
  daily_limit: number;
  monthly_limit: number;
}

export interface Channel {
  id: string;
  code: string;
  name: string;
  description?: string;
  provider_id: string;
  provider_name: string;
  type: ChannelType;
  status: ChannelStatus;
  priority: number;
  limits: ChannelLimits;
  config: Record<string, any>;
  encrypted_config?: Record<string, string>;
  health_status: HealthStatus;
  last_health_check?: string;
  success_rate_24h?: number;
  avg_response_ms?: number;
  created_at: string;
  updated_at: string;
}

// Routing Strategy types
export interface RuleCondition {
  field: string;
  operator: Operator;
  value: any;
}

export interface Rule {
  conditions: RuleCondition[];
  logic: RuleLogic;
}

export interface FailoverConfig {
  enabled: boolean;
  max_retries: number;
  retry_interval_ms: number;
}

export interface RoutingTarget {
  id: string;
  channel_id: string;
  channel_name: string;
  weight: number;
  display_order: number;
  failover_to_channel_id?: string;
}

export interface RoutingStrategy {
  id: string;
  name: string;
  description?: string;
  priority: number;
  status: RoutingStrategyStatus;
  rules: Rule;
  failover_config: FailoverConfig;
  targets: RoutingTarget[];
  match_count_24h?: number;
  created_at: string;
  updated_at: string;
}

// Health Check types
export interface HealthCheckDetail {
  passed: boolean;
  response_ms: number;
  details?: any;
}

export interface HealthCheckDetails {
  connectivity: HealthCheckDetail;
  auth: HealthCheckDetail;
  transaction?: HealthCheckDetail;
}

export interface HealthCheck {
  id: string;
  channel_id: string;
  channel_name: string;
  check_type: HealthCheckType;
  status: HealthCheckStatus;
  response_time_ms: number;
  details: HealthCheckDetails;
  error_message?: string;
  created_at: string;
}

export interface ChannelHealthStatus {
  channel_id: string;
  channel_name: string;
  health_status: HealthStatus;
  last_check?: HealthCheck;
  success_rate_24h: number;
  avg_response_ms: number;
}

// Provider types
export interface ProviderConfigField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  required: boolean;
  description: string;
  sensitive: boolean;
}

export interface Provider {
  id: string;
  code: string;
  name: string;
  name_en?: string;
  description?: string;
  status: ProviderStatus;
  supported_types: ChannelType[];
  config_schema: ProviderConfigField[];
  icon_url?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

// Form data types
export interface ChannelFormData {
  code: string;
  name: string;
  description?: string;
  provider_id: string;
  type: ChannelType;
  priority: number;
  limits: ChannelLimits;
  config: Record<string, any>;
}

export interface RoutingStrategyFormData {
  name: string;
  description?: string;
  priority: number;
  rules: Rule;
  failover_config: FailoverConfig;
  targets: Array<{
    channel_id: string;
    weight: number;
    display_order: number;
    failover_to_channel_id?: string;
  }>;
}
