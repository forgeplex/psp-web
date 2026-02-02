import React, { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Form, Input, Button, Checkbox, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { apiClient } from '@psp/api';
import { useAuthStore } from '../stores/auth';

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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* 左侧品牌区 */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 64,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 背景装饰 */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        
        {/* 网格背景 */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />

        {/* 品牌内容 */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            marginBottom: 48 
          }}>
            <div style={{
              width: 44,
              height: 44,
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span style={{ 
              fontSize: 24, 
              fontWeight: 700, 
              color: '#F8FAFC' 
            }}>PSP Admin</span>
          </div>

          <h1 style={{
            fontSize: 48,
            fontWeight: 700,
            color: '#F8FAFC',
            lineHeight: 1.1,
            margin: '0 0 24px 0',
            letterSpacing: -1,
          }}>
            下一代<br />支付基础设施
          </h1>
          
          <p style={{
            fontSize: 18,
            color: '#94A3B8',
            lineHeight: 1.6,
            margin: 0,
            maxWidth: 400,
          }}>
            安全、高效、可扩展的企业级支付管理平台
          </p>
        </div>

        {/* 底部特性 */}
        <div style={{
          position: 'absolute',
          bottom: 64,
          left: 64,
          right: 64,
          display: 'flex',
          gap: 32,
        }}>
          {[
            { icon: '⚡', text: '实时交易' },
            { icon: '🛡️', text: '银行级安全' },
            { icon: '📊', text: '数据分析' },
          ].map((item) => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{item.icon}</span>
              <span style={{ color: '#94A3B8', fontSize: 13 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧表单区 */}
      <div style={{
        width: 480,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 64,
        background: '#FFFFFF',
      }}>
        <div style={{ maxWidth: 360, width: '100%', margin: '0 auto' }}>
          {/* 表单头部 */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontSize: 28,
              fontWeight: 600,
              color: '#0F172A',
              margin: '0 0 8px 0',
            }}>登录</h2>
            <p style={{
              fontSize: 14,
              color: '#64748B',
              margin: 0,
            }}>请输入您的账号信息以访问管理面板</p>
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
            initialValues={{ remember: false }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
              style={{ marginBottom: 20 }}
            >
              <Input
                size="large"
                placeholder="用户名 / 邮箱"
                prefix={<UserOutlined style={{ color: '#94A3B8' }} />}
                style={{
                  height: 48,
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
                  height: 48,
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
                  color: '#6366F1',
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
                  height: 48,
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 500,
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
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
            marginTop: 48,
          }}>
            © 2026 PSP Admin · 安全连接
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
