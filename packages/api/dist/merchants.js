/**
 * PSP Admin - Merchants API Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
// Query Keys
export const merchantKeys = {
    all: ['merchants'],
    lists: () => [...merchantKeys.all, 'list'],
    list: (params) => [...merchantKeys.lists(), params],
    details: () => [...merchantKeys.all, 'detail'],
    detail: (id) => [...merchantKeys.details(), id],
};
// Hooks
export function useMerchants(params = {}) {
    return useQuery({
        queryKey: merchantKeys.list(params),
        queryFn: async () => {
            const { data } = await apiClient.get('/api/v1/merchants', { params });
            return data;
        },
    });
}
export function useCreateMerchant() {
    const queryClient = useQueryClient();
    return useMutation({
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
export function useExportMerchants() {
    return useMutation({
        mutationFn: async (params) => {
            const { data } = await apiClient.post('/api/v1/merchants/export', params);
            return data;
        },
    });
}
//# sourceMappingURL=merchants.js.map