import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@psp/ui';
import { Card, Typography } from 'antd';

export const Route = createFileRoute('/_authenticated/monitoring')({
  component: MonitoringPage,
});

function MonitoringPage() {
  return (
    <div>
      <PageHeader title="监控告警" />
      <Card style={ { borderRadius: 8 } }>
        <div style={ { padding: 40, textAlign: 'center' } }>
          <Typography.Text type="secondary">
            🚧 监控告警模块开发中...
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}
