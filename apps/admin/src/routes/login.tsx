import React, { useState, useCallback } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { brandColors } from '@psp/shared';
import { useAuthStore } from '../stores/auth';
import { BrandPanel, ErrorAlert, type AuthErrorCode } from '../components/auth';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

interface LoginFormValues {
  username: string;
  password: string;
  remember?: boolean;
}

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
  // Subtle background decoration for right panel
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
  // Logo
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
  // Welcome text
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
    marginBottom: 6,
    fontSize: 26,
    fontWeight: 700,
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    textAlign: 'center' as const,
    marginBottom: 32,
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 1.5,
  },
  // Card with glassmorphism
  card: {
    borderRadius: 16,
    border: '1px solid rgba(226, 232, 240, 0.8)',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
    background: '#FFFFFF',
    padding: 36,
  },
  // Divider
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
  // Social login buttons
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
  // Form elements
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
  // Footer
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
  // Copyright
  copyright: {
    marginTop: 40,
    textAlign: 'center' as const,
    fontSize: 12,
    color: '#CBD5E1',
  },
};

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
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<{ visible: boolean; code?: AuthErrorCode; message?: string }>({
    visible: false,
  });

  const handleLogin = useCallback(
    async (values: LoginFormValues) => {
      setLoading(true);
      setError({ visible: false });

      try {
        await new Promise((resolve, reject) =>
          setTimeout(() => {
            if (values.username === 'admin' && values.password === 'admin') {
              resolve(true);
            } else {
              reject(new Error('AUTH_001'));
            }
          }, 800)
        );

        login(
          {
            id: '1',
            username: values.username,
            name: 'Admin User',
            email: 'admin@psp.com',
            role: 'admin',
          },
          'mock_access_token',
          'mock_refresh_token'
        );

        message.success('登录成功');
        navigate({ to: '/merchants' });
      } catch (err) {
        const errorCode = err instanceof Error ? err.message : 'AUTH_001';
        setError({
          visible: true,
          code: errorCode as AuthErrorCode,
        });

        if (errorCode === 'AUTH_002') {
          setLoading(true);
        }
      } finally {
        if (error.code !== 'AUTH_002') {
          setLoading(false);
        }
      }
    },
    [login, navigate, error.code]
  );

  const handleForgotPassword = () => {
    message.info('请联系管理员重置密码');
  };

  return (
    <div style={styles.page}>
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

          {/* Welcome badge */}
          <div style={styles.welcomeTag}>
            <span style={styles.welcomeBadge}>
              👋 欢迎回来
            </span>
          </div>

          <div style={{ ...styles.title, margin: 0 }}>
            <Typography.Title level={3} style={{ marginBottom: 4, fontWeight: 700, letterSpacing: -0.5 }}>
              登录您的账户
            </Typography.Title>
          </div>

          <p style={styles.subtitle}>
            输入凭据以访问支付管理平台
          </p>

          {/* Login Card */}
          <div style={styles.card}>
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
          </div>

          {/* Footer */}
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
        </div>
      </main>
    </div>
  );
}
