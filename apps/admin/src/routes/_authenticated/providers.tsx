import React from 'react';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/providers')({
  component: ProvidersLayout,
});

function ProvidersLayout() {
  return <Outlet />;
}
