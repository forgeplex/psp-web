import { Tag } from 'antd';
import type { TransactionStatus } from '../types/transaction';

interface Props {
  status: TransactionStatus;
}

const statusMap: Record<TransactionStatus, { color: string; label: string }> = {
  pending: { color: 'gold', label: '待支付' },
  processing: { color: 'blue', label: '处理中' },
  completed: { color: 'green', label: '已完成' },
  failed: { color: 'red', label: '失败' },
  cancelled: { color: 'default', label: '已取消' },
  refunded: { color: 'purple', label: '已退款' },
};

export function TransactionStatusBadge({ status }: Props) {
  const config = statusMap[status] || { color: 'default', label: status };
  return <Tag color={config.color}>{config.label}</Tag>;
}
