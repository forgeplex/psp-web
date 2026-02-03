// Channels module shared types
// Based on DBA Schema + Arch API Spec v0.9
// NON-FROZEN: will be replaced by openapi-typescript codegen

export type ChannelType = 'payment' | 'payout' | 'combined';
export type ChannelStatus = 'inactive' | 'active' | 'maintenance';
export type HealthStatus = 'unknown' | 'healthy' | 'degraded' | 'failed';
export type RoutingStrategyStatus = 'active' | 'inactive';
export type RuleLogic = 'AND' | 'OR';
export type Operator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'between';
export type ProviderStatus = 'active' | 'inactive';
export type HealthCheckType = 'scheduled' | 'manual' | 'auto_failover';
export type HealthCheckStatus = 'healthy' | 'degraded' | 'failed';

// Config field types per API Spec v0.9
export type ConfigFieldType = 'string' | 'number' | 'enum' | 'boolean' | 'secret';

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

// Routing Strategy types - API Spec v0.9
export interface RuleCondition {
  field: string;
  operator: Operator;
  value: any;
}

// API Spec v0.9: 单层 AND 条件
export interface RoutingRule {
  conditions: RuleCondition[];
  logic: 'AND'; // Sprint 2: 仅支持单层 AND
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
  rules: RoutingRule;
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

// Provider types - API Spec v0.9: ConfigFieldType 5 种类型
export interface ProviderConfigField {
  name: string;
  type: ConfigFieldType;
  required: boolean;
  description: string;
  default_value?: any;
  options?: string[]; // for enum type
  sensitive: boolean; // for secret type
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

// API Request/Response types
export interface ListChannelsParams {
  page?: number;
  size?: number;
  status?: ChannelStatus;
  provider?: string;
  keyword?: string;
  type?: ChannelType;
}

export interface ListChannelsResponse {
  code: number;
  data: {
    items: Channel[];
    total: number;
    page: number;
    size: number;
  };
}

export interface CreateChannelRequest {
  code: string;
  name: string;
  description?: string;
  provider_id: string;
  type: ChannelType;
  priority: number;
  limits: ChannelLimits;
  config: Record<string, any>;
}

export interface UpdateChannelRequest {
  name?: string;
  description?: string;
  priority?: number;
  limits?: Partial<ChannelLimits>;
  config?: Record<string, any>;
}

export interface ToggleChannelRequest {
  status: ChannelStatus;
}

export interface ListRoutingStrategiesParams {
  page?: number;
  size?: number;
  status?: RoutingStrategyStatus;
}

export interface ListRoutingStrategiesResponse {
  code: number;
  data: {
    items: RoutingStrategy[];
    total: number;
    page: number;
    size: number;
  };
}

export interface CreateRoutingStrategyRequest {
  name: string;
  description?: string;
  priority: number;
  rules: RoutingRule;
  failover_config: FailoverConfig;
  targets: Array<{
    channel_id: string;
    weight: number;
    display_order: number;
    failover_to_channel_id?: string;
  }>;
}

export interface UpdateRoutingStrategyRequest {
  name?: string;
  description?: string;
  rules?: RoutingRule;
  failover_config?: Partial<FailoverConfig>;
  targets?: Array<{
    channel_id: string;
    weight: number;
    display_order: number;
    failover_to_channel_id?: string;
  }>;
}

// API Spec v0.9: POST /routing-strategies/reorder - 批量排序
export interface ReorderRoutingStrategiesRequest {
  items: Array<{
    id: string;
    priority: number;
  }>;
}

export interface ListHealthChecksParams {
  page?: number;
  size?: number;
  channel_id?: string;
  status?: HealthCheckStatus;
  check_type?: HealthCheckType;
}

export interface ListHealthChecksResponse {
  code: number;
  data: {
    items: HealthCheck[];
    total: number;
    page: number;
    size: number;
  };
}

export interface TriggerHealthCheckRequest {
  channel_id: string;
}

export interface ListProvidersParams {
  page?: number;
  size?: number;
  status?: ProviderStatus;
  type?: ChannelType;
}

export interface ListProvidersResponse {
  code: number;
  data: {
    items: Provider[];
    total: number;
    page: number;
    size: number;
  };
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
  rules: RoutingRule;
  failover_config: FailoverConfig;
  targets: Array<{
    channel_id: string;
    weight: number;
    display_order: number;
    failover_to_channel_id?: string;
  }>;
}
