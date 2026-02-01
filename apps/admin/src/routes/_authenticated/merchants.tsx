import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@psp/ui';
import { Card, Typography } from 'antd';

export const Route = createFileRoute('/_authenticated/merchants')({
  component: MerchantsPage,
});

function MerchantsPage() {
  return (
    <div>
      <PageHeader title="商户管理" />
      <Card style={ { borderRadius: 8 } }>
        <div style={ { padding: 40, textAlign: 'center' } }>
          <Typography.Text type="secondary">
            🚧 商户管理模块开发中...
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}
