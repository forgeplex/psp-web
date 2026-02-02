import React, { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PageHeader } from '@psp/ui';
import {
  Card,
  Tabs,
  Button,
  Space,
  Typography,
  Descriptions,
  Row,
  Col,
  Divider,
  message,
  Dropdown,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  CheckCircleOutlined,
  StopOutlined,
  MoreOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { brandColors, baseColors } from '@psp/shared';
import {
  MerchantStatusBadge,
  KYBStatusBadge,
  RiskLevelBadge,
  MerchantAccountsTab,
  MerchantUsersTab,
  MerchantApiKeysTab,
  MerchantSecurityTab,
  type MerchantStatus,
  type KYBStatus,
  type RiskLevel,
} from '../../../components/merchants';

export const Route = createFileRoute('/_authenticated/merchants/$merchantId')({
  component: MerchantDetailPage,
});

// ============================================================
// Types — aligned with MerchantResponse model
// ============================================================
interface MerchantDetail {
  id: string;
  merchant_code: string;
  merchant_name: string;
  legal_name: string;
  merchant_type: 'individual' | 'company';
  status: MerchantStatus;
  kyb_status: KYBStatus;
  risk_level: RiskLevel;
  // Contact
  email: string;
  phone: string;
  website: string;
  // Address
  country_code: string;
  state: string;
  city: string;
  address: string;
  postal_code: string;
  // Business
  mcc: string;
  industry: string;
  business_model: string;
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================================
// Mock Data — TODO: API call — GET /merchants/{merchantId}
// ============================================================
const mockMerchant: MerchantDetail = {
  id: '1',
  merchant_code: 'M001',
  merchant_name: '某某电商',
  legal_name: '某某科技有限公司',
  merchant_type: 'company',
  status: 'active',
  kyb_status: 'verified',
  risk_level: 'low',
  email: 'contact@example-merchant.com',
  phone: '+55 11 99999-9999',
  website: 'https://example-merchant.com',
  country_code: 'BR',
  state: 'São Paulo',
  city: 'São Paulo',
  address: 'Av. Paulista, 1000, Sala 501',
  postal_code: '01310-100',
  mcc: '5411',
  industry: '电子商务',
  business_model: 'B2C 零售',
  created_at: '2024-01-15 10:30:00',
  updated_at: '2024-01-20 14:15:00',
};

const countryFlags: Record<string, string> = {
  BR: '🇧🇷',
  MX: '🇲🇽',
  US: '🇺🇸',
  CN: '🇨🇳',
};

// ============================================================
// Sub-components
// ============================================================
const SectionTitle: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <Space style={{ marginBottom: 12 }}>
    <span style={{ color: brandColors.primary, fontSize: 16 }}>{icon}</span>
    <Typography.Text strong style={{ fontSize: 15 }}>{title}</Typography.Text>
  </Space>
);

const BasicInfoTab: React.FC<{ merchant: MerchantDetail }> = ({ merchant }) => (
  <div>
    {/* Overview */}
    <Card
      size="small"
      style={{ borderRadius: 8, marginBottom: 16 }}
      styles={{ body: { padding: 20 } }}
    >
      <SectionTitle icon={<BankOutlined />} title="概览信息" />
      <Descriptions column={{ xs: 1, sm: 2, md: 3 }} colon={false} size="small">
        <Descriptions.Item label="商户名称">
          <Typography.Text strong>{merchant.merchant_name}</Typography.Text>
        </Descriptions.Item>
        <Descriptions.Item label="商户编码">
          <Typography.Text code style={{ color: brandColors.primary }}>
            {merchant.merchant_code}
          </Typography.Text>
        </Descriptions.Item>
        <Descriptions.Item label="法人名称">{merchant.legal_name}</Descriptions.Item>
        <Descriptions.Item label="类型">
          {merchant.merchant_type === 'company' ? '企业' : '个人'}
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          <MerchantStatusBadge status={merchant.status} />
        </Descriptions.Item>
        <Descriptions.Item label="KYB 状态">
          <KYBStatusBadge status={merchant.kyb_status} />
        </Descriptions.Item>
        <Descriptions.Item label="风险等级">
          <RiskLevelBadge level={merchant.risk_level} />
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">{merchant.created_at}</Descriptions.Item>
        <Descriptions.Item label="更新时间">{merchant.updated_at}</Descriptions.Item>
      </Descriptions>
    </Card>

    <Row gutter={16}>
      {/* Contact Info */}
      <Col xs={24} md={12}>
        <Card
          size="small"
          style={{ borderRadius: 8, marginBottom: 16 }}
          styles={{ body: { padding: 20 } }}
        >
          <SectionTitle icon={<MailOutlined />} title="联系信息" />
          <Descriptions column={1} colon={false} size="small">
            <Descriptions.Item label="邮箱">
              <a href={`mailto:${merchant.email}`}>{merchant.email}</a>
            </Descriptions.Item>
            <Descriptions.Item label="电话">
              <Space>
                <PhoneOutlined style={{ color: '#71717A' }} />
                {merchant.phone}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="网站">
              <a href={merchant.website} target="_blank" rel="noopener noreferrer">
                {merchant.website}
              </a>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>

      {/* Address Info */}
      <Col xs={24} md={12}>
        <Card
          size="small"
          style={{ borderRadius: 8, marginBottom: 16 }}
          styles={{ body: { padding: 20 } }}
        >
          <SectionTitle icon={<EnvironmentOutlined />} title="地址信息" />
          <Descriptions column={1} colon={false} size="small">
            <Descriptions.Item label="国家">
              {countryFlags[merchant.country_code] || ''} {merchant.country_code}
            </Descriptions.Item>
            <Descriptions.Item label="州/省">{merchant.state}</Descriptions.Item>
            <Descriptions.Item label="城市">{merchant.city}</Descriptions.Item>
            <Descriptions.Item label="地址">{merchant.address}</Descriptions.Item>
            <Descriptions.Item label="邮编">{merchant.postal_code}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>

    {/* Business Info */}
    <Card
      size="small"
      style={{ borderRadius: 8 }}
      styles={{ body: { padding: 20 } }}
    >
      <SectionTitle icon={<GlobalOutlined />} title="业务信息" />
      <Descriptions column={{ xs: 1, sm: 2 }} colon={false} size="small">
        <Descriptions.Item label="商户类型">
          {merchant.merchant_type === 'company' ? '企业' : '个人'}
        </Descriptions.Item>
        <Descriptions.Item label="MCC">
          <Typography.Text code>{merchant.mcc}</Typography.Text>
        </Descriptions.Item>
        <Descriptions.Item label="行业">{merchant.industry}</Descriptions.Item>
        <Descriptions.Item label="商业模式">{merchant.business_model}</Descriptions.Item>
      </Descriptions>
    </Card>
  </div>
);

// ============================================================
// Main Page
// ============================================================
function MerchantDetailPage() {
  const { merchantId } = Route.useParams();
  const navigate = useNavigate();
  const [merchant] = useState<MerchantDetail>(mockMerchant); // TODO: API call
  const [activeTab, setActiveTab] = useState('basic');

  const handleBack = () => {
    navigate({ to: '/merchants' });
  };

  const handleEdit = () => {
    // TODO: Navigate to edit page or open edit modal
    message.info('编辑商户功能开发中');
  };

  const handleToggleStatus = () => {
    const action = merchant.status === 'active' ? '暂停' : '激活';
    // TODO: API call — POST /merchants/{merchantId}/activate|suspend
    message.success(`商户${action}成功`);
  };

  const moreActions: MenuProps['items'] = [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '编辑商户',
      onClick: handleEdit,
    },
    { type: 'divider' },
    merchant.status === 'active'
      ? {
          key: 'suspend',
          icon: <StopOutlined />,
          label: '暂停商户',
          danger: true,
          onClick: handleToggleStatus,
        }
      : {
          key: 'activate',
          icon: <CheckCircleOutlined />,
          label: '激活商户',
          onClick: handleToggleStatus,
        },
  ];

  const tabItems = [
    {
      key: 'basic',
      label: '基本信息',
      children: <BasicInfoTab merchant={merchant} />,
    },
    {
      key: 'accounts',
      label: '账户管理',
      children: <MerchantAccountsTab merchantId={merchantId} />,
    },
    {
      key: 'users',
      label: '用户管理',
      children: <MerchantUsersTab merchantId={merchantId} />,
    },
    {
      key: 'api-keys',
      label: 'API Key',
      children: <MerchantApiKeysTab merchantId={merchantId} />,
    },
    {
      key: 'security',
      label: '安全设置',
      children: <MerchantSecurityTab merchantId={merchantId} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title={merchant.merchant_name}
        breadcrumb={[
          { title: '商户管理', href: '/merchants' },
          { title: merchant.merchant_name },
        ]}
        extra={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              返回
            </Button>
            <MerchantStatusBadge status={merchant.status} />
            <Button
              icon={<EditOutlined />}
              onClick={handleEdit}
            >
              编辑
            </Button>
            <Dropdown menu={{ items: moreActions }} trigger={['click']}>
              <Button icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        }
      />

      <Card
        style={{ borderRadius: 8, marginTop: 16 }}
        styles={{ body: { padding: '0 16px 16px' } }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          style={{ marginTop: 8 }}
        />
      </Card>
    </div>
  );
}
