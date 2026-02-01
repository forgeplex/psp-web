import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@psp/ui';
import { Card, Typography } from 'antd';

export const Route = createFileRoute('/_authenticated/risk')({
  component: RiskPage,
});

function RiskPage() {
  return (
    <div>
      <PageHeader title="风控中心" />
      <Card style={ { borderRadius: 8 } }>
        <div style={ { padding: 40, textAlign: 'center' } }>
          <Typography.Text type="secondary">
            🚧 风控中心模块开发中...
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}
