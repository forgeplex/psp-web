import React, { useMemo } from 'react';
import { createFileRoute, Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { Tabs } from 'antd';

export const Route = createFileRoute('/_authenticated/channels')({
  component: ChannelsLayout,
});

function ChannelsLayout() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const tabItems = useMemo(
    () => [
      { key: '/channels', label: '渠道列表' },
      { key: '/channels/routing-strategies', label: '路由策略' },
      { key: '/channels/health-checks', label: '健康检查' },
      { key: '/channels/providers', label: '提供商' },
    ],
    [],
  );

  const activeKey =
    tabItems
      .filter((item) => currentPath === item.key || currentPath.startsWith(`${item.key}/`))
      .sort((a, b) => b.key.length - a.key.length)[0]?.key ??
    '/channels';

  return (
    <div>
      <Tabs
        activeKey={activeKey}
        items={tabItems}
        onChange={(key) => navigate({ to: key })}
      />
      <Outlet />
    </div>
  );
}
