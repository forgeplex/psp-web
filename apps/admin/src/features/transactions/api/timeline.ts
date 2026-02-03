import { apiClient } from '@psp/api';
import type { TimelineNode } from '../types';

export interface TimelineResponse {
  transaction_id: string;
  nodes: TimelineNode[];
}

/**
 * 获取交易时间线
 * GET /api/v1/transactions/:id/timeline
 * 
 * ✅ 已切换到真实 API
 */
export async function getTransactionTimeline(id: string): Promise<TimelineResponse> {
  const response = await apiClient.get(`/api/v1/transactions/${id}/timeline`);
  return response.data;
}
