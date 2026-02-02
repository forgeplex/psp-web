/**
 * PSP Admin - Merchants API Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type { AxiosError } from 'axios';
import type { ApiError, PaginatedResponse } from './hooks';

// Types
export type MerchantStatus = 'pending' | 'active' | 'suspended' | 'closed' | 'rejected';
export type KYBStatus = 'not_submitted' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'need_more_info';
export type RiskLevel = 'low' | 'medium' | 'high' | 'blacklist';

export interface MerchantListItem {
  id: string;
  merchant_code: string;
  name: string;
  legal_name: string;
  merchant_type: 'individual' | 'company';
  status: MerchantStatus;
  kyb_status: KYBStatus;
  risk_level: RiskLevel;
  country_code: string;
  created_at: string;
}

export interface CreateMerchantRequest {
  merchant_code: string;
  merchant_name: string;
  legal_name: string;
  merchant_type: 'individual' | 'company';
  email: string;
  country_code: string;
  phone?: string;
  mcc?: string;
  industry?: string;
  website?: string;
}

export interface ListMerchantsParams {
  status?: MerchantStatus;
  kyb_status?: KYBStatus;
  risk_level?: RiskLevel;
  country_code?: string;
  keyword?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: 'created_at' | 'name' | 'status';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

// Query Keys
export const merchantKeys = {
  all: ['merchants'] as const,
  lists: () => [...merchantKeys.all, 'list'] as const,
  list: (params: ListMerchantsParams) => [...merchantKeys.lists(), params] as const,
  details: () => [...merchantKeys.all, 'detail'] as const,
  detail: (id: string) => [...merchantKeys.details(), id] as const,
};

// Hooks
export function useMerchants(params: ListMerchantsParams = {}) {
  return useQuery<PaginatedResponse<MerchantListItem>, AxiosError<ApiError>>({
    queryKey: merchantKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get('/api/v1/merchants', { params });
      return data;
    },
  });
}

export function useCreateMerchant() {
  const queryClient = useQueryClient();
  return useMutation<MerchantListItem, AxiosError<ApiError>, CreateMerchantRequest>({
    mutationFn: async (data) => {
      const { data: result } = await apiClient.post('/api/v1/merchants', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.lists() });
    },
  });
}

export function useUpdateMerchantStatus() {
  const queryClient = useQueryClient();
  return useMutation<MerchantListItem, AxiosError<ApiError>, { id: string; status: MerchantStatus; reason?: string }>({
    mutationFn: async ({ id, status, reason }) => {
      const { data } = await apiClient.put(`/api/v1/merchants/${id}/status`, { status, reason });
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: merchantKeys.lists() });
    },
  });
}

export function useBatchMerchantAction() {
  const queryClient = useQueryClient();
  return useMutation<{ success: number; failed: number }, AxiosError<ApiError>, { ids: string[]; action: 'activate' | 'suspend' | 'close' }>({
    mutationFn: async ({ ids, action }) => {
      const { data } = await apiClient.post('/api/v1/merchants/batch', { merchant_ids: ids, action });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.lists() });
    },
  });
}

export function useExportMerchants() {
  return useMutation<{ task_id: string; download_url?: string }, AxiosError<ApiError>, ListMerchantsParams & { format?: 'csv' | 'xlsx' }>({
    mutationFn: async (params) => {
      const { data } = await apiClient.post('/api/v1/merchants/export', params);
      return data;
    },
  });
}
