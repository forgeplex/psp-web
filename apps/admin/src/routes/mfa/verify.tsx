import React, { useState, useCallback } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Card, Button, Typography, Input, Checkbox, Alert } from 'antd';
import {
  SafetyCertificateOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons';
import { brandColors } from '@psp/shared';
import {
  OtpInput,
  MfaMethodSelector,
  SuccessOverlay,
  PasskeyPulse,
  type MfaMethod,
} from '../../components/auth';

export const Route = createFileRoute('/mfa/verify')({
  component: MfaVerifyPage,
});

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
    maxWidth: 480,
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
    background: brandColors.primary,
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
    background: brandColors.primaryLight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    color: brandColors.primary,
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
    marginBottom: 24,
    lineHeight: 1.6,
  },
  trustDevice: {
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    marginTop: 20,
    textAlign: 'center' as const,
  },
  backLink: {
    color: brandColors.primary,
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: 12,
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
  const [step, setStep] = useState<'select' | 'verify'>('select');
  const [method, setMethod] = useState<MfaMethod>('totp');
  const [otpValue, setOtpValue] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [trustDevice, setTrustDevice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passkeyWaiting, setPasskeyWaiting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<{ visible: boolean; code?: MfaErrorCode }>({
    visible: false,
  });

  const isDisabled = error.code === 'MFA_003' || error.code === 'MFA_004';

  const handleMethodSelect = () => {
    setStep('verify');
    setError({ visible: false });
  };

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

      setShowSuccess(true);
    } catch (err) {
      const errorCode = err instanceof Error ? err.message : 'MFA_001';
      setError({
        visible: true,
        code: errorCode as MfaErrorCode,
      });
      setOtpValue('');
      setLoading(false);
    }
  }, [otpValue]);

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

      setShowSuccess(true);
    } catch (err) {
      const errorCode = err instanceof Error ? err.message : 'MFA_001';
      setError({
        visible: true,
        code: errorCode as MfaErrorCode,
      });
      setLoading(false);
    }
  };

  const handlePasskeyVerify = async () => {
    setLoading(true);
    setPasskeyWaiting(true);
    setError({ visible: false });

    try {
      // TODO: Replace with actual WebAuthn API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowSuccess(true);
    } catch {
      setError({
        visible: true,
        code: 'MFA_001',
      });
      setLoading(false);
      setPasskeyWaiting(false);
    }
  };

  const handleSuccessComplete = () => {
    navigate({ to: '/' });
  };

  const handleBack = () => {
    setStep('select');
    setError({ visible: false });
    setOtpValue('');
    setBackupCode('');
  };

  return (
    <div style={styles.page}>
      <SuccessOverlay
        visible={showSuccess}
        message="验证成功"
        onComplete={handleSuccessComplete}
      />

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
          {/* Step 1: Method Selection */}
          {step === 'select' && (
            <>
              <div style={styles.iconCircle}>
                <SafetyCertificateOutlined />
              </div>

              <Typography.Title level={5} style={styles.title}>
                双因素验证
              </Typography.Title>
              <Typography.Text style={styles.subtitle}>
                请选择验证方式完成身份验证
              </Typography.Text>

              <MfaMethodSelector
                value={method}
                onChange={setMethod}
                showRecovery
              />

              <Button
                type="primary"
                block
                onClick={handleMethodSelect}
                style={{
                  marginTop: 24,
                  height: 42,
                  background: brandColors.primary,
                  borderColor: brandColors.primary,
                }}
              >
                继续验证
              </Button>
            </>
          )}

          {/* Step 2: TOTP Verify */}
          {step === 'verify' && method === 'totp' && (
            <>
              <div style={styles.iconCircle}>
                <SafetyCertificateOutlined />
              </div>

              <Typography.Title level={5} style={styles.title}>
                身份验证器验证
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

              <div style={styles.trustDevice}>
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
                  background: otpValue.length === 6 && !isDisabled ? brandColors.primary : undefined,
                  borderColor: otpValue.length === 6 && !isDisabled ? brandColors.primary : undefined,
                }}
              >
                验证
              </Button>

              <div style={styles.backButton}>
                <span style={styles.backLink} onClick={handleBack}>
                  ← 返回选择验证方式
                </span>
              </div>
            </>
          )}

          {/* Step 2: Backup Code Verify */}
          {step === 'verify' && method === 'recovery' && (
            <>
              <div style={styles.iconCircle}>
                <SafetyCertificateOutlined />
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
                  background: backupCode.length >= 8 && !isDisabled ? brandColors.primary : undefined,
                  borderColor: backupCode.length >= 8 && !isDisabled ? brandColors.primary : undefined,
                }}
              >
                验证
              </Button>

              <div style={styles.backButton}>
                <span style={styles.backLink} onClick={handleBack}>
                  ← 返回选择验证方式
                </span>
              </div>
            </>
          )}

          {/* Step 2: Passkey Verify */}
          {step === 'verify' && method === 'passkey' && (
            <>
              <PasskeyPulse active={passkeyWaiting} />

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
                  background: !isDisabled ? brandColors.primary : undefined,
                  borderColor: !isDisabled ? brandColors.primary : undefined,
                }}
              >
                使用安全密钥验证
              </Button>

              <div style={styles.backButton}>
                <span style={styles.backLink} onClick={handleBack}>
                  ← 返回选择验证方式
                </span>
              </div>
            </>
          )}
        </Card>

        <div style={styles.footer}>PSP Admin © 2026</div>
      </div>
    </div>
  );
}
