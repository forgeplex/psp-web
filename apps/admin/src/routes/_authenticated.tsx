import React from 'react';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppLayout } from '@psp/ui';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const token = localStorage.getItem('psp_access_token');
    if (!token) {
      throw redirect({ to: '/login' });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <AppLayout
      header={<AdminHeader />}
      sidebar={<AdminSidebar />}
      logo={null}
    >
      <Outlet />
    </AppLayout>
  );
}
