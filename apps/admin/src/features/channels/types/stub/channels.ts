// NON-FROZEN: stub types derived from DBA schema (channels-schema.md)
// TODO(openapi): replace with codegen once v0.9 spec is published

/** NON-FROZEN */
export type ChannelType = 'payment' | 'payout' | 'combined';
/** NON-FROZEN */
export type ChannelStatus = 'inactive' | 'active' | 'maintenance';
/** NON-FROZEN */
export type HealthStatus = 'unknown' | 'healthy' | 'degraded' | 'failed';

/** NON-FROZEN */
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
    /** 单位待定：amount cents or count（MVP Spec 出后对齐） */
    daily_limit?: number;
    /** 单位待定：amount cents or count（MVP Spec 出后对齐） */
    monthly_limit?: number;
  };
  created_at?: string;
  updated_at?: string;
}

/** NON-FROZEN */
export interface ChannelConfigStub {
  channel_id: string;
  config?: Record<string, unknown>; // plain
  encrypted_config?: Record<string, unknown>; // encrypted
  masked_fields?: string[];
  writable_fields?: string[];
}
