import { createFileRoute } from '@tanstack/react-router';
import { Card, Descriptions, Tabs, Tag, Typography, Spin, Button, Space, Alert } from 'antd';
import { 
  ArrowLeftOutlined, 
  HistoryOutlined, 
  ClockCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useTransaction, useTransactionTimeline } from '@/features/transactions/hooks/useTransactions';
import { TransactionTimeline, TransactionStatusTag } from '@/features/transactions/components';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const Route = createFileRoute('/_authenticated/transactions/$id')({
  component: TransactionDetailPage,
});

function TransactionDetailPage() {
  const { id } = Route.useParams();
  
  const { data: transaction, isLoading: isLoadingTransaction } = useTransaction(id);
  const { data: timelineData, isLoading: isLoadingTimeline, error: timelineError } = useTransactionTimeline(id);

  if (isLoadingTransaction) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>加载交易详情...</p>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Text type="secondary">交易不存在或已被删除</Text>
      </div>
    );
  }

  const tabItems = [
    {
      key: 'timeline',
      label: (
        <span>
          <ClockCircleOutlined style={{ marginRight: 8 }} />
          状态时间线
        </span>
      ),
      children: (
        <>
          {timelineError && (
            <Alert
              message="时间线加载失败"
              description={timelineError.message}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          <TransactionTimeline 
            nodes={timelineData?.nodes || []} 
            loading={isLoadingTimeline} 
          />
        </>
      ),
    },
    {
      key: 'history',
      label: (
        <span>
          <HistoryOutlined style={{ marginRight: 8 }} />
          操作记录
        </span>
      ),
      children: (
        <div style={{ padding: 24 }}>
          <Text type="secondary">操作记录功能开发中...</Text>
        </div>
      ),
    },
    {
      key: 'raw',
      label: (
        <span>
          <FileTextOutlined style={{ marginRight: 8 }} />
          原始数据
        </span>
      ),
      children: (
        <pre style={{ padding: 16, background: '#f6ffed', borderRadius: 8 }}>
          {JSON.stringify(transaction, null, 2)}
        </pre>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => window.history.back()}>
            返回
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            交易详情
          </Title>
          <TransactionStatusTag status={transaction.status} />
        </div>

        {/* Basic Info */}
        <Card title="基本信息" bordered={false}>
          <Descriptions column={2}>
            <Descriptions.Item label="交易ID">
              <Text copyable>{transaction.id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="订单号">{transaction.orderId}</Descriptions.Item>
            
            <Descriptions.Item label="类型">
              <Tag>{transaction.type}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <TransactionStatusTag status={transaction.status} />
            </Descriptions.Item>
            
            <Descriptions.Item label="金额">
              <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                {transaction.currency} {transaction.amount.toFixed(2)}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="可退款金额">
              {transaction.currency} {transaction.refundableAmount.toFixed(2)}
            </Descriptions.Item>
            
            <Descriptions.Item label="用户">
              {transaction.userName} ({transaction.userId.slice(0, 8)}...)
            </Descriptions.Item>
            <Descriptions.Item label="邮箱">{transaction.userEmail || '-'}</Descriptions.Item>
            
            <Descriptions.Item label="支付方式">
              {transaction.paymentMethodLabel}
            </Descriptions.Item>
            <Descriptions.Item label="支付网关">
              {transaction.gateway}
            </Descriptions.Item>
            
            <Descriptions.Item label="标题" span={2}>
              {transaction.subject}
            </Descriptions.Item>
            
            <Descriptions.Item label="描述" span={2}>
              {transaction.description || '-'}
            </Descriptions.Item>
            
            <Descriptions.Item label="网关流水号">
              {transaction.gatewayTradeNo || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {dayjs(transaction.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            
            {transaction.paidAt && (
              <Descriptions.Item label="支付时间">
                {dayjs(transaction.paidAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            )}
            
            {transaction.completedAt && (
              <Descriptions.Item label="完成时间">
                {dayjs(transaction.completedAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* Tabs */}
        <Card bordered={false}>
          <Tabs items={tabItems} defaultActiveKey="timeline" />
        </Card>
      </Space>
    </div>
  );
}

export default TransactionDetailPage;
