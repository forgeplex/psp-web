import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Spin, Alert } from 'antd';
import { RoutingStrategiesPage } from '../../../features/channels/pages/RoutingStrategiesPage';
import { useRoutingStrategies } from '../../../features/channels/hooks/useRoutingStrategies';

export const Route = createFileRoute('/_authenticated/channels/strategy')({
  component: RoutingStrategiesRoute,
});

function RoutingStrategiesRoute() {
  const { data, isLoading, error } = useRoutingStrategies();

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

  return <RoutingStrategiesPage data={data ?? []} />;
}
