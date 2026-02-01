import React from 'react';
import { Tag } from 'antd';
import { statusConfigMap, type TransactionStatus } from '@psp/shared';

export interface StatusBadgeProps {
  status: TransactionStatus;
  label?: string;
  showDot?: boolean;
}

export function StatusBadge({ status, label, showDot = true }: StatusBadgeProps) {
  const config = statusConfigMap[status] ?? statusConfigMap.unknown;

  return (
    <Tag
      color={config.bg}
      style={{
        color: config.color,
        borderColor: config.bg,
        borderRadius: 9999,
        padding: '2px 10px',
        fontSize: 12,
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {showDot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: config.color,
            display: 'inline-block',
          }}
        />
      )}
      {label ?? config.label}
    </Tag>
  );
}
