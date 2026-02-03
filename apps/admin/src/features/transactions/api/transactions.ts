import { apiClient } from '@psp/api';
import type {
  Transaction,
  TransactionTimeline,
  TransactionHistoryItem,
  ListTransactionsParams,
  ListTransactionsResponse,
  TransactionStats,
  ExportTransactionsRequest,
  ExportResponse,
  CancelTransactionRequest,
} from '../types';

// ==================== Transaction APIs ====================

/**
 * 获取交易列表
 * GET /api/v1/transactions
 */
export async function listTransactions(
  params: ListTransactionsParams = {}
): Promise<ListTransactionsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.size) searchParams.set('size', String(params.size));
  if (params.status) searchParams.set('status', params.status);
  if (params.type) searchParams.set('type', params.type);
  if (params.startDate) searchParams.set('startDate', params.startDate);
  if (params.endDate) searchParams.set('endDate', params.endDate);
  if (params.keyword) searchParams.set('keyword', params.keyword);
  if (params.minAmount) searchParams.set('minAmount', String(params.minAmount));
  if (params.maxAmount) searchParams.set('maxAmount', String(params.maxAmount));
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

  const response = await apiClient.get(`/api/v1/transactions?${searchParams.toString()}`);
  return response.data;
}

/**
 * 获取交易详情
 * GET /api/v1/transactions/:id
 */
export async function getTransaction(id: string): Promise<Transaction> {
  const response = await apiClient.get(`/api/v1/transactions/${id}`);
  return response.data;
}

/**
 * 获取交易历史记录
 * GET /api/v1/transactions/:id/history
 */
export async function getTransactionHistory(
  id: string
): Promise<{ items: TransactionHistoryItem[] }> {
  const response = await apiClient.get(`/api/v1/transactions/${id}/history`);
  return response.data;
}

/**
 * 获取交易状态时间线
 * GET /api/v1/transactions/:id/timeline
 * 
 * Note: 此端点 BE 14:00 前完成，目前先用 mock 数据开发 UI
 */
export async function getTransactionTimeline(id: string): Promise<TransactionTimeline> {
  const response = await apiClient.get(`/api/v1/transactions/${id}/timeline`);
  return response.data;
}

// Mock timeline for development (14:00 前使用)
export function getMockTransactionTimeline(): TransactionTimeline {
  return {
    currentStatus: 'COMPLETED',
    nodes: [
      {
        status: 'PENDING',
        label: '待支付',
        description: '等待用户完成支付',
        completed: true,
        current: false,
        time: '2026-02-03T10:30:00Z',
        operator: '张三',
      },
      {
        status: 'PAID',
        label: '已支付',
        description: '支付成功，等待处理',
        completed: true,
        current: false,
        time: '2026-02-03T10:31:00Z',
        operator: '系统',
      },
      {
        status: 'COMPLETED',
        label: '已完成',
        description: '交易完成',
        completed: true,
        current: true,
        time: '2026-02-03T10:31:30Z',
        operator: '系统',
      },
    ],
  };
}

/**
 * 获取交易统计
 * GET /api/v1/transactions/stats
 */
export async function getTransactionStats(
  startDate: string,
  endDate: string
): Promise<TransactionStats> {
  const response = await apiClient.get(
    `/api/v1/transactions/stats?startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
}

/**
 * 导出交易数据
 * POST /api/v1/transactions/export
 */
export async function exportTransactions(
  request: ExportTransactionsRequest
): Promise<ExportResponse> {
  const response = await apiClient.post('/api/v1/transactions/export', request);
  return response.data;
}

/**
 * 取消交易
 * POST /api/v1/transactions/:id/cancel
 */
export async function cancelTransaction(
  id: string,
  data: Omit<CancelTransactionRequest, 'transactionId'>
): Promise<void> {
  await apiClient.post(`/api/v1/transactions/${id}/cancel`, {
    transactionId: id,
    ...data,
  });
}
