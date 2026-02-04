import React from 'react';
import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@psp/ui';
import type { Provider } from '../types/domain';

interface ProvidersPageProps {
  data: Provider[];
}

export function ProvidersPage({ data }: ProvidersPageProps) {
  const columns = [
    { title: 'Provider Code', dataIndex: 'code', key: 'code' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: Provider['status']) => (
        <Tag color={value === 'active' ? 'green' : 'default'}>{value}</Tag>
      ),
    },
    { title: 'Description', dataIndex: 'description', key: 'description' },
  ];

  return (
    <div>
      <PageHeader title="Providers" />
      <Card style={{ borderRadius: 8 }}>
        <Table rowKey="id" columns={columns} dataSource={data} pagination={false} />
      </Card>
    </div>
  );
}
