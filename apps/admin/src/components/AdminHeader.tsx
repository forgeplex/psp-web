import React from 'react';
import { Space, Avatar, Dropdown, Typography } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuthStore } from '../stores/auth';

export function AdminHeader() {
  const { user, logout } = useAuthStore();

  const dropdownItems = [
    { key: 'settings', icon: <SettingOutlined />, label: '个人设置' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      window.location.href = '/login';
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Typography.Title level={5} style={{ margin: 0, fontWeight: 700 }}>
        PSP Admin
      </Typography.Title>

      <Dropdown menu={{ items: dropdownItems, onClick: handleMenuClick }} placement="bottomRight">
        <Space style={{ cursor: 'pointer' }}>
          <Avatar size="small" icon={<UserOutlined />} />
          <span style={{ fontSize: 14 }}>{user?.name ?? 'Admin'}</span>
        </Space>
      </Dropdown>
    </div>
  );
}
