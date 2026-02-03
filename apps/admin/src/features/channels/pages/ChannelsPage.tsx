import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Input, Modal, Select, Space, Table, Tag } from 'antd';
import { PageHeader } from '@psp/ui';
import { Link } from '@tanstack/react-router';
import type { Channel, Provider } from '../types/domain';
import { getProviders } from '../api/adapter';
import {
  createChannel,
  listChannels,
  setChannelStatus,
  updateChannel,
} from '../api/channelsApi';

interface ChannelsPageProps {
  title?: string;
  providerId?: string;
}

type ChannelFormValues = {
  name: string;
  code: string;
  provider_id: string;
  type: Channel['type'];
  priority: number;
  status: Channel['status'];
};

const statusColor: Record<string, string> = {
  active: 'green',
  inactive: 'default',
  maintenance: 'orange',
};

const healthColor: Record<string, string> = {
  healthy: 'green',
  degraded: 'orange',
  failed: 'red',
  unknown: 'default',
};

export function ChannelsPage({ title = 'Channels', providerId }: ChannelsPageProps) {
  const [data, setData] = useState<Channel[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    providerId: providerId ?? '',
    status: '',
    keyword: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Channel | null>(null);
  const [form] = Form.useForm<ChannelFormValues>();

  useEffect(() => {
    setLoading(true);
    Promise.all([listChannels(), getProviders()])
      .then(([channelsResponse, providerList]) => {
        setData(channelsResponse.items);
        setProviders(providerList);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (filters.providerId && item.provider_id !== filters.providerId) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.keyword) {
        const text = `${item.name} ${item.code}`.toLowerCase();
        if (!text.includes(filters.keyword.toLowerCase())) return false;
      }
      return true;
    });
  }, [data, filters]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: Channel) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      code: record.code,
      provider_id: record.provider_id,
      type: record.type,
      priority: record.priority,
      status: record.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editing) {
      await updateChannel(editing.id, values);
    } else {
      await createChannel(values);
    }
    const next = await listChannels();
    setData(next.items);
    setModalOpen(false);
  };

  const handleStatusChange = async (record: Channel, status: Channel['status']) => {
    await setChannelStatus(record.id, status);
    const next = await listChannels();
    setData(next.items);
  };

  return (
    <div>
      <PageHeader title={title} subtitle="全局通道列表" />
      <Card style={{ borderRadius: 8 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Form layout="inline">
            <Form.Item label="Provider">
              <Select
                allowClear
                placeholder="选择提供商"
                style={{ width: 200 }}
                value={filters.providerId || undefined}
                options={providers.map((item) => ({ label: item.name, value: item.id }))}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, providerId: value ?? '' }))
                }
              />
            </Form.Item>
            <Form.Item label="Channel">
              <Input
                allowClear
                placeholder="名称 / Code"
                value={filters.keyword}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, keyword: event.target.value }))
                }
              />
            </Form.Item>
            <Form.Item label="Status">
              <Select
                allowClear
                placeholder="状态"
                style={{ width: 200 }}
                value={filters.status || undefined}
                options={[
                  { label: 'Enabled', value: 'active' },
                  { label: 'Disabled', value: 'inactive' },
                  { label: 'Maintenance', value: 'maintenance' },
                ]}
                onChange={(value) => setFilters((prev) => ({ ...prev, status: value ?? '' }))}
              />
            </Form.Item>
          </Form>
          <Button type="primary" onClick={openCreate}>
            新建渠道
          </Button>
          <Table
            rowKey="id"
            loading={loading}
            dataSource={filteredData}
            columns={[
              {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                render: (value: string, record: Channel) => (
                  <Link to="/channels/$channelId" params={{ channelId: record.id }}>
                    {value}
                  </Link>
                ),
              },
              { title: 'Code', dataIndex: 'code', key: 'code' },
              { title: 'Provider', dataIndex: 'provider_id', key: 'provider_id' },
              { title: '类型', dataIndex: 'type', key: 'type' },
              {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (value: string) => <Tag color={statusColor[value]}>{value}</Tag>,
              },
              {
                title: '健康度',
                dataIndex: 'health_status',
                key: 'health_status',
                render: (value: string) => <Tag color={healthColor[value]}>{value}</Tag>,
              },
              { title: '优先级', dataIndex: 'priority', key: 'priority' },
              {
                title: '操作',
                key: 'actions',
                render: (_, record) => (
                  <Space>
                    <Button size="small" onClick={() => openEdit(record)}>
                      编辑
                    </Button>
                    <Button size="small" onClick={() => handleStatusChange(record, 'active')}>
                      Enable
                    </Button>
                    <Button size="small" onClick={() => handleStatusChange(record, 'inactive')}>
                      Disable
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleStatusChange(record, 'maintenance')}
                    >
                      Maintenance
                    </Button>
                  </Space>
                ),
              },
            ]}
            pagination={{ pageSize: 10 }}
          />
        </Space>
      </Card>
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        title={editing ? `编辑渠道 ${editing.name}` : '新建渠道'}
        okText="保存"
      >
        <Form form={form} layout="vertical" initialValues={{ status: 'inactive' }}>
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="Code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="provider_id" label="Provider" rules={[{ required: true }]}>
            <Select options={providers.map((item) => ({ label: item.name, value: item.id }))} />
          </Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select
              options={[
                { label: 'Payment', value: 'payment' },
                { label: 'Payout', value: 'payout' },
                { label: 'Combined', value: 'combined' },
              ]}
            />
          </Form.Item>
          <Form.Item name="priority" label="优先级" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select
              options={[
                { label: 'Enabled', value: 'active' },
                { label: 'Disabled', value: 'inactive' },
                { label: 'Maintenance', value: 'maintenance' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Config">
            <Card size="small">TODO(openapi): channel_configs 占位</Card>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
