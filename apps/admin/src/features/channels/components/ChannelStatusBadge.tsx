import React from 'react';
import { Tag } from 'antd';
import type { ChannelStatus } from '../types/domain';

interface ChannelStatusBadgeProps {
  status: ChannelStatus;
}

const statusConfig: Record<ChannelStatus, { color: string; label: string }> = {
  active: { color: 'success', label: 'Active' },
  inactive: { color: 'default', label: 'Inactive' },
  maintenance: { color: 'warning', label: 'Maintenance' },
};

export function ChannelStatusBadge({ status }: ChannelStatusBadgeProps) {
  const config = statusConfig[status] || { color: 'default', label: status };
  return <Tag color={config.color}>{config.label}</Tag>;
}
