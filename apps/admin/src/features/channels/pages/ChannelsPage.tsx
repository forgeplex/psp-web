import React from 'react';
import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@psp/ui';
import type { Channel } from '../types/domain';

interface ChannelsPageProps {
  title?: string;
  data: Channel[];
}

export function ChannelsPage({ title = 'Channels', data }: ChannelsPageProps) {
  const columns = [
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: Channel['status']) => (
        <Tag color={value === 'active' ? 'green' : value === 'maintenance' ? 'orange' : 'default'}>{value}</Tag>
      ),
    },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Priority', dataIndex: 'priority', key: 'priority' },
    {
      title: 'Health',
      dataIndex: 'health_status',
      key: 'health_status',
      render: (value: Channel['health_status']) => (
        <Tag color={value === 'healthy' ? 'green' : value === 'degraded' ? 'orange' : value === 'failed' ? 'red' : 'default'}>
          {value}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title={title} />
      <Card style={{ borderRadius: 8 }}>
        <Table rowKey="id" columns={columns} dataSource={data} pagination={false} />
      </Card>
    </div>
  );
}
