import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Select,
  Table,
  Typography,
  Space,
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Link } from '@tanstack/react-router';
import { PageHeader } from '@psp/ui';
import { MerchantStatusBadge } from '../components';
import type { MerchantStatus } from '../types';

// Mock stats data
const mockStats = {
  total_merchants: 156,
  active_merchants: 128,
  pending_kyb: 12,
  high_risk: 5,
  changes: {
    total: 8.2,
    active: 5.1,
    pending: -12.5,
    high_risk: 0,
  },
};

const mockRecentMerchants = [
  { id: '1', name: '某某电商', created_at: '2026-02-01', status: 'pending' as MerchantStatus },
  { id: '2', name: 'ABC Store', created_at: '2026-01-30', status: 'active' as MerchantStatus },
  { id: '3', name: 'XYZ Games', created_at: '2026-01-28', status: 'active' as MerchantStatus },
  { id: '4', name: '数码专营', created_at: '2026-01-26', status: 'suspended' as MerchantStatus },
  { id: '5', name: '服装批发', created_at: '2026-01-24', status: 'active' as MerchantStatus },
];

const mockRecentChanges = [
  { merchant_id: '3', merchant_name: 'XYZ Games', from: 'active', to: 'suspended', time: '2 小时前' },
  { merchant_id: '2', merchant_name: 'ABC Store', from: 'pending', to: 'active', time: '1 天前' },
  { merchant_id: '1', merchant_name: '某某电商', from: 'suspended', to: 'active', time: '3 天前' },
  { merchant_id: '6', merchant_name: '进口食品', from: 'active', to: 'closed', time: '5 天前' },
];

interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
}

function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <Card style={{ borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {title}
          </Typography.Text>
          <div style={{ fontSize: 32, fontWeight: 'bold', marginTop: 8 }}>
            {value.toLocaleString()}
          </div>
          {change !== 0 && (
            <div style={{ marginTop: 8 }}>
              {change > 0 ? (
                <span style={{ color: '#22C55E', fontSize: 12 }}>
                  <ArrowUpOutlined /> {change}%
                </span>
              ) : (
                <span style={{ color: '#EF4444', fontSize: 12 }}>
                  <ArrowDownOutlined /> {Math.abs(change)}%
                </span>
              )}
              <Typography.Text type="secondary" style={{ fontSize: 12, marginLeft: 4 }}>
                较上期
              </Typography.Text>
            </div>
          )}
        </div>
        {icon}
      </div>
    </Card>
  );
}

export function MerchantDashboardPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const statsCards = [
    {
      title: '商户总数',
      value: mockStats.total_merchants,
      change: mockStats.changes.total,
      icon: <TeamOutlined style={{ fontSize: 24, color: '#18181B' }} />,
    },
    {
      title: '活跃商户',
      value: mockStats.active_merchants,
      change: mockStats.changes.active,
      icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#22C55E' }} />,
    },
    {
      title: '待审核 KYB',
      value: mockStats.pending_kyb,
      change: mockStats.changes.pending,
      icon: <ClockCircleOutlined style={{ fontSize: 24, color: '#F59E0B' }} />,
    },
    {
      title: '高风险商户',
      value: mockStats.high_risk,
      change: mockStats.changes.high_risk,
      icon: <WarningOutlined style={{ fontSize: 24, color: '#EF4444' }} />,
    },
  ];

  const recentMerchantsColumns = [
    {
      title: '商户名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: typeof mockRecentMerchants[0]) => (
        <Link to="/merchants/$merchantId" params={{ merchantId: record.id }}>{name}</Link>
      ),
    },
    { title: '创建时间', dataIndex: 'created_at', key: 'created_at' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: MerchantStatus) => <MerchantStatusBadge status={status} />,
    },
  ];

  const recentChangesColumns = [
    {
      title: '商户',
      dataIndex: 'merchant_name',
      key: 'merchant_name',
      render: (name: string, record: typeof mockRecentChanges[0]) => (
        <Link to="/merchants/$merchantId" params={{ merchantId: record.merchant_id }}>{name}</Link>
      ),
    },
    {
      title: '状态变更',
      key: 'change',
      render: (_: unknown, record: typeof mockRecentChanges[0]) => (
        <Space>
          <MerchantStatusBadge status={record.from as MerchantStatus} />
          <span>→</span>
          <MerchantStatusBadge status={record.to as MerchantStatus} />
        </Space>
      ),
    },
    { title: '时间', dataIndex: 'time', key: 'time' },
  ];

  return (
    <div>
      <PageHeader
        title="商户仪表盘"
        extra={
          <Select
            value={period}
            onChange={setPeriod}
            options={[
              { value: '7d', label: '近 7 天' },
              { value: '30d', label: '近 30 天' },
              { value: '90d', label: '近 90 天' },
            ]}
            style={{ width: 120 }}
          />
        }
      />

      {/* 统计卡片 */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        {statsCards.map((card) => (
          <Col span={6} key={card.title}>
            <StatCard {...card} />
          </Col>
        ))}
      </Row>

      {/* 图表区域 - 占位 */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="增长趋势" style={{ borderRadius: 8, height: 300 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: 200,
              color: '#71717A',
            }}>
              📈 图表组件待接入 @ant-design/charts
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="状态分布" style={{ borderRadius: 8, height: 300 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: 200,
              color: '#71717A',
            }}>
              🥧 饼图待接入 @ant-design/charts
            </div>
          </Card>
        </Col>
      </Row>

      {/* 列表区域 */}
      <Row gutter={24}>
        <Col span={12}>
          <Card 
            title="最近新增商户" 
            style={{ borderRadius: 8 }}
            extra={<Link to="/merchants">查看全部</Link>}
          >
            <Table
              columns={recentMerchantsColumns}
              dataSource={mockRecentMerchants}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title="最近状态变更" 
            style={{ borderRadius: 8 }}
            extra={<Link to="/merchants">查看全部</Link>}
          >
            <Table
              columns={recentChangesColumns}
              dataSource={mockRecentChanges}
              rowKey="merchant_id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
