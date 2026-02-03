import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  searchTransactions, 
  getTransaction, 
  getTransactionTimeline,
  exportTransactions 
} from '../api/transactions';
import type { TransactionSearchParams } from '../types/transaction';

export function useTransactions(params: TransactionSearchParams) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => searchTransactions(params),
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => getTransaction(id),
    enabled: !!id,
  });
}

export function useTransactionTimeline(id: string) {
  return useQuery({
    queryKey: ['transaction-timeline', id],
    queryFn: () => getTransactionTimeline(id),
    enabled: !!id,
  });
}

export function useExportTransactions() {
  return useMutation({
    mutationFn: exportTransactions,
  });
}
