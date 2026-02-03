import React, { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { Card, Tabs, Button, Space, Tag, Descriptions, Spin } from 'antd';
import { ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';
import { Link } from '@tanstack/react-router';
import { TransactionTimeline } from '../components/TransactionTimeline';
import { useTransactionTimeline } from '../hooks/useTimeline';

export const TransactionDetailPage: React.FC = () => {
  const { transactionId } = useParams({ from: '/transactions/$transactionId' });
  const [activeTab, setActiveTab] = useState('overview');
  const { data: timeline, isLoading } = useTransactionTimeline(transactionId);

  // 概览 Tab
  const OverviewTab = () => (
    <Descriptions bordered column={2}>
      <Descriptions.Item label="交易ID">{transactionId}</Descriptions.Item>
      <Descriptions.Item label="状态">
        <Tag color="green">SUCCESS</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="商户">Test Merchant</Descriptions.Item>
      <Descriptions.Item label="金额">USD 1,000.00</Descriptions.Item>
      <Descriptions.Item label="类型">Payment</Descriptions.Item>
      <Descriptions.Item label="创建时间">2025-02-03 08:00:00</Descriptions.Item>
      <Descriptions.Item label="完成时间">2025-02-03 08:05:00</Descriptions.Item>
      <Descriptions.Item label="支付方式">Credit Card</Descriptions.Item>
    </Descriptions>
  );

  // 时间线 Tab
  const TimelineTab = () => {
    if (isLoading) {
      return <Spin tip="加载中..." />;
    }
    return (
      <TransactionTimeline
        transactionId={transactionId}
        nodes={timeline?.nodes || []}
      />
    );
  };

  // 操作记录 Tab
  const OperationsTab = () => (
    <Descriptions bordered>
      <Descriptions.Item label="操作类型">退款申请</Descriptions.Item>
      <Descriptions.Item label="操作人">admin@psp.dev</Descriptions.Item>
      <Descriptions.Item label="操作时间">2025-02-03 09:00:00</Descriptions.Item>
      <Descriptions.Item label="备注">客户要求退款</Descriptions.Item>
    </Descriptions>
  );

  // 风控信息 Tab
  const RiskTab = () => (
    <Descriptions bordered column={2}>
      <Descriptions.Item label="风险评分">85/100</Descriptions.Item>
      <Descriptions.Item label="风险等级">LOW</Descriptions.Item>
      <Descriptions.Item label="IP地址">192.168.1.1</Descriptions.Item>
      <Descriptions.Item label="设备指纹">fp_abc123</Descriptions.Item>
    </Descriptions>
  );

  const items = [
    { key: 'overview', label: '概览', children: <OverviewTab /> },
    { key: 'timeline', label: '时间线', children: <TimelineTab /> },
    { key: 'operations', label: '操作记录', children: <OperationsTab /> },
    { key: 'risk', label: '风控信息', children: <RiskTab /> },
  ];

  return (
    <Card
      title={
        <Space>
          <Link to="/transactions">
            <Button icon={<ArrowLeftOutlined />}>返回</Button>
          </Link>
          <span>交易详情</span>
        </Space>
      }
      extra={
        <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
          刷新
        </Button>
      }
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </Card>
  );
};
