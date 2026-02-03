// NON-FROZEN: stub types derived from DBA schema (channels-schema.md)
// TODO(openapi): replace with codegen once v0.9 spec is published

/** NON-FROZEN */
export type ProviderStatus = 'active' | 'inactive';

/** NON-FROZEN */
export interface ProviderStub {
  id: string;
  code: string;
  name: string;
  status: ProviderStatus;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}
