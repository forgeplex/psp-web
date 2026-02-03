import React, { useState, useCallback, useEffect } from 'react';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { Card, Button, Typography, message, Alert, Tabs } from 'antd';
import { SafetyCertificateOutlined, KeyOutlined, MobileOutlined } from '@ant-design/icons';
import { brandColors } from '@psp/shared';
import { useMfaVerify, usePasskeyAuthenticationOptions, usePasskeyAuthenticationVerify } from '@psp/api';
import { OtpInput, SuccessOverlay } from '../../components/auth';
import { useAuthStore } from '../../stores/auth';

export const Route = createFileRoute('/mfa/verify')({
  component: MfaVerifyPage,
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: (search.session_id as string) || '',
  }),
});

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
    maxWidth: 420,
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
  otpSection: {
    textAlign: 'center' as const,
    marginBottom: 24,
  },
  passkeySection: {
    textAlign: 'center' as const,
    padding: '24px 0',
  },
  actions: {
    marginTop: 24,
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
  },
  backupLink: {
    marginTop: 16,
    textAlign: 'center' as const,
    fontSize: 12,
  },
};

function MfaVerifyPage() {
  const navigate = useNavigate();
  const { session_id: sessionId } = useSearch({ from: '/mfa/verify' });
  const { login } = useAuthStore();
  
  const [verifyCode, setVerifyCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'totp' | 'passkey'>('totp');

  // API Hooks
  const mfaVerifyMutation = useMfaVerify();
  const passkeyOptionsMutation = usePasskeyAuthenticationOptions();
  const passkeyVerifyMutation = usePasskeyAuthenticationVerify();

  // TOTP 验证
  const handleTotpVerify = useCallback(async () => {
    if (verifyCode.length !== 6) {
      message.error('请输入 6 位验证码');
      return;
    }

    try {
      const result = await mfaVerifyMutation.mutateAsync({
        sessionId,
        method: 'totp',
        code: verifyCode,
      });
      
      if (result.access_token && result.refresh_token) {
        // 登录成功
        login(
          { email: 'admin@psp.dev', name: 'Admin' } as any, // TODO: 从 API 获取用户信息
          result.access_token,
          result.refresh_token
        );
        
        setShowSuccess(true);
        setTimeout(() => {
          navigate({ to: '/' });
        }, 1500);
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || '验证码错误，请重试');
      setVerifyCode('');
    }
  }, [verifyCode, sessionId, mfaVerifyMutation, login, navigate]);

  // Passkey 验证
  const handlePasskeyVerify = useCallback(async () => {
    try {
      // 获取认证选项
      const options = await passkeyOptionsMutation.mutateAsync({ sessionId });
      
      // 调用 WebAuthn API
      const credential = await navigator.credentials.get({
        publicKey: options.publicKey as PublicKeyCredentialRequestOptions,
      });

      if (!credential) {
        message.error('Passkey 认证被取消');
        return;
      }

      // 发送认证结果
      const result = await passkeyVerifyMutation.mutateAsync({
        sessionId,
        credential: credential,
      });

      if (result.access_token && result.refresh_token) {
        login(
          { email: 'admin@psp.dev', name: 'Admin' } as any,
          result.access_token,
          result.refresh_token
        );
        
        setShowSuccess(true);
        setTimeout(() => {
          navigate({ to: '/' });
        }, 1500);
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Passkey 验证失败');
    }
  }, [sessionId, passkeyOptionsMutation, passkeyVerifyMutation, login, navigate]);

  // 验证码输入完成自动验证
  useEffect(() => {
    if (verifyCode.length === 6 && activeTab === 'totp') {
      handleTotpVerify();
    }
  }, [verifyCode, activeTab, handleTotpVerify]);

  // 无 session 时提示
  if (!sessionId) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <Alert
            type="error"
            message="会话无效"
            description="请先登录。"
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

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.logo}>
          <SafetyCertificateOutlined style={styles.logoIcon} />
          <Typography.Title level={4} style={{ margin: 0 }}>
            双因素认证
          </Typography.Title>
        </div>

        <Card style={styles.card}>
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as 'totp' | 'passkey')}
            centered
            items={[
              {
                key: 'totp',
                label: (
                  <span>
                    <MobileOutlined /> 验证器
                  </span>
                ),
                children: (
                  <>
                    <Typography.Text style={styles.cardDesc}>
                      输入验证器应用中显示的 6 位验证码
                    </Typography.Text>
                    
                    <div style={styles.otpSection}>
                      <OtpInput
                        value={verifyCode}
                        onChange={setVerifyCode}
                        length={6}
                        disabled={mfaVerifyMutation.isPending}
                      />
                    </div>
                    
                    <div style={styles.actions}>
                      <Button 
                        type="primary" 
                        block
                        onClick={handleTotpVerify}
                        loading={mfaVerifyMutation.isPending}
                        disabled={verifyCode.length !== 6}
                      >
                        验证
                      </Button>
                    </div>
                    
                    <div style={styles.backupLink}>
                      <Typography.Link onClick={() => message.info('请输入备用码')}>
                        使用备用码登录
                      </Typography.Link>
                    </div>
                  </>
                ),
              },
              {
                key: 'passkey',
                label: (
                  <span>
                    <KeyOutlined /> Passkey
                  </span>
                ),
                children: (
                  <>
                    <Typography.Text style={styles.cardDesc}>
                      使用已注册的 Passkey 进行验证
                    </Typography.Text>
                    
                    <div style={styles.passkeySection}>
                      <Button
                        type="primary"
                        size="large"
                        icon={<KeyOutlined />}
                        onClick={handlePasskeyVerify}
                        loading={passkeyOptionsMutation.isPending || passkeyVerifyMutation.isPending}
                      >
                        使用 Passkey 验证
                      </Button>
                    </div>
                  </>
                ),
              },
            ]}
          />
        </Card>
      </div>
      
      <SuccessOverlay visible={showSuccess} message="验证成功！" />
    </div>
  );
}

export default MfaVerifyPage;
