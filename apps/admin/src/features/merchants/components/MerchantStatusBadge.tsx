import React from 'react';
import { Tag } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  PauseCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SafetyCertificateOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { MerchantStatus, KybStatus, RiskLevel } from '../types';

// ============================================================
// Merchant Status Badge
// ============================================================

const merchantStatusConfig: Record<MerchantStatus, { color: string; icon: React.ReactNode; label: string }> = {
  active: { color: 'success', icon: <CheckCircleOutlined />, label: 'Active' },
  pending: { color: 'warning', icon: <ClockCircleOutlined />, label: 'Pending' },
  suspended: { color: 'error', icon: <PauseCircleOutlined />, label: 'Suspended' },
  closed: { color: 'default', icon: <CloseCircleOutlined />, label: 'Closed' },
  rejected: { color: 'error', icon: <CloseCircleOutlined />, label: 'Rejected' },
};

interface MerchantStatusBadgeProps {
  status: MerchantStatus;
}

export const MerchantStatusBadge: React.FC<MerchantStatusBadgeProps> = ({ status }) => {
  const config = merchantStatusConfig[status];
  return (
    <Tag color={config.color} icon={config.icon}>
      {config.label}
    </Tag>
  );
};

// ============================================================
// KYB Status Badge
// ============================================================

const kybStatusConfig: Record<KybStatus, { color: string; icon: React.ReactNode; label: string }> = {
  verified: { color: 'processing', icon: <SafetyCertificateOutlined />, label: 'KYB Verified' },
  pending: { color: 'warning', icon: <ClockCircleOutlined />, label: 'KYB Pending' },
  in_review: { color: 'blue', icon: <SyncOutlined />, label: 'In Review' },
  rejected: { color: 'error', icon: <CloseCircleOutlined />, label: 'KYB Rejected' },
};

interface KybStatusBadgeProps {
  status: KybStatus;
}

export const KybStatusBadge: React.FC<KybStatusBadgeProps> = ({ status }) => {
  const config = kybStatusConfig[status];
  return (
    <Tag color={config.color} icon={config.icon}>
      {config.label}
    </Tag>
  );
};

// ============================================================
// Risk Level Badge
// ============================================================

const riskLevelConfig: Record<RiskLevel, { color: string; label: string }> = {
  low: { color: 'success', label: 'Low' },
  medium: { color: 'warning', label: 'Medium' },
  high: { color: 'orange', label: 'High' },
  critical: { color: 'error', label: 'Critical' },
};

interface RiskLevelBadgeProps {
  level: RiskLevel;
}

export const RiskLevelBadge: React.FC<RiskLevelBadgeProps> = ({ level }) => {
  const config = riskLevelConfig[level];
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
    <Tag style={{ backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}>
      {type}
    </Tag>
  );
};
