import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@psp/ui';
import { Card, Typography } from 'antd';

export const Route = createFileRoute('/_authenticated/notifications')({
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <div>
      <PageHeader title="通知 & 集成" />
      <Card style={ { borderRadius: 8 } }>
        <div style={ { padding: 40, textAlign: 'center' } }>
          <Typography.Text type="secondary">
            🚧 通知 & 集成模块开发中...
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}
