import React from 'react';
import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@psp/ui';
import type { RoutingStrategy } from '../types/domain';

interface RoutingStrategiesPageProps {
  data: RoutingStrategy[];
}

export function RoutingStrategiesPage({ data }: RoutingStrategiesPageProps) {
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: RoutingStrategy['status']) => (
        <Tag color={value === 'active' ? 'green' : 'default'}>{value}</Tag>
      ),
    },
    { title: 'Priority', dataIndex: 'priority', key: 'priority' },
  ];

  return (
    <div>
      <PageHeader title="Routing Strategies" subtitle="路由策略" />
      <Card style={{ borderRadius: 8 }}>
        <Table rowKey="id" columns={columns} dataSource={data} pagination={false} />
      </Card>
    </div>
  );
}
