import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Card, Space } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import {
  TransactionTable,
  TransactionFilters,
  type FilterValues,
} from '@/features/transactions';
import { useTransactions } from '@/features/transactions/hooks/useTransactions';
import type { Transaction, ListTransactionsParams } from '@/features/transactions/types';

export const Route = createFileRoute('/_authenticated/transactions/')({
  component: TransactionsPage,
});

function TransactionsPage() {
  const navigate = useNavigate();
  const [params, setParams] = useState<ListTransactionsParams>({
    page: 1,
    size: 20,
  });

  const { data, isLoading } = useTransactions(params);
  const transactions = data?.items || [];
  const pagination = data?.pagination || { page: 1, size: 20, total: 0, totalPages: 0 };

  const handleSearch = (values: FilterValues) => {
    const newParams: ListTransactionsParams = {
      page: 1,
      size: params.size,
    };

    if (values.keyword) newParams.keyword = values.keyword;
    if (values.status) newParams.status = values.status;
    if (values.type) newParams.type = values.type;
    if (values.dateRange && values.dateRange.length === 2) {
      newParams.startDate = values.dateRange[0].format('YYYY-MM-DD');
      newParams.endDate = values.dateRange[1].format('YYYY-MM-DD');
    }

    setParams(newParams);
  };

  const handleReset = () => {
    setParams({ page: 1, size: 20 });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setParams((prev) => ({ ...prev, page, size: pageSize }));
  };

  const handleView = (record: Transaction) => {
    navigate({ to: '/transactions/$id', params: { id: record.id } });
  };

  const handleRefund = (record: Transaction) => {
    // TODO: 打开退款弹窗
    console.log('Refund:', record);
  };

  return (
    <div style={{ padding: 24 }}>
      <Card title="交易管理" bordered={false}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <TransactionFilters
            onSearch={handleSearch}
            onReset={handleReset}
            loading={isLoading}
          />
          
          <TransactionTable
            data={transactions}
            loading={isLoading}
            pagination={{
              current: pagination.page,
              pageSize: pagination.size,
              total: pagination.total,
            }}
            onPageChange={handlePageChange}
            onView={handleView}
            onRefund={handleRefund}
          />
        </Space>
      </Card>
    </div>
  );
}

export default TransactionsPage;
