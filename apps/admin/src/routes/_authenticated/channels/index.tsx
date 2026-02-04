import React, { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Table,
  Card,
  Button,
  Tag,
  Space,
  Badge,
  Dropdown,
  Tooltip,
  Typography,
  Row,
  Col,
  Statistic,
  Alert,
  message,
} from 'antd';
import {
  PlusOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  ExperimentOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ChannelResponse } from '@psp/api';
import { useChannelList, useEnableChannel, useDisableChannel, useVerifyChannel } from '../../../features/channels/hooks/useChannels';

const { Title, Text } = Typography;

export const Route = createFileRoute('/_authenticated/channels/')({
  component: ChannelsIndexRoute,
});

// Status maps
const channelStatusMap: Record<string, { badge: 'success' | 'warning' | 'default' | 'error'; text: string }> = {
  active: { badge: 'success', text: '已启用' },
  inactive: { badge: 'default', text: '已禁用' },
  maintenance: { badge: 'warning', text: '维护中' },
};

const healthStatusMap: Record<string, { color: 'success' | 'warning' | 'error' | 'default'; text: string }> = {
  healthy: { color: 'success', text: '健康' },
  degraded: { color: 'warning', text: '降级' },
  failed: { color: 'error', text: '故障' },
  unknown: { color: 'default', text: '未知' },
};

// Provider colors
const providerColors: Record<string, string> = {
  stripe: 'blue',
  adyen: 'purple',
  pix: 'green',
  spei: 'orange',
  upi: 'cyan',
};

function ChannelsIndexRoute() {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  
  const { data, isLoading, error, refetch } = useChannelList({
    limit: pagination.pageSize,
    offset: (pagination.current - 1) * pagination.pageSize,
  });

  const enableMutation = useEnableChannel();
  const disableMutation = useDisableChannel();
  const verifyMutation = useVerifyChannel();

  const handleEnable = async (id: string) => {
    try {
      await enableMutation.mutateAsync(id);
      message.success('渠道已启用');
    } catch (e) {
      message.error('启用失败');
    }
  };

  const handleDisable = async (id: string) => {
    try {
      await disableMutation.mutateAsync(id);
      message.success('渠道已禁用');
    } catch (e) {
      message.error('禁用失败');
    }
  };

  const handleTest = async (id: string) => {
    try {
      await verifyMutation.mutateAsync({ channelId: id });
      message.success('连通性测试完成');
    } catch (e) {
      message.error('测试失败');
    }
  };

  const columns = [
    {
      title: '渠道名称',
      dataIndex: 'channel_name',
      key: 'channel_name',
      render: (text: string, record: ChannelResponse) => (
        <Link to="/channels/$channelId" params={{ channelId: record.id! }} style={{ fontWeight: 500 }}>
          {text || record.channel_code}
        </Link>
      ),
    },
    {
      title: '渠道代码',
      dataIndex: 'channel_code',
      key: 'channel_code',
      render: (code: string) => <Tag>{code}</Tag>,
    },
    {
      title: '支付方式',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (method: string) => (
        <Tag color={providerColors[method?.toLowerCase()] || 'default'}>{method || '-'}</Tag>
      ),
    },
    {
      title: '健康状态',
      dataIndex: 'health_status',
      key: 'health_status',
      render: (status: string) => {
        const config = healthStatusMap[status] || healthStatusMap.unknown;
        return (
          <Tooltip title={`最后检查: ${'-'}`}>
            <Badge status={config.color} text={config.text} />
          </Tooltip>
        );
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: number) => (
        <Tag color="blue" style={{ minWidth: 40, textAlign: 'center' }}>
          {priority ?? '-'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = channelStatusMap[status] || channelStatusMap.inactive;
        return <Badge status={config.badge} text={config.text} />;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: unknown, record: ChannelResponse) => {
        const items = [
          {
            key: 'view',
            icon: <EyeOutlined />,
            label: (
              <Link to="/channels/$channelId" params={{ channelId: record.id! }}>
                查看详情
              </Link>
            ),
          },
          {
            key: 'edit',
            icon: <EditOutlined />,
            label: '编辑配置',
          },
          {
            key: 'test',
            icon: <ExperimentOutlined />,
            label: '连通性测试',
            onClick: () => handleTest(record.id!),
          },
          { type: 'divider' as const },
          record.status === 'active'
            ? {
                key: 'disable',
                icon: <PauseCircleOutlined />,
                label: '禁用渠道',
                danger: true,
                onClick: () => handleDisable(record.id!),
              }
            : {
                key: 'enable',
                icon: <PlayCircleOutlined />,
                label: '启用渠道',
                onClick: () => handleEnable(record.id!),
              },
        ];

        return (
          <Dropdown menu={{ items }} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  // API Spec v1.1: flat response { items, total, limit, offset }
  const channels = data?.items || [];
  const activeCount = channels.filter((c) => c.status === 'active').length;
  const healthyCount = channels.filter((c) => c.health_status === 'healthy').length;
  const abnormalCount = channels.filter((c) => c.health_status === 'degraded' || c.health_status === 'failed').length;

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="加载失败"
          description={(error as Error).message}
          type="error"
          action={
            <Button size="small" onClick={() => refetch()}>
              重试
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            渠道管理
          </Title>
          <Text type="secondary">管理支付渠道配置、监控渠道健康状态</Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()} loading={isLoading}>
              刷新
            </Button>
            <Button type="primary" icon={<PlusOutlined />} size="large">
              新建渠道
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总渠道数" value={data?.total || 0} suffix="个" valueStyle={{ color: '#1677ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="已启用" value={activeCount} suffix="个" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="健康渠道" value={healthyCount} suffix="个" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="异常/维护"
              value={abnormalCount}
              suffix="个"
              valueStyle={{ color: abnormalCount > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 渠道列表 */}
      <Card
        title="渠道列表"
        extra={
          <Space>
            <Button>导出数据</Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={channels}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: data?.total || 0,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
          }}
        />
      </Card>
    </div>
  );
}
