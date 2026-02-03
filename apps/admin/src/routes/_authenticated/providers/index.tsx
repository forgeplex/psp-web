import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Spin, Alert } from 'antd';
import { ProvidersPage } from '../../../features/channels/pages/ProvidersPage';
import { useProviders } from '../../../features/channels/hooks/useProviders';

export const Route = createFileRoute('/_authenticated/providers/')({
  component: ProvidersIndexRoute,
});

function ProvidersIndexRoute() {
  const { data, isLoading, error } = useProviders();

  if (isLoading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="加载失败"
          description={error.message}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return <ProvidersPage data={data ?? []} />;
}
