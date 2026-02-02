import React from 'react';
import { Tag } from 'antd';
import { statusColors } from '@psp/shared';

type MerchantStatus = 'pending' | 'active' | 'suspended' | 'closed' | 'rejected';
type KYBStatus = 'pending' | 'in_review' | 'verified' | 'rejected';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

const statusConfig: Record<MerchantStatus, { color: string; text: string }> = {
  pending: { color: 'orange', text: '待审核' },
  active: { color: 'green', text: '已激活' },
  suspended: { color: 'red', text: '已暂停' },
  closed: { color: 'default', text: '已关闭' },
  rejected: { color: 'red', text: '已拒绝' },
};

const kybConfig: Record<KYBStatus, { color: string; text: string }> = {
  pending: { color: 'orange', text: '待提交' },
  in_review: { color: 'blue', text: '审核中' },
  verified: { color: 'green', text: '已验证' },
  rejected: { color: 'red', text: '已拒绝' },
};

const riskConfig: Record<RiskLevel, { color: string; text: string }> = {
  low: { color: 'green', text: '低' },
  medium: { color: 'orange', text: '中' },
  high: { color: 'volcano', text: '高' },
  critical: { color: 'red', text: '极高' },
};

export const MerchantStatusBadge: React.FC<{ status: MerchantStatus }> = ({ status }) => {
  const config = statusConfig[status];
  return <Tag color={config.color}>{config.text}</Tag>;
};

export const KYBStatusBadge: React.FC<{ status: KYBStatus }> = ({ status }) => {
  const config = kybConfig[status];
  return <Tag color={config.color}>{config.text}</Tag>;
};

export const RiskLevelBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  const config = riskConfig[level];
  return <Tag color={config.color}>{config.text}</Tag>;
};

export type { MerchantStatus, KYBStatus, RiskLevel };
