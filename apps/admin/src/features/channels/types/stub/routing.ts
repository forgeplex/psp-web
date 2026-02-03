// NON-FROZEN: stub types derived from DBA schema (channels-schema.md)
// TODO(openapi): replace with codegen once v0.9 spec is published

/** NON-FROZEN */
export type RoutingStrategyStatus = 'active' | 'inactive';

/** NON-FROZEN */
export interface RoutingStrategyStub {
  id: string;
  tenant_id: string;
  name: string;
  status: RoutingStrategyStatus;
  priority: number;
  conditions?: Record<string, unknown>; // JSONB
  created_at?: string;
  updated_at?: string;
}

/** NON-FROZEN */
export interface RoutingStrategyTargetStub {
  id: string;
  routing_strategy_id: string;
  channel_id: string;
  weight?: number;
  priority?: number;
}
