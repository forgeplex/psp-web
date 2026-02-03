import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import type { ListTransactionsParams } from '../types';
import * as api from '../api';

// Query keys
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (params: ListTransactionsParams) => [...transactionKeys.lists(), params] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  timeline: (id: string) => [...transactionKeys.all, 'timeline', id] as const,
  history: (id: string) => [...transactionKeys.all, 'history', id] as const,
  stats: () => [...transactionKeys.all, 'stats'] as const,
};

// ==================== Queries ====================

/**
 * 获取交易列表
 */
export function useTransactions(params: ListTransactionsParams = {}) {
  return useQuery({
    queryKey: transactionKeys.list(params),
    queryFn: () => api.listTransactions(params),
  });
}

/**
 * 获取交易详情
 */
export function useTransaction(id: string) {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => api.getTransaction(id),
    enabled: !!id,
  });
}

/**
 * 获取交易时间线
 * BE 端点已完成，直接使用真实 API
 */
export function useTransactionTimeline(id: string) {
  return useQuery({
    queryKey: transactionKeys.timeline(id),
    queryFn: () => api.getTransactionTimeline(id),
    enabled: !!id,
  });
}

/**
 * 获取交易历史
 */
export function useTransactionHistory(id: string) {
  return useQuery({
    queryKey: transactionKeys.history(id),
    queryFn: () => api.getTransactionHistory(id),
    enabled: !!id,
  });
}

// ==================== Mutations ====================

/**
 * 创建退款
 */
export function useCreateRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createRefund,
    onSuccess: () => {
      message.success('退款申请已提交');
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
    onError: (error: Error) => {
      message.error(`退款失败: ${error.message}`);
    },
  });
}

/**
 * 取消交易
 */
export function useCancelTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason, reasonCode }: { id: string; reason: string; reasonCode: string }) =>
      api.cancelTransaction(id, { reason, reasonCode }),
    onSuccess: (_, variables) => {
      message.success('交易已取消');
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
    onError: (error: Error) => {
      message.error(`取消失败: ${error.message}`);
    },
  });
}
