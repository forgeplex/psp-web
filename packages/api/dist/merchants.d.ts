/**
 * PSP Admin - Merchants API Hooks
 *
 * 商户管理相关的 API 调用和类型定义
 * 基于 Arch 的 02-merchants-api-spec.md
 */
import type { AxiosError } from 'axios';
import type { ApiError, PaginatedResponse } from './hooks';
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
    status_distribution: {
        status: MerchantStatus;
        count: number;
    }[];
    risk_distribution: {
        risk_level: RiskLevel;
        count: number;
    }[];
}
export declare const merchantKeys: {
    all: readonly ["merchants"];
    lists: () => readonly ["merchants", "list"];
    list: (params: ListMerchantsParams) => readonly ["merchants", "list", ListMerchantsParams];
    details: () => readonly ["merchants", "detail"];
    detail: (id: string) => readonly ["merchants", "detail", string];
    dashboard: () => readonly ["merchants", "dashboard"];
};
/**
 * 获取商户列表
 */
export declare function useMerchants(params?: ListMerchantsParams): import("@tanstack/react-query").UseQueryResult<PaginatedResponse<MerchantListItem>, AxiosError<ApiError, any>>;
/**
 * 获取商户详情
 */
export declare function useMerchant(id: string): import("@tanstack/react-query").UseQueryResult<MerchantDetail, AxiosError<ApiError, any>>;
/**
 * 获取商户仪表盘统计
 */
export declare function useMerchantDashboard(period?: '7d' | '30d' | '90d'): import("@tanstack/react-query").UseQueryResult<MerchantDashboard, AxiosError<ApiError, any>>;
/**
 * 创建商户
 */
export declare function useCreateMerchant(): import("@tanstack/react-query").UseMutationResult<MerchantDetail, AxiosError<ApiError, any>, CreateMerchantRequest, unknown>;
/**
 * 更新商户状态
 */
export declare function useUpdateMerchantStatus(): import("@tanstack/react-query").UseMutationResult<MerchantDetail, AxiosError<ApiError, any>, {
    id: string;
    status: MerchantStatus;
    reason?: string;
}, unknown>;
/**
 * 批量操作商户
 */
export declare function useBatchMerchantAction(): import("@tanstack/react-query").UseMutationResult<{
    success: number;
    failed: number;
}, AxiosError<ApiError, any>, {
    ids: string[];
    action: "activate" | "suspend" | "close";
}, unknown>;
/**
 * 导出商户
 */
export declare function useExportMerchants(): import("@tanstack/react-query").UseMutationResult<{
    task_id: string;
    download_url?: string;
}, AxiosError<ApiError, any>, ListMerchantsParams & {
    format?: "csv" | "xlsx";
}, unknown>;
//# sourceMappingURL=merchants.d.ts.map