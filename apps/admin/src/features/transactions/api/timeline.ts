import { apiClient } from '@psp/api';
import type { TimelineNode } from '../types';

export interface TimelineResponse {
  transaction_id: string;
  nodes: TimelineNode[];
}

// Mock 数据 - 等待 BE 真实实现
// 使用 UIUX 提供的 mock 数据: mock/timeline.mock.ts
export async function getTransactionTimeline(id: string): Promise<TimelineResponse> {
  // TODO: BE 实现后切换为真实 API
  // const response = await apiClient.get(`/api/v1/transactions/${id}/timeline`);
  // return response.data;
  
  // 临时返回空，实际使用 UIUX 的 mock 数据
  console.log('[MOCK] getTransactionTimeline:', id);
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    transaction_id: id,
    nodes: [], // UIUX 组件会使用自己的 mock 数据
  };
}
