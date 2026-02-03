import React, { useState } from 'react';
import { Button, Typography } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';
import { brandColors } from '@psp/shared';

interface RecoveryCodeInputProps {
  onSubmit: (code: string) => void;
  loading?: boolean;
  error?: string | null;
  onBack?: () => void;
}

const styles = {
  container: {
    textAlign: 'center' as const,
    padding: '24px 0',
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'rgba(245, 158, 11, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  icon: {
    fontSize: 28,
    color: '#F59E0B',
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
    maxWidth: 300,
    margin: '0 auto 32px',
    lineHeight: 1.6,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 56,
    borderRadius: 10,
    border: '1px solid #E2E8F0',
    padding: '0 20px',
    fontSize: 18,
    fontFamily: 'monospace',
    letterSpacing: 2,
    textAlign: 'center' as const,
    textTransform: 'uppercase' as const,
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  submitButton: {
    height: 48,
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 500,
    background: brandColors.gradient,
    border: 'none',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
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
  hint: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 16,
  },
};

export const RecoveryCodeInput: React.FC<RecoveryCodeInputProps> = ({
  onSubmit,
  loading = false,
  error = null,
  onBack,
}) => {
  const [code, setCode] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
    setCode(value);
  };

  const handleSubmit = () => {
    if (code.length >= 8) {
      onSubmit(code);
    }
  };

  const formatDisplay = (value: string) => {
    // Format as XXXX-XXXX-XXXX
    const parts = value.match(/.{1,4}/g) || [];
    return parts.join('-');
  };

  return (
    <div style={styles.container}>
      <div style={styles.iconWrapper}>
        <SafetyOutlined style={styles.icon} />
      </div>

      <div style={styles.title}>使用备用码</div>
      <div style={styles.desc}>
        输入您保存的备用恢复码。每个备用码只能使用一次。
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="XXXX-XXXX-XXXX"
          value={formatDisplay(code)}
          onChange={handleChange}
          disabled={loading}
          style={{
            ...styles.input,
            borderColor: error ? '#DC2626' : '#E2E8F0',
            boxShadow: error ? '0 0 0 3px rgba(220, 38, 38, 0.1)' : 'none',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
        />
      </div>

      <Button
        type="primary"
        size="large"
        onClick={handleSubmit}
        loading={loading}
        disabled={code.length < 8}
        style={styles.submitButton}
        block
      >
        验证并登录
      </Button>

      {error && <div style={styles.error}>{error}</div>}

      {onBack && (
        <button style={styles.backLink} onClick={onBack}>
          ← 选择其他验证方式
        </button>
      )}

      <div style={styles.hint}>
        提示：备用码通常在启用双因素认证时生成并下载
      </div>
    </div>
  );
};

export default RecoveryCodeInput;
