import React, { useState, useCallback } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Form, Input, Button, Checkbox, Typography, theme } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { brandColors } from '@psp/shared';
import { apiClient } from '@psp/api';
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

interface LoginResponse {
  session_id?: string;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  mfa_status?: 'verified' | 'requires_setup' | 'requires_verification';
  available_mfa_types?: string[];
}

const { useToken } = theme;

// 样式常量 - 使用 8px 基准网格系统
const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { token } = useToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ visible: boolean; code?: AuthErrorCode; message?: string }>({
    visible: false,
  });

  const handleLogin = useCallback(
    async (values: LoginFormValues) => {
      setLoading(true);
      setError({ visible: false });

      try {
        const { data } = await apiClient.post<LoginResponse>('/api/v1/auth/login', {
          username: values.username,
          password: values.password,
        });

        if (data.session_id) {
          sessionStorage.setItem('psp_session_id', data.session_id);
        }

        if (data.mfa_status === 'requires_setup') {
          navigate({ to: '/mfa/setup', search: { session_id: data.session_id || '' } });
          return;
        }

        if (data.mfa_status === 'requires_verification') {
          if (data.available_mfa_types) {
            sessionStorage.setItem('psp_mfa_types', JSON.stringify(data.available_mfa_types));
          }
          navigate({ to: '/mfa/verify', search: { session_id: data.session_id || '' } });
          return;
        }

        if (data.access_token) {
          login(
            {
              id: '1',
              username: values.username,
              name: values.username,
              email: values.username,
              role: 'admin',
            },
            data.access_token,
            data.refresh_token || ''
          );
          navigate({ to: '/merchants' });
        }
      } catch (err: unknown) {
        const axiosError = err as { response?: { status: number; data?: { message?: string } } };
        if (axiosError.response?.status === 401) {
          setError({ visible: true, code: 'INVALID_CREDENTIALS' });
        } else {
          setError({
            visible: true,
            code: 'UNKNOWN_ERROR',
            message: axiosError.response?.data?.message || '登录失败，请稍后重试',
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [login, navigate]
  );

  const handleForgotPassword = useCallback(() => {
    navigate({ to: '/forgot-password' });
  }, [navigate]);

  return (
    <div style={pageStyles.container}>
      <BrandPanel />
      
      {/* 右侧表单区域 */}
      <div style={pageStyles.formSection}>
        <div style={pageStyles.formWrapper}>
          {/* 头部品牌区 */}
          <div style={pageStyles.header}>
            <div style={pageStyles.logo}>
              <div style={pageStyles.logoIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span style={pageStyles.logoText}>PSP Admin</span>
            </div>
            
            <Typography.Title 
              level={3} 
              style={{ 
                margin: `${SPACING.md}px 0 ${SPACING.xs}px`,
                fontWeight: 600,
                fontSize: 24,
              }}
            >
              欢迎回来
            </Typography.Title>
            
            <Typography.Text style={pageStyles.subtitle}>
              请输入您的账号信息以继续
            </Typography.Text>
          </div>

          {/* 登录卡片 */}
          <div style={pageStyles.card}>
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
              requiredMark={false}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
                style={{ marginBottom: SPACING.lg }}
              >
                <Input
                  prefix={<UserOutlined style={{ color: token.colorTextDisabled }} />}
                  placeholder="用户名 / 邮箱"
                  autoComplete="username"
                  style={inputStyles.base}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
                style={{ marginBottom: SPACING.md }}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: token.colorTextDisabled }} />}
                  placeholder="密码"
                  autoComplete="current-password"
                  style={inputStyles.base}
                />
              </Form.Item>

              <div style={pageStyles.formFooter}>
                <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 0 }}>
                  <Checkbox style={{ fontSize: 13 }}>记住此设备</Checkbox>
                </Form.Item>
                <Button 
                  type="link" 
                  onClick={handleForgotPassword}
                  style={{ padding: 0, fontSize: 13, height: 'auto' }}
                >
                  忘记密码？
                </Button>
              </div>

              <Form.Item style={{ marginBottom: 0, marginTop: SPACING.lg }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  style={buttonStyles.primary}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>

          {/* 底部版权 */}
          <Typography.Text style={pageStyles.copyright}>
            © 2026 PSP Admin · 安全连接
          </Typography.Text>
        </div>
      </div>
    </div>
  );
}

// 页面级样式
const pageStyles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
  },
  formSection: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${SPACING.xl}px`,
    position: 'relative',
  },
  formWrapper: {
    width: '100%',
    maxWidth: 360,
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.lg,
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  logoIcon: {
    width: 36,
    height: 36,
    background: brandColors.gradient || `linear-gradient(135deg, ${brandColors.primary} 0%, #8B5CF6 100%)`,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 700,
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 14,
    margin: 0,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    border: '1px solid #E2E8F0',
    padding: `${SPACING.xl}px`,
  },
  formFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  copyright: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
    marginTop: SPACING.md,
  },
};

// 输入框样式
const inputStyles = {
  base: {
    borderRadius: 8,
    height: 44,
  } as React.CSSProperties,
};

// 按钮样式
const buttonStyles = {
  primary: {
    height: 44,
    borderRadius: 8,
    fontWeight: 500,
    fontSize: 15,
    background: brandColors.primary,
    borderColor: brandColors.primary,
  } as React.CSSProperties,
};

export default LoginPage;
