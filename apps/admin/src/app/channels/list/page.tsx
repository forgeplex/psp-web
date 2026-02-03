'use client';

import React, { useState } from 'react';
import {
  Table,
  Card,
  Button,
  Tag,
  Space,
  Badge,
  Dropdown,
  Progress,
  Tooltip,
  Typography,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

// 健康状态映射
const healthStatusMap = {
  HEALTHY: { color: 'success', text: '健康', icon: '🟢' },
  WARNING: { color: 'warning', text: '警告', icon: '🟡' },
  CRITICAL: { color: 'error', text: '严重', icon: '🔴' },
  OFFLINE: { color: 'default', text: '离线', icon: '⚫' },
};

// 渠道状态映射
const channelStatusMap = {
  active: { color: 'success', text: '已启用' },
  inactive: { color: 'default', text: '已禁用' },
  error: { color: 'error', text: '错误' },
  created: { color: 'processing', text: '创建中' },
};

// 提供商标签颜色
const providerColors: Record<string, string> = {
  stripe: 'blue',
  adyen: 'purple',
  pix: 'green',
  spei: 'orange',
  upi: 'cyan',
};

// 模拟数据
const mockData = [
  {
    id: 'ch_abc123',
    name: 'Stripe-Brazil',
    provider: 'stripe',
    status: 'active',
    weight: 60,
    success_rate: 98.5,
    avg_response_ms: 245,
    health_status: 'HEALTHY',
    created_at: '2026-01-15T08:30:00Z',
  },
  {
    id: 'ch_def456',
    name: 'Adyen-Mexico',
    provider: 'adyen',
    status: 'active',
    weight: 40,
    success_rate: 96.2,
    avg_response_ms: 320,
    health_status: 'HEALTHY',
    created_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'ch_ghi789',
    name: 'Pix-Local',
    provider: 'pix',
    status: 'warning',
    weight: 30,
    success_rate: 92.1,
    avg_response_ms: 1800,
    health_status: 'WARNING',
    created_at: '2026-01-05T14:20:00Z',
  },
  {
    id: 'ch_jkl012',
    name: 'SPEI-Backup',
    provider: 'spei',
    status: 'inactive',
    weight: 10,
    success_rate: 0,
    avg_response_ms: 0,
    health_status: 'OFFLINE',
    created_at: '2025-12-20T09:00:00Z',
  },
];

export default function ChannelsListPage() {
  const [loading, setLoading] = useState(false);

  const handleDisable = (id: string) => {
    console.log('Disable channel:', id);
  };

  const handleEnable = (id: string) => {
    console.log('Enable channel:', id);
  };

  const handleTest = (id: string) => {
    console.log('Test channel:', id);
  };

  const columns = [
    {
      title: '渠道名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Link href={`/channels/detail/${record.id}`} style={{ fontWeight: 500 }}>
          {text}
        </Link>
      ),
    },
    {
      title: '提供商',
      dataIndex: 'provider',
      key: 'provider',
      render: (provider: string) => (
        <Tag color={providerColors[provider] || 'default'} style={{ textTransform: 'uppercase' }}>
          {provider}
        </Tag>
      ),
    },
    {
      title: '健康状态',
      dataIndex: 'health_status',
      key: 'health_status',
      render: (status: keyof typeof healthStatusMap) => {
        const config = healthStatusMap[status] || healthStatusMap.OFFLINE;
        return (
          <Tooltip title={`最后检查: 5分钟前`}>
            <Badge status={config.color as any} text={config.text} />
          </Tooltip>
        );
      },
    },
    {
      title: '24h成功率',
      dataIndex: 'success_rate',
      key: 'success_rate',
      render: (rate: number, record: any) =>
        record.status === 'inactive' ? (
          <Text type="secondary">-</Text>
        ) : (
          <Progress
            percent={rate}
            size="small"
            status={rate >= 95 ? 'success' : rate >= 90 ? 'normal' : 'exception'}
            format={(p) => `${p?.toFixed(1)}%`}
            style={{ width: 80 }}
          />
        ),
    },
    {
      title: '平均响应',
      dataIndex: 'avg_response_ms',
      key: 'avg_response_ms',
      render: (ms: number, record: any) =>
        record.status === 'inactive' ? (
          <Text type="secondary">-</Text>
        ) : (
          <Text style={{ color: ms > 1000 ? '#ff4d4f' : ms > 500 ? '#faad14' : '#52c41a' }}>
            {ms}ms
          </Text>
        ),
    },
    {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight: number) => (
        <Tag color="blue" style={{ minWidth: 40, textAlign: 'center' }}>
          {weight}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: keyof typeof channelStatusMap) => {
        const config = channelStatusMap[status] || channelStatusMap.inactive;
        return <Badge status={config.color as any} text={config.text} />;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => {
        const items = [
          {
            key: 'view',
            icon: <EyeOutlined />,
            label: <Link href={`/channels/detail/${record.id}`}>查看详情</Link>,
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
            onClick: () => handleTest(record.id),
          },
          { type: 'divider' },
          record.status === 'active'
            ? {
                key: 'disable',
                icon: <PauseCircleOutlined />,
                label: '禁用渠道',
                danger: true,
                onClick: () => handleDisable(record.id),
              }
            : {
                key: 'enable',
                icon: <PlayCircleOutlined />,
                label: '启用渠道',
                onClick: () => handleEnable(record.id),
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
          <Button type="primary" icon={<PlusOutlined />} size="large">
            新建渠道
          </Button>
        </Col>
      </Row>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总渠道数"
              value={4}
              suffix="个"
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已启用"
              value={3}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="健康渠道"
              value={2}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="警告/异常"
              value={1}
              suffix="个"
              valueStyle={{ color: '#faad14' }}
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
          dataSource={mockData}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  );
}
