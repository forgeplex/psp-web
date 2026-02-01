import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Row, Col, Card, Typography } from 'antd';
import { DollarOutlined, SwapOutlined, CheckCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { KpiCard, PageHeader } from '@psp/ui';
import { formatCurrency } from '@psp/shared';

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="支付系统运营概览"
      />

      {/* KPI Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} xl={6}>
          <KpiCard
            title="今日交易额"
            value={formatCurrency(1285600)}
            change={{ value: 12.5, type: 'increase' }}
            subtitle="较昨日"
            icon={<DollarOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <KpiCard
            title="今日交易笔数"
            value="3,842"
            change={{ value: 8.2, type: 'increase' }}
            subtitle="较昨日"
            icon={<SwapOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <KpiCard
            title="成功率"
            value="96.8%"
            change={{ value: 0.3, type: 'increase' }}
            subtitle="较昨日"
            icon={<CheckCircleOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <KpiCard
            title="活跃商户"
            value="128"
            change={{ value: 2.1, type: 'decrease' }}
            subtitle="较昨日"
            icon={<TeamOutlined />}
          />
        </Col>
      </Row>

      {/* Transaction Trend Chart Placeholder */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="交易趋势" style={{ borderRadius: 8 }}>
            <div
              style={{
                height: 320,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#71717A',
                background: '#FAFAFA',
                borderRadius: 8,
              }}
            >
              <Typography.Text type="secondary">
                📊 交易趋势图（待接入 ECharts / Recharts）
              </Typography.Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="通道健康度" style={{ borderRadius: 8 }}>
            <div
              style={{
                height: 320,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#71717A',
                background: '#FAFAFA',
                borderRadius: 8,
              }}
            >
              <Typography.Text type="secondary">
                🏥 通道健康度网格（待实现）
              </Typography.Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
