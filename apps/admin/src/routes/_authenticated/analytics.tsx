import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@psp/ui';
import { Card, Typography } from 'antd';

export const Route = createFileRoute('/_authenticated/analytics')({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="数据分析" />
      <Card style={ { borderRadius: 8 } }>
        <div style={ { padding: 40, textAlign: 'center' } }>
          <Typography.Text type="secondary">
            🚧 数据分析模块开发中...
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}
