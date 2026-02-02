/**
 * PSP Admin - Export API Hooks
 * 
 * 异步导出相关的 API 调用和类型定义
 * 对接 BE 的 /api/v1/analytics/export/async 端点
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type { AxiosError } from 'axios';
import type { ApiError } from './hooks';

// ─── Types ──────────────────────────────────────────────────

export type ExportReportType = 'transactions' | 'refunds' | 'ledger' | 'merchants';
export type ExportFormat = 'csv' | 'xlsx' | 'json';
export type ExportTaskStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'expired';

export interface CreateExportTaskRequest {
  /** 报表类型 */
  report_type: ExportReportType;
  /** 导出格式 */
  format: ExportFormat;
  /** 开始时间 (Unix 毫秒) */
  start_time: number;
  /** 结束时间 (Unix 毫秒) */
  end_time: number;
  /** 商户 ID (可选) */
  merchant_id?: string;
  /** 商户 ID 列表 (可选) */
  merchant_ids?: string[];
  /** 指定列 (可选) */
  columns?: string[];
  /** 交易类型过滤 (可选) */
  transaction_types?: string[];
  /** Webhook URL (可选) */
  webhook_url?: string;
}

export interface ExportTask {
  task_id: string;
  status: ExportTaskStatus;
  report_type: ExportReportType;
  format: ExportFormat;
  progress?: number;
  total_records?: number;
  download_url?: string;
  created_at: string;
  completed_at?: string;
  expires_at?: string;
  error_message?: string;
}

export interface CreateExportTaskResponse {
  task_id: string;
  status: ExportTaskStatus;
  message?: string;
  created_at?: string;
  expires_at?: string;
}

export interface ListExportTasksResponse {
  tasks: ExportTask[];
  total: number;
  limit: number;
  offset: number;
}

export interface ExportTaskStats {
  total_tasks: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

// ─── Query Keys ──────────────────────────────────────────────

export const exportKeys = {
  all: ['export'] as const,
  tasks: () => [...exportKeys.all, 'tasks'] as const,
  taskList: (params?: { merchant_id?: string; limit?: number; offset?: number }) => 
    [...exportKeys.tasks(), params] as const,
  task: (taskId: string) => [...exportKeys.tasks(), taskId] as const,
  stats: () => [...exportKeys.all, 'stats'] as const,
};

// ─── Hooks ──────────────────────────────────────────────────

/**
 * 获取导出任务列表
 */
export function useExportTasks(params?: { merchant_id?: string; limit?: number; offset?: number }) {
  return useQuery<ListExportTasksResponse, AxiosError<ApiError>>({
    queryKey: exportKeys.taskList(params),
    queryFn: async () => {
      const { data } = await apiClient.get<ListExportTasksResponse>(
        '/api/v1/analytics/export/async',
        { params }
      );
      return data;
    },
  });
}

/**
 * 获取单个导出任务状态
 */
export function useExportTask(taskId: string, options?: { refetchInterval?: number }) {
  return useQuery<ExportTask, AxiosError<ApiError>>({
    queryKey: exportKeys.task(taskId),
    queryFn: async () => {
      const { data } = await apiClient.get<ExportTask>(
        `/api/v1/analytics/export/async/${taskId}`
      );
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
  return useQuery<ExportTaskStats, AxiosError<ApiError>>({
    queryKey: exportKeys.stats(),
    queryFn: async () => {
      const { data } = await apiClient.get<ExportTaskStats>(
        '/api/v1/analytics/export/async/stats'
      );
      return data;
    },
  });
}

/**
 * 创建导出任务
 */
export function useCreateExportTask() {
  const queryClient = useQueryClient();
  
  return useMutation<CreateExportTaskResponse, AxiosError<ApiError>, CreateExportTaskRequest>({
    mutationFn: async (request) => {
      const { data } = await apiClient.post<CreateExportTaskResponse>(
        '/api/v1/analytics/export/async',
        request
      );
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
  
  return useMutation<CreateExportTaskResponse, AxiosError<ApiError>, string>({
    mutationFn: async (taskId) => {
      const { data } = await apiClient.post<CreateExportTaskResponse>(
        `/api/v1/analytics/export/async/${taskId}/retry`
      );
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
  return useMutation<string, AxiosError<ApiError>, string>({
    mutationFn: async (taskId) => {
      const response = await apiClient.get(
        `/api/v1/analytics/export/async/${taskId}/download`,
        { responseType: 'blob' }
      );
      
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
  
  return useMutation<
    CreateExportTaskResponse,
    AxiosError<ApiError>,
    {
      format?: ExportFormat;
      start_time?: number;
      end_time?: number;
      merchant_ids?: string[];
    }
  >({
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
