import React, { useState } from 'react';
import { Card, Table, Tag, Input, Space, Badge } from 'antd';
import { SearchOutlined, AppstoreOutlined } from '@ant-design/icons';
import { PageHeader } from '@psp/ui';
import type { Provider } from '../types/domain';

interface ProvidersPageProps {
  data: Provider[];
  loading?: boolean;
}

export function ProvidersPage({ data, loading = false }: ProvidersPageProps) {
  const [searchText, setSearchText] = useState('');

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.code.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Provider',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Provider) => (
        <Space>
          <AppstoreOutlined />
          <span style={{ fontWeight: 500 }}>{name}</span>
          <Tag size="small">{record.code}</Tag>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: Provider['status']) => (
        <Badge
          status={status === 'active' ? 'success' : 'default'}
          text={
            <Tag color={status === 'active' ? 'green' : 'default'}>
              {status === 'active' ? 'Active' : 'Inactive'}
            </Tag>
          }
        />
      ),
    },
    {
      title: 'Supported Types',
      dataIndex: 'supported_types',
      key: 'supported_types',
      render: (types: string[]) => (
        <Space size="small">
          {types.map((type) => (
            <Tag key={type} color="blue">
              {type}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Config Fields',
      dataIndex: 'config_schema',
      key: 'config_schema',
      render: (schema: Provider['config_schema']) => (
        <Space size="small" wrap>
          {schema.map((field) => (
            <Tag key={field.name} size="small">
              {field.name}
              {field.sensitive && <span style={{ marginLeft: 4 }}>🔒</span>}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
  ];

  return (
    <div>
      <PageHeader title="Provider Management" subTitle="Manage payment providers" />
      <Card
        style={{ borderRadius: 8 }}
        extra={
          <Input
            placeholder="Search providers..."
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
            showTotal: (total) => `Total ${total} providers`,
          }}
        />
      </Card>
    </div>
  );
}
