import React, { useEffect, useState } from 'react';
import { Card, Divider, List, Tag, Typography } from 'antd';
import { PageHeader } from '@psp/ui';
import type { RoutingRuleSpec } from '../types/domain';
import { getRoutingRuleSpecs } from '../api/adapter';

const { Paragraph, Text } = Typography;

export function RoutingRulesPage() {
  const [data, setData] = useState<RoutingRuleSpec[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getRoutingRuleSpecs()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Routing Rules JSON" subtitle="Schema / 校验规则 / Samples（stub）" />
      <Card loading={loading} style={{ borderRadius: 8 }}>
        {data.map((spec) => (
          <div key={spec.id} style={{ marginBottom: 24 }}>
            <Typography.Title level={5} style={{ marginBottom: 4 }}>
              {spec.name}
            </Typography.Title>
            <Text type="secondary">更新时间：{spec.updated_at}</Text>

            <Divider orientation="left" style={{ marginTop: 16 }}>Schema</Divider>
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
