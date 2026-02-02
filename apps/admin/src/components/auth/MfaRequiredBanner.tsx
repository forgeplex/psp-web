import React from 'react';
import { Alert } from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';

interface MfaRequiredBannerProps {
  visible?: boolean;
}

export const MfaRequiredBanner: React.FC<MfaRequiredBannerProps> = ({ visible = true }) => {
  if (!visible) return null;

  return (
    <Alert
      type="warning"
      showIcon
      icon={<SafetyCertificateOutlined />}
      message="首次登录需要设置两步验证以保护账户安全"
      style={{
        marginBottom: 24,
        background: '#FFF7ED',
        border: '1px solid #FDBA74',
        borderRadius: 8,
      }}
    />
  );
};
