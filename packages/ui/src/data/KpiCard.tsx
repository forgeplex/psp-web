import React from 'react';
import { Card, Skeleton, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { statusColors } from '@psp/shared';

export interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
  loading?: boolean;
}

export function KpiCard({ title, value, subtitle, change, icon, loading }: KpiCardProps) {
  return (
    <Card styles={{ body: { padding: 24 } }} style={{ borderRadius: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography.Text type="secondary" style={{ fontSize: 14, fontWeight: 500 }}>
          {title}
        </Typography.Text>
        {icon && <span style={{ color: '#71717A' }}>{icon}</span>}
      </div>

      <div style={{ marginTop: 8 }}>
        {loading ? (
          <Skeleton.Input active size="small" style={{ width: 120 }} />
        ) : (
          <span
            style={{
              fontSize: 24,
              fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {value}
          </span>
        )}
      </div>

      {(subtitle || change) && (
        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          {change && (
            <span
              style={{
                color:
                  change.type === 'increase'
                    ? statusColors.success
                    : statusColors.failed,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {change.type === 'increase' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              {Math.abs(change.value)}%
            </span>
          )}
          {subtitle && <span style={{ color: '#71717A' }}>{subtitle}</span>}
        </div>
      )}
    </Card>
  );
}
