import React from 'react';
import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@psp/ui';
import type { HealthCheck } from '../types/domain';

interface HealthChecksPageProps {
  data: HealthCheck[];
}

export function HealthChecksPage({ data }: HealthChecksPageProps) {
  const columns = [
    { title: 'Channel', dataIndex: 'channel_id', key: 'channel_id' },
    {
      title: 'Result',
      dataIndex: 'result',
      key: 'result',
      render: (value: HealthCheck['result']) => (
        <Tag color={value === 'healthy' ? 'green' : value === 'degraded' ? 'orange' : 'red'}>
          {value}
        </Tag>
      ),
    },
    { title: 'Latency(ms)', dataIndex: 'latency_ms', key: 'latency_ms' },
  ];

  return (
    <div>
      <PageHeader title="Health Checks" subtitle="通道健康检查" />
      <Card style={{ borderRadius: 8 }}>
        <Table rowKey="id" columns={columns} dataSource={data} pagination={false} />
      </Card>
    </div>
  );
}
