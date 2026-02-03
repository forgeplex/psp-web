import { useState } from 'react';
import { Table, Card, Input, Select, DatePicker, Button, Space } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionStatusBadge } from '../components/TransactionStatusBadge';
import type { Transaction } from '../types/transaction';

const { RangePicker } = DatePicker;

const columns = [
  {
    title: '交易ID',
    dataIndex: 'id',
    key: 'id',
    width: 180,
  },
  {
    title: '订单号',
    dataIndex: 'order_id',
    key: 'order_id',
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => <TransactionStatusBadge status={status as any} />,
  },
  {
    title: '金额',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount: number, record: Transaction) => `${amount} ${record.currency}`,
  },
  {
    title: '用户',
    dataIndex: 'user_name',
    key: 'user_name',
  },
  {
    title: '支付方式',
    dataIndex: 'payment_method',
    key: 'payment_method',
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (date: string) => new Date(date).toLocaleString(),
  },
];

export function TransactionList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  const { data, isLoading } = useTransactions({
    page,
    size: pageSize,
  });

  return (
    <Card title="交易管理">
      <Space style={{ marginBottom: 16 }}>
        <Input.Search 
          placeholder="搜索交易ID/订单号" 
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
        />
        <Select placeholder="状态" style={{ width: 120 }} allowClear>
          <Select.Option value="pending">待支付</Select.Option>
          <Select.Option value="processing">处理中</Select.Option>
          <Select.Option value="completed">已完成</Select.Option>
          <Select.Option value="failed">失败</Select.Option>
        </Select>
        <RangePicker />
        <Button type="primary" icon={<SearchOutlined />}>查询</Button>
        <Button icon={<ExportOutlined />}>导出</Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data?.items}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: page,
          pageSize,
          total: data?.pagination.total,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps || 20);
          },
        }}
      />
    </Card>
  );
}
