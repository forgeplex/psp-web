import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, DatePicker, Input, Select } from 'antd';
import { Link } from '@tanstack/react-router';
import { ReloadOutlined, ExportOutlined, EyeOutlined } from '@ant-design/icons';
import type { Transaction, TransactionSearchParams } from '../types';

const { RangePicker } = DatePicker;
const { Option } = Select;

// TODO: 替换为真实 API 调用
const mockData: Transaction[] = [
  {
    id: 'TXN-001',
    merchantId: 'MCH-001',
    merchantName: 'Test Merchant',
    amount: '1000.00',
    currency: 'USD',
    status: 'success',
    type: 'payment',
    createdAt: '2025-02-03T08:00:00Z',
    updatedAt: '2025-02-03T08:05:00Z',
  },
];

export const TransactionListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useState<TransactionSearchParams>({
    page: 1,
    pageSize: 20,
  });

  const columns = [
    {
      title: '交易ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <Link to="/transactions/$transactionId" params={{ transactionId: id }}>
          {id}
        </Link>
      ),
    },
    {
      title: '商户',
      dataIndex: 'merchantName',
      key: 'merchantName',
    },
    {
      title: '金额',
      key: 'amount',
      render: (_: unknown, record: Transaction) => (
        <span>
          {record.currency} {record.amount}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: Transaction['status']) => {
        const colorMap: Record<string, string> = {
          pending: 'gold',
          processing: 'blue',
          success: 'green',
          failed: 'red',
          cancelled: 'default',
          refunded: 'purple',
        };
        return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Transaction) => (
        <Space>
          <Link to="/transactions/$transactionId" params={{ transactionId: record.id }}>
            <Button icon={<EyeOutlined />} size="small">
              查看
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="交易管理"
      extra={
        <Space>
          <Button icon={<ReloadOutlined />}>刷新</Button>
          <Button icon={<ExportOutlined />}>导出</Button>
        </Space>
      }
    >
      {/* 搜索栏 */}
      <Space wrap style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="搜索交易ID/商户"
          style={{ width: 250 }}
        />
        <Select
          placeholder="状态"
          style={{ width: 120 }}
          allowClear
        >
          <Option value="pending">待处理</Option>
          <Option value="processing">处理中</Option>
          <Option value="success">成功</Option>
          <Option value="failed">失败</Option>
          <Option value="cancelled">已取消</Option>
          <Option value="refunded">已退款</Option>
        </Select>
        <Select
          placeholder="类型"
          style={{ width: 120 }}
          allowClear
        >
          <Option value="payment">支付</Option>
          <Option value="refund">退款</Option>
          <Option value="withdrawal">提现</Option>
          <Option value="adjustment">调账</Option>
        </Select>
        <RangePicker />
      </Space>

      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={mockData}
        rowKey="id"
        pagination={{
          current: searchParams.page,
          pageSize: searchParams.pageSize,
          total: 1,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </Card>
  );
};
