import React, { useState } from 'react';
import { Input } from 'antd';
import { LockOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import type { InputProps } from 'antd';

interface PasswordInputProps extends Omit<InputProps, 'type' | 'suffix'> {
  prefixIcon?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  prefixIcon = true,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      {...props}
      type={visible ? 'text' : 'password'}
      prefix={prefixIcon ? <LockOutlined style={{ color: '#94a3b8' }} /> : undefined}
      suffix={
        <span
          onClick={() => setVisible(!visible)}
          style={{ cursor: 'pointer', color: '#94a3b8', display: 'flex' }}
        >
          {visible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </span>
      }
    />
  );
};
