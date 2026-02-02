import React from 'react';
import { Alert } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

export type AuthErrorCode = 'AUTH_001' | 'AUTH_002' | 'AUTH_003' | 'AUTH_004';

const errorMessages: Record<AuthErrorCode, string> = {
  AUTH_001: '用户名或密码错误',
  AUTH_002: '账户已锁定，请 30 分钟后重试',
  AUTH_003: '账户已禁用，请联系管理员',
  AUTH_004: 'IP 已被封禁',
};

interface ErrorAlertProps {
  code?: AuthErrorCode | null;
  message?: string;
  visible: boolean;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ code, message, visible }) => {
  if (!visible) return null;

  const displayMessage = message || (code ? errorMessages[code] : '登录失败，请重试');

  return (
    <Alert
      type="error"
      showIcon
      icon={<ExclamationCircleFilled />}
      message={displayMessage}
      style={{ marginBottom: 20 }}
    />
  );
};
