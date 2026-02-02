/**
 * PSP Admin - Merchants API Hooks
 *
 * 商户管理相关的 API 调用和类型定义
 * 基于 Arch 的 02-merchants-api-spec.md
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
// ─── Query Keys ──────────────────────────────────────────────
export const merchantKeys = {
    all: ['merchants'],
    lists: () => [...merchantKeys.all, 'list'],
    list: (params) => [...merchantKeys.lists(), params],
    details: () => [...merchantKeys.all, 'detail'],
    detail: (id) => [...merchantKeys.details(), id],
    dashboard: () => [...merchantKeys.all, 'dashboard'],
};
// ─── Hooks ──────────────────────────────────────────────────
/**
 * 获取商户列表
 */
export function useMerchants(params = {}) {
    return useQuery({
        queryKey: merchantKeys.list(params),
        queryFn: async () => {
            const { data } = await apiClient.get('/api/v1/merchants', { params });
            return data;
        },
    });
}
/**
 * 获取商户详情
 */
export function useMerchant(id) {
    return useQuery({
        queryKey: merchantKeys.detail(id),
        queryFn: async () => {
            const { data } = await apiClient.get(`/api/v1/merchants/${id}`);
            return data;
        },
        enabled: !!id,
    });
}
/**
 * 获取商户仪表盘统计
 */
export function useMerchantDashboard(period = '30d') {
    return useQuery({
        queryKey: [...merchantKeys.dashboard(), period],
        queryFn: async () => {
            const { data } = await apiClient.get('/api/v1/merchants/summary', { params: { period } });
            return data;
        },
    });
}
/**
 * 创建商户
 */
export function useCreateMerchant() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const { data: result } = await apiClient.post('/api/v1/merchants', data);
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
    return useMutation({
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
/**
 * 批量操作商户
 */
export function useBatchMerchantAction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ ids, action }) => {
            const { data } = await apiClient.post('/api/v1/merchants/batch', { merchant_ids: ids, action });
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
    return useMutation({
        mutationFn: async (params) => {
            const { data } = await apiClient.post('/api/v1/merchants/export', params);
            return data;
        },
    });
}
//# sourceMappingURL=merchants.js.map