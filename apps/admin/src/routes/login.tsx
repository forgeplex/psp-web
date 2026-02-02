import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Form, Input, Button, Checkbox, Typography, message, Tooltip } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  EyeOutlined, 
  EyeInvisibleOutlined,
  SafetyCertificateOutlined,
  CopyOutlined,
  CheckOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { brandColors, statusColors } from '@psp/shared';
import { apiClient } from '@psp/api';
import { useAuthStore } from '../stores/auth';
import { 
  BrandPanel, 
  ErrorAlert, 
  StepIndicator,
  OtpInput,
  MfaMethodSelector,
  BackupCodes,
  PasskeyPulse,
  SuccessOverlay,
  type AuthErrorCode,
  type MfaMethod,
} from '../components/auth';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

// Types
interface LoginFormValues {
  username: string;
  password: string;
  remember?: boolean;
}

interface LoginResponse {
  session_id?: string;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  mfa_status?: 'verified' | 'requires_setup' | 'requires_verification';
  available_mfa_types?: string[];
}

interface MfaSetupResponse {
  secret?: string;
  qr_code_url?: string;
  backup_codes?: string[];
}

type LoginStep = 'credentials' | 'mfa-verify' | 'mfa-setup' | 'backup-codes';

// Mock data for demo
const MOCK_SECRET = 'JBSW Y3DP EHPK 3PXP';
const MOCK_QR_URL = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=otpauth://totp/PSP:admin@psp.com?secret=JBSWY3DPEHPK3PXP&issuer=PSP';
const MOCK_BACKUP_CODES = [
  'A8F2-K9M3', 'B7N4-P2Q5', 'C6R8-S1T7', 'D5U9-V3W4', 'E4X6-Y8Z2',
  'F3A1-B5C9', 'G2D7-E4F6', 'H1G8-I3J5', 'K9L2-M7N4', 'P8Q1-R6S3',
];

// Steps configuration
const LOGIN_STEPS = [
  { label: '身份验证' },
  { label: 'MFA 验证' },
];

const SETUP_STEPS = [
  { label: '身份验证' },
  { label: '设置 MFA' },
  { label: '保存备用码' },
];

// Styles
const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    background: '#FAFBFD',
  },
  formPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  },
  bgDecor1: {
    position: 'absolute' as const,
    width: 500,
    height: 500,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.04), transparent 70%)',
    top: '-15%',
    right: '-10%',
    pointerEvents: 'none' as const,
  },
  bgDecor2: {
    position: 'absolute' as const,
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.03), transparent 70%)',
    bottom: '-10%',
    left: '-5%',
    pointerEvents: 'none' as const,
  },
  formContainer: {
    width: '100%',
    maxWidth: 440,
    position: 'relative' as const,
    zIndex: 1,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
  },
  logoIcon: {
    width: 44,
    height: 44,
    background: brandColors.gradient,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 700,
    color: '#0F172A',
    letterSpacing: -0.8,
  },
  welcomeTag: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 8,
  },
  welcomeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 14px',
    background: brandColors.primaryLight,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
    color: brandColors.primary,
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center' as const,
    marginBottom: 24,
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 1.5,
  },
  // Animated card wrapper
  cardWrapper: {
    position: 'relative' as const,
    overflow: 'hidden' as const,
  },
  card: {
    borderRadius: 16,
    border: '1px solid rgba(226, 232, 240, 0.8)',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
    background: '#FFFFFF',
    padding: 32,
  },
  // Animation container
  slideContainer: {
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  dividerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '24px 0',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: '#E2E8F0',
  },
  dividerText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: 500,
    whiteSpace: 'nowrap' as const,
  },
  socialRow: {
    display: 'flex',
    gap: 12,
    marginBottom: 0,
  },
  socialBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    border: '1px solid #E2E8F0',
    background: '#FAFBFD',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
    color: '#475569',
    transition: 'all 0.2s ease',
  },
  forgotPassword: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  forgotLink: {
    fontSize: 13,
    color: brandColors.primary,
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  loginBtn: {
    height: 46,
    borderRadius: 10,
    background: brandColors.gradient,
    border: 'none',
    fontSize: 15,
    fontWeight: 600,
    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
    transition: 'all 0.3s ease',
  },
  footer: {
    marginTop: 28,
    textAlign: 'center' as const,
  },
  footerText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  footerLink: {
    color: brandColors.primary,
    fontWeight: 500,
    cursor: 'pointer',
    marginLeft: 4,
  },
  copyright: {
    marginTop: 40,
    textAlign: 'center' as const,
    fontSize: 12,
    color: '#CBD5E1',
  },
  // MFA specific styles
  mfaIcon: {
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
  mfaTitle: {
    textAlign: 'center' as const,
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 6,
    color: '#0f172a',
  },
  mfaSubtitle: {
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
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    color: brandColors.primary,
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: 13,
    marginTop: 20,
  },
  // QR Code section
  qrSection: {
    textAlign: 'center' as const,
    marginBottom: 24,
  },
  qrCode: {
    width: 180,
    height: 180,
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    margin: '0 auto 16px',
    background: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden' as const,
  },
  secretToggle: {
    fontSize: 12,
    color: brandColors.primary,
    cursor: 'pointer',
    marginBottom: 12,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontWeight: 500,
  },
  secretKey: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 16px',
    background: '#f8fafc',
    borderRadius: 8,
    fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
    fontSize: 14,
    fontWeight: 500,
    color: '#334155',
  },
  otpLabel: {
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 12,
    textAlign: 'center' as const,
    color: '#475569',
  },
  buttonGroup: {
    display: 'flex',
    gap: 12,
    marginTop: 24,
  },
};

// Icons
const LayersIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const SsoIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const KeyIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [form] = Form.useForm();
  
  // State
  const [step, setStep] = useState<LoginStep>('credentials');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<{ visible: boolean; code?: AuthErrorCode; message?: string }>({
    visible: false,
  });
  
  // MFA state
  const [mfaMethod, setMfaMethod] = useState<MfaMethod>('totp');
  const [otpValue, setOtpValue] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [trustDevice, setTrustDevice] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [secretCopied, setSecretCopied] = useState(false);
  const [passkeyWaiting, setPasskeyWaiting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Session data
  const [sessionId, setSessionId] = useState<string>('');
  const [availableMfaTypes, setAvailableMfaTypes] = useState<string[]>([]);
  const [backupCodes, setBackupCodes] = useState<string[]>(MOCK_BACKUP_CODES);
  
  // Animation
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [isAnimating, setIsAnimating] = useState(false);

  // Credentials form ref for preserving values
  const credentialsRef = useRef<LoginFormValues>({ username: '', password: '' });

  // Animation helper
  const animateToStep = (newStep: LoginStep, direction: 'left' | 'right' = 'left') => {
    setSlideDirection(direction);
    setIsAnimating(true);
    
    setTimeout(() => {
      setStep(newStep);
      setIsAnimating(false);
    }, 200);
  };

  // Get current step number for indicator
  const getCurrentStepNumber = () => {
    if (step === 'credentials') return 1;
    if (step === 'mfa-verify') return 2;
    if (step === 'mfa-setup') return 2;
    if (step === 'backup-codes') return 3;
    return 1;
  };

  // Copy secret to clipboard
  const handleCopySecret = async () => {
    try {
      await navigator.clipboard.writeText(MOCK_SECRET.replace(/\s/g, ''));
      setSecretCopied(true);
      setTimeout(() => setSecretCopied(false), 2000);
    } catch {
      message.error('复制失败');
    }
  };

  // Handle login
  const handleLogin = useCallback(async (values: LoginFormValues) => {
    credentialsRef.current = values;
    setLoading(true);
    setError({ visible: false });

    try {
      const { data } = await apiClient.post<LoginResponse>('/api/v1/auth/login', {
        username: values.username,
        password: values.password,
      });

      // Store session for MFA flow
      if (data.session_id) {
        setSessionId(data.session_id);
        sessionStorage.setItem('psp_session_id', data.session_id);
      }

      if (data.available_mfa_types) {
        setAvailableMfaTypes(data.available_mfa_types);
      }

      // Handle MFA status
      if (data.mfa_status === 'requires_setup') {
        animateToStep('mfa-setup');
        setLoading(false);
        return;
      }

      if (data.mfa_status === 'requires_verification') {
        animateToStep('mfa-verify');
        setLoading(false);
        return;
      }

      // MFA verified or not required - complete login
      if (data.access_token) {
        completeLogin(values.username, data.access_token, data.refresh_token);
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      
      let errorCode: AuthErrorCode = 'AUTH_001';
      let errorMessage = '用户名或密码错误';
      
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { code?: string; message?: string }; status?: number } }).response;
        if (response?.data?.code) {
          errorCode = response.data.code as AuthErrorCode;
        }
        if (response?.data?.message) {
          errorMessage = response.data.message;
        }
        if (response?.status === 401) {
          errorCode = 'AUTH_001';
        } else if (response?.status === 423) {
          errorCode = 'AUTH_002';
        }
      }
      
      setError({
        visible: true,
        code: errorCode,
        message: errorMessage,
      });
      setLoading(false);
    }
  }, []);

  // Handle MFA verification
  const handleMfaVerify = useCallback(async () => {
    if (mfaMethod === 'totp' && otpValue.length !== 6) return;
    if (mfaMethod === 'recovery' && backupCode.length < 8) return;

    setLoading(true);
    setError({ visible: false });

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve, reject) =>
        setTimeout(() => {
          if (mfaMethod === 'totp' && otpValue === '123456') {
            resolve(true);
          } else if (mfaMethod === 'recovery' && backupCode.replace(/-/g, '').toUpperCase() === 'A8F2K9M3') {
            resolve(true);
          } else if (mfaMethod === 'passkey') {
            resolve(true);
          } else {
            reject(new Error('MFA_001'));
          }
        }, 1000)
      );

      setShowSuccess(true);
    } catch {
      setError({
        visible: true,
        code: 'AUTH_001',
        message: '验证码错误，请重试',
      });
      setOtpValue('');
      setLoading(false);
    }
  }, [mfaMethod, otpValue, backupCode]);

  // Handle Passkey verification
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
        code: 'AUTH_001',
        message: '安全密钥验证失败',
      });
      setLoading(false);
      setPasskeyWaiting(false);
    }
  };

  // Handle MFA setup verification
  const handleSetupVerify = useCallback(async () => {
    if (otpValue.length !== 6) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      animateToStep('backup-codes');
    } catch {
      message.error('验证码错误，请重试');
    } finally {
      setLoading(false);
    }
  }, [otpValue]);

  // Handle backup codes confirmation
  const handleBackupCodesConfirm = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowSuccess(true);
    } catch {
      message.error('设置失败，请重试');
      setLoading(false);
    }
  };

  // Complete login
  const completeLogin = (username: string, accessToken: string, refreshToken?: string) => {
    login(
      {
        id: '1',
        username,
        name: username,
        email: username,
        role: 'admin',
      },
      accessToken,
      refreshToken || ''
    );

    message.success('登录成功');
    navigate({ to: '/merchants' });
  };

  // Handle success animation complete
  const handleSuccessComplete = () => {
    completeLogin(
      credentialsRef.current.username, 
      'mock_access_token', 
      'mock_refresh_token'
    );
  };

  // Handle back navigation
  const handleBack = () => {
    setError({ visible: false });
    setOtpValue('');
    setBackupCode('');
    
    if (step === 'mfa-verify' || step === 'mfa-setup') {
      animateToStep('credentials', 'right');
    } else if (step === 'backup-codes') {
      animateToStep('mfa-setup', 'right');
    }
  };

  const handleForgotPassword = () => {
    message.info('请联系管理员重置密码');
  };

  // Determine which steps to show
  const steps = step === 'backup-codes' ? SETUP_STEPS : 
                step === 'mfa-setup' ? SETUP_STEPS : 
                LOGIN_STEPS;

  return (
    <div style={styles.page}>
      <SuccessOverlay
        visible={showSuccess}
        message={step === 'backup-codes' ? 'MFA 设置完成' : '验证成功'}
        onComplete={handleSuccessComplete}
      />

      <BrandPanel />

      <main style={styles.formPanel} className="login-form-panel">
        <style>{`
          @media (min-width: 1024px) {
            .login-form-panel { width: 50%; flex: none !important; }
          }
          @media (min-width: 1440px) {
            .login-form-panel { width: 45%; }
          }
          .login-form-panel .ant-input-affix-wrapper {
            border-radius: 10px !important;
            height: 46px !important;
            border-color: #E2E8F0 !important;
            transition: all 0.2s ease !important;
          }
          .login-form-panel .ant-input-affix-wrapper:hover {
            border-color: ${brandColors.primary} !important;
          }
          .login-form-panel .ant-input-affix-wrapper-focused {
            border-color: ${brandColors.primary} !important;
            box-shadow: 0 0 0 3px ${brandColors.primaryLight} !important;
          }
          .login-form-panel .ant-form-item-label > label {
            font-weight: 500 !important;
            color: #334155 !important;
            font-size: 13px !important;
          }
          .login-form-panel .ant-btn-primary:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45) !important;
          }
          .login-form-panel .ant-btn-primary:active {
            transform: translateY(0) !important;
          }
          .social-btn:hover {
            border-color: ${brandColors.primary} !important;
            background: ${brandColors.primaryLight} !important;
            color: ${brandColors.primary} !important;
          }
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideOutLeft {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(-30px); }
          }
          @keyframes slideOutRight {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(30px); }
          }
          .slide-enter-left { animation: slideInLeft 0.3s ease forwards; }
          .slide-enter-right { animation: slideInRight 0.3s ease forwards; }
          .slide-exit-left { animation: slideOutLeft 0.2s ease forwards; }
          .slide-exit-right { animation: slideOutRight 0.2s ease forwards; }
        `}</style>

        {/* Background decorations */}
        <div style={styles.bgDecor1} />
        <div style={styles.bgDecor2} />

        <div style={styles.formContainer}>
          {/* Logo */}
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <LayersIcon />
            </div>
            <span style={styles.logoText}>PSP Admin</span>
          </div>

          {/* Welcome badge - only on credentials step */}
          {step === 'credentials' && (
            <div style={styles.welcomeTag}>
              <span style={styles.welcomeBadge}>👋 欢迎回来</span>
            </div>
          )}

          {/* Title & Subtitle */}
          <div style={styles.title}>
            <Typography.Title level={3} style={{ marginBottom: 4, fontWeight: 700, letterSpacing: -0.5 }}>
              {step === 'credentials' && '登录您的账户'}
              {step === 'mfa-verify' && '身份验证'}
              {step === 'mfa-setup' && '设置多因素认证'}
              {step === 'backup-codes' && '保存备用码'}
            </Typography.Title>
          </div>

          <p style={styles.subtitle}>
            {step === 'credentials' && '输入凭据以访问支付管理平台'}
            {step === 'mfa-verify' && '请完成双因素验证以继续'}
            {step === 'mfa-setup' && '为您的账户添加额外的安全保护'}
            {step === 'backup-codes' && '当您无法使用验证器时可使用备用码'}
          </p>

          {/* Step Indicator - show for MFA steps */}
          {step !== 'credentials' && (
            <StepIndicator steps={steps} currentStep={getCurrentStepNumber()} />
          )}

          {/* Card with animated content */}
          <div style={styles.cardWrapper}>
            <div 
              style={styles.card}
              className={isAnimating 
                ? (slideDirection === 'left' ? 'slide-exit-left' : 'slide-exit-right')
                : (slideDirection === 'left' ? 'slide-enter-left' : 'slide-enter-right')
              }
            >
              {/* Step 1: Credentials */}
              {step === 'credentials' && (
                <>
                  <ErrorAlert
                    visible={error.visible}
                    code={error.code}
                    message={error.message}
                  />

                  {/* Social login */}
                  <div style={styles.socialRow}>
                    <div className="social-btn" style={styles.socialBtn}>
                      <SsoIcon />
                      <span>SSO 登录</span>
                    </div>
                    <div className="social-btn" style={styles.socialBtn}>
                      <KeyIcon />
                      <span>Passkey</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={styles.dividerRow}>
                    <div style={styles.dividerLine} />
                    <span style={styles.dividerText}>或使用账号密码</span>
                    <div style={styles.dividerLine} />
                  </div>

                  <Form<LoginFormValues>
                    form={form}
                    onFinish={handleLogin}
                    layout="vertical"
                    size="large"
                    initialValues={{ username: '', password: '', remember: false }}
                  >
                    <Form.Item
                      name="username"
                      label="用户名 / 邮箱"
                      rules={[{ required: true, message: '请输入用户名' }]}
                    >
                      <Input
                        prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
                        placeholder="请输入用户名或邮箱"
                        autoComplete="username"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      label="密码"
                      rules={[{ required: true, message: '请输入密码' }]}
                    >
                      <Input
                        type={passwordVisible ? 'text' : 'password'}
                        prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
                        suffix={
                          <span
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            style={{ cursor: 'pointer', color: '#94a3b8', display: 'flex' }}
                            aria-label={passwordVisible ? '隐藏密码' : '显示密码'}
                          >
                            {passwordVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                          </span>
                        }
                        placeholder="请输入密码"
                        autoComplete="current-password"
                      />
                    </Form.Item>

                    <div style={styles.forgotPassword}>
                      <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Checkbox>
                          <span style={{ fontSize: 13, color: '#475569' }}>记住此设备</span>
                        </Checkbox>
                      </Form.Item>
                      <span style={styles.forgotLink} onClick={handleForgotPassword}>
                        忘记密码？
                      </span>
                    </div>

                    <Form.Item style={{ marginBottom: 0 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        style={styles.loginBtn}
                      >
                        登录
                      </Button>
                    </Form.Item>
                  </Form>
                </>
              )}

              {/* Step 2: MFA Verify */}
              {step === 'mfa-verify' && (
                <>
                  <div style={styles.mfaIcon}>
                    <SafetyCertificateOutlined />
                  </div>

                  <ErrorAlert
                    visible={error.visible}
                    code={error.code}
                    message={error.message}
                  />

                  {/* Method selector for verify */}
                  <MfaMethodSelector
                    value={mfaMethod}
                    onChange={(m) => {
                      setMfaMethod(m);
                      setError({ visible: false });
                      setOtpValue('');
                      setBackupCode('');
                    }}
                    showRecovery
                  />

                  <div style={{ height: 24 }} />

                  {/* TOTP input */}
                  {mfaMethod === 'totp' && (
                    <>
                      <div style={styles.otpLabel}>输入验证器中的 6 位验证码</div>
                      <OtpInput
                        value={otpValue}
                        onChange={setOtpValue}
                        onComplete={handleMfaVerify}
                        error={error.visible}
                      />

                      <div style={styles.trustDevice}>
                        <Checkbox
                          checked={trustDevice}
                          onChange={(e) => setTrustDevice(e.target.checked)}
                        >
                          <Typography.Text style={{ fontSize: 12, color: '#64748b' }}>
                            信任此设备（7天内免验证）
                          </Typography.Text>
                        </Checkbox>
                      </div>

                      <Button
                        type="primary"
                        block
                        onClick={handleMfaVerify}
                        loading={loading}
                        disabled={otpValue.length !== 6}
                        style={{
                          ...styles.loginBtn,
                          opacity: otpValue.length === 6 ? 1 : 0.6,
                        }}
                      >
                        验证
                      </Button>
                    </>
                  )}

                  {/* Backup code input */}
                  {mfaMethod === 'recovery' && (
                    <>
                      <div style={styles.otpLabel}>输入 8 位备用验证码</div>
                      <Input
                        value={backupCode}
                        onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                        placeholder="例如：A8F2-K9M3"
                        maxLength={9}
                        style={{
                          textAlign: 'center',
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 15,
                          fontWeight: 500,
                          letterSpacing: 2,
                          marginBottom: 20,
                          height: 46,
                          borderRadius: 10,
                        }}
                      />

                      <Button
                        type="primary"
                        block
                        onClick={handleMfaVerify}
                        loading={loading}
                        disabled={backupCode.length < 8}
                        style={{
                          ...styles.loginBtn,
                          opacity: backupCode.length >= 8 ? 1 : 0.6,
                        }}
                      >
                        验证
                      </Button>
                    </>
                  )}

                  {/* Passkey */}
                  {mfaMethod === 'passkey' && (
                    <>
                      <PasskeyPulse active={passkeyWaiting} />

                      <Typography.Text style={{ ...styles.mfaSubtitle, marginTop: 16 }}>
                        点击下方按钮，在弹出的系统对话框中完成验证
                      </Typography.Text>

                      <Button
                        type="primary"
                        block
                        onClick={handlePasskeyVerify}
                        loading={loading}
                        style={styles.loginBtn}
                      >
                        使用安全密钥验证
                      </Button>
                    </>
                  )}

                  {/* Back link */}
                  <div style={{ textAlign: 'center' }}>
                    <span style={styles.backLink} onClick={handleBack}>
                      <ArrowLeftOutlined /> 返回登录
                    </span>
                  </div>
                </>
              )}

              {/* Step 2: MFA Setup */}
              {step === 'mfa-setup' && (
                <>
                  <div style={styles.qrSection}>
                    <div style={styles.qrCode}>
                      <img
                        src={MOCK_QR_URL}
                        alt="QR Code"
                        style={{ width: 160, height: 160 }}
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
                      <span style={{ 
                        transform: showSecret ? 'rotate(180deg)' : 'none', 
                        transition: 'transform 200ms',
                        display: 'inline-block',
                      }}>
                        ▼
                      </span>
                    </div>

                    {showSecret && (
                      <div style={styles.secretKey}>
                        <span>{MOCK_SECRET}</span>
                        <Tooltip title={secretCopied ? '已复制' : '点击复制'}>
                          <span 
                            onClick={handleCopySecret}
                            style={{ cursor: 'pointer', color: brandColors.primary }}
                          >
                            {secretCopied ? <CheckOutlined /> : <CopyOutlined />}
                          </span>
                        </Tooltip>
                      </div>
                    )}
                  </div>

                  <div style={styles.otpLabel}>输入验证器中的 6 位验证码</div>
                  <OtpInput
                    value={otpValue}
                    onChange={setOtpValue}
                    onComplete={handleSetupVerify}
                  />

                  <div style={styles.buttonGroup}>
                    <Button onClick={handleBack} style={{ flex: 1, height: 46, borderRadius: 10 }}>
                      返回
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleSetupVerify}
                      loading={loading}
                      disabled={otpValue.length !== 6}
                      style={{
                        ...styles.loginBtn,
                        flex: 1,
                        opacity: otpValue.length === 6 ? 1 : 0.6,
                      }}
                    >
                      验证并绑定
                    </Button>
                  </div>
                </>
              )}

              {/* Step 3: Backup Codes */}
              {step === 'backup-codes' && (
                <>
                  <BackupCodes
                    codes={backupCodes}
                    onConfirm={handleBackupCodesConfirm}
                    loading={loading}
                  />
                </>
              )}
            </div>
          </div>

          {/* Footer - only show on credentials step */}
          {step === 'credentials' && (
            <>
              <div style={styles.footer}>
                <span style={styles.footerText}>
                  遇到问题？
                  <span style={styles.footerLink}>联系管理员</span>
                </span>
              </div>

              <div style={styles.copyright}>
                &copy; 2026 PSP Admin &middot; 安全连接
                <span style={{ marginLeft: 4, display: 'inline-flex', verticalAlign: 'middle' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
              </div>
            </>
          )}

          {/* Footer for MFA steps */}
          {step !== 'credentials' && (
            <div style={styles.copyright}>
              PSP Admin &copy; 2026
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
