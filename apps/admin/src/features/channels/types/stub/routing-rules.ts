/** NON-FROZEN */
export interface RoutingRuleSpecStub {
  id: string;
  name: string;
  schema: Record<string, unknown>;
  validation_rules: string[];
  samples: Array<Record<string, unknown>>;
  error_codes: Array<{
    code: string;
    message: string;
    reason: string;
  }>;
  updated_at: string;
}
