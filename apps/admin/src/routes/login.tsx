import React, { useState, useCallback, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Form, Input, Button, Checkbox, Typography, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, KeyOutlined } from '@ant-design/icons';
import { brandColors } from '@psp/shared';
import { apiClient } from '@psp/api';
import { useAuthStore } from '../stores/auth';
import {
  BrandPanel,
  OtpInput,
  MfaMethodSelector,
  type MfaMethod,
  PasskeyPulse,
  RecoveryCodeInput,
  SuccessOverlay,
} from '../components/auth';

export const Route = createFileRoute('/login')({
  component: Login,
});

// ─── Types ─────────────────────────────────────────────────

type LoginStep = 'credentials' | 'mfa-select' | 'mfa-totp' | 'mfa-passkey' | 'mfa-recovery' | 'success';
type MfaStatus = 'required' | 'verified' | 'requires_setup';

interface LoginResponse {
  session_id?: string;
  mfa_status?: MfaStatus;
  available_methods?: Array<'totp' | 'passkey'>;
  default_method?: 'totp' | 'passkey';
  access_token?: string;
  refresh_token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

interface MfaVerifyResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// ─── WebAuthn Types ────────────────────────────────────────

interface PasskeyAuthOptions {
  challenge: string;
  rpId: string;
  timeout: number;
  allowCredentials?: Array<{
    type: 'public-key';
    id: string;
  }>;
  userVerification: 'required' | 'preferred' | 'discouraged';
}

// ─── Component ─────────────────────────────────────────────

function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [form] = Form.useForm();

  // UI State
  const [currentStep, setCurrentStep] = useState<LoginStep>('credentials');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // MFA State
  const [sessionId, setSessionId] = useState<string>('');
  const [availableMfaMethods, setAvailableMfaMethods] = useState<MfaMethod[]>(['totp']);
  const [defaultMfaMethod, setDefaultMfaMethod] = useState<MfaMethod>('totp');

  // TOTP State
  const [totpCode, setTotpCode] = useState('');

  // Passkey State
  const [passkeyError, setPasskeyError] = useState<string | null>(null);

  // Success State
  const [showSuccess, setShowSuccess] = useState(false);

  // ─── Credentials Step ────────────────────────────────────

  const handleCredentialsSubmit = async (values: {
    username: string;
    password: string;
    remember?: boolean;
  }) => {
    setLoading(true);
    setError('');

    try {
      const { data } = await apiClient.post<LoginResponse>('/api/v1/auth/login', {
        email: values.username,
        password: values.password,
        device_fingerprint: generateDeviceFingerprint(),
      });

      // No MFA required - direct login
      if (data.access_token && data.mfa_status === 'verified') {
        completeLogin(
          data.access_token,
          data.refresh_token || '',
          data.user || { id: '', email: values.username, name: values.username }
        );
        return;
      }

      // MFA setup required - redirect to setup page
      if (data.mfa_status === 'requires_setup') {
        navigate({ to: '/mfa/setup', search: { session_id: data.session_id || '' } });
        return;
      }

      // MFA required - transition to MFA flow
      if (data.mfa_status === 'required' && data.session_id) {
        setSessionId(data.session_id);

        // Parse available MFA methods from backend
        const backendMethods = data.available_methods || ['totp'];
        const methods: MfaMethod[] = [...backendMethods];
        
        // Always allow recovery as fallback
        methods.push('recovery');
        setAvailableMfaMethods(methods);

        // Use default method from backend if available
        const defaultMethod = data.default_method || 'totp';
        setDefaultMfaMethod(defaultMethod as MfaMethod);

        // If only one real MFA method available (plus recovery), go directly to it
        const realMethods = backendMethods;
        if (realMethods.length === 1) {
          transitionToMfaStep(realMethods[0] as MfaMethod);
        } else {
          // Multiple options - show selector, or use default
          if (methods.includes(defaultMethod as MfaMethod)) {
            transitionToMfaStep(defaultMethod as MfaMethod);
          } else {
            setCurrentStep('mfa-select');
          }
        }
        return;
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || '用户名或密码错误');
    } finally {
      setLoading(false);
    }
  };

  // ─── MFA Step Transitions ────────────────────────────────

  const transitionToMfaStep = (method: MfaMethod) => {
    setError('');
    setCurrentStep(`mfa-${method}` as LoginStep);
  };

  const handleMfaMethodSelect = (method: MfaMethod) => {
    transitionToMfaStep(method);
  };

  const handleBackToCredentials = () => {
    setSessionId('');
    setTotpCode('');
    setPasskeyError(null);
    setError('');
    setCurrentStep('credentials');
  };

  const handleBackToMfaSelect = () => {
    setTotpCode('');
    setPasskeyError(null);
    setError('');
    setCurrentStep('mfa-select');
  };

  // ─── TOTP Verification ───────────────────────────────────

  const handleTotpVerify = useCallback(
    async (code: string) => {
      if (code.length !== 6) return;

      setLoading(true);
      setError('');

      try {
        const { data } = await apiClient.post<MfaVerifyResponse>('/api/v1/auth/mfa/verify', {
          session_id: sessionId,
          totp_code: code,
          trust_device: false,
          device_fingerprint: generateDeviceFingerprint(),
        });

        completeLogin(data.access_token, data.refresh_token, data.user);
      } catch (err: any) {
        setError(err?.response?.data?.message || '验证码错误，请重试');
        setTotpCode('');
      } finally {
        setLoading(false);
      }
    },
    [sessionId]
  );

  // Auto-verify when 6 digits entered
  useEffect(() => {
    if (totpCode.length === 6 && currentStep === 'mfa-totp') {
      handleTotpVerify(totpCode);
    }
  }, [totpCode, currentStep, handleTotpVerify]);

  // ─── Passkey Verification ────────────────────────────────

  const handlePasskeyVerify = async () => {
    setPasskeyError(null);
    setLoading(true);

    try {
      // Check WebAuthn support
      if (!window.PublicKeyCredential) {
        throw new Error('您的浏览器不支持 Passkey，请使用 TOTP 验证');
      }

      // 1. Get authentication options from backend
      const { data: options } = await apiClient.post<PasskeyAuthOptions>(
        '/api/v1/auth/mfa/passkey/authentication-options',
        { session_id: sessionId }
      );

      // 2. Call WebAuthn API
      const challenge = base64URLToBuffer(options.challenge);
      const allowCredentials = options.allowCredentials?.map((cred) => ({
        type: 'public-key' as const,
        id: base64URLToBuffer(cred.id),
      }));

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          rpId: options.rpId,
          timeout: options.timeout,
          allowCredentials,
          userVerification: options.userVerification,
        },
      });

      if (!credential) {
        throw new Error('Passkey 验证被取消');
      }

      // 3. Send assertion to backend
      const assertion = credential as PublicKeyCredential;
      const response = assertion.response as AuthenticatorAssertionResponse;

      const { data } = await apiClient.post<MfaVerifyResponse>(
        '/api/v1/auth/mfa/passkey/verify',
        {
          session_id: sessionId,
          assertion_response: {
            id: assertion.id,
            rawId: bufferToBase64URL(assertion.rawId),
            type: assertion.type,
            clientDataJSON: bufferToBase64URL(response.clientDataJSON),
            authenticatorData: bufferToBase64URL(response.authenticatorData),
            signature: bufferToBase64URL(response.signature),
            userHandle: response.userHandle
              ? bufferToBase64URL(response.userHandle)
              : null,
          },
        }
      );

      completeLogin(data.access_token, data.refresh_token, data.user);
    } catch (err: any) {
      const errorMsg = err?.message || err?.response?.data?.message || 'Passkey 验证失败';
      setPasskeyError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ─── Recovery Code Verification ──────────────────────────

  const handleRecoveryVerify = async (code: string) => {
    setLoading(true);
    setError('');

    try {
      const { data } = await apiClient.post<MfaVerifyResponse>('/api/v1/auth/mfa/verify', {
        session_id: sessionId,
        recovery_code: code,
        device_fingerprint: generateDeviceFingerprint(),
      });

      completeLogin(data.access_token, data.refresh_token, data.user);
    } catch (err: any) {
      setError(err?.response?.data?.message || '备用码无效或已使用');
    } finally {
      setLoading(false);
    }
  };

  // ─── Login Completion ────────────────────────────────────

  const completeLogin = (
    accessToken: string,
    refreshToken: string,
    user: { id: string; email: string; name?: string }
  ) => {
    setShowSuccess(true);

    // Delay actual login to show success animation
    setTimeout(() => {
      login(
        {
          id: user.id,
          username: user.email,
          name: user.name || user.email,
          email: user.email,
          role: 'admin',
        },
        accessToken,
        refreshToken
      );
      navigate({ to: '/merchants' });
    }, 1200);
  };

  // ─── Utilities ───────────────────────────────────────────

  const generateDeviceFingerprint = (): string => {
    const raw = `${navigator.userAgent}|${navigator.language}|${screen.width}x${screen.height}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  };

  const base64URLToBuffer = (base64url: string): ArrayBuffer => {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const bufferToBase64URL = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  };

  // ─── Render ──────────────────────────────────────────────

  const renderStepContent = () => {
    switch (currentStep) {
      case 'credentials':
        return (
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 16px',
                  background: '#F1F5F9',
                  borderRadius: 20,
                  marginBottom: 20,
                }}
              >
                <span style={{ fontSize: 14 }}>👋</span>
                <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>欢迎回来</span>
              </div>

              <Typography.Title
                level={3}
                style={{
                  margin: '0 0 8px 0',
                  fontWeight: 600,
                  fontSize: 24,
                  color: '#0F172A',
                }}
              >
                登录您的账户
              </Typography.Title>
              <Typography.Text
                style={{
                  fontSize: 14,
                  color: '#64748B',
                }}
              >
                请输入您的账号信息以访问管理面板
              </Typography.Text>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  padding: '12px 16px',
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: 8,
                  marginBottom: 16,
                  color: '#DC2626',
                  fontSize: 14,
                }}
              >
                {error}
              </div>
            )}

            {/* Login Form */}
            <Form
              form={form}
              onFinish={handleCredentialsSubmit}
              layout="vertical"
              requiredMark={false}
              initialValues={{ username: 'admin@psp.dev', password: '', remember: false }}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
                style={{ marginBottom: 16 }}
              >
                <Input
                  size="large"
                  placeholder="邮箱 / 用户名"
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

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 24,
                }}
              >
                <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 0 }}>
                  <Checkbox style={{ fontSize: 13, color: '#475569' }}>记住此设备</Checkbox>
                </Form.Item>
                <Button
                  type="link"
                  style={{
                    padding: 0,
                    fontSize: 13,
                    height: 'auto',
                    color: brandColors.primary,
                  }}
                  onClick={() => message.info('忘记密码功能开发中')}
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
                    background:
                      brandColors.gradient || `linear-gradient(135deg, ${brandColors.primary} 0%, #8B5CF6 100%)`,
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
                  }}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Typography.Text style={{ fontSize: 13, color: '#64748B' }}>
                遇到问题？
                <Button type="link" style={{ padding: 0, fontSize: 13 }}>
                  联系管理员
                </Button>
              </Typography.Text>
            </div>

            <Typography.Text
              style={{
                display: 'block',
                textAlign: 'center',
                fontSize: 12,
                color: '#94A3B8',
                marginTop: 16,
              }}
            >
              © 2026 PSP Admin · 安全连接
            </Typography.Text>
          </>
        );

      case 'mfa-select':
        return (
          <MfaMethodSelector
            onSelect={handleMfaMethodSelect}
            availableMethods={availableMfaMethods}
            onBack={handleBackToCredentials}
          />
        );

      case 'mfa-totp':
        return (
          <div style={{ padding: '24px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>
                输入验证码
              </div>
              <div style={{ fontSize: 14, color: '#64748B' }}>
                请输入验证器应用中显示的 6 位数字
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <OtpInput value={totpCode} onChange={setTotpCode} length={6} disabled={loading} />
            </div>

            {error && (
              <div
                style={{
                  padding: '12px 16px',
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: 8,
                  marginBottom: 16,
                  color: '#DC2626',
                  fontSize: 14,
                  textAlign: 'center',
                }}
              >
                {error}
              </div>
            )}

            <Button
              type="primary"
              block
              size="large"
              onClick={() => handleTotpVerify(totpCode)}
              loading={loading}
              disabled={totpCode.length !== 6}
              style={{
                height: 44,
                borderRadius: 8,
                fontSize: 15,
                background: brandColors.gradient,
                border: 'none',
              }}
            >
              验证
            </Button>

            <button
              onClick={handleBackToMfaSelect}
              style={{
                display: 'block',
                margin: '20px auto 0',
                fontSize: 13,
                color: brandColors.primary,
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
              }}
            >
              ← 选择其他验证方式
            </button>
          </div>
        );

      case 'mfa-passkey':
        return (
          <PasskeyPulse
            onActivate={handlePasskeyVerify}
            loading={loading}
            error={passkeyError}
            onBack={handleBackToMfaSelect}
          />
        );

      case 'mfa-recovery':
        return (
          <RecoveryCodeInput
            onSubmit={handleRecoveryVerify}
            loading={loading}
            error={error}
            onBack={handleBackToMfaSelect}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FFFFFF' }}>
      {/* Left Brand Panel */}
      <BrandPanel />

      {/* Right Form Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 32px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 380,
            opacity: showSuccess ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}
        >
          {renderStepContent()}
        </div>
      </div>

      {/* Success Overlay */}
      <SuccessOverlay visible={showSuccess} message="登录成功！" />
    </div>
  );
}

export default Login;
