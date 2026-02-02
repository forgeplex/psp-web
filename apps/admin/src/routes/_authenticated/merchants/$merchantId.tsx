import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { MerchantDetailPage } from '../../../features/merchants';

export const Route = createFileRoute('/_authenticated/merchants/$merchantId')({
  component: MerchantDetailPageRoute,
});

function MerchantDetailPageRoute() {
  const { merchantId } = Route.useParams();
  // TODO: Pass merchantId to page and fetch data
  return <MerchantDetailPage />;
}
