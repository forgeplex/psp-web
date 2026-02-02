import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@psp/ui';
import { Card, Typography } from 'antd';

export const Route = createFileRoute('/_authenticated/settings/')({
  component: SettingsIndexPage,
});

function SettingsIndexPage() {
  return (
    <div>
      <PageHeader title="系统管理" />
      <Card style={{ borderRadius: 8 }}>
        <div style={{ padding: 40, textAlign: 'center' }}>
          <Typography.Text type="secondary">
            🚧 系统管理模块开发中...
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}
