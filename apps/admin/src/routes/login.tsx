import React, { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Form, Input, Button, Checkbox, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { brandColors } from '@psp/shared';
import { apiClient } from '@psp/api';
import { useAuthStore } from '../stores/auth';
import { BrandPanel } from '../components/auth';

export const Route = createFileRoute('/login')({
  component: Login,
});

interface LoginResponse {
  session_id?: string;
  access_token?: string;
  refresh_token?: string;
  mfa_status?: 'verified' | 'requires_setup' | 'requires_verification';
  available_mfa_types?: string[];
}

function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onFinish = async (values: { username: string; password: string; remember?: boolean }) => {
    setLoading(true);
    setError('');
    
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
          { id: '1', username: values.username, name: values.username, email: values.username, role: 'admin' },
          data.access_token,
          data.refresh_token || ''
        );
        navigate({ to: '/merchants' });
      }
    } catch {
      setError('用户名或密码错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FFFFFF' }}>
      {/* 左侧品牌区 - 保持原有 BrandPanel */}
      <BrandPanel />

      {/* 右侧表单区 */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 32px',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          {/* 表单头部 */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Typography.Title level={3} style={{ 
              margin: '0 0 8px 0', 
              fontWeight: 600,
              fontSize: 24,
              color: '#0F172A',
            }}>
              欢迎回来
            </Typography.Title>
            <Typography.Text style={{ 
              fontSize: 14, 
              color: '#64748B',
            }}>
              请输入您的账号信息以继续
            </Typography.Text>
          </div>

          {/* 错误提示 */}
          {error && (
            <div style={{
              padding: '12px 16px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 8,
              marginBottom: 20,
              color: '#DC2626',
              fontSize: 14,
            }}>
              {error}
            </div>
          )}

          {/* 登录表单 */}
          <Form
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
            initialValues={{ username: 'admin@psp.dev', password: '123456', remember: false }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
              style={{ marginBottom: 16 }}
            >
              <Input
                size="large"
                placeholder="用户名 / 邮箱"
                prefix={<UserOutlined style={{ color: '#94A3B8' }} />}
                style={{
                  height: 44,
                  borderRadius: 8,
                  borderColor: '#E2E8F0',
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
              style={{ marginBottom: 16 }}
            >
              <Input.Password
                size="large"
                placeholder="密码"
                prefix={<LockOutlined style={{ color: '#94A3B8' }} />}
                style={{
                  height: 44,
                  borderRadius: 8,
                  borderColor: '#E2E8F0',
                }}
              />
            </Form.Item>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 0 }}>
                <Checkbox style={{ fontSize: 13, color: '#475569' }}>
                  记住此设备
                </Checkbox>
              </Form.Item>
              <Button 
                type="link" 
                style={{ 
                  padding: 0, 
                  fontSize: 13, 
                  height: 'auto',
                  color: brandColors.primary,
                }}
                onClick={() => navigate({ to: '/forgot-password' })}
              >
                忘记密码？
              </Button>
            </div>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                style={{
                  height: 44,
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 500,
                  background: brandColors.gradient || `linear-gradient(135deg, ${brandColors.primary} 0%, #8B5CF6 100%)`,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
                }}
              >
                登录
              </Button>
            </Form.Item>
          </Form>

          {/* 版权信息 */}
          <p style={{
            textAlign: 'center',
            fontSize: 12,
            color: '#94A3B8',
            marginTop: 40,
          }}>
            © 2026 PSP Admin · 安全连接
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
