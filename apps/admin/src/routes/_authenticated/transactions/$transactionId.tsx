import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { TransactionDetailPage } from '../../../features/transactions';

export const Route = createFileRoute('/_authenticated/transactions/$transactionId')({
  component: TransactionDetailPageRoute,
});

function TransactionDetailPageRoute() {
  const { transactionId } = Route.useParams();
  return <TransactionDetailPage transactionId={transactionId} />;
}
