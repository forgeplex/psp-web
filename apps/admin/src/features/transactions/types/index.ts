// Transactions 模块类型定义
// TODO: 等 OpenAPI Spec 更新后从 generated 导入

export interface Transaction {
  id: string;
  merchantId: string;
  merchantName?: string;
  amount: string;
  currency: string;
  status: TransactionStatus;
  type: TransactionType;
  createdAt: string;
  updatedAt: string;
}

export type TransactionStatus =
  | 'pending'
  | 'processing'
  | 'success'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type TransactionType =
  | 'payment'
  | 'refund'
  | 'withdrawal'
  | 'adjustment';

// 搜索参数
export interface TransactionSearchParams {
  page?: number;
  pageSize?: number;
  status?: TransactionStatus;
  type?: TransactionType;
  merchantId?: string;
  startTime?: string;
  endTime?: string;
  keyword?: string;
}

// 详情页 Tab 类型
export type TransactionDetailTab =
  | 'overview'
  | 'timeline'
  | 'operations'
  | 'risk';
