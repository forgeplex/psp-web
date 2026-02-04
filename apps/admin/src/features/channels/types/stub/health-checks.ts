// NON-FROZEN: stub types based on Arch API Spec v0.9
// TODO(openapi): replace with codegen once API stabilizes
// Source: docs/api/03-channels-api-spec.md

export type HealthCheckType = 'scheduled' | 'manual' | 'auto_failover';
export type HealthCheckStatus = 'healthy' | 'degraded' | 'failed';

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

// API Request/Response types
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

export interface ChannelHealthStatus {
  channel_id: string;
  channel_name: string;
  health_status: HealthCheckStatus;
  last_check?: HealthCheck;
  success_rate_24h: number;
  avg_response_ms: number;
}
