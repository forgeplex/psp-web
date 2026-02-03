import React from 'react';
import { Button, Typography } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import { brandColors } from '@psp/shared';

interface PasskeyPulseProps {
  onActivate: () => void;
  loading?: boolean;
  error?: string | null;
  onBack?: () => void;
}

const styles = {
  container: {
    textAlign: 'center' as const,
    padding: '40px 0',
  },
  pulseRing: {
    position: 'relative' as const,
    width: 120,
    height: 120,
    margin: '0 auto 32px',
  },
  pulseCircle: {
    position: 'absolute' as const,
    inset: 0,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${brandColors.primary}20 0%, #8B5CF620 100%)`,
    animation: 'passkeyPulse 2s ease-out infinite',
  },
  pulseCircle2: {
    position: 'absolute' as const,
    inset: 15,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${brandColors.primary}30 0%, #8B5CF630 100%)`,
    animation: 'passkeyPulse 2s ease-out infinite 0.5s',
  },
  iconContainer: {
    position: 'absolute' as const,
    inset: 30,
    borderRadius: '50%',
    background: brandColors.gradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
  },
  icon: {
    fontSize: 32,
    color: '#FFFFFF',
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
    maxWidth: 280,
    margin: '0 auto 32px',
    lineHeight: 1.6,
  },
  activateButton: {
    height: 48,
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 500,
  },
  error: {
    marginTop: 16,
    padding: '12px 16px',
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: 8,
    color: '#DC2626',
    fontSize: 13,
  },
  backLink: {
    marginTop: 20,
    fontSize: 13,
    color: brandColors.primary,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
  },
};

export const PasskeyPulse: React.FC<PasskeyPulseProps> = ({
  onActivate,
  loading = false,
  error = null,
  onBack,
}) => {
  return (
    <div style={styles.container}>
      <style>{`
        @keyframes passkeyPulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
      
      <div style={styles.pulseRing}>
        <div style={styles.pulseCircle} />
        <div style={styles.pulseCircle2} />
        <div style={styles.iconContainer}>
          <KeyOutlined style={styles.icon} />
        </div>
      </div>

      <div style={styles.title}>使用 Passkey 验证</div>
      <div style={styles.desc}>
        点击按钮使用设备上的生物识别（指纹/面容）或安全密钥进行验证
      </div>

      <Button
        type="primary"
        size="large"
        icon={<KeyOutlined />}
        onClick={onActivate}
        loading={loading}
        style={{
          ...styles.activateButton,
          background: brandColors.gradient,
          border: 'none',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
        }}
        block
      >
        {loading ? '验证中...' : '使用 Passkey 登录'}
      </Button>

      {error && <div style={styles.error}>{error}</div>}

      {onBack && (
        <button style={styles.backLink} onClick={onBack}>
          ← 选择其他验证方式
        </button>
      )}
    </div>
  );
};

export default PasskeyPulse;
