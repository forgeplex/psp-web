// NON-FROZEN: stub types derived from DBA schema (channels-schema.md)
// TODO(openapi): replace with codegen once v0.9 spec is published

export type ChannelType = 'payment' | 'payout' | 'combined';
export type ChannelStatus = 'inactive' | 'active' | 'maintenance';
export type HealthStatus = 'unknown' | 'healthy' | 'degraded' | 'failed';

export interface ChannelStub {
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
  created_at?: string;
  updated_at?: string;
}

export interface ChannelConfigStub {
  channel_id: string;
  config?: Record<string, unknown>; // plain
  encrypted_config?: Record<string, unknown>; // encrypted
  masked_fields?: string[];
  writable_fields?: string[];
}
