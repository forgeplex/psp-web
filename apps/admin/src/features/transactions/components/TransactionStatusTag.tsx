import { Tag } from 'antd';
import type { TransactionStatus, RefundStatus, CorrectStatus } from '../types';

interface StatusTagProps {
  status: TransactionStatus | RefundStatus | CorrectStatus | string;
  type?: 'transaction' | 'refund' | 'correction';
}

const transactionStatusMap: Record<TransactionStatus, { color: string; label: string }> = {
  PENDING: { color: 'default', label: '待支付' },
  PAID: { color: 'processing', label: '已支付' },
  COMPLETED: { color: 'success', label: '已完成' },
  FAILED: { color: 'error', label: '失败' },
  EXPIRED: { color: 'default', label: '已过期' },
  CLOSED: { color: 'default', label: '已关闭' },
  PARTIALLY_REFUNDED: { color: 'warning', label: '部分退款' },
  FULLY_REFUNDED: { color: 'success', label: '全额退款' },
};

const refundStatusMap: Record<RefundStatus, { color: string; label: string }> = {
  PENDING: { color: 'default', label: '待处理' },
  PROCESSING: { color: 'processing', label: '处理中' },
  COMPLETED: { color: 'success', label: '已完成' },
  FAILED: { color: 'error', label: '失败' },
};

const correctionStatusMap: Record<CorrectStatus, { color: string; label: string }> = {
  DRAFT: { color: 'default', label: '草稿' },
  PENDING_REVIEW: { color: 'warning', label: '待初审' },
  PENDING_FINAL_REVIEW: { color: 'processing', label: '待终审' },
  APPROVED: { color: 'success', label: '已通过' },
  REJECTED: { color: 'error', label: '已驳回' },
  COMPLETED: { color: 'success', label: '已执行' },
};

export function TransactionStatusTag({ status, type = 'transaction' }: StatusTagProps) {
  let config: { color: string; label: string } | undefined;

  switch (type) {
    case 'transaction':
      config = transactionStatusMap[status as TransactionStatus];
      break;
    case 'refund':
      config = refundStatusMap[status as RefundStatus];
      break;
    case 'correction':
      config = correctionStatusMap[status as CorrectStatus];
      break;
  }

  if (!config) {
    return <Tag>{status}</Tag>;
  }

  return <Tag color={config.color}>{config.label}</Tag>;
}

export default TransactionStatusTag;
