import { apiClient } from '@psp/api';
import type {
  CreateRefundRequest,
  CreateRefundResponse,
  BatchRefundRequest,
  BatchRefundResponse,
  BatchJobStatus,
} from '../types';

/**
 * 创建单笔退款
 * POST /api/v1/refunds
 */
export async function createRefund(
  request: CreateRefundRequest
): Promise<CreateRefundResponse> {
  const response = await apiClient.post('/api/v1/refunds', request);
  return response.data;
}

/**
 * 批量退款
 * POST /api/v1/refunds/batch
 */
export async function createBatchRefund(
  request: BatchRefundRequest
): Promise<BatchRefundResponse> {
  const response = await apiClient.post('/api/v1/refunds/batch', request);
  return response.data;
}

/**
 * 查询批量退款任务状态
 * GET /api/v1/refunds/batch/jobs/:jobId
 */
export async function getBatchJobStatus(jobId: string): Promise<BatchJobStatus> {
  const response = await apiClient.get(`/api/v1/refunds/batch/jobs/${jobId}`);
  return response.data;
}

/**
 * 审批退款
 * POST /api/v1/refunds/:id/approve
 */
export async function approveRefund(
  refundId: string,
  action: 'APPROVE' | 'REJECT',
  comment?: string
): Promise<void> {
  await apiClient.post(`/api/v1/refunds/${refundId}/approve`, {
    action,
    comment,
  });
}
