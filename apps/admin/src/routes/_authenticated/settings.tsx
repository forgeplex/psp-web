import React from 'react';
import { createFileRoute, Outlet, useMatches } from '@tanstack/react-router';
import { PageHeader } from '@psp/ui';
import { Card, Typography } from 'antd';

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsLayout,
});

function SettingsLayout() {
  const matches = useMatches();
  // Check if we're on a child route (more than just /settings)
  const hasChildRoute = matches.some(m => 
    m.routeId.includes('/settings/') && m.routeId !== '/_authenticated/settings'
  );

  if (hasChildRoute) {
    return <Outlet />;
  }

  // Default settings page content
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
