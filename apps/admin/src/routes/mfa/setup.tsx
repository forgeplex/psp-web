import React, { useState, useCallback } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Card, Button, Typography, Input, message } from 'antd';
import { SafetyCertificateOutlined, LockOutlined } from '@ant-design/icons';
import { brandColors } from '@psp/shared';
import {
  StepIndicator,
  MfaMethodSelector,
  OtpInput,
  BackupCodes,
  MfaRequiredBanner,
  SuccessOverlay,
  PasskeyPulse,
  type MfaMethod,
} from '../../components/auth';

export const Route = createFileRoute('/mfa/setup')({
  component: MfaSetupPage,
});

const STEPS = [
  { label: '选择方式' },
  { label: '设置验证' },
  { label: '保存备用码' },
];

// Mock data
const MOCK_SECRET = 'JBSW Y3DP EHPK 3PXP';
const MOCK_QR_URL = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/PSP:admin@psp.com?secret=JBSWY3DPEHPK3PXP&issuer=PSP';
const MOCK_BACKUP_CODES = [
  'A8F2-K9M3',
  'B7N4-P2Q5',
  'C6R8-S1T7',
  'D5U9-V3W4',
  'E4X6-Y8Z2',
  'F3A1-B5C9',
  'G2D7-E4F6',
  'H1G8-I3J5',
  'K9L2-M7N4',
  'P8Q1-R6S3',
];

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
    maxWidth: 520,
  },
  logo: {
    textAlign: 'center' as const,
    marginBottom: 32,
  },
  logoIcon: {
    fontSize: 48,
    color: brandColors.primary,
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center' as const,
    marginBottom: 24,
  },
  qrSection: {
    textAlign: 'center' as const,
    marginBottom: 24,
  },
  qrCode: {
    width: 200,
    height: 200,
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    margin: '0 auto 16px',
    background: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secretToggle: {
    fontSize: 12,
    color: brandColors.primary,
    cursor: 'pointer',
    marginBottom: 12,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  },
  secretKey: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    fontWeight: 500,
    padding: 12,
    background: '#f8fafc',
    borderRadius: 6,
    textAlign: 'center' as const,
    wordBreak: 'break-all' as const,
  },
  otpSection: {
    marginBottom: 24,
  },
  otpLabel: {
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  buttonGroup: {
    display: 'flex',
    gap: 12,
    marginTop: 24,
  },
  passkeySection: {
    textAlign: 'center' as const,
  },
  passkeyHint: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 16,
  },
};

function MfaSetupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<MfaMethod>('totp');
  const [otpValue, setOtpValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [passkeyWaiting, setPasskeyWaiting] = useState(false);

  const handleMethodNext = () => {
    setStep(2);
  };

  const handleTotpVerify = useCallback(async () => {
    if (otpValue.length !== 6) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock: accept any 6-digit code
      setStep(3);
    } catch {
      message.error('验证码错误，请重试');
    } finally {
      setLoading(false);
    }
  }, [otpValue]);

  const handlePasskeyRegister = async () => {
    setLoading(true);
    setPasskeyWaiting(true);
    try {
      // TODO: Replace with actual WebAuthn API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock: simulate successful registration
      setStep(3);
    } catch {
      message.error('安全密钥注册失败');
    } finally {
      setLoading(false);
      setPasskeyWaiting(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowSuccess(true);
    } catch {
      message.error('设置失败，请重试');
      setLoading(false);
    }
  };

  const handleSuccessComplete = () => {
    navigate({ to: '/' });
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setOtpValue('');
    }
  };

  return (
    <div style={styles.page}>
      <SuccessOverlay
        visible={showSuccess}
        message="MFA 设置完成"
        onComplete={handleSuccessComplete}
      />

      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logo}>
          <SafetyCertificateOutlined style={styles.logoIcon} />
          <Typography.Title level={4} style={{ margin: 0 }}>
            设置多因素认证
          </Typography.Title>
        </div>

        {/* Forced MFA Banner */}
        <MfaRequiredBanner />

        {/* Step Indicator */}
        <StepIndicator steps={STEPS} currentStep={step} />

        {/* Card */}
        <Card style={styles.card} styles={{ body: { padding: 32 } }}>
          {/* Step 1: Choose Method */}
          {step === 1 && (
            <>
              <Typography.Title level={5} style={styles.cardTitle}>
                选择验证方式
              </Typography.Title>
              <Typography.Text style={styles.cardDesc}>
                请选择一种多因素认证方式来保护您的账户
              </Typography.Text>

              <MfaMethodSelector value={method} onChange={setMethod} />

              <Button
                type="primary"
                block
                onClick={handleMethodNext}
                style={{
                  marginTop: 24,
                  height: 42,
                  background: brandColors.primary,
                  borderColor: brandColors.primary,
                }}
              >
                下一步
              </Button>
            </>
          )}

          {/* Step 2: TOTP Setup */}
          {step === 2 && method === 'totp' && (
            <>
              <Typography.Title level={5} style={styles.cardTitle}>
                设置身份验证器
              </Typography.Title>
              <Typography.Text style={styles.cardDesc}>
                使用验证器应用扫描下方二维码
              </Typography.Text>

              <div style={styles.qrSection}>
                <div style={styles.qrCode}>
                  <img
                    src={MOCK_QR_URL}
                    alt="QR Code"
                    style={{ width: 180, height: 180 }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>

                <div
                  style={styles.secretToggle}
                  onClick={() => setShowSecret(!showSecret)}
                >
                  无法扫码？手动输入密钥
                  <span style={{ transform: showSecret ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
                    ▼
                  </span>
                </div>

                {showSecret && <div style={styles.secretKey}>{MOCK_SECRET}</div>}
              </div>

              <div style={styles.otpSection}>
                <div style={styles.otpLabel}>输入 6 位验证码</div>
                <OtpInput
                  value={otpValue}
                  onChange={setOtpValue}
                  onComplete={handleTotpVerify}
                />
              </div>

              <div style={styles.buttonGroup}>
                <Button onClick={handleBack} style={{ flex: 1 }}>
                  返回
                </Button>
                <Button
                  type="primary"
                  onClick={handleTotpVerify}
                  loading={loading}
                  disabled={otpValue.length !== 6}
                  style={{
                    flex: 1,
                    background: otpValue.length === 6 ? brandColors.primary : undefined,
                    borderColor: otpValue.length === 6 ? brandColors.primary : undefined,
                  }}
                >
                  验证并绑定
                </Button>
              </div>
            </>
          )}

          {/* Step 2: Passkey Setup */}
          {step === 2 && method === 'passkey' && (
            <>
              <Typography.Title level={5} style={styles.cardTitle}>
                注册安全密钥
              </Typography.Title>
              <Typography.Text style={styles.cardDesc}>
                使用您的设备注册安全密钥或生物识别
              </Typography.Text>

              <div style={styles.passkeySection}>
                <PasskeyPulse active={passkeyWaiting} />

                <Input
                  placeholder="例如：我的 MacBook Pro"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  style={{ marginBottom: 16 }}
                />

                <Button
                  type="primary"
                  block
                  onClick={handlePasskeyRegister}
                  loading={loading}
                  style={{
                    height: 42,
                    background: brandColors.primary,
                    borderColor: brandColors.primary,
                  }}
                >
                  注册安全密钥
                </Button>

                <Typography.Text style={styles.passkeyHint}>
                  点击注册后，请在弹出的系统对话框中完成验证
                </Typography.Text>
              </div>

              <Button onClick={handleBack} block style={{ marginTop: 24 }}>
                返回
              </Button>
            </>
          )}

          {/* Step 3: Backup Codes */}
          {step === 3 && (
            <>
              <Typography.Title level={5} style={styles.cardTitle}>
                请保存您的备用码
              </Typography.Title>
              <Typography.Text style={styles.cardDesc}>
                当您无法使用验证器时，可以使用备用码登录
              </Typography.Text>

              <BackupCodes
                codes={MOCK_BACKUP_CODES}
                onConfirm={handleComplete}
                loading={loading}
              />
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
