import React from 'react';
import { Alert } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

// 后端返回的错误码 + 前端自定义错误码
export type AuthErrorCode = 
  | 'UNAUTHORIZED'      // 用户名或密码错误
  | 'AUTH_001'          // 用户名或密码错误（旧）
  | 'AUTH_002'          // 账户已锁定
  | 'AUTH_003'          // 账户已禁用
  | 'AUTH_004'          // IP 已被封禁
  | 'MFA_INVALID'       // MFA 验证码错误
  | 'GENERIC_ERROR';    // 通用错误

const errorMessages: Record<AuthErrorCode, string> = {
  UNAUTHORIZED: '用户名或密码错误',
  AUTH_001: '用户名或密码错误',
  AUTH_002: '账户已锁定，请 30 分钟后重试',
  AUTH_003: '账户已禁用，请联系管理员',
  AUTH_004: 'IP 已被封禁',
  MFA_INVALID: '验证码错误',
  GENERIC_ERROR: '登录失败，请重试',
};

interface ErrorAlertProps {
  code?: AuthErrorCode | null;
  message?: string;
  visible: boolean;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ code, message, visible }) => {
  if (!visible) return null;

  const displayMessage = message || (code && errorMessages[code]) || '登录失败，请重试';

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
