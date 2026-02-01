import React from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { ConfigProvider, App as AntApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { pspTheme } from '@psp/shared';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ConfigProvider theme={pspTheme} locale={zhCN}>
      <AntApp>
        <Outlet />
      </AntApp>
    </ConfigProvider>
  );
}
