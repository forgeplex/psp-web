import React, { useState } from 'react';
import {
  Table,
  Card,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Badge,
  Slider,
  Row,
  Col,
  Tooltip,
  Dropdown,
  Modal,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  SettingOutlined,
  MoreOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import type { Channel, ChannelStatus } from '../types/domain';
import { useChannels, useToggleChannel, useDeleteChannel } from '../hooks';
import { ChannelStatusBadge } from '../components/ChannelStatusBadge';

const { Option } = Select;

// Health status mapping
type HealthStatus = 'healthy' | 'warning' | 'critical' | 'offline';

interface ChannelWithHealth extends Channel {
  healthStatus?: HealthStatus;
}

// Map API status to UI health status
function getHealthStatus(channel: Channel): HealthStatus {
  // TODO: Use real health_status field when API v1.0 is ready
  if (channel.status === 'inactive') return 'offline';
  if (channel.status === 'maintenance') return 'warning';
  return 'healthy';
}

export function ChannelsPage() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<ChannelStatus | undefined>();
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 1000000]);

  const { data, isLoading, refetch } = useChannels({
    keyword: searchKeyword,
    status: statusFilter,
  });

  const toggleMutation = useToggleChannel();
  const deleteMutation = useDeleteChannel();

  const channels = data?.items || [];

  const handleToggleStatus = (channel: Channel) => {
    const newStatus: ChannelStatus = channel.status === 'active' ? 'inactive' : 'active';
    Modal.confirm({
      title: \`\${newStatus === 'active' ? 'Enable' : 'Disable'} Channel\`,
      content: \`Are you sure you want to \${newStatus === 'active' ? 'enable' : 'disable'} "\${channel.name}"?\`,
      onOk: async () => {
        try {
          await toggleMutation.mutateAsync({ channelId: channel.id, status: newStatus });
          message.success(\`Channel \${newStatus === 'active' ? 'enabled' : 'disabled'} successfully\`);
        } catch {
          message.error(\`Failed to \${newStatus === 'active' ? 'enable' : 'disable'} channel\`);
        }
      },
    });
  };

  const handleDelete = (channel: Channel) => {
    Modal.confirm({
      title: 'Delete Channel',
      content: \`Are you sure you want to delete "\${channel.name}"? This action cannot be undone.\`,
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(channel.id);
          message.success('Channel deleted successfully');
        } catch {
          message.error('Failed to delete channel');
        }
      },
    });
  };

  const columns: ColumnsType<Channel> = [
    {
      title: 'Channel',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Channel) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 500 }}>{name}</span>
          <span style={{ fontSize: 12, color: '#8c8c8c' }}>{record.code}</span>
        </Space>
      ),
    },
    {
      title: 'Provider',
      dataIndex: 'providerId',
      key: 'provider',
      width: 120,
      render: (providerId: string) => <Tag>{providerId}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: ChannelStatus) => <ChannelStatusBadge status={status} />,
    },
    {
      title: 'Health',
      key: 'health',
      width: 100,
      render: (_, record: Channel) => {
        const health = getHealthStatus(record);
        const statusColors = {
          healthy: 'success',
          warning: 'warning',
          critical: 'error',
          offline: 'default',
        };
        return <Badge status={statusColors[health] as any} text={health} />;
      },
    },
    {
      title: 'Amount Range',
      key: 'amountRange',
      width: 180,
      render: (_, record: Channel) => (
        <span>{record.limits?.min_amount || 0} - {record.limits?.max_amount || 0} {"USD"}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record: Channel) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              icon={<LineChartOutlined />}
              size="small"
              onClick={() => navigate({ to: '/channels/\${record.id}' })}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<SettingOutlined />}
              size="small"
              onClick={() => navigate({ to: '/channels/\${record.id}/edit' })}
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'toggle',
                  label: record.status === 'active' ? 'Disable' : 'Enable',
                  onClick: () => handleToggleStatus(record),
                },
                {
                  key: 'delete',
                  label: 'Delete',
                  danger: true,
                  onClick: () => handleDelete(record),
                },
              ],
            }}
          >
            <Button icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Input
            placeholder="Search channels..."
            prefix={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            allowClear
          />
        </Col>
        <Col span={4}>
          <Select
            placeholder="Filter by Status"
            allowClear
            style={{ width: '100%' }}
            value={statusFilter}
            onChange={setStatusFilter}
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
            <Option value="maintenance">Maintenance</Option>
          </Select>
        </Col>
        <Col span={8}>
          <Space direction="vertical" size={0} style={{ width: '100%' }}>
            <span style={{ fontSize: 12, color: '#8c8c8c' }}>
              Amount Range: {amountRange[0]} - {amountRange[1]}
            </span>
            <Slider
              range
              min={0}
              max={1000000}
              value={amountRange}
              onChange={setAmountRange}
            />
          </Space>
        </Col>
        <Col span={4} style={{ textAlign: 'right' }}>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()} loading={isLoading}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate({ to: '/channels/create' })}
            >
              New Channel
            </Button>
          </Space>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={channels}
        loading={isLoading}
        rowKey="id"
        pagination={{
          total: data?.total || 0,
          pageSize: data?.pageSize || 10,
          current: data?.page || 1,
        }}
      />
    </Card>
  );
}
