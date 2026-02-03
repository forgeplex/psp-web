import React from 'react';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  CreditCardOutlined,
  DollarOutlined,
  ApartmentOutlined,
  PercentageOutlined,
  SafetyOutlined,
  UserOutlined,
  BarChartOutlined,
  BellOutlined,
  SettingOutlined,
  MonitorOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useNavigate, useRouterState } from '@tanstack/react-router';

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/merchants', icon: <TeamOutlined />, label: '商户管理' },
  { key: '/transactions', icon: <CreditCardOutlined />, label: '交易中心' },
  { key: '/settlements', icon: <DollarOutlined />, label: '结算 & 资金' },
  { key: '/channels', icon: <ApartmentOutlined />, label: '通道 & 路由' },
  { key: '/providers', icon: <AppstoreOutlined />, label: 'Provider 管理' },
  { key: '/rates', icon: <PercentageOutlined />, label: '费率管理' },
  { key: '/risk', icon: <SafetyOutlined />, label: '风控中心' },
  { key: '/agents', icon: <UserOutlined />, label: '代理商管理' },
  { key: '/analytics', icon: <BarChartOutlined />, label: '数据分析' },
  { key: '/notifications', icon: <BellOutlined />, label: '通知 & 集成' },
  { key: '/settings', icon: <SettingOutlined />, label: '系统管理' },
  { key: '/monitoring', icon: <MonitorOutlined />, label: '监控告警' },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Find the matching key (longest prefix match)
  const selectedKey = menuItems
    .filter((item) => currentPath === item.key || (item.key !== '/' && currentPath.startsWith(item.key)))
    .sort((a, b) => b.key.length - a.key.length)[0]?.key ?? '/';

  return (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      items={menuItems}
      style={{ border: 'none', paddingTop: 8 }}
      onClick={({ key }) => navigate({ to: key })}
    />
  );
}
