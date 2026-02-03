// NON-FROZEN: stub types based on Arch API Spec v0.9
// TODO(openapi): replace with codegen once API stabilizes
// Source: docs/api/03-channels-api-spec.md

export type ChannelType = 'payment' | 'payout' | 'combined';
export type ChannelStatus = 'inactive' | 'active' | 'maintenance';
export type HealthStatus = 'unknown' | 'healthy' | 'degraded' | 'failed';

export interface ChannelLimits {
  min_amount: number;          // 最小金额（分）
  max_amount: number;          // 最大金额（分）
  daily_limit: number;         // 日限额（分）
  monthly_limit: number;       // 月限额（分）
}

export interface Channel {
  id: string;                    // UUID
  code: string;                  // 渠道编码，租户内唯一 [A-Z0-9_]{2,50}
  name: string;                  // 渠道名称
  description?: string;          // 描述
  provider_id: string;           // 提供商ID
  provider_name: string;         // 提供商名称
  type: ChannelType;
  status: ChannelStatus;
  priority: number;              // 优先级，>=0
  limits: ChannelLimits;
  config: Record<string, any>;   // 明文配置
  encrypted_config?: Record<string, string>;  // 加密配置
  health_status: HealthStatus;
  last_health_check?: string;    // ISO 8601
  success_rate_24h?: number;     // 0-1
  avg_response_ms?: number;
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
