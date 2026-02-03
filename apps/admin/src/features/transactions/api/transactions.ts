import { client } from '@psp/api';
import type { 
  Transaction, 
  TransactionHistory,
  TimelineResponse,
  TransactionSearchParams,
  PaginatedResponse 
} from '../types/transaction';

// 临时 mock 数据，等待 OpenAPI 类型生成
const mockTransactions: Transaction[] = [
  {
    id: 'txn_001',
    order_id: 'ORD-2026-001',
    type: 'payment',
    status: 'completed',
    amount: 999.99,
    currency: 'CNY',
    user_id: 'user_001',
    user_name: '张三',
    payment_method: 'ALIPAY',
    gateway: 'ALIPAY_OFFICIAL',
    subject: '商品购买',
    description: 'iPhone 16 Pro',
    created_at: '2026-02-03T10:30:00Z',
    paid_at: '2026-02-03T10:31:00Z',
    completed_at: '2026-02-03T10:31:00Z',
    refunded_amount: 0,
    refundable_amount: 999.99,
  },
];

export async function searchTransactions(
  params: TransactionSearchParams
): Promise<PaginatedResponse<Transaction>> {
  // TODO: 等待 OpenAPI 类型生成后替换
  // const response = await client.POST('/transactions/search', { body: params });
  // return response.data!;
  
  // Mock 数据
  return {
    items: mockTransactions,
    pagination: {
      page: params.page || 1,
      size: params.size || 20,
      total: 100,
      total_pages: 5,
    },
  };
}

export async function getTransaction(id: string): Promise<Transaction> {
  // TODO: 等待 OpenAPI 类型生成
  // const response = await client.GET('/transactions/{id}', { params: { path: { id } } });
  // return response.data!;
  
  return mockTransactions[0];
}

export async function getTransactionHistory(id: string): Promise<TransactionHistory[]> {
  // TODO: 等待 OpenAPI 类型生成
  return [];
}

export async function getTransactionTimeline(id: string): Promise<TimelineResponse> {
  // TODO: 等待 OpenAPI 类型生成
  // const response = await client.GET('/transactions/{id}/timeline', { params: { path: { id } } });
  // return response.data!;
  
  return {
    transaction_id: id,
    events: [
      { status: 'pending', timestamp: '2026-02-03T10:30:00Z', operator: 'system', notes: '创建交易' },
      { status: 'completed', timestamp: '2026-02-03T10:31:00Z', operator: 'system', notes: '支付成功' },
    ],
  };
}

export async function exportTransactions(params: TransactionSearchParams) {
  // TODO: 等待 OpenAPI 类型生成
  return { download_url: '', expires_at: '' };
}
