import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@psp/ui';
import { Card, Typography } from 'antd';

export const Route = createFileRoute('/_authenticated/channels')({
  component: ChannelsPage,
});

function ChannelsPage() {
  return (
    <div>
      <PageHeader title="通道 & 路由" />
      <Card style={ { borderRadius: 8 } }>
        <div style={ { padding: 40, textAlign: 'center' } }>
          <Typography.Text type="secondary">
            🚧 通道 & 路由模块开发中...
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}
