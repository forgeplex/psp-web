/**
 * PSP Admin - Merchants API Hooks
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
export declare const merchantKeys: {
    all: readonly ["merchants"];
    lists: () => readonly ["merchants", "list"];
    list: (params: ListMerchantsParams) => readonly ["merchants", "list", ListMerchantsParams];
    details: () => readonly ["merchants", "detail"];
    detail: (id: string) => readonly ["merchants", "detail", string];
};
export declare function useMerchants(params?: ListMerchantsParams): import("@tanstack/react-query").UseQueryResult<PaginatedResponse<MerchantListItem>, AxiosError<ApiError, any>>;
export declare function useCreateMerchant(): import("@tanstack/react-query").UseMutationResult<MerchantListItem, AxiosError<ApiError, any>, CreateMerchantRequest, unknown>;
export declare function useUpdateMerchantStatus(): import("@tanstack/react-query").UseMutationResult<MerchantListItem, AxiosError<ApiError, any>, {
    id: string;
    status: MerchantStatus;
    reason?: string;
}, unknown>;
export declare function useBatchMerchantAction(): import("@tanstack/react-query").UseMutationResult<{
    success: number;
    failed: number;
}, AxiosError<ApiError, any>, {
    ids: string[];
    action: "activate" | "suspend" | "close";
}, unknown>;
export declare function useExportMerchants(): import("@tanstack/react-query").UseMutationResult<{
    task_id: string;
    download_url?: string;
}, AxiosError<ApiError, any>, ListMerchantsParams & {
    format?: "csv" | "xlsx";
}, unknown>;
//# sourceMappingURL=merchants.d.ts.map