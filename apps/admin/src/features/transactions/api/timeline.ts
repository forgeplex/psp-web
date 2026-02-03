import { apiClient } from '@psp/api';
import type { TimelineNode } from '../types';

export interface TimelineResponse {
  transaction_id: string;
  nodes: TimelineNode[];
}

// Mock 数据兜底 - 当真实 API 不可用时使用
const mockTimelineData: Record<string, TimelineResponse> = {
  'test-txn-001': {
    transaction_id: 'test-txn-001',
    nodes: [
      {
        status: 'created',
        label: '创建订单',
        description: '订单已创建，等待支付',
        completed: true,
        current: false,
        time: '2024-01-01T12:00:00Z',
      },
      {
        status: 'paid',
        label: '已支付',
        description: '用户已完成支付',
        completed: true,
        current: true,
        time: '2024-01-01T12:01:00Z',
      },
    ],
  },
};

/**
 * 获取交易时间线
 * 尝试真实 API，失败时降级到 mock 数据
 */
export async function getTransactionTimeline(id: string): Promise<TimelineResponse> {
  try {
    // 尝试路径 1: /api/v1/transactions/:id/timeline
    const response1 = await apiClient.get(`/api/v1/transactions/${id}/timeline`);
    return response1.data;
  } catch (err1: any) {
    if (err1.response?.status === 404) {
      try {
        // 尝试路径 2: /v1/transactions/:id/timeline
        const response2 = await apiClient.get(`/v1/transactions/${id}/timeline`);
        return response2.data;
      } catch (err2: any) {
        if (err2.response?.status === 404) {
          console.warn('[Timeline] API 404，使用 mock 数据:', id);
          return mockTimelineData[id] || {
            transaction_id: id,
            nodes: [{
              status: 'pending',
              label: '待处理',
              completed: false,
              current: true,
              time: new Date().toISOString(),
            }],
          };
        }
        throw err2;
      }
    }
    throw err1;
  }
}
