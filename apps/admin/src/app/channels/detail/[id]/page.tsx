'use client';

import React, { useState } from 'react';
import {
  Card,
  Descriptions,
  Badge,
  Tag,
  Button,
  Space,
  Tabs,
  Statistic,
  Row,
  Col,
  Typography,
  Tooltip,
  message,
} from 'antd';
import {
  EditOutlined,
  CopyOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  ExperimentOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { channelStatusMap, healthStatusMap } from '../../status-maps';

const { Title, Text } = Typography;

export default function ChannelDetailPage({ params }: { params: { id: string } }) {
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);

  // 模拟渠道数据 - Schema 版本状态
  const channel = {
    id: params.id,
    name: 'Stripe-Brazil',
    provider: 'stripe',
    status: 'active' as const,
    weight: 60,
    success_rate: 98.5,
    avg_response_ms: 245,
    health_status: 'healthy' as const,
    created_at: '2026-01-15T08:30:00Z',
    updated_at: '2026-02-03T10:20:00Z',
    config: {
      api_key: 'sk_live_51H...xxxxxxxxx',
      webhook_secret: 'whsec_...yyyyyyyyy',
      api_version: '2023-10-16',
    },
    limits: {
      min_amount: 1,
      max_amount: 100000,
      daily_limit: 1000000,
      currency: ['BRL', 'USD'],
    },
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    message.success('密钥已复制到剪贴板');
  };

  const handleTest = async () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      message.success('连通性测试成功！响应时间: 245ms');
    }, 2000);
  };

  const healthConfig = healthStatusMap[channel.health_status] || healthStatusMap.unknown;
  const statusConfig = channelStatusMap[channel.status] || channelStatusMap.inactive;

  const maskKey = (key: string) => {
    if (showKey) return key;
    const prefix = key.slice(0, 10);
    return `${prefix}...${'x'.repeat(20)}`;
  };

  return (
    <div style={{ padding: 24 }}>
      <Link href="/channels/list" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: 16 }}>
        <ArrowLeftOutlined style={{ marginRight: 8 }} />
        返回列表
      </Link>

      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space align="center" size={16}>
            <Title level={3} style={{ margin: 0 }}>
              {channel.name}
            </Title>
            <Badge status={healthConfig.color as any} text={healthConfig.text} />
            <Badge status={statusConfig.badge as any} text={statusConfig.text} />
          </Space>
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            ID: {channel.id} · 提供商: <Tag style={{ textTransform: 'uppercase' }}>{channel.provider}</Tag>
          </Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<ExperimentOutlined />} loading={testing} onClick={handleTest}>
              连通性测试
            </Button>
            {channel.status === 'active' ? (
              <Button danger icon={<PauseCircleOutlined />}>禁用渠道</Button>
            ) : (
              <Button type="primary" icon={<PlayCircleOutlined />}>启用渠道</Button>
            )}
            <Button type="primary" icon={<EditOutlined />}>编辑配置</Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="24h成功率" value={channel.success_rate} suffix="%" precision={1}
              valueStyle={{ color: channel.success_rate >= 95 ? '#52c41a' : '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="平均响应时间" value={channel.avg_response_ms} suffix="ms"
              valueStyle={{ color: channel.avg_response_ms < 500 ? '#52c41a' : '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="权重配置" value={channel.weight} suffix="/ 100" /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="今日请求数" value={1523} suffix="笔" /></Card>
        </Col>
      </Row>

      <Card>
        <Tabs items={[
          {
            key: 'basic',
            label: '基本信息',
            children: (
              <>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="渠道名称">{channel.name}</Descriptions.Item>
                  <Descriptions.Item label="提供商">
                    <Tag color="blue" style={{ textTransform: 'uppercase' }}>{channel.provider}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="渠道ID">{channel.id}</Descriptions.Item>
                  <Descriptions.Item label="创建时间">{channel.created_at}</Descriptions.Item>
                  <Descriptions.Item label="更新时间">{channel.updated_at}</Descriptions.Item>
                  <Descriptions.Item label="健康状态">
                    <Badge status={healthConfig.color as any} text={healthConfig.text} />
                  </Descriptions.Item>
                </Descriptions>
                <Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>限额配置</Title>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="单笔最小金额">{channel.limits.min_amount}</Descriptions.Item>
                  <Descriptions.Item label="单笔最大金额">{channel.limits.max_amount}</Descriptions.Item>
                  <Descriptions.Item label="日限额">{channel.limits.daily_limit.toLocaleString()}</Descriptions.Item>
                  <Descriptions.Item label="支持币种">
                    {channel.limits.currency.map((c) => <Tag key={c}>{c}</Tag>)}
                  </Descriptions.Item>
                </Descriptions>
              </>
            ),
          },
          {
            key: 'config',
            label: 'API 配置',
            children: (
              <>
                <Card title="API 密钥" extra={
                  <Button type="text" icon={showKey ? <EyeInvisibleOutlined /> : <EyeOutlined />} onClick={() => setShowKey(!showKey)}>
                    {showKey ? '隐藏' : '显示'}
                  </Button>
                }>
                  <Descriptions bordered column={1}>
                    <Descriptions.Item label="Secret Key" contentStyle={{ fontFamily: 'monospace' }}>
                      <Space>
                        <Text code style={{ fontSize: 14 }}>{maskKey(channel.config.api_key)}</Text>
                        <Tooltip title="复制到剪贴板">
                          <Button type="text" icon={<CopyOutlined />} onClick={() => handleCopyKey(channel.config.api_key)} />
                        </Tooltip>
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Webhook Secret" contentStyle={{ fontFamily: 'monospace' }}>
                      <Space>
                        <Text code style={{ fontSize: 14 }}>{maskKey(channel.config.webhook_secret)}</Text>
                        <Tooltip title="复制到剪贴板">
                          <Button type="text" icon={<CopyOutlined />} onClick={() => handleCopyKey(channel.config.webhook_secret)} />
                        </Tooltip>
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="API 版本">{channel.config.api_version}</Descriptions.Item>
                  </Descriptions>
                </Card>
                <Card title="配置说明" style={{ marginTop: 16 }}>
                  <Text type="secondary">
                    • API 密钥用于渠道通信认证，请妥善保管<br />
                    • 密钥变更后约 5 分钟生效<br />
                    • 支持密钥轮换，新旧密钥可同时使用 5 分钟<br />
                    • Webhook Secret 用于验证回调签名
                  </Text>
                </Card>
              </>
            ),
          },
          { key: 'health', label: '健康监控', children: <div>健康监控图表占位</div> },
          { key: 'tests', label: '测试历史', children: <div>测试历史表格占位</div> },
        ]} />
      </Card>
    </div>
  );
}
