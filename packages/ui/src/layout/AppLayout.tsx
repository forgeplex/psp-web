import React, { useState } from 'react';
import { Layout } from 'antd';
import { layout } from '@psp/shared';

const { Header, Sider, Content } = Layout;

export interface AppLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  logo?: React.ReactNode;
  defaultCollapsed?: boolean;
}

export function AppLayout({
  children,
  sidebar,
  header,
  logo,
  defaultCollapsed = false,
}: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: layout.headerHeight,
          lineHeight: `${layout.headerHeight}px`,
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #E4E4E7',
          background: '#FFFFFF',
        }}
      >
        {logo && <div style={{ marginRight: 24 }}>{logo}</div>}
        {header}
      </Header>

      <Layout style={{ marginTop: layout.headerHeight }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={layout.sidebarWidth}
          collapsedWidth={layout.sidebarCollapsedWidth}
          style={{
            position: 'fixed',
            left: 0,
            top: layout.headerHeight,
            bottom: 0,
            overflow: 'auto',
            background: '#FFFFFF',
            borderRight: '1px solid #E4E4E7',
          }}
          theme="light"
        >
          {sidebar}
        </Sider>

        <Content
          style={{
            marginLeft: collapsed ? layout.sidebarCollapsedWidth : layout.sidebarWidth,
            padding: layout.pagePadding,
            transition: 'margin-left 0.2s',
            minHeight: `calc(100vh - ${layout.headerHeight}px)`,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
