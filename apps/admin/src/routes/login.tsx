import React, { useState, useCallback } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Card, Form, Input, Button, Checkbox, Typography, message } from 'antd';
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
  },
  formPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    background: '#F8FAFC',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 8,
  },
  logoIcon: {
    width: 40,
    height: 40,
    background: brandColors.primary,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: 700,
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center' as const,
    marginBottom: 32,
    fontSize: 13,
    color: '#64748b',
  },
  card: {
    borderRadius: 12,
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  },
  forgotPassword: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  forgotLink: {
    fontSize: 12,
    color: brandColors.primary,
    cursor: 'pointer',
  },
  footer: {
    marginTop: 32,
    textAlign: 'center' as const,
  },
  copyright: {
    fontSize: 12,
    color: '#64748B',
  },
};

const LayersIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FFFFFF"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
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
        // TODO: Replace with actual API call
        await new Promise((resolve, reject) =>
          setTimeout(() => {
            // Simulate login - use 'admin@psp.dev/123456' for success
            if (values.username === 'admin@psp.dev' && values.password === '123456') {
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

        // TODO: Check if MFA setup is required
        // For now, navigate to dashboard
        navigate({ to: '/' });
      } catch (err) {
        const errorCode = err instanceof Error ? err.message : 'AUTH_001';
        setError({
          visible: true,
          code: errorCode as AuthErrorCode,
        });

        // Disable button for AUTH_002 (account locked)
        if (errorCode === 'AUTH_002') {
          setLoading(true); // Keep button disabled
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

      <main style={styles.formPanel} className="form-panel">
        <style>{`
          @media (min-width: 1024px) {
            .form-panel { width: 50%; flex: none !important; }
          }
          @media (min-width: 1440px) {
            .form-panel { width: 45%; }
          }
        `}</style>
        <div style={styles.formContainer}>
          {/* Logo */}
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <LayersIcon />
            </div>
            <span style={styles.logoText}>PSP Admin</span>
          </div>

          <Typography.Title level={4} style={styles.title}>
            登录
          </Typography.Title>

          <Typography.Text style={styles.subtitle}>
            输入您的账号信息以访问管理面板
          </Typography.Text>

          <Card style={styles.card} styles={{ body: { padding: 32 } }}>
            <ErrorAlert
              visible={error.visible}
              code={error.code}
              message={error.message}
            />

            <Form<LoginFormValues>
              onFinish={handleLogin}
              layout="vertical"
              size="large"
              initialValues={{ username: 'admin@psp.dev', password: '123456', remember: false }}
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
                  <Checkbox>记住此设备</Checkbox>
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
                  style={{
                    height: 42,
                    background: brandColors.primary,
                    borderColor: brandColors.primary,
                  }}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <footer style={styles.footer}>
            <Typography.Text style={styles.copyright}>
              &copy; 2026 PSP Admin
            </Typography.Text>
          </footer>
        </div>
      </main>
    </div>
  );
}
