/**
 * PSP Admin - Export API Hooks
 *
 * 异步导出相关的 API 调用和类型定义
 * 对接 BE 的 /api/v1/analytics/export/async 端点
 */
import type { AxiosError } from 'axios';
import type { ApiError } from './hooks';
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
export declare const exportKeys: {
    all: readonly ["export"];
    tasks: () => readonly ["export", "tasks"];
    taskList: (params?: {
        merchant_id?: string;
        limit?: number;
        offset?: number;
    }) => readonly ["export", "tasks", {
        merchant_id?: string;
        limit?: number;
        offset?: number;
    } | undefined];
    task: (taskId: string) => readonly ["export", "tasks", string];
    stats: () => readonly ["export", "stats"];
};
/**
 * 获取导出任务列表
 */
export declare function useExportTasks(params?: {
    merchant_id?: string;
    limit?: number;
    offset?: number;
}): import("@tanstack/react-query").UseQueryResult<ListExportTasksResponse, AxiosError<ApiError, any>>;
/**
 * 获取单个导出任务状态
 */
export declare function useExportTask(taskId: string, options?: {
    refetchInterval?: number;
}): import("@tanstack/react-query").UseQueryResult<ExportTask, AxiosError<ApiError, any>>;
/**
 * 获取导出任务统计
 */
export declare function useExportTaskStats(): import("@tanstack/react-query").UseQueryResult<ExportTaskStats, AxiosError<ApiError, any>>;
/**
 * 创建导出任务
 */
export declare function useCreateExportTask(): import("@tanstack/react-query").UseMutationResult<CreateExportTaskResponse, AxiosError<ApiError, any>, CreateExportTaskRequest, unknown>;
/**
 * 重试失败的导出任务
 */
export declare function useRetryExportTask(): import("@tanstack/react-query").UseMutationResult<CreateExportTaskResponse, AxiosError<ApiError, any>, string, unknown>;
/**
 * 下载导出文件
 * 返回下载 URL 或触发浏览器下载
 */
export declare function useDownloadExport(): import("@tanstack/react-query").UseMutationResult<string, AxiosError<ApiError, any>, string, unknown>;
/**
 * 导出商户列表（便捷封装）
 */
export declare function useExportMerchantsAsync(): import("@tanstack/react-query").UseMutationResult<CreateExportTaskResponse, AxiosError<ApiError, any>, {
    format?: ExportFormat;
    start_time?: number;
    end_time?: number;
    merchant_ids?: string[];
}, unknown>;
//# sourceMappingURL=export.d.ts.map