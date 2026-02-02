import React, { useState, useCallback } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Card, Button, Typography, Input, Checkbox, message, Alert } from 'antd';
import {
  SafetyCertificateOutlined,
  KeyOutlined,
  ScanOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons';
import { OtpInput } from '../../components/auth';

export const Route = createFileRoute('/mfa/verify')({
  component: MfaVerifyPage,
});

type VerifyMode = 'totp' | 'backup' | 'passkey';
type MfaErrorCode = 'MFA_001' | 'MFA_002' | 'MFA_003' | 'MFA_004';

const errorMessages: Record<MfaErrorCode, string> = {
  MFA_001: '验证码错误，请重试',
  MFA_002: '验证码已过期，请使用最新验证码',
  MFA_003: '尝试次数过多，请 5 分钟后重试',
  MFA_004: 'MFA 已锁定，请联系管理员',
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F8FAFC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    maxWidth: 400,
  },
  logo: {
    textAlign: 'center' as const,
    marginBottom: 32,
  },
  logoInner: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 28,
    height: 28,
    background: '#6366f1',
    borderRadius: 7,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 14,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0f172a',
    letterSpacing: -0.02,
  },
  logoAdmin: {
    fontWeight: 500,
    color: '#64748b',
    marginLeft: 2,
  },
  card: {
    borderRadius: 12,
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02)',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 14,
    background: '#eef2ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    color: '#6366f1',
    fontSize: 28,
  },
  title: {
    textAlign: 'center' as const,
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 6,
  },
  subtitle: {
    textAlign: 'center' as const,
    fontSize: 13,
    color: '#64748b',
    marginBottom: 28,
    lineHeight: 1.6,
  },
  trustDevice: {
    marginBottom: 20,
  },
  switchLinks: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
    fontSize: 12,
  },
  switchLink: {
    color: '#6366f1',
    cursor: 'pointer',
    fontWeight: 500,
  },
  switchSep: {
    color: '#e2e8f0',
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 20,
    fontSize: 12,
    color: '#6366f1',
    cursor: 'pointer',
    fontWeight: 500,
  },
  backupInput: {
    textAlign: 'center' as const,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 15,
    fontWeight: 500,
    letterSpacing: 2,
    marginBottom: 20,
  },
  passkeyDesc: {
    textAlign: 'center' as const,
    fontSize: 12,
    color: '#64748b',
    marginBottom: 24,
    lineHeight: 1.6,
  },
  footer: {
    textAlign: 'center' as const,
    marginTop: 24,
    fontSize: 11,
    color: '#94a3b8',
  },
};

function MfaVerifyPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<VerifyMode>('totp');
  const [otpValue, setOtpValue] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [trustDevice, setTrustDevice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ visible: boolean; code?: MfaErrorCode }>({
    visible: false,
  });

  const isDisabled = error.code === 'MFA_003' || error.code === 'MFA_004';

  const handleTotpVerify = useCallback(async () => {
    if (otpValue.length !== 6) return;

    setLoading(true);
    setError({ visible: false });

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve, reject) =>
        setTimeout(() => {
          // Mock: accept '123456' as valid
          if (otpValue === '123456') {
            resolve(true);
          } else {
            reject(new Error('MFA_001'));
          }
        }, 1000)
      );

      message.success('验证成功');
      navigate({ to: '/' });
    } catch (err) {
      const errorCode = err instanceof Error ? err.message : 'MFA_001';
      setError({
        visible: true,
        code: errorCode as MfaErrorCode,
      });
      setOtpValue('');
    } finally {
      setLoading(false);
    }
  }, [otpValue, navigate]);

  const handleBackupVerify = async () => {
    if (backupCode.length < 8) return;

    setLoading(true);
    setError({ visible: false });

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve, reject) =>
        setTimeout(() => {
          // Mock: accept 'A8F2K9M3' as valid
          if (backupCode.replace(/-/g, '').toUpperCase() === 'A8F2K9M3') {
            resolve(true);
          } else {
            reject(new Error('MFA_001'));
          }
        }, 1000)
      );

      message.success('验证成功');
      navigate({ to: '/' });
    } catch (err) {
      const errorCode = err instanceof Error ? err.message : 'MFA_001';
      setError({
        visible: true,
        code: errorCode as MfaErrorCode,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeyVerify = async () => {
    setLoading(true);
    setError({ visible: false });

    try {
      // TODO: Replace with actual WebAuthn API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      message.success('验证成功');
      navigate({ to: '/' });
    } catch {
      setError({
        visible: true,
        code: 'MFA_001',
      });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: VerifyMode) => {
    setMode(newMode);
    setError({ visible: false });
    setOtpValue('');
    setBackupCode('');
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoInner}>
            <div style={styles.logoIcon}>
              <SafetyCertificateOutlined />
            </div>
            <span style={styles.logoText}>
              PSP <span style={styles.logoAdmin}>Admin</span>
            </span>
          </div>
        </div>

        {/* Card */}
        <Card style={styles.card} styles={{ body: { padding: 32 } }}>
          {/* TOTP Mode */}
          {mode === 'totp' && (
            <>
              <div style={styles.iconCircle}>
                <SafetyCertificateOutlined />
              </div>

              <Typography.Title level={5} style={styles.title}>
                双因素验证
              </Typography.Title>
              <Typography.Text style={styles.subtitle}>
                请输入身份验证器应用中的 6 位验证码
              </Typography.Text>

              {error.visible && error.code && (
                <Alert
                  type="error"
                  showIcon
                  icon={<ExclamationCircleFilled />}
                  message={errorMessages[error.code]}
                  style={{ marginBottom: 20 }}
                />
              )}

              <OtpInput
                value={otpValue}
                onChange={setOtpValue}
                onComplete={handleTotpVerify}
                error={error.visible && error.code === 'MFA_001'}
                disabled={isDisabled}
              />

              <div style={{ ...styles.trustDevice, marginTop: 20 }}>
                <Checkbox
                  checked={trustDevice}
                  onChange={(e) => setTrustDevice(e.target.checked)}
                  disabled={isDisabled}
                >
                  <Typography.Text style={{ fontSize: 12, color: '#64748b' }}>
                    信任此设备（7天内免验证）
                  </Typography.Text>
                </Checkbox>
              </div>

              <Button
                type="primary"
                block
                onClick={handleTotpVerify}
                loading={loading}
                disabled={otpValue.length !== 6 || isDisabled}
                style={{
                  height: 40,
                  background: otpValue.length === 6 && !isDisabled ? '#6366f1' : undefined,
                  borderColor: otpValue.length === 6 && !isDisabled ? '#6366f1' : undefined,
                }}
              >
                验证
              </Button>

              <div style={styles.switchLinks}>
                <span style={styles.switchLink} onClick={() => switchMode('backup')}>
                  使用备用码
                </span>
                <span style={styles.switchSep}>|</span>
                <span style={styles.switchLink} onClick={() => switchMode('passkey')}>
                  使用安全密钥
                </span>
              </div>
            </>
          )}

          {/* Backup Code Mode */}
          {mode === 'backup' && (
            <>
              <div style={styles.iconCircle}>
                <KeyOutlined />
              </div>

              <Typography.Title level={5} style={styles.title}>
                使用备用码
              </Typography.Title>
              <Typography.Text style={styles.subtitle}>
                请输入您保存的 8 位备用验证码
              </Typography.Text>

              {error.visible && error.code && (
                <Alert
                  type="error"
                  showIcon
                  icon={<ExclamationCircleFilled />}
                  message={errorMessages[error.code]}
                  style={{ marginBottom: 20 }}
                />
              )}

              <Input
                value={backupCode}
                onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                placeholder="输入 8 位备用码"
                maxLength={9}
                style={styles.backupInput}
                disabled={isDisabled}
              />

              <Button
                type="primary"
                block
                onClick={handleBackupVerify}
                loading={loading}
                disabled={backupCode.length < 8 || isDisabled}
                style={{
                  height: 40,
                  background: backupCode.length >= 8 && !isDisabled ? '#6366f1' : undefined,
                  borderColor: backupCode.length >= 8 && !isDisabled ? '#6366f1' : undefined,
                }}
              >
                验证
              </Button>

              <div style={styles.backLink} onClick={() => switchMode('totp')}>
                ← 返回验证码验证
              </div>
            </>
          )}

          {/* Passkey Mode */}
          {mode === 'passkey' && (
            <>
              <div style={styles.iconCircle}>
                <ScanOutlined />
              </div>

              <Typography.Title level={5} style={styles.title}>
                安全密钥验证
              </Typography.Title>
              <Typography.Text style={styles.subtitle}>
                使用您注册的安全密钥或生物识别进行验证
              </Typography.Text>

              {error.visible && error.code && (
                <Alert
                  type="error"
                  showIcon
                  icon={<ExclamationCircleFilled />}
                  message={errorMessages[error.code]}
                  style={{ marginBottom: 20 }}
                />
              )}

              <Typography.Text style={styles.passkeyDesc}>
                请在弹出提示时触摸安全密钥或使用指纹/面容识别
              </Typography.Text>

              <Button
                type="primary"
                block
                onClick={handlePasskeyVerify}
                loading={loading}
                disabled={isDisabled}
                style={{
                  height: 40,
                  background: !isDisabled ? '#6366f1' : undefined,
                  borderColor: !isDisabled ? '#6366f1' : undefined,
                }}
                icon={<ScanOutlined />}
              >
                使用安全密钥验证
              </Button>

              <div style={styles.backLink} onClick={() => switchMode('totp')}>
                ← 返回验证码验证
              </div>
            </>
          )}
        </Card>

        <div style={styles.footer}>PSP Admin © 2026</div>
      </div>
    </div>
  );
}
