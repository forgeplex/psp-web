import { Table, Space, Button, Typography } from 'antd';
import { EyeOutlined, UndoOutlined } from '@ant-design/icons';
import type { Transaction } from '../types';
import { TransactionStatusTag } from './TransactionStatusTag';
import dayjs from 'dayjs';

const { Text } = Typography;

interface TransactionTableProps {
  data: Transaction[];
  loading?: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  onPageChange: (page: number, pageSize: number) => void;
  onView: (record: Transaction) => void;
  onRefund?: (record: Transaction) => void;
}

export function TransactionTable({
  data,
  loading,
  pagination,
  onPageChange,
  onView,
  onRefund,
}: TransactionTableProps) {
  const columns = [
    {
      title: '交易ID',
      dataIndex: 'id',
      key: 'id',
      width: 180,
      render: (id: string) => (
        <Text copyable={{ text: id }} style={{ fontFamily: 'monospace' }}>
          {id.slice(0, 12)}...
        </Text>
      ),
    },
    {
      title: '订单号',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          PAYMENT: '支付',
          REFUND: '退款',
          TRANSFER: '转账',
        };
        return typeMap[type] || type;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => <TransactionStatusTag status={status} />,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right' as const,
      render: (amount: number, record: Transaction) => (
        <Text strong>
          {record.currency} {amount.toFixed(2)}
        </Text>
      ),
    },
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
      width: 120,
      render: (name: string, record: Transaction) => (
        <div>
          <div>{name}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.userId.slice(0, 8)}...
          </Text>
        </div>
      ),
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethodLabel',
      key: 'paymentMethodLabel',
      width: 120,
    },
    {
      title: '标题',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: unknown, record: Transaction) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
          >
            详情
          </Button>
          {record.refundableAmount > 0 && (
            <Button
              type="text"
              icon={<UndoOutlined />}
              onClick={() => onRefund?.(record)}
            >
              退款
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
        pageSizeOptions: [10, 20, 50, 100],
      }}
      onChange={(pagination) => {
        onPageChange(pagination.current || 1, pagination.pageSize || 20);
      }}
      scroll={{ x: 1400 }}
    />
  );
}

export default TransactionTable;
