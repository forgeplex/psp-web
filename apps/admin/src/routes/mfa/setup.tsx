import React, { useState, useCallback, useEffect } from 'react';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { Card, Button, Typography, message, Spin, Alert } from 'antd';
import { SafetyCertificateOutlined, LoadingOutlined } from '@ant-design/icons';
import { brandColors } from '@psp/shared';
import { useTotpSetup, useTotpBind } from '@psp/api';
import {
  StepIndicator,
  MfaMethodSelector,
  OtpInput,
  BackupCodes,
  MfaRequiredBanner,
  SuccessOverlay,
  type MfaMethod,
} from '../../components/auth';

export const Route = createFileRoute('/mfa/setup')({
  component: MfaSetupPage,
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: (search.session_id as string) || '',
  }),
});

const STEPS = [
  { label: '选择方式' },
  { label: '设置验证' },
  { label: '保存备用码' },
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
  },
  secretCode: {
    marginTop: 12,
    padding: '8px 12px',
    background: '#f8fafc',
    borderRadius: 6,
    fontFamily: 'monospace',
    fontSize: 13,
    letterSpacing: '0.1em',
    color: '#334155',
  },
  verifySection: {
    marginTop: 24,
    textAlign: 'center' as const,
  },
  verifyLabel: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
  },
  actions: {
    marginTop: 24,
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
  },
};

function MfaSetupPage() {
  const navigate = useNavigate();
  const { session_id: sessionId } = useSearch({ from: '/mfa/setup' });
  
  // currentStep: 1-based (1, 2, 3)
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<MfaMethod>('totp');
  const [showSecret, setShowSecret] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [totpData, setTotpData] = useState<{ secret: string; qrCodeUri: string } | null>(null);

  // API Hooks
  const totpSetupMutation = useTotpSetup();
  const totpBindMutation = useTotpBind();

  // 选择方式后初始化 TOTP
  const handleMethodConfirm = useCallback(async () => {
    if (selectedMethod === 'totp') {
      try {
        const result = await totpSetupMutation.mutateAsync({ sessionId });
        setTotpData({
          secret: result.secret,
          qrCodeUri: result.qr_code_uri,
        });
        setBackupCodes(result.backup_codes);
        setCurrentStep(2);
      } catch (error: any) {
        message.error(error?.response?.data?.message || 'TOTP 设置初始化失败');
      }
    } else {
      // Passkey setup
      message.info('Passkey 设置即将支持');
    }
  }, [sessionId, selectedMethod, totpSetupMutation]);

  // 验证 TOTP 码
  const handleVerify = useCallback(async () => {
    if (verifyCode.length !== 6) {
      message.error('请输入 6 位验证码');
      return;
    }

    try {
      await totpBindMutation.mutateAsync({ sessionId, code: verifyCode });
      setCurrentStep(3);
    } catch (error: any) {
      message.error(error?.response?.data?.message || '验证码错误，请重试');
      setVerifyCode('');
    }
  }, [verifyCode, sessionId, totpBindMutation]);

  // 完成设置
  const handleComplete = useCallback(() => {
    setShowSuccess(true);
    setTimeout(() => {
      navigate({ to: '/mfa/verify', search: { session_id: sessionId } });
    }, 1500);
  }, [navigate, sessionId]);

  // 验证码输入完成自动验证
  useEffect(() => {
    if (verifyCode.length === 6 && currentStep === 2) {
      handleVerify();
    }
  }, [verifyCode, currentStep, handleVerify]);

  // 无 session 时提示
  if (!sessionId) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <Alert
            type="error"
            message="会话无效"
            description="请先登录后再设置 MFA。"
            showIcon
            action={
              <Button type="primary" onClick={() => navigate({ to: '/login' })}>
                去登录
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <MfaRequiredBanner />
            <Typography.Title level={5} style={styles.cardTitle}>
              选择验证方式
            </Typography.Title>
            <Typography.Text style={styles.cardDesc}>
              请选择一种双因素认证方式保护您的账号
            </Typography.Text>
            <MfaMethodSelector
              value={selectedMethod}
              onChange={setSelectedMethod}
            />
            <div style={styles.actions}>
              <Button 
                type="primary" 
                onClick={handleMethodConfirm}
                loading={totpSetupMutation.isPending}
              >
                继续
              </Button>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <Typography.Title level={5} style={styles.cardTitle}>
              设置身份验证器
            </Typography.Title>
            <Typography.Text style={styles.cardDesc}>
              使用 Google Authenticator 或其他 TOTP 应用扫描二维码
            </Typography.Text>
            
            <div style={styles.qrSection}>
              <div style={styles.qrCode}>
                {totpData ? (
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(totpData.qrCodeUri)}`}
                    alt="TOTP QR Code"
                    style={{ width: 180, height: 180 }}
                  />
                ) : (
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} />} />
                )}
              </div>
              
              <Typography.Link 
                style={styles.secretToggle}
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? '隐藏密钥' : '无法扫描？手动输入密钥'}
              </Typography.Link>
              
              {showSecret && totpData && (
                <Typography.Text code copyable style={styles.secretCode}>
                  {totpData.secret}
                </Typography.Text>
              )}
            </div>
            
            <div style={styles.verifySection}>
              <Typography.Text style={styles.verifyLabel}>
                输入验证器显示的 6 位验证码
              </Typography.Text>
              <OtpInput
                value={verifyCode}
                onChange={setVerifyCode}
                length={6}
                disabled={totpBindMutation.isPending}
              />
            </div>
            
            <div style={styles.actions}>
              <Button onClick={() => setCurrentStep(1)}>
                返回
              </Button>
              <Button 
                type="primary" 
                onClick={handleVerify}
                loading={totpBindMutation.isPending}
                disabled={verifyCode.length !== 6}
              >
                验证并继续
              </Button>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <Typography.Title level={5} style={styles.cardTitle}>
              保存备用码
            </Typography.Title>
            <Typography.Text style={styles.cardDesc}>
              请妥善保存这些备用码，当您无法使用验证器时可用于登录
            </Typography.Text>
            
            <BackupCodes codes={backupCodes} onConfirm={handleComplete} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.logo}>
          <SafetyCertificateOutlined style={styles.logoIcon} />
          <Typography.Title level={4} style={{ margin: 0 }}>
            设置双因素认证
          </Typography.Title>
        </div>

        <StepIndicator steps={STEPS} currentStep={currentStep} />

        <Card style={styles.card}>
          {renderStep()}
        </Card>
      </div>
      
      <SuccessOverlay visible={showSuccess} message="MFA 设置成功！" />
    </div>
  );
}

export default MfaSetupPage;
