// NON-FROZEN: stub types based on Arch API Spec v0.9
// TODO(openapi): replace with codegen once API stabilizes
// Source: docs/api/03-channels-api-spec.md

export type ProviderStatus = 'active' | 'inactive';

export interface ProviderConfigField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  required: boolean;
  description: string;
  sensitive: boolean;  // true = 加密存储
}

export interface Provider {
  id: string;
  code: string;                  // 提供商编码
  name: string;                  // 提供商名称
  name_en?: string;              // 英文名称
  description?: string;
  status: ProviderStatus;
  supported_types: Array<'payment' | 'payout' | 'combined'>;
  config_schema: ProviderConfigField[];  // 配置字段定义
  icon_url?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

// API Request/Response types
export interface ListProvidersParams {
  page?: number;
  size?: number;
  status?: ProviderStatus;
  type?: 'payment' | 'payout' | 'combined';
}

export interface ListProvidersResponse {
  code: number;
  data: {
    items: Provider[];
    total: number;
    page: number;
    size: number;
  };
}
