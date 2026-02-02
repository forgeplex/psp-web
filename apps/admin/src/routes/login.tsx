import React, { useState, useCallback, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Form, Input, Button, Checkbox, Typography, message, Radio, Space } from 'antd';
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined, SafetyOutlined, KeyOutlined, QrcodeOutlined } from '@ant-design/icons';
import { brandColors } from '@psp/shared';
import { apiClient } from '@psp/api';
import { useAuthStore } from '../stores/auth';
import { BrandPanel, ErrorAlert, type AuthErrorCode } from '../components/auth';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

// MFA 步骤类型
type LoginStep = 'credentials' | 'mfa-select' | 'mfa-totp' | 'mfa-passkey' | 'mfa-recovery' | 'success';

interface LoginFormValues {
  username: string;
  password: string;
  remember?: boolean;
}

interface MFAVerifyValues {
  code: string;
}

// API 响应类型（与 Arch 确认后的实际字段）
interface LoginResponse {
  session_id?: string;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  mfa_status?: 'required' | 'optional' | 'not_configured' | 'requires_setup' | 'requires_verification';
  available_mfa_types?: ('totp' | 'passkey' | 'recovery')[];
  mfa_token?: string;
  mfa_token_expires_in?: number;
}

// MFA 方法配置
const MFA_METHODS: Record<string, { label: string; icon: React.ReactNode; desc: string }> = {
  totp: { label: 'TOTP 验证器', icon: <SafetyOutlined />, desc: '使用 Google Authenticator 等应用生成的验证码' },
  passkey: { label: 'Passkey', icon: <KeyOutlined />, desc: '使用设备生物识别或安全密钥' },
  recovery: { label: '备用码', icon: <QrcodeOutlined />, desc: '使用预先保存的备用恢复码' },
};

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    background: '#FEFDFB',
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
    maxWidth: 420,
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
    padding: '6px 14px',
    background: 'rgba(99, 102, 241, 0.08)',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
    color: brandColors.primary,
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center' as const,
    color: '#64748B',
    fontSize: 14,
    marginBottom: 32,
  },
  card: {
    background: '#FFFFFF',
    borderRadius: 16,
    padding: '32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(0, 0, 0, 0.04)',
  },
  loginBtn: {
    height: 44,
    fontSize: 15,
    fontWeight: 600,
    borderRadius: 10,
    background: brandColors.gradient,
    border: 'none',
    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
  },
  forgotPassword: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotLink: {
    fontSize: 13,
    color: brandColors.primary,
    cursor: 'pointer',
    fontWeight: 500,
  },
  footer: {
    textAlign: 'center' as const,
    marginTop: 24,
  },
  footerText: {
    fontSize: 13,
    color: '#64748B',
  },
  footerLink: {
    color: brandColors.primary,
    cursor: 'pointer',
    marginLeft: 4,
    fontWeight: 500,
  },
  copyright: {
    textAlign: 'center' as const,
    marginTop: 16,
    fontSize: 12,
    color: '#94A3B8',
  },
  backLink: {
    fontSize: 13,
    color: '#64748B',
    cursor: 'pointer',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  methodCard: {
    padding: '16px',
    borderRadius: 12,
    border: '1px solid #E2E8F0',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      borderColor: brandColors.primary,
      background: 'rgba(99, 102, 241, 0.02)',
    },
  },
  methodCardSelected: {
    borderColor: brandColors.primary,
    background: 'rgba(99, 102, 241, 0.04)',
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'rgba(99, 102, 241, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: brandColors.primary,
    fontSize: 20,
    marginBottom: 12,
  },
};

// Icon components
const LayersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

function LoginPage(): React.ReactElement {
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [step, setStep] = useState<LoginStep>('credentials');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [mfaToken, setMfaToken] = useState<string>('');
  const [availableMethods, setAvailableMethods] = useState<string[]>([]);
  const [error, setError] = useState<{ visible: boolean; code: AuthErrorCode; message: string }>({
    visible: false,
    code: 'GENERIC_ERROR',
    message: '',
  });

  // 清除错误
  const clearError = useCallback(() => {
    setError({ visible: false, code: 'GENERIC_ERROR', message: '' });
  }, []);

  // 处理登录
  const handleLogin = useCallback(async (values: LoginFormValues) => {
    setLoading(true);
    clearError();

    try {
      // 使用真实 API
      const { data } = await apiClient.post<LoginResponse>('/api/v1/auth/login', {
        username: values.username,
        password: values.password,
      });

      // 处理不同的 MFA 状态
      switch (data.mfa_status) {
        case 'requires_setup':
          // 首次登录，需要设置 MFA
          message.info('首次登录，请设置 MFA');
          navigate({ to: '/mfa/setup' });
          break;
          
        case 'requires_verification':
        case 'required':
          // 需要 MFA 验证
          setMfaToken(data.mfa_token || '');
          setAvailableMethods(data.available_mfa_types || []);
          setSelectedMethod(data.available_mfa_types?.[0] || '');
          setStep('mfa-select');
          break;
          
        case 'not_configured':
        case 'optional':
        default:
          // 直接登录成功
          if (data.access_token) {
            setTokens(data.access_token, data.refresh_token || '');
            message.success('登录成功');
            navigate({ to: '/' });
          }
          break;
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { code?: string; message?: string } } };
      setError({
        visible: true,
        code: (axiosError.response?.data?.code as AuthErrorCode) || 'GENERIC_ERROR',
        message: axiosError.response?.data?.message || '登录失败，请检查用户名和密码',
      });
    } finally {
      setLoading(false);
    }
  }, [navigate, setTokens, clearError]);

  // 处理 MFA 方法选择
  const handleSelectMethod = useCallback((method: string) => {
    setSelectedMethod(method);
    if (method === 'totp') {
      setStep('mfa-totp');
    } else if (method === 'passkey') {
      setStep('mfa-passkey');
    } else if (method === 'recovery') {
      setStep('mfa-recovery');
    }
  }, []);

  // 处理 TOTP 验证
  const handleTOTPVerify = useCallback(async (values: MFAVerifyValues) => {
    setLoading(true);
    clearError();

    try {
      // TODO: 联调时切换到真实 API
      // const { data } = await apiClient.post('/api/v1/auth/mfa/verify', {
      //   mfa_token: mfaToken,
      //   method: 'totp',
      //   totp_code: values.code,
      // });

      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('验证成功');
      navigate({ to: '/' });
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { code?: string; message?: string } } };
      setError({
        visible: true,
        code: 'MFA_INVALID',
        message: axiosError.response?.data?.message || '验证码错误',
      });
    } finally {
      setLoading(false);
    }
  }, [mfaToken, navigate, clearError]);

  // 返回上一步
  const handleBack = useCallback(() => {
    if (step === 'mfa-totp' || step === 'mfa-passkey' || step === 'mfa-recovery') {
      setStep('mfa-select');
    } else if (step === 'mfa-select') {
      setStep('credentials');
      setMfaToken('');
      setAvailableMethods([]);
    }
    clearError();
  }, [step, clearError]);

  // 渲染凭证输入表单
  const renderCredentialsForm = () => (
    <>
      <div style={styles.welcomeTag}>
        <span style={styles.welcomeBadge}>👋 欢迎回来</span>
      </div>

      <div style={{ ...styles.title, margin: 0 }}>
        <Typography.Title level={3} style={{ marginBottom: 4, fontWeight: 700, letterSpacing: -0.5 }}>
          登录您的账户
        </Typography.Title>
      </div>

      <p style={styles.subtitle}>输入凭据以访问支付管理平台</p>

      <div style={styles.card}>
        <ErrorAlert visible={error.visible} code={error.code} message={error.message} />

        <Form<LoginFormValues>
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
            <span style={styles.forgotLink} onClick={() => message.info('请联系管理员重置密码')}>
              忘记密码？
            </span>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block loading={loading} style={styles.loginBtn}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );

  // 渲染 MFA 方法选择
  const renderMFASelect = () => (
    <>
      <div style={styles.welcomeTag}>
        <span style={styles.welcomeBadge}>🔐 双重验证</span>
      </div>

      <div style={{ ...styles.title, margin: 0 }}>
        <Typography.Title level={3} style={{ marginBottom: 4, fontWeight: 700, letterSpacing: -0.5 }}>
          选择验证方式
        </Typography.Title>
      </div>

      <p style={styles.subtitle}>请选择一种方式完成身份验证</p>

      <div style={styles.card}>
        <ErrorAlert visible={error.visible} code={error.code} message={error.message} />

        <div style={styles.backLink} onClick={handleBack}>
          ← 返回登录
        </div>

        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {availableMethods.map((method) => {
            const config = MFA_METHODS[method];
            if (!config) return null;
            return (
              <div
                key={method}
                style={{
                  ...styles.methodCard,
                  ...(selectedMethod === method ? styles.methodCardSelected : {}),
                }}
                onClick={() => handleSelectMethod(method)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={styles.methodIcon}>{config.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: '#0F172A', marginBottom: 4 }}>
                      {config.label}
                    </div>
                    <div style={{ fontSize: 13, color: '#64748B' }}>{config.desc}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </Space>
      </div>
    </>
  );

  // 渲染 TOTP 验证
  const renderTOTPVerify = () => (
    <>
      <div style={styles.welcomeTag}>
        <span style={styles.welcomeBadge}>🔢 TOTP 验证</span>
      </div>

      <div style={{ ...styles.title, margin: 0 }}>
        <Typography.Title level={3} style={{ marginBottom: 4, fontWeight: 700, letterSpacing: -0.5 }}>
          输入验证码
        </Typography.Title>
      </div>

      <p style={styles.subtitle}>请输入验证器应用中的 6 位验证码</p>

      <div style={styles.card}>
        <ErrorAlert visible={error.visible} code={error.code} message={error.message} />

        <div style={styles.backLink} onClick={handleBack}>
          ← 返回选择
        </div>

        <Form<MFAVerifyValues> onFinish={handleTOTPVerify} layout="vertical" size="large">
          <Form.Item
            name="code"
            rules={[
              { required: true, message: '请输入验证码' },
              { pattern: /^\d{6}$/, message: '验证码为 6 位数字' },
            ]}
          >
            <Input.OTP length={6} size="large" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block loading={loading} style={styles.loginBtn}>
              验证
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );

  // 渲染 Passkey 验证
  const renderPasskeyVerify = () => (
    <>
      <div style={styles.welcomeTag}>
        <span style={styles.welcomeBadge}>🔑 Passkey</span>
      </div>

      <div style={{ ...styles.title, margin: 0 }}>
        <Typography.Title level={3} style={{ marginBottom: 4, fontWeight: 700, letterSpacing: -0.5 }}>
          使用 Passkey
        </Typography.Title>
      </div>

      <p style={styles.subtitle}>点击下方按钮使用设备验证</p>

      <div style={styles.card}>
        <ErrorAlert visible={error.visible} code={error.code} message={error.message} />

        <div style={styles.backLink} onClick={handleBack}>
          ← 返回选择
        </div>

        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: 36,
              color: brandColors.primary,
            }}
          >
            <KeyOutlined />
          </div>
          <Typography.Text style={{ color: '#64748B' }}>
            请按设备提示完成验证
          </Typography.Text>
        </div>

        <Button
          type="primary"
          block
          loading={loading}
          style={styles.loginBtn}
          onClick={() => message.info('WebAuthn 集成开发中')}
        >
          使用 Passkey 验证
        </Button>
      </div>
    </>
  );

  // 渲染备用码验证
  const renderRecoveryVerify = () => (
    <>
      <div style={styles.welcomeTag}>
        <span style={styles.welcomeBadge}>🆘 备用码</span>
      </div>

      <div style={{ ...styles.title, margin: 0 }}>
        <Typography.Title level={3} style={{ marginBottom: 4, fontWeight: 700, letterSpacing: -0.5 }}>
          输入备用码
        </Typography.Title>
      </div>

      <p style={styles.subtitle}>请输入预先保存的备用恢复码</p>

      <div style={styles.card}>
        <ErrorAlert visible={error.visible} code={error.code} message={error.message} />

        <div style={styles.backLink} onClick={handleBack}>
          ← 返回选择
        </div>

        <Form<MFAVerifyValues> onFinish={handleTOTPVerify} layout="vertical" size="large">
          <Form.Item
            name="code"
            label="备用码"
            rules={[{ required: true, message: '请输入备用码' }]}
          >
            <Input placeholder="xxxx-xxxx-xxxx" size="large" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block loading={loading} style={styles.loginBtn}>
              验证
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );

  return (
    <div style={styles.page}>
      <BrandPanel />

      <main style={styles.formPanel}>
        <style>{`
          input::placeholder { color: #94A3B8 !important; }
          .ant-input-affix-wrapper { border-radius: 10px !important; border-color: #E2E8F0 !important; }
          .ant-input-affix-wrapper:focus, .ant-input-affix-wrapper-focused { border-color: ${brandColors.primary} !important; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important; }
          .ant-input { border-radius: 10px !important; }
          .ant-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4) !important; }
          .ant-btn-primary:active { transform: translateY(0); }
        `}</style>

        <div style={styles.bgDecor1} />
        <div style={styles.bgDecor2} />

        <div style={styles.formContainer}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <LayersIcon />
            </div>
            <span style={styles.logoText}>PSP Admin</span>
          </div>

          {step === 'credentials' && renderCredentialsForm()}
          {step === 'mfa-select' && renderMFASelect()}
          {step === 'mfa-totp' && renderTOTPVerify()}
          {step === 'mfa-passkey' && renderPasskeyVerify()}
          {step === 'mfa-recovery' && renderRecoveryVerify()}

          <div style={styles.footer}>
            <span style={styles.footerText}>
              遇到问题？<span style={styles.footerLink}>联系管理员</span>
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
        </div>
      </main>
    </div>
  );
}
