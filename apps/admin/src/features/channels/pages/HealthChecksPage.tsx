import React from 'react';
import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@psp/ui';
import type { HealthCheck } from '../types/domain';

interface HealthChecksPageProps {
  data: HealthCheck[];
}

export function HealthChecksPage({ data }: HealthChecksPageProps) {
  const columns = [
    { title: 'Channel', dataIndex: 'channel_name', key: 'channel_name' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: HealthCheck['status']) => (
        <Tag color={value === 'healthy' ? 'green' : value === 'degraded' ? 'orange' : 'red'}>
          {value}
        </Tag>
      ),
    },
    { title: 'Response Time(ms)', dataIndex: 'response_time_ms', key: 'response_time_ms' },
    { title: 'Check Type', dataIndex: 'check_type', key: 'check_type' },
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
