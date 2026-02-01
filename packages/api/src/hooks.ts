import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
} from '@tanstack/react-query';
import { apiClient } from './client';
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

// ─── Generic Query Hook ─────────────────────────────────────

export function useApiQuery<T>(
  queryKey: QueryKey,
  url: string,
  config?: AxiosRequestConfig,
  options?: Omit<UseQueryOptions<T, AxiosError<ApiError>>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<T, AxiosError<ApiError>>({
    queryKey,
    queryFn: async () => {
      const { data } = await apiClient.get<T>(url, config);
      return data;
    },
    ...options,
  });
}

// ─── Generic List Hook (paginated) ──────────────────────────

export function useApiList<T>(
  queryKey: QueryKey,
  url: string,
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<PaginatedResponse<T>, AxiosError<ApiError>>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<PaginatedResponse<T>, AxiosError<ApiError>>({
    queryKey: [...queryKey, params],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<T>>(url, { params });
      return data;
    },
    ...options,
  });
}

// ─── Mutation Hooks ──────────────────────────────────────────

export function useApiCreate<TData, TVariables = unknown>(
  url: string,
  options?: UseMutationOptions<TData, AxiosError<ApiError>, TVariables>,
) {
  return useMutation<TData, AxiosError<ApiError>, TVariables>({
    mutationFn: async (variables) => {
      const { data } = await apiClient.post<TData>(url, variables);
      return data;
    },
    ...options,
  });
}

export function useApiUpdate<TData, TVariables = unknown>(
  url: string,
  options?: UseMutationOptions<TData, AxiosError<ApiError>, TVariables>,
) {
  return useMutation<TData, AxiosError<ApiError>, TVariables>({
    mutationFn: async (variables) => {
      const { data } = await apiClient.put<TData>(url, variables);
      return data;
    },
    ...options,
  });
}

export function useApiDelete<TData = void>(
  url: string,
  options?: UseMutationOptions<TData, AxiosError<ApiError>, string | number>,
) {
  return useMutation<TData, AxiosError<ApiError>, string | number>({
    mutationFn: async (id) => {
      const { data } = await apiClient.delete<TData>(`${url}/${id}`);
      return data;
    },
    ...options,
  });
}
