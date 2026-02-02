import React from 'react';
import { Breadcrumb, Space, Typography } from 'antd';

const { Title } = Typography;

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

export interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: string;
  breadcrumb?: BreadcrumbItem[];
  extra?: React.ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumb, extra }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      {breadcrumb && breadcrumb.length > 0 && (
        <Breadcrumb
          style={{ marginBottom: 8 }}
          items={breadcrumb.map((item) => ({
            title: item.href ? <a href={item.href}>{item.title}</a> : item.title,
          }))}
        />
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space direction="vertical" size={0}>
          {typeof title === 'string' ? (
            <Title level={4} style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
              {title}
            </Title>
          ) : (
            <div style={{ fontSize: 20, fontWeight: 600 }}>{title}</div>
          )}
          {subtitle && (
            <span style={{ color: '#71717A', fontSize: 14 }}>{subtitle}</span>
          )}
        </Space>
        {extra && <Space>{extra}</Space>}
      </div>
    </div>
  );
}
