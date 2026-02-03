// Domain types for Channels module - aligned with API Spec v1.0
// ChannelStatus: inactive/active/maintenance
// HealthStatus: unknown/healthy/degraded/failed

export type ChannelType = 'payment' | 'payout' | 'combined';
export type ChannelStatus = 'inactive' | 'active' | 'maintenance';
export type HealthStatus = 'unknown' | 'healthy' | 'degraded' | 'failed';

export interface Channel {
  id: string;
  tenant_id: string;
  provider_id: string;
  code: string;
  name: string;
  description?: string | null;
  type: ChannelType;
  status: ChannelStatus;
  priority: number;
  health_status: HealthStatus;
  limits?: {
    min_amount?: number;
    max_amount?: number;
    daily_amount?: number;
  };
  success_rate?: number;
  avg_response_ms?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ChannelConfig {
  channel_id: string;
  config?: Record<string, unknown>;
  encrypted_config?: Record<string, unknown>;
  masked_fields?: string[];
  writable_fields?: string[];
}

export interface RoutingStrategy {
  id: string;
  name: string;
  description?: string;
  priority: number;
  enabled: boolean;
  conditions?: Record<string, unknown>;
  target_channels?: string[];
  channel_weights?: Record<string, number>;
  created_at?: string;
  updated_at?: string;
}

// v1.0 Move API request type
export interface MoveStrategyRequest {
  targetId: string;
}
