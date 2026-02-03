import React from 'react';
import { Tag } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  PauseCircleOutlined,
  CloseCircleOutlined,
  SafetyCertificateOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { baseColors } from '@psp/shared';

// ============================================================
// Merchant Status Badge
// ============================================================

const merchantStatusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  active: { color: 'success', icon: <CheckCircleOutlined />, label: 'Active' },
  pending: { color: 'warning', icon: <ClockCircleOutlined />, label: 'Pending' },
  suspended: { color: 'error', icon: <PauseCircleOutlined />, label: 'Suspended' },
  closed: { color: 'default', icon: <CloseCircleOutlined />, label: 'Closed' },
  rejected: { color: 'error', icon: <CloseCircleOutlined />, label: 'Rejected' },
};

interface MerchantStatusBadgeProps {
  status: string;
}

export const MerchantStatusBadge: React.FC<MerchantStatusBadgeProps> = ({ status }) => {
  const config = merchantStatusConfig[status] || { color: 'default', icon: null, label: status };
  return (
    <Tag color={config.color} icon={config.icon}>
      {config.label}
    </Tag>
  );
};

// ============================================================
// KYB Status Badge
// ============================================================

const kybStatusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  // API values (snake_case)
  not_submitted: { color: 'default', icon: <ClockCircleOutlined />, label: 'Not Submitted' },
  submitted: { color: 'processing', icon: <SyncOutlined spin />, label: 'Submitted' },
  under_review: { color: 'blue', icon: <SyncOutlined spin />, label: 'Under Review' },
  approved: { color: 'success', icon: <SafetyCertificateOutlined />, label: 'Approved' },
  rejected: { color: 'error', icon: <CloseCircleOutlined />, label: 'Rejected' },
  need_more_info: { color: 'warning', icon: <ExclamationCircleOutlined />, label: 'Need Info' },
  // Legacy values
  verified: { color: 'success', icon: <SafetyCertificateOutlined />, label: 'Verified' },
  pending: { color: 'warning', icon: <ClockCircleOutlined />, label: 'Pending' },
  in_review: { color: 'blue', icon: <SyncOutlined spin />, label: 'In Review' },
};

interface KybStatusBadgeProps {
  status: string;
}

export const KybStatusBadge: React.FC<KybStatusBadgeProps> = ({ status }) => {
  const config = kybStatusConfig[status] || { color: 'default', icon: null, label: status };
  return (
    <Tag color={config.color} icon={config.icon}>
      {config.label}
    </Tag>
  );
};

// ============================================================
// Risk Level Badge
// ============================================================

const riskLevelConfig: Record<string, { color: string; label: string }> = {
  low: { color: 'success', label: 'Low' },
  medium: { color: 'warning', label: 'Medium' },
  high: { color: 'orange', label: 'High' },
  critical: { color: 'error', label: 'Critical' },
  blacklist: { color: '#000', label: 'Blacklist' },
};

interface RiskLevelBadgeProps {
  level: string;
}

export const RiskLevelBadge: React.FC<RiskLevelBadgeProps> = ({ level }) => {
  const config = riskLevelConfig[level] || { color: 'default', label: level };
  return <Tag color={config.color}>{config.label}</Tag>;
};

// ============================================================
// Merchant Type Badge
// ============================================================

interface MerchantTypeBadgeProps {
  type: 'company' | 'individual';
}

export const MerchantTypeBadge: React.FC<MerchantTypeBadgeProps> = ({ type }) => {
  return (
    <Tag
      style={{
        backgroundColor: baseColors.secondary,
        color: baseColors.secondaryForeground,
        border: `1px solid ${baseColors.border}`,
      }}
    >
      {type === 'company' ? 'Company' : 'Individual'}
    </Tag>
  );
};
