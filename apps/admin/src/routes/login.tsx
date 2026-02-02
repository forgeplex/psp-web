import React from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuthStore } from '../stores/auth';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

interface LoginFormValues {
  username: string;
  password: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // Simulated login for scaffold
      await new Promise((resolve) => setTimeout(resolve, 800));

      login(
        {
          id: '1',
          username: values.username,
          name: 'Admin User',
          email: 'admin@psp.com',
          role: 'admin',
        },
        'mock_access_token',
        'mock_refresh_token',
      );

      message.success('登录成功');
      navigate({ to: '/' });
    } catch {
      message.error('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F5F5F5',
      }}
    >
      <Card style={{ width: 400, borderRadius: 12 }} styles={{ body: { padding: 32 } }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            PSP Admin
          </Typography.Title>
          <Typography.Text type="secondary">支付管理后台</Typography.Text>
        </div>

        <Form<LoginFormValues>
          onFinish={handleLogin}
          layout="vertical"
          size="large"
          initialValues={{ username: '', password: '' }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
