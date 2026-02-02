/**
 * PSP Admin - Merchants API Hooks
 * 
 * 商户管理相关的 API 调用和类型定义
 * 基于 Arch 的 02-merchants-api-spec.md
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type { AxiosError } from 'axios';
import type { ApiError, PaginatedResponse } from './hooks';

// ─── Types ──────────────────────────────────────────────────

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

export interface MerchantDetail extends MerchantListItem {
  tenant_id: string;
  email: string;
  phone?: string;
  mcc?: string;
  industry?: string;
  website?: string;
  balance?: {
    available: number;
    pending: number;
    frozen: number;
    currency: string;
  };
  updated_at: string;
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

export interface MerchantDashboard {
  total_merchants: number;
  active_merchants: number;
  pending_kyb: number;
  high_risk: number;
  status_distribution: { status: MerchantStatus; count: number }[];
  risk_distribution: { risk_level: RiskLevel; count: number }[];
}

// ─── Query Keys ──────────────────────────────────────────────

export const merchantKeys = {
  all: ['merchants'] as const,
  lists: () => [...merchantKeys.all, 'list'] as const,
  list: (params: ListMerchantsParams) => [...merchantKeys.lists(), params] as const,
  details: () => [...merchantKeys.all, 'detail'] as const,
  detail: (id: string) => [...merchantKeys.details(), id] as const,
  dashboard: () => [...merchantKeys.all, 'dashboard'] as const,
};

// ─── Hooks ──────────────────────────────────────────────────

/**
 * 获取商户列表
 */
export function useMerchants(params: ListMerchantsParams = {}) {
  return useQuery<PaginatedResponse<MerchantListItem>, AxiosError<ApiError>>({
    queryKey: merchantKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<MerchantListItem>>(
        '/api/v1/merchants',
        { params }
      );
      return data;
    },
  });
}

/**
 * 获取商户详情
 */
export function useMerchant(id: string) {
  return useQuery<MerchantDetail, AxiosError<ApiError>>({
    queryKey: merchantKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<MerchantDetail>(`/api/v1/merchants/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

/**
 * 获取商户仪表盘统计
 */
export function useMerchantDashboard(period: '7d' | '30d' | '90d' = '30d') {
  return useQuery<MerchantDashboard, AxiosError<ApiError>>({
    queryKey: [...merchantKeys.dashboard(), period],
    queryFn: async () => {
      const { data } = await apiClient.get<MerchantDashboard>(
        '/api/v1/merchants/summary',
        { params: { period } }
      );
      return data;
    },
  });
}

/**
 * 创建商户
 */
export function useCreateMerchant() {
  const queryClient = useQueryClient();
  
  return useMutation<MerchantDetail, AxiosError<ApiError>, CreateMerchantRequest>({
    mutationFn: async (data) => {
      const { data: result } = await apiClient.post<MerchantDetail>('/api/v1/merchants', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.lists() });
      queryClient.invalidateQueries({ queryKey: merchantKeys.dashboard() });
    },
  });
}

/**
 * 更新商户状态
 */
export function useUpdateMerchantStatus() {
  const queryClient = useQueryClient();
  
  return useMutation<
    MerchantDetail,
    AxiosError<ApiError>,
    { id: string; status: MerchantStatus; reason?: string }
  >({
    mutationFn: async ({ id, status, reason }) => {
      const { data } = await apiClient.put<MerchantDetail>(
        `/api/v1/merchants/${id}/status`,
        { status, reason }
      );
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: merchantKeys.lists() });
    },
  });
}

/**
 * 批量操作商户
 */
export function useBatchMerchantAction() {
  const queryClient = useQueryClient();
  
  return useMutation<
    { success: number; failed: number },
    AxiosError<ApiError>,
    { ids: string[]; action: 'activate' | 'suspend' | 'close' }
  >({
    mutationFn: async ({ ids, action }) => {
      const { data } = await apiClient.post<{ success: number; failed: number }>(
        '/api/v1/merchants/batch',
        { merchant_ids: ids, action }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.lists() });
    },
  });
}

/**
 * 导出商户
 */
export function useExportMerchants() {
  return useMutation<
    { task_id: string; download_url?: string },
    AxiosError<ApiError>,
    ListMerchantsParams & { format?: 'csv' | 'xlsx' }
  >({
    mutationFn: async (params) => {
      const { data } = await apiClient.post<{ task_id: string; download_url?: string }>(
        '/api/v1/merchants/export',
        params
      );
      return data;
    },
  });
}

// ─── Merchant Detail ───────────────────────────────────────

export interface MerchantDetail extends MerchantListItem {
  tenant_id: string;
  email: string;
  phone?: string;
  mcc?: string;
  industry?: string;
  website?: string;
  address?: string;
  business_model?: string;
  activated_at?: string;
  updated_at: string;
}

export interface MerchantBalance {
  currency: string;
  available: number;
  pending: number;
  frozen: number;
  settled: number;
}

export interface MerchantStats {
  total_transactions: number;
  total_amount: number;
  active_accounts: number;
  active_users: number;
}

export function useMerchant(id: string) {
  return useQuery<MerchantDetail, AxiosError<ApiError>>({
    queryKey: merchantKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/v1/merchants/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useMerchantBalance(merchantId: string) {
  return useQuery<MerchantBalance, AxiosError<ApiError>>({
    queryKey: [...merchantKeys.detail(merchantId), 'balance'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/v1/merchants/${merchantId}/balance`);
      return data;
    },
    enabled: !!merchantId,
  });
}

export function useMerchantStats(merchantId: string) {
  return useQuery<MerchantStats, AxiosError<ApiError>>({
    queryKey: [...merchantKeys.detail(merchantId), 'stats'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/v1/merchants/${merchantId}/stats`);
      return data;
    },
    enabled: !!merchantId,
  });
}

// ─── Merchant Accounts ─────────────────────────────────────

export interface MerchantAccount {
  id: string;
  code: string;
  currency: string;
  bank_name: string;
  account_number: string;
  pix_key_type?: string;
  status: 'active' | 'frozen' | 'closed';
  is_default: boolean;
  created_at: string;
}

export function useMerchantAccounts(merchantId: string) {
  return useQuery<MerchantAccount[], AxiosError<ApiError>>({
    queryKey: [...merchantKeys.detail(merchantId), 'accounts'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/v1/merchants/${merchantId}/accounts`);
      return data;
    },
    enabled: !!merchantId,
  });
}

export function useFreezeAccount() {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<ApiError>, { merchantId: string; accountId: string; reason: string }>({
    mutationFn: async ({ merchantId, accountId, reason }) => {
      await apiClient.post(`/api/v1/merchants/${merchantId}/accounts/${accountId}/freeze`, { reason });
    },
    onSuccess: (_, { merchantId }) => {
      queryClient.invalidateQueries({ queryKey: [...merchantKeys.detail(merchantId), 'accounts'] });
    },
  });
}

export function useUnfreezeAccount() {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<ApiError>, { merchantId: string; accountId: string }>({
    mutationFn: async ({ merchantId, accountId }) => {
      await apiClient.post(`/api/v1/merchants/${merchantId}/accounts/${accountId}/unfreeze`);
    },
    onSuccess: (_, { merchantId }) => {
      queryClient.invalidateQueries({ queryKey: [...merchantKeys.detail(merchantId), 'accounts'] });
    },
  });
}

// ─── Merchant Users ────────────────────────────────────────

export interface MerchantUser {
  id: string;
  username: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'locked';
  mfa_enabled: boolean;
  last_login_at?: string;
  created_at: string;
}

export function useMerchantUsers(merchantId: string) {
  return useQuery<MerchantUser[], AxiosError<ApiError>>({
    queryKey: [...merchantKeys.detail(merchantId), 'users'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/v1/merchants/${merchantId}/users`);
      return data;
    },
    enabled: !!merchantId,
  });
}

// ─── API Keys ──────────────────────────────────────────────

export interface MerchantApiKey {
  id: string;
  name: string;
  prefix: string;
  status: 'active' | 'disabled';
  last_used_at?: string;
  created_at: string;
  expires_at?: string;
}

export function useMerchantApiKeys(merchantId: string) {
  return useQuery<MerchantApiKey[], AxiosError<ApiError>>({
    queryKey: [...merchantKeys.detail(merchantId), 'api-keys'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/v1/merchants/${merchantId}/api-keys`);
      return data;
    },
    enabled: !!merchantId,
  });
}

// ─── IP Whitelist ──────────────────────────────────────────

export interface IpWhitelistEntry {
  id: string;
  ip_address: string;
  description?: string;
  created_at: string;
  created_by: string;
}

export function useMerchantIpWhitelist(merchantId: string) {
  return useQuery<IpWhitelistEntry[], AxiosError<ApiError>>({
    queryKey: [...merchantKeys.detail(merchantId), 'ip-whitelist'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/v1/merchants/${merchantId}/ip-whitelist`);
      return data;
    },
    enabled: !!merchantId,
  });
}

export function useAddIpWhitelist() {
  const queryClient = useQueryClient();
  return useMutation<IpWhitelistEntry, AxiosError<ApiError>, { merchantId: string; ip_address: string; description?: string }>({
    mutationFn: async ({ merchantId, ...data }) => {
      const { data: result } = await apiClient.post(`/api/v1/merchants/${merchantId}/ip-whitelist`, data);
      return result;
    },
    onSuccess: (_, { merchantId }) => {
      queryClient.invalidateQueries({ queryKey: [...merchantKeys.detail(merchantId), 'ip-whitelist'] });
    },
  });
}

export function useRemoveIpWhitelist() {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<ApiError>, { merchantId: string; ipId: string }>({
    mutationFn: async ({ merchantId, ipId }) => {
      await apiClient.delete(`/api/v1/merchants/${merchantId}/ip-whitelist/${ipId}`);
    },
    onSuccess: (_, { merchantId }) => {
      queryClient.invalidateQueries({ queryKey: [...merchantKeys.detail(merchantId), 'ip-whitelist'] });
    },
  });
}
