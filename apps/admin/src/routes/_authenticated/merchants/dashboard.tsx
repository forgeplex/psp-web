import { createFileRoute } from '@tanstack/react-router';
import { MerchantDashboardPage } from '../../../features/merchants';

export const Route = createFileRoute('/_authenticated/merchants/dashboard')({
  component: MerchantDashboardPage,
});
