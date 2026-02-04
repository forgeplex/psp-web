// NON-FROZEN: stub types derived from DBA schema (channels-schema.md)
// TODO(openapi): replace with codegen once v0.9 spec is published

export type HealthCheckType = 'scheduled' | 'manual' | 'auto_failover';
export type HealthCheckResult = 'healthy' | 'degraded' | 'failed';

export interface HealthCheckStub {
  id: string;
  channel_id: string;
  check_type: HealthCheckType;
  result: HealthCheckResult;
  latency_ms?: number;
  error_message?: string | null;
  details?: Record<string, unknown>;
  created_at?: string;
}
