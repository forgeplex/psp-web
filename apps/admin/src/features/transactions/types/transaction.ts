// Transactions 类型定义 (临时，等待 OpenAPI 生成)

export type TransactionStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'cancelled' 
  | 'refunded';

export type TransactionType = 'payment' | 'refund' | 'transfer';

export interface Transaction {
  id: string;
  order_id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  user_id: string;
  user_name: string;
  payment_method: string;
  gateway: string;
  gateway_trade_no?: string;
  subject: string;
  description?: string;
  created_at: string;
  paid_at?: string;
  completed_at?: string;
  refunded_amount: number;
  refundable_amount: number;
  metadata?: Record<string, any>;
}

export interface TransactionHistory {
  id: string;
  transaction_id: string;
  old_status: TransactionStatus;
  new_status: TransactionStatus;
  reason?: string;
  operator_id?: string;
  operator_type: 'system' | 'user' | 'merchant';
  created_at: string;
}

export interface TimelineEvent {
  status: string;
  timestamp: string;
  operator_id?: string;
  operator: string;
  notes?: string;
}

export interface TimelineResponse {
  transaction_id: string;
  events: TimelineEvent[];
}

export interface TransactionSearchParams {
  page?: number;
  size?: number;
  status?: string;
  type?: string;
  start_date?: string;
  end_date?: string;
  keyword?: string;
  min_amount?: number;
  max_amount?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    size: number;
    total: number;
    total_pages: number;
  };
}
