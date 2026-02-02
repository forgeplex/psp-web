import React from 'react';
import { Typography } from 'antd';
import { MobileOutlined, KeyOutlined, SafetyOutlined } from '@ant-design/icons';
import { brandColors } from '@psp/shared';

export type MfaMethod = 'totp' | 'passkey' | 'recovery';

interface MfaMethodSelectorProps {
  // Mode 1: Login flow
  onSelect?: (method: MfaMethod) => void;
  availableMethods?: MfaMethod[];
  onBack?: () => void;

  // Mode 2: Setup flow (controlled)
  value?: MfaMethod;
  onChange?: (method: MfaMethod) => void;
}

const ALL_METHODS: MfaMethod[] = ['totp', 'passkey'];

const styles = {
  container: {
    textAlign: 'center' as const,
    padding: '24px 0',
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: '#0F172A',
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 32,
  },
  methods: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  },
  methodButton: {
    height: 64,
    borderRadius: 12,
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left' as const,
  } as React.CSSProperties,
  methodButtonSelected: {
    borderColor: brandColors.primary,
    boxShadow: `0 0 0 3px ${brandColors.primary}15`,
    background: `${brandColors.primary}08`,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    fontSize: 18,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: '#0F172A',
    marginBottom: 2,
  },
  methodSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  backLink: {
    marginTop: 24,
    fontSize: 13,
    color: brandColors.primary,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
  },
};

export const MfaMethodSelector: React.FC<MfaMethodSelectorProps> = ({
  onSelect,
  availableMethods,
  onBack,
  value,
  onChange,
}) => {
  // Determine mode and methods to display
  const isSetupMode = value !== undefined && onChange !== undefined;
  const methodsToShow = isSetupMode ? ALL_METHODS : (availableMethods || ALL_METHODS);

  const handleMethodClick = (method: MfaMethod) => {
    if (isSetupMode) {
      onChange?.(method);
    } else {
      onSelect?.(method);
    }
  };

  const isSelected = (method: MfaMethod) => isSetupMode && value === method;

  const methodConfigs: Record<
    MfaMethod,
    { icon: React.ReactNode; title: string; subtitle: string; color: string }
  > = {
    totp: {
      icon: <MobileOutlined />,
      title: '验证器应用',
      subtitle: '使用 Google Authenticator 等应用',
      color: '#6366F1',
    },
    passkey: {
      icon: <KeyOutlined />,
      title: 'Passkey',
      subtitle: '使用生物识别或设备密钥',
      color: '#8B5CF6',
    },
    recovery: {
      icon: <SafetyOutlined />,
      title: '备用码',
      subtitle: '使用一次性备用恢复码',
      color: '#F59E0B',
    },
  };

  return (
    <div style={styles.container}>
      {!isSetupMode && (
        <>
          <div style={styles.title}>双因素认证</div>
          <div style={styles.desc}>请选择验证方式继续登录</div>
        </>
      )}

      <div style={styles.methods}>
        {methodsToShow
          .filter((m): m is MfaMethod => m in methodConfigs)
          .map((method) => {
            const config = methodConfigs[method];
            const selected = isSelected(method);

            return (
              <button
                key={method}
                style={{
                  ...styles.methodButton,
                  ...(selected ? styles.methodButtonSelected : {}),
                }}
                onClick={() => handleMethodClick(method)}
                onMouseEnter={(e) => {
                  if (!selected) {
                    e.currentTarget.style.borderColor = config.color;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${config.color}15`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selected) {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div
                  style={{
                    ...styles.methodIcon,
                    background: selected ? `${config.color}25` : `${config.color}15`,
                    color: config.color,
                  }}
                >
                  {config.icon}
                </div>
                <div style={styles.methodInfo}>
                  <div style={styles.methodTitle}>{config.title}</div>
                  <div style={styles.methodSubtitle}>{config.subtitle}</div>
                </div>
              </button>
            );
          })}
      </div>

      {!isSetupMode && onBack && (
        <button style={styles.backLink} onClick={onBack}>
          ← 返回登录
        </button>
      )}
    </div>
  );
};

export default MfaMethodSelector;
