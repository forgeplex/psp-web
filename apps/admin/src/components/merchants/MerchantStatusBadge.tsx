import React from 'react';
import { Tag } from 'antd';
import { statusColors, baseColors } from '@psp/shared';

type MerchantStatus = 'pending' | 'active' | 'suspended' | 'closed' | 'rejected';
type KYBStatus = 'pending' | 'in_review' | 'verified' | 'rejected';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

const statusConfig: Record<MerchantStatus, { color: string; bg: string; text: string }> = {
  pending: { color: statusColors.pending, bg: statusColors.pendingBg, text: '待审核' },
  active: { color: statusColors.success, bg: statusColors.successBg, text: '已激活' },
  suspended: { color: statusColors.failed, bg: statusColors.failedBg, text: '已暂停' },
  closed: { color: baseColors.mutedForeground, bg: baseColors.muted, text: '已关闭' },
  rejected: { color: statusColors.failed, bg: statusColors.failedBg, text: '已拒绝' },
};

const kybConfig: Record<KYBStatus, { color: string; bg: string; text: string }> = {
  pending: { color: statusColors.pending, bg: statusColors.pendingBg, text: '待提交' },
  in_review: { color: '#3B82F6', bg: '#EFF6FF', text: '审核中' },  // blue
  verified: { color: statusColors.success, bg: statusColors.successBg, text: '已验证' },
  rejected: { color: statusColors.failed, bg: statusColors.failedBg, text: '已拒绝' },
};

const riskConfig: Record<RiskLevel, { color: string; bg: string; text: string }> = {
  low: { color: statusColors.success, bg: statusColors.successBg, text: '低' },
  medium: { color: statusColors.pending, bg: statusColors.pendingBg, text: '中' },
  high: { color: '#F97316', bg: '#FFF7ED', text: '高' },  // orange/volcano
  critical: { color: statusColors.failed, bg: statusColors.failedBg, text: '极高' },
};

export const MerchantStatusBadge: React.FC<{ status: MerchantStatus }> = ({ status }) => {
  const config = statusConfig[status];
  return (
    <Tag 
      style={{ 
        color: config.color, 
        backgroundColor: config.bg, 
        border: `1px solid ${config.color}20`,
        borderRadius: 9999,
      }}
    >
      {config.text}
    </Tag>
  );
};

export const KYBStatusBadge: React.FC<{ status: KYBStatus }> = ({ status }) => {
  const config = kybConfig[status];
  return (
    <Tag 
      style={{ 
        color: config.color, 
        backgroundColor: config.bg, 
        border: `1px solid ${config.color}20`,
        borderRadius: 9999,
      }}
    >
      {config.text}
    </Tag>
  );
};

export const RiskLevelBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  const config = riskConfig[level];
  return (
    <Tag 
      style={{ 
        color: config.color, 
        backgroundColor: config.bg, 
        border: `1px solid ${config.color}20`,
        borderRadius: 9999,
      }}
    >
      {config.text}
    </Tag>
  );
};

export type { MerchantStatus, KYBStatus, RiskLevel };
