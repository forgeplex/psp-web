import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { MerchantListPage } from '../../features/merchants';

export const Route = createFileRoute('/_authenticated/merchants')({
  component: MerchantsPage,
});

function MerchantsPage() {
  return <MerchantListPage />;
}
