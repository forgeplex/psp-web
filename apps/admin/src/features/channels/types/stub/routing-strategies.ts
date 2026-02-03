// NON-FROZEN: stub types based on Arch API Spec v0.9
// TODO(openapi): replace with codegen once API stabilizes
// Source: docs/api/03-channels-api-spec.md

export type RoutingStrategyStatus = 'active' | 'inactive';
export type RuleLogic = 'AND' | 'OR';
export type Operator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in';

export interface RuleCondition {
  field: string;             // 支持字段见 API Spec
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
  weight: number;              // >=1
  display_order: number;
  failover_to_channel_id?: string;
}

export interface RoutingStrategy {
  id: string;
  name: string;
  description?: string;
  priority: number;              // 租户内唯一，>=1
  status: RoutingStrategyStatus;
  rules: Rule;
  failover_config: FailoverConfig;
  targets: RoutingTarget[];
  match_count_24h?: number;
  created_at: string;
  updated_at: string;
}

// API Request/Response types
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
  rules: Rule;
  failover_config: FailoverConfig;
  targets: Omit<RoutingTarget, 'id' | 'channel_name'>[];
}

export interface UpdateRoutingStrategyRequest {
  name?: string;
  description?: string;
  rules?: Rule;
  failover_config?: Partial<FailoverConfig>;
  targets?: Omit<RoutingTarget, 'id' | 'channel_name'>[];
}

export interface ReorderRoutingStrategiesRequest {
  items: Array<{
    id: string;
    priority: number;
  }>;
}
