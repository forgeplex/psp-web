import { useQuery, useMutation, } from '@tanstack/react-query';
import { apiClient } from './client';
// ─── Generic Query Hook ─────────────────────────────────────
export function useApiQuery(queryKey, url, config, options) {
    return useQuery({
        queryKey,
        queryFn: async () => {
            const { data } = await apiClient.get(url, config);
            return data;
        },
        ...options,
    });
}
// ─── Generic List Hook (paginated) ──────────────────────────
export function useApiList(queryKey, url, params, options) {
    return useQuery({
        queryKey: [...queryKey, params],
        queryFn: async () => {
            const { data } = await apiClient.get(url, { params });
            return data;
        },
        ...options,
    });
}
// ─── Mutation Hooks ──────────────────────────────────────────
export function useApiCreate(url, options) {
    return useMutation({
        mutationFn: async (variables) => {
            const { data } = await apiClient.post(url, variables);
            return data;
        },
        ...options,
    });
}
export function useApiUpdate(url, options) {
    return useMutation({
        mutationFn: async (variables) => {
            const { data } = await apiClient.put(url, variables);
            return data;
        },
        ...options,
    });
}
export function useApiDelete(url, options) {
    return useMutation({
        mutationFn: async (id) => {
            const { data } = await apiClient.delete(`${url}/${id}`);
            return data;
        },
        ...options,
    });
}
//# sourceMappingURL=hooks.js.map