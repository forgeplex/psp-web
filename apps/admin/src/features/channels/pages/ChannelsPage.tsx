import React, { useState } from 'react';
import { Card, Table, Tag, Input, Button, Space, Badge } from 'antd';
import { SearchOutlined, PlusOutlined, LinkOutlined } from '@ant-design/icons';
import { PageHeader } from '@psp/ui';
import type { Channel } from '../types/domain';
import { Link } from '@tanstack/react-router';

interface ChannelsPageProps {
  title?: string;
  data: Channel[];
  loading?: boolean;
}

const statusColors: Record<Channel['status'], string> = {
  active: 'green',
  inactive: 'default',
  maintenance: 'orange',
};

const healthColors: Record<Channel['health_status'], string> = {
  healthy: 'success',
  degraded: 'warning',
  failed: 'error',
  unknown: 'default',
};

export function ChannelsPage({ title = 'Channels', data, loading = false }: ChannelsPageProps) {
  const [searchText, setSearchText] = useState('');

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.code.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Channel',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Channel) => (
        <Space direction="vertical" size={0}>
          <Link
            to="/channels/$channelId"
            params={{ channelId: record.id }}
            style={{ fontWeight: 500 }}
          >
            <Space>
              <LinkOutlined />
              {name}
            </Space>
          </Link>
          <Tag style={{ fontSize: 11 }}>{record.code}</Tag>
        </Space>
      ),
    },
    {
      title: 'Provider',
      dataIndex: 'provider_name',
      key: 'provider_name',
      render: (name: string) => <Tag color="blue">{name}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: Channel['status']) => (
        <Badge
          status={healthColors[status] as any}
          text={<Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>}
        />
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      sorter: (a: Channel, b: Channel) => a.priority - b.priority,
    },
    {
      title: 'Health',
      dataIndex: 'health_status',
      key: 'health_status',
      width: 100,
      render: (status: Channel['health_status']) => (
        <Badge
          status={healthColors[status] as any}
          text={status.toUpperCase()}
        />
      ),
    },
    {
      title: 'Limits',
      key: 'limits',
      render: (_: any, record: Channel) => (
        <Space direction="vertical" size={0} style={{ fontSize: 12 }}>
          <span>Min: {record.limits.min_amount}</span>
          <span>Max: {record.limits.max_amount}</span>
          <span>Daily: {record.limits.daily_limit}</span>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={title}
        subtitle="Manage payment channels"
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            Create Channel
          </Button>
        }
      />
      <Card
        style={{ borderRadius: 8 }}
        extra={
          <Input
            placeholder="Search channels..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} channels`,
          }}
        />
      </Card>
    </div>
  );
}
