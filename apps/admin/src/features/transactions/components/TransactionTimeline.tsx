import { Timeline as AntTimeline, Card, Spin } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { TimelineEvent } from '../types/transaction';

interface Props {
  events: TimelineEvent[];
  loading?: boolean;
}

const statusLabelMap: Record<string, string> = {
  pending: '待支付',
  processing: '处理中',
  completed: '已完成',
  failed: '失败',
  cancelled: '已取消',
  refunded: '已退款',
};

export function TransactionTimeline({ events, loading }: Props) {
  if (loading) {
    return (
      <Card title="交易时间线">
        <Spin />
      </Card>
    );
  }

  const items = events.map((event, index) => {
    const isLast = index === events.length - 1;
    const label = statusLabelMap[event.status] || event.status;
    
    return {
      key: index,
      dot: isLast ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <ClockCircleOutlined />,
      children: (
        <div>
          <div style={{ fontWeight: 500 }}>{label}</div>
          <div style={{ fontSize: 12, color: '#999' }}>
            {new Date(event.timestamp).toLocaleString()} · {event.operator}
          </div>
          {event.notes && (
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
              {event.notes}
            </div>
          )}
        </div>
      ),
    };
  });

  return (
    <Card title="交易时间线">
      <AntTimeline items={items} mode="left" />
    </Card>
  );
}
