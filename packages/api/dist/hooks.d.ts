import { type UseQueryOptions, type UseMutationOptions, type QueryKey } from '@tanstack/react-query';
import type { AxiosError, AxiosRequestConfig } from 'axios';
/** Paginated response wrapper */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}
/** Standard API error */
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}
export declare function useApiQuery<T>(queryKey: QueryKey, url: string, config?: AxiosRequestConfig, options?: Omit<UseQueryOptions<T, AxiosError<ApiError>>, 'queryKey' | 'queryFn'>): import("@tanstack/react-query").UseQueryResult<import("@tanstack/react-query").NoInfer<T>, AxiosError<ApiError, any>>;
export declare function useApiList<T>(queryKey: QueryKey, url: string, params?: Record<string, unknown>, options?: Omit<UseQueryOptions<PaginatedResponse<T>, AxiosError<ApiError>>, 'queryKey' | 'queryFn'>): import("@tanstack/react-query").UseQueryResult<PaginatedResponse<T>, AxiosError<ApiError, any>>;
export declare function useApiCreate<TData, TVariables = unknown>(url: string, options?: UseMutationOptions<TData, AxiosError<ApiError>, TVariables>): import("@tanstack/react-query").UseMutationResult<TData, AxiosError<ApiError, any>, TVariables, unknown>;
export declare function useApiUpdate<TData, TVariables = unknown>(url: string, options?: UseMutationOptions<TData, AxiosError<ApiError>, TVariables>): import("@tanstack/react-query").UseMutationResult<TData, AxiosError<ApiError, any>, TVariables, unknown>;
export declare function useApiDelete<TData = void>(url: string, options?: UseMutationOptions<TData, AxiosError<ApiError>, string | number>): import("@tanstack/react-query").UseMutationResult<TData, AxiosError<ApiError, any>, string | number, unknown>;
//# sourceMappingURL=hooks.d.ts.map