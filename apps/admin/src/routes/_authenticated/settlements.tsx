import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@psp/ui';
import { Card, Typography } from 'antd';

export const Route = createFileRoute('/_authenticated/settlements')({
  component: SettlementsPage,
});

function SettlementsPage() {
  return (
    <div>
      <PageHeader title="结算 & 资金" />
      <Card style={ { borderRadius: 8 } }>
        <div style={ { padding: 40, textAlign: 'center' } }>
          <Typography.Text type="secondary">
            🚧 结算 & 资金模块开发中...
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}
