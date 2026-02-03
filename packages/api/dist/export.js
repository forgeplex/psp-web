/**
 * PSP Admin - Export API Hooks
 *
 * 异步导出相关的 API 调用和类型定义
 * 对接 BE 的 /api/v1/analytics/export/async 端点
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
// ─── Query Keys ──────────────────────────────────────────────
export const exportKeys = {
    all: ['export'],
    tasks: () => [...exportKeys.all, 'tasks'],
    taskList: (params) => [...exportKeys.tasks(), params],
    task: (taskId) => [...exportKeys.tasks(), taskId],
    stats: () => [...exportKeys.all, 'stats'],
};
// ─── Hooks ──────────────────────────────────────────────────
/**
 * 获取导出任务列表
 */
export function useExportTasks(params) {
    return useQuery({
        queryKey: exportKeys.taskList(params),
        queryFn: async () => {
            const { data } = await apiClient.get('/api/v1/analytics/export/async', { params });
            return data;
        },
    });
}
/**
 * 获取单个导出任务状态
 */
export function useExportTask(taskId, options) {
    return useQuery({
        queryKey: exportKeys.task(taskId),
        queryFn: async () => {
            const { data } = await apiClient.get(`/api/v1/analytics/export/async/${taskId}`);
            return data;
        },
        enabled: !!taskId,
        refetchInterval: options?.refetchInterval,
    });
}
/**
 * 获取导出任务统计
 */
export function useExportTaskStats() {
    return useQuery({
        queryKey: exportKeys.stats(),
        queryFn: async () => {
            const { data } = await apiClient.get('/api/v1/analytics/export/async/stats');
            return data;
        },
    });
}
/**
 * 创建导出任务
 */
export function useCreateExportTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (request) => {
            const { data } = await apiClient.post('/api/v1/analytics/export/async', request);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: exportKeys.tasks() });
            queryClient.invalidateQueries({ queryKey: exportKeys.stats() });
        },
    });
}
/**
 * 重试失败的导出任务
 */
export function useRetryExportTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (taskId) => {
            const { data } = await apiClient.post(`/api/v1/analytics/export/async/${taskId}/retry`);
            return data;
        },
        onSuccess: (_, taskId) => {
            queryClient.invalidateQueries({ queryKey: exportKeys.task(taskId) });
            queryClient.invalidateQueries({ queryKey: exportKeys.tasks() });
        },
    });
}
/**
 * 下载导出文件
 * 返回下载 URL 或触发浏览器下载
 */
export function useDownloadExport() {
    return useMutation({
        mutationFn: async (taskId) => {
            const response = await apiClient.get(`/api/v1/analytics/export/async/${taskId}/download`, { responseType: 'blob' });
            // 从 response headers 获取文件名
            const contentDisposition = response.headers['content-disposition'];
            const filename = contentDisposition
                ?.match(/filename="?([^";\n]+)"?/)?.[1]
                ?? `export-${taskId}.csv`;
            // 创建下载链接
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            return url;
        },
    });
}
// ─── Helper: 商户导出便捷方法 ──────────────────────────────────
/**
 * 导出商户列表（便捷封装）
 */
export function useExportMerchantsAsync() {
    const createTask = useCreateExportTask();
    return useMutation({
        mutationFn: async (params) => {
            // 默认导出最近 90 天的商户数据
            const now = Date.now();
            const ninetyDaysAgo = now - 90 * 24 * 60 * 60 * 1000;
            return createTask.mutateAsync({
                report_type: 'merchants',
                format: params.format ?? 'csv',
                start_time: params.start_time ?? ninetyDaysAgo,
                end_time: params.end_time ?? now,
                merchant_ids: params.merchant_ids,
            });
        },
    });
}
//# sourceMappingURL=export.js.map