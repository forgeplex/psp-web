import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Spin, Alert } from 'antd';
import { HealthChecksPage } from '../../../features/channels/pages/HealthChecksPage';
import { useHealthChecks } from '../../../features/channels/hooks/useHealthChecks';

export const Route = createFileRoute('/_authenticated/channels/health')({
  component: HealthChecksRoute,
});

function HealthChecksRoute() {
  const { data, isLoading, error } = useHealthChecks();

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

  return <HealthChecksPage data={data ?? []} />;
}
