import React from 'react';
import { MobileOutlined, KeyOutlined, SafetyOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { brandColors } from '@psp/shared';

export type MfaMethod = 'totp' | 'passkey' | 'recovery';

interface MfaMethodSelectorProps {
  value: MfaMethod;
  onChange: (method: MfaMethod) => void;
  showRecovery?: boolean;
}

const styles = {
  options: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  },
  option: (selected: boolean) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    padding: 16,
    border: `2px solid ${selected ? brandColors.primary : '#e2e8f0'}`,
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 200ms ease',
    background: selected ? brandColors.primaryLight : '#ffffff',
  }),
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    background: brandColors.primaryLight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: brandColors.primary,
    fontSize: 18,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 4,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  optionDesc: {
    fontSize: 12,
    color: '#64748b',
  },
};

export const MfaMethodSelector: React.FC<MfaMethodSelectorProps> = ({ 
  value, 
  onChange, 
  showRecovery = false 
}) => {
  const methods = [
    {
      key: 'totp' as MfaMethod,
      icon: <MobileOutlined />,
      title: '身份验证器应用',
      description: '使用 Google Authenticator 等应用生成验证码',
      recommended: true,
    },
    {
      key: 'passkey' as MfaMethod,
      icon: <KeyOutlined />,
      title: '安全密钥/生物识别',
      description: '使用指纹、面容或安全密钥',
      recommended: false,
    },
    ...(showRecovery ? [{
      key: 'recovery' as MfaMethod,
      icon: <SafetyOutlined />,
      title: '使用备用码',
      description: '使用您保存的 8 位备用验证码',
      recommended: false,
    }] : []),
  ];

  return (
    <div style={styles.options}>
      {methods.map((method) => (
        <div
          key={method.key}
          style={styles.option(value === method.key)}
          onClick={() => onChange(method.key)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onChange(method.key);
            }
          }}
        >
          <div style={styles.optionIcon}>{method.icon}</div>
          <div style={styles.optionContent}>
            <div style={styles.optionTitle}>
              {method.title}
              {method.recommended && <Tag color="blue">推荐</Tag>}
            </div>
            <p style={styles.optionDesc}>{method.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
