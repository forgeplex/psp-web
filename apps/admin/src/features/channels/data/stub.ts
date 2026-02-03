import type {
  Provider,
  Channel,
  RoutingStrategy,
  HealthCheck,
  ChannelConfigMatrix,
  RoutingRuleSpec,
} from '../types/domain';

export const stubProviders: Provider[] = [
  {
    id: 'prov-001',
    code: 'stripe',
    name: 'Stripe',
    status: 'active',
    description: 'Global payment provider',
    created_at: '2026-02-03T03:00:00Z',
    updated_at: '2026-02-03T03:10:00Z',
  },
  {
    id: 'prov-002',
    code: 'paypal',
    name: 'PayPal',
    status: 'inactive',
    description: 'Legacy provider (paused)',
    created_at: '2026-02-02T08:00:00Z',
    updated_at: '2026-02-02T08:00:00Z',
  },
];

export const stubChannels: Channel[] = [
  {
    id: 'chn-001',
    tenant_id: 'tenant-001',
    provider_id: 'prov-001',
    code: 'stripe-main',
    name: 'Stripe 主通道',
    description: '默认收款通道',
    type: 'payment',
    status: 'active',
    priority: 10,
    health_status: 'healthy',
    limits: { min_amount: 1, max_amount: 5000000, daily_limit: 10000000 },
    created_at: '2026-02-03T03:00:00Z',
    updated_at: '2026-02-03T03:10:00Z',
  },
  {
    id: 'chn-002',
    tenant_id: 'tenant-001',
    provider_id: 'prov-001',
    code: 'stripe-backup',
    name: 'Stripe 备通道',
    description: '备用收款通道',
    type: 'payment',
    status: 'maintenance',
    priority: 20,
    health_status: 'degraded',
    limits: { min_amount: 1, max_amount: 2000000, daily_limit: 3000000 },
    created_at: '2026-02-02T08:00:00Z',
    updated_at: '2026-02-03T02:00:00Z',
  },
];

export const stubRoutingStrategies: RoutingStrategy[] = [
  {
    id: 'rs-001',
    tenant_id: 'tenant-001',
    name: '默认路由',
    status: 'active',
    priority: 1,
    conditions: { logic: 'AND', conditions: [] },
    created_at: '2026-02-03T02:00:00Z',
    updated_at: '2026-02-03T02:00:00Z',
  },
];

export const stubHealthChecks: HealthCheck[] = [
  {
    id: 'hc-001',
    channel_id: 'chn-001',
    check_type: 'scheduled',
    result: 'healthy',
    latency_ms: 120,
    details: { connectivity: 'ok', auth: 'ok' },
    created_at: '2026-02-03T03:10:00Z',
  },
  {
    id: 'hc-002',
    channel_id: 'chn-002',
    check_type: 'scheduled',
    result: 'degraded',
    latency_ms: 450,
    details: { connectivity: 'slow', auth: 'ok' },
    created_at: '2026-02-03T03:05:00Z',
  },
];

export const stubChannelConfigMatrices: ChannelConfigMatrix[] = [
  {
    channel_id: 'chn-001',
    channel_name: 'Stripe 主通道',
    confirm_required: true,
    audit_required: true,
    updated_at: '2026-02-03T05:00:00Z',
    fields: [
      {
        key: 'api_key',
        label: 'API Key',
        type: 'secret',
        required: true,
        masked: true,
        write_only: true,
        patch_strategy: 'replace',
        description: '用于签名的密钥，仅支持写入。',
      },
      {
        key: 'webhook_url',
        label: 'Webhook URL',
        type: 'string',
        required: true,
        masked: false,
        write_only: false,
        patch_strategy: 'replace',
      },
      {
        key: 'settlement_delay',
        label: '结算延迟(天)',
        type: 'number',
        required: false,
        masked: false,
        write_only: false,
        patch_strategy: 'partial',
      },
    ],
  },
  {
    channel_id: 'chn-002',
    channel_name: 'Stripe 备通道',
    confirm_required: false,
    audit_required: true,
    updated_at: '2026-02-02T12:00:00Z',
    fields: [
      {
        key: 'client_id',
        label: 'Client ID',
        type: 'string',
        required: true,
        masked: false,
        write_only: false,
        patch_strategy: 'replace',
      },
      {
        key: 'client_secret',
        label: 'Client Secret',
        type: 'secret',
        required: true,
        masked: true,
        write_only: true,
        patch_strategy: 'replace',
      },
      {
        key: 'risk_config',
        label: '风控配置(JSON)',
        type: 'json',
        required: false,
        masked: false,
        write_only: false,
        patch_strategy: 'merge',
        description: '支持局部 PATCH 合并。',
      },
    ],
  },
];

export const stubRoutingRuleSpecs: RoutingRuleSpec[] = [
  {
    id: 'routing_rule_spec_001',
    name: '默认路由规则 JSON',
    updated_at: '2026-02-03T04:30:00Z',
    schema: {
      type: 'object',
      required: ['conditions', 'actions'],
      properties: {
        conditions: {
          type: 'array',
          items: {
            type: 'object',
            required: ['field', 'operator', 'value'],
            properties: {
              field: { type: 'string' },
              operator: { type: 'string', enum: ['eq', 'in', 'gte', 'lte'] },
              value: {},
            },
          },
        },
        actions: {
          type: 'array',
          items: {
            type: 'object',
            required: ['type', 'payload'],
            properties: {
              type: { type: 'string', enum: ['route', 'fallback'] },
              payload: { type: 'object' },
            },
          },
        },
        priority: { type: 'number' },
      },
    },
    validation_rules: [
      'conditions 至少包含 1 条规则',
      'actions 至少包含 1 条路由动作',
      'priority 必须是 1-100 的整数',
    ],
    samples: [
      {
        conditions: [
          { field: 'amount', operator: 'gte', value: 1000 },
          { field: 'currency', operator: 'eq', value: 'USD' },
        ],
        actions: [
          { type: 'route', payload: { channel_id: 'chn-001' } },
        ],
        priority: 10,
      },
      {
        conditions: [
          { field: 'card_brand', operator: 'in', value: ['visa', 'master'] },
        ],
        actions: [
          { type: 'route', payload: { channel_id: 'chn-002' } },
          { type: 'fallback', payload: { channel_id: 'chn-001' } },
        ],
        priority: 20,
      },
    ],
    error_codes: [
      {
        code: 'ROUTING_RULE_SCHEMA_INVALID',
        message: '路由规则 JSON 不符合 schema',
        reason: '字段缺失或类型不匹配',
      },
      {
        code: 'ROUTING_RULE_CONDITION_EMPTY',
        message: 'conditions 不能为空',
        reason: '未配置任何条件',
      },
    ],
  },
];
