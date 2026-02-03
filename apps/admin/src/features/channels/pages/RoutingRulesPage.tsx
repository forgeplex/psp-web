import React from 'react';
import { Card, Divider, List, Tag, Typography } from 'antd';
import { PageHeader } from '@psp/ui';
import type { RoutingStrategy } from '../types/domain';
import { stubRoutingStrategies } from '../data/stub';

const { Paragraph, Text } = Typography;

// Stub routing rule spec
interface RoutingRuleSpec {
  id: string;
  name: string;
  description: string;
  updated_at: string;
  schema: object;
  validation_rules: string[];
  samples: object[];
  error_codes: Array<{ code: string; message: string; reason: string }>;
}

const stubRuleSpecs: RoutingRuleSpec[] = [
  {
    id: 'rule-001',
    name: '金额路由规则',
    description: '根据交易金额选择渠道',
    updated_at: '2024-01-15T00:00:00Z',
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number', minimum: 0 },
        currency: { type: 'string', enum: ['USD', 'CNY', 'EUR'] },
      },
    },
    validation_rules: ['amount > 0', 'currency in allowed list'],
    samples: [
      { amount: 100, currency: 'USD', target_channel: 'stripe-main' },
      { amount: 5000, currency: 'CNY', target_channel: 'stripe-backup' },
    ],
    error_codes: [
      { code: 'INVALID_AMOUNT', message: '金额无效', reason: 'amount <= 0' },
      { code: 'UNSUPPORTED_CURRENCY', message: '不支持的币种', reason: 'currency not in enum' },
    ],
  },
];

interface RoutingRulesPageProps {
  data?: RoutingStrategy[];
}

export function RoutingRulesPage({ data }: RoutingRulesPageProps) {
  return (
    <div>
      <PageHeader title="Routing Rules" subtitle="路由规则定义" />
      <Card style={{ borderRadius: 8 }}>
        {stubRuleSpecs.map((spec) => (
          <div key={spec.id} style={{ marginBottom: 24 }}>
            <Typography.Title level={5} style={{ marginBottom: 4 }}>
              {spec.name}
            </Typography.Title>
            <Text type="secondary">更新时间：{spec.updated_at}</Text>
            <Paragraph>{spec.description}</Paragraph>

            <Divider orientation="left">Schema</Divider>
            <Paragraph>
              <pre style={{ background: '#f6f7f9', padding: 12, borderRadius: 8 }}>
                {JSON.stringify(spec.schema, null, 2)}
              </pre>
            </Paragraph>

            <Divider orientation="left">校验规则</Divider>
            <List
              size="small"
              dataSource={spec.validation_rules}
              renderItem={(rule) => (
                <List.Item>
                  <Text>{rule}</Text>
                </List.Item>
              )}
            />

            <Divider orientation="left">Samples</Divider>
            {spec.samples.map((sample, index) => (
              <Paragraph key={index}>
                <pre style={{ background: '#f6f7f9', padding: 12, borderRadius: 8 }}>
                  {JSON.stringify(sample, null, 2)}
                </pre>
              </Paragraph>
            ))}

            <Divider orientation="left">错误码示例</Divider>
            <List
              size="small"
              dataSource={spec.error_codes}
              renderItem={(item) => (
                <List.Item>
                  <Tag color="red">{item.code}</Tag>
                  <Text>{item.message}</Text>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    {item.reason}
                  </Text>
                </List.Item>
              )}
            />
          </div>
        ))}
      </Card>
    </div>
  );
}
