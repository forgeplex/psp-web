import { useParams } from '@tanstack/react-router';
import { Card, Descriptions, Row, Col, Divider } from 'antd';
import { useTransaction, useTransactionTimeline } from '../hooks/useTransactions';
import { TransactionStatusBadge } from '../components/TransactionStatusBadge';
import { TransactionTimeline } from '../components/TransactionTimeline';

export function TransactionDetail() {
  const { id } = useParams({ from: '/transactions/$id' });
  const { data: transaction, isLoading } = useTransaction(id);
  const { data: timeline, isLoading: timelineLoading } = useTransactionTimeline(id);

  if (isLoading || !transaction) {
    return <Card loading>加载中...</Card>;
  }

  return (
    <>
      <Card title="交易详情">
        <Descriptions bordered column={2}>
          <Descriptions.Item label="交易ID">{transaction.id}</Descriptions.Item>
          <Descriptions.Item label="订单号">{transaction.order_id}</Descriptions.Item>
          <Descriptions.Item label="类型">{transaction.type}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <TransactionStatusBadge status={transaction.status} />
          </Descriptions.Item>
          <Descriptions.Item label="金额">
            {transaction.amount} {transaction.currency}
          </Descriptions.Item>
          <Descriptions.Item label="用户">{transaction.user_name}</Descriptions.Item>
          <Descriptions.Item label="支付方式">{transaction.payment_method}</Descriptions.Item>
          <Descriptions.Item label="网关">{transaction.gateway}</Descriptions.Item>
          <Descriptions.Item label="订单标题">{transaction.subject}</Descriptions.Item>
          <Descriptions.Item label="描述">{transaction.description}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {new Date(transaction.created_at).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="完成时间">
            {transaction.completed_at ? new Date(transaction.completed_at).toLocaleString() : '-'}
          </Descriptions.Item>
        </Descriptionscriptions>
        
        <Divider />
        
        <Descriptions title="退款信息" column={2}>
          <Descriptions.Item label="已退款金额">
            {transaction.refunded_amount} {transaction.currency}
          </Descriptions.Item>
          <Descriptions.Item label="可退款金额">
            {transaction.refundable_amount} {transaction.currency}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <div style={{ marginTop: 16 }}>
        <TransactionTimeline 
          events={timeline?.events || []} 
          loading={timelineLoading} 
        />
      </div>
    </>
  );
}
