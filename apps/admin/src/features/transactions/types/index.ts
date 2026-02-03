// Transactions API Types - Based on API Spec v1.2

// ==================== Enums ====================
export type TransactionType = 'PAYMENT' | 'REFUND' | 'TRANSFER';

export type TransactionStatus = 
  | 'PENDING'      // 待支付
  | 'PAID'         // 已支付
  | 'COMPLETED'    // 已完成
  | 'FAILED'       // 失败
  | 'EXPIRED'      // 已过期
  | 'CLOSED'       // 已关闭
  | 'PARTIALLY_REFUNDED'  // 部分退款
  | 'FULLY_REFUNDED';     // 全额退款

export type RefundStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type CorrectStatus = 
  | 'DRAFT' 
  | 'PENDING_REVIEW' 
  | 'PENDING_FINAL_REVIEW' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'COMPLETED';

export type CorrectType = 'AMOUNT_ADJUSTMENT' | 'STATUS_CORRECTION' | 'METADATA_UPDATE';

// ==================== Base Models ====================
export interface Transaction {
  id: string;
  orderId: string;
  type: TransactionType;
  status: TransactionStatus;
  statusLabel: string;
  amount: number;
  currency: string;
  userId: string;
  userName: string;
  userEmail?: string;
  paymentMethod: string;
  paymentMethodLabel: string;
  gateway: string;
  gatewayTradeNo?: string;
  subject: string;
  description?: string;
  createdAt: string;
  paidAt?: string;
  completedAt?: string;
  expiredAt?: string;
  clientIp?: string;
  deviceInfo?: {
    os: string;
    version: string;
    device: string;
  };
  refundedAmount: number;
  refundableAmount: number;
  metadata?: Record<string, unknown>;
}

export interface Refund {
  id: string;
  transactionId: string;
  amount: number;
  status: RefundStatus;
  reason: string;
  reasonCode: string;
  refundNo: string;
  gatewayRefundNo?: string;
  completedAt?: string;
}

export interface Correction {
  id: string;
  transactionId: string;
  correctType: CorrectType;
  correctTypeLabel: string;
  beforeValue: string;
  afterValue: string;
  status: CorrectStatus;
  submitterId: string;
  submitterName: string;
  initialApproverId?: string;
  reviewerId?: string;
  submittedAt: string;
  initialApprovedAt?: string;
  reviewedAt?: string;
}

// ==================== Timeline ====================
export interface TimelineNode {
  status: string;           // 状态码
  label: string;            // 中文标签（如 "待支付"）
  description?: string;     // 状态描述
  completed: boolean;       // 是否已完成
  current: boolean;         // 是否为当前状态
  time?: string;            // ISO 8601
  operator?: string;        // 操作人
}

export interface TransactionTimelineData {
  currentStatus: TransactionStatus;
  nodes: TimelineNode[];
}

// ==================== History ====================
export interface TransactionHistoryItem {
  id: string;
  transactionId: string;
  action: string;
  actionLabel: string;
  operatorId: string;
  operatorName: string;
  beforeState: Record<string, unknown> | null;
  afterState: Record<string, unknown>;
  remark?: string;
  createdAt: string;
}

// ==================== API Request/Response ====================
export interface ListTransactionsParams {
  page?: number;
  size?: number;
  status?: string;        // 支持多选（逗号分隔）
  type?: string;
  startDate?: string;     // YYYY-MM-DD
  endDate?: string;
  keyword?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ListTransactionsResponse {
  items: Transaction[];
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateRefundRequest {
  transactionId: string;
  amount: number;
  reason: string;
  reasonCode: string;
  notifyUrl?: string;
}

export interface CreateRefundResponse {
  refundId: string;
  transactionId: string;
  amount: number;
  status: RefundStatus;
  refundNo: string;
  gatewayRefundNo?: string;
  completedAt?: string;
}

export interface BatchRefundItem {
  transactionId: string;
  amount: number;
  reason: string;
}

export interface BatchRefundRequest {
  items: BatchRefundItem[];
  notifyUrl?: string;
}

export interface BatchRefundResponse {
  jobId: string | null;
  status: 'pending' | 'processing' | 'completed';
  total: number;
  success: number;
  failed: number;
  results?: Array<{
    transactionId: string;
    success: boolean;
    refundId?: string;
    errorCode?: string;
    message?: string;
  }>;
  completedAt?: string;
}

export interface BatchJobStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  statusLabel: string;
  total: number;
  processed: number;
  success: number;
  failed: number;
  progress: number;
  createdAt: string;
  startedAt?: string;
  estimatedCompletedAt?: string;
  results?: Array<{
    transactionId: string;
    success: boolean;
    refundId?: string;
    message?: string;
    errorCode?: string;
  }>;
}

export interface CancelTransactionRequest {
  transactionId: string;
  reason: string;
  reasonCode: string;
}

export interface CreateCorrectionRequest {
  transactionId: string;
  correctType: CorrectType;
  beforeValue: string;
  afterValue: string;
  reason: string;
  attachments?: Array<{ name: string; url: string }>;
}

export interface ReviewCorrectionRequest {
  action: 'APPROVE' | 'REJECT';
  comment?: string;
}

export interface TransactionStats {
  overview: {
    totalCount: number;
    totalAmount: number;
    successCount: number;
    successAmount: number;
    refundCount: number;
    refundAmount: number;
    successRate: number;
  };
  byStatus: Array<{
    status: TransactionStatus;
    count: number;
    amount: number;
  }>;
  byPaymentMethod: Array<{
    method: string;
    count: number;
    amount: number;
  }>;
  trend: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
}

export interface ExportTransactionsRequest {
  filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  };
  fields?: string[];
  format?: 'xlsx' | 'csv' | 'json';
}

export interface ExportResponse {
  downloadUrl?: string;
  expiresAt?: string;
  jobId?: string;
  status?: string;
  message?: string;
}
