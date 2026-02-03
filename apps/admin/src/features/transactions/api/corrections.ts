import { apiClient } from '@psp/api';
import type {
  Correction,
  CreateCorrectionRequest,
  ReviewCorrectionRequest,
} from '../types';

/**
 * 创建校正申请
 * POST /api/v1/corrections
 */
export async function createCorrection(
  request: CreateCorrectionRequest
): Promise<Correction> {
  const response = await apiClient.post('/api/v1/corrections', request);
  return response.data;
}

/**
 * 初审校正申请
 * POST /api/v1/corrections/:id/review
 */
export async function reviewCorrection(
  correctionId: string,
  request: ReviewCorrectionRequest
): Promise<Correction> {
  const response = await apiClient.post(
    `/api/v1/corrections/${correctionId}/review`,
    request
  );
  return response.data;
}

/**
 * 终审校正申请
 * POST /api/v1/corrections/:id/approve
 */
export async function approveCorrection(
  correctionId: string,
  request: ReviewCorrectionRequest
): Promise<Correction> {
  const response = await apiClient.post(
    `/api/v1/corrections/${correctionId}/approve`,
    request
  );
  return response.data;
}
