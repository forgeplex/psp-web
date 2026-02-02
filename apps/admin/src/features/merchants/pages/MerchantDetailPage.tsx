import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Button,
  Dropdown,
  Typography,
  Descriptions,
  Row,
  Col,
  Statistic,
  Space,
  Table,
  Timeline,
  Tag,
  Empty,
} from 'antd';
import type { MenuProps, TableColumnsType, TabsProps } from 'antd';
import {
  EditOutlined,
  DownOutlined,
  PauseCircleOutlined,
  CloseCircleOutlined,
  GlobalOutlined,
  BankOutlined,
  UserOutlined,
  DollarOutlined,
  KeyOutlined,
  SafetyOutlined,
  HistoryOutlined,
  PlusOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@psp/ui';
import { formatCurrency, formatDate } from '@psp/shared';
import {
  MerchantStatusBadge,
  KybStatusBadge,
  RiskLevelBadge,
  StatusChangeModal,
} from '../components';
import type { Merchant, MerchantAccount, MerchantBalance, MerchantStats, StatusLog } from '../types';

const { Text, Link } = Typography;

// Mock data
const mockMerchant: Merchant = {
  id: '1',
  code: 'M001',
  name: '某某电商',
  legalName: '某某科技有限公司',
  type: 'company',
  status: 'active',
  kybStatus: 'verified',
  riskLevel: 'low',
  email: 'merchant@example.com',
  phone: '+55 11 99999-9999',
  website: 'https://example.com',
  mcc: '5411',
  industry: '电子商务',
  businessModel: 'B2C',
  country: 'BR',
  address: '圣保罗市某某街123号',
  createdAt: '2024-01-15T14:30:00Z',
  activatedAt: '2024-01-16T10:00:00Z',
};

const mockBalance: MerchantBalance = {
  currency: 'BRL',
  available: 125680.5,
  pending: 15230.0,
  frozen: 0,
  settled: 1280500.0,
};

const mockStats: MerchantStats = {
  totalTransactions: 3847,
  totalAmount: 1284592.0,
  activeAccounts: 2,
  activeUsers: 5,
};

const mockAccounts: MerchantAccount[] = [
  {
    id: '1',
    code: 'ACC001',
    currency: 'BRL',
    bankName: 'Banco do Brasil',
    accountNumber: '****1234',
    pixKeyType: 'cpf',
    status: 'active',
    isDefault: true,
    createdAt: '2024-01-15T14:30:00Z',
  },
  {
    id: '2',
    code: 'ACC002',
    currency: 'BRL',
    bankName: 'Itaú',
    accountNumber: '****5678',
    pixKeyType: 'email',
    status: 'active',
    isDefault: false,
    createdAt: '2024-01-16T10:00:00Z',
  },
  {
    id: '3',
    code: 'ACC003',
    currency: 'USD',
    bankName: 'Wise',
    accountNumber: '****9012',
    status: 'frozen',
    isDefault: false,
    createdAt: '2024-01-17T09:00:00Z',
  },
];

const mockLogs: StatusLog[] = [
  {
    id: '1',
    action: '激活商户',
    toStatus: 'active',
    reason: 'KYB 审核通过',
    operator: 'admin@psp.com',
    createdAt: '2024-01-16T10:00:00Z',
  },
  {
    id: '2',
    action: '创建商户',
    operator: 'system',
    createdAt: '2024-01-15T14:30:00Z',
  },
  {
    id: '3',
    action: '提交 KYB 资料',
    operator: 'merchant@example.com',
    createdAt: '2024-01-15T14:00:00Z',
  },
];

// Styles
const cardStyle = { borderRadius: 8 };
const monoStyle = { fontFamily: 'JetBrains Mono, monospace' };

export const MerchantDetailPage: React.FC = () => {
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const merchant = mockMerchant;
  const balance = mockBalance;
  const stats = mockStats;

  const statusMenuItems: MenuProps['items'] = [
    {
      key: 'suspend',
      icon: <PauseCircleOutlined />,
      label: '暂停商户',
      onClick: () => setStatusModalOpen(true),
    },
    {
      key: 'close',
      icon: <CloseCircleOutlined />,
      label: '关闭商户',
      danger: true,
      onClick: () => setStatusModalOpen(true),
    },
  ];

  // Account columns
  const accountColumns: TableColumnsType<MerchantAccount> = [
    {
      title: '账户编码',
      dataIndex: 'code',
      key: 'code',
      render: (code) => <Text style={monoStyle}>{code}</Text>,
    },
    { title: '币种', dataIndex: 'currency', key: 'currency' },
    { title: '银行', dataIndex: 'bankName', key: 'bankName' },
    {
      title: '账户号码',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
      render: (num) => <Text style={monoStyle}>{num}</Text>,
    },
    {
      title: 'PIX Key 类型',
      dataIndex: 'pixKeyType',
      key: 'pixKeyType',
      render: (type) => type || <Text type="secondary">-</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'active' | 'frozen' | 'closed') => {
        const config = {
          active: { color: 'success', label: 'Active' },
          frozen: { color: 'blue', label: 'Frozen' },
          closed: { color: 'default', label: 'Closed' },
        };
        return <Tag color={config[status].color}>{config[status].label}</Tag>;
      },
    },
    {
      title: '是否默认',
      dataIndex: 'isDefault',
      key: 'isDefault',
      render: (isDefault) =>
        isDefault ? (
          <Text strong style={{ color: '#6366f1' }}>
            ✓ 默认
          </Text>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={record.status === 'frozen' ? <UnlockOutlined /> : <LockOutlined />}
        >
          {record.status === 'frozen' ? '解冻' : '冻结'}
        </Button>
      ),
    },
  ];

  // Tab items
  const tabItems: TabsProps['items'] = [
    {
      key: 'accounts',
      label: (
        <span>
          <BankOutlined /> 账户列表
        </span>
      ),
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <Button type="primary" size="small" icon={<PlusOutlined />}>
              添加账户
            </Button>
          </div>
          <Table
            rowKey="id"
            columns={accountColumns}
            dataSource={mockAccounts}
            pagination={false}
            size="middle"
          />
        </div>
      ),
    },
    {
      key: 'users',
      label: (
        <span>
          <UserOutlined /> 用户列表
        </span>
      ),
      children: (
        <Empty description="用户列表内容" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ),
    },
    {
      key: 'rates',
      label: (
        <span>
          <DollarOutlined /> 费率配置
        </span>
      ),
      children: (
        <Empty description="费率配置内容" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ),
    },
    {
      key: 'apikeys',
      label: (
        <span>
          <KeyOutlined /> API Key
        </span>
      ),
      children: (
        <Empty description="API Key 管理内容" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ),
    },
    {
      key: 'whitelist',
      label: (
        <span>
          <SafetyOutlined /> IP 白名单
        </span>
      ),
      children: (
        <Empty description="IP 白名单内容" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ),
    },
    {
      key: 'logs',
      label: (
        <span>
          <HistoryOutlined /> 状态日志
        </span>
      ),
      children: (
        <div style={{ padding: '8px 0' }}>
          <Timeline
            items={mockLogs.map((log) => ({
              color: log.action.includes('激活') ? 'green' : log.action.includes('创建') ? 'blue' : 'gray',
              children: (
                <div>
                  <Text type="secondary" style={{ ...monoStyle, fontSize: 11 }}>
                    {formatDate(log.createdAt)}
                  </Text>
                  <div style={{ fontWeight: 600, marginTop: 2 }}>{log.action}</div>
                  <Space size={16} style={{ marginTop: 4 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <UserOutlined style={{ marginRight: 4 }} />
                      {log.operator}
                    </Text>
                    {log.reason && (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {log.reason}
                      </Text>
                    )}
                  </Space>
                </div>
              ),
            }))}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={
          <Space>
            {merchant.name}
            <MerchantStatusBadge status={merchant.status} />
            <KybStatusBadge status={merchant.kybStatus} />
          </Space>
        }
        breadcrumb={[
          { title: '商户管理', href: '/merchants' },
          { title: merchant.name },
        ]}
        extra={
          <Space>
            <Button icon={<EditOutlined />}>编辑</Button>
            <Dropdown menu={{ items: statusMenuItems }} trigger={['click']}>
              <Button type="primary">
                状态变更 <DownOutlined />
              </Button>
            </Dropdown>
          </Space>
        }
      />

      {/* Info + Balance Grid */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {/* Basic Info Card */}
        <Col xs={24} lg={14}>
          <Card title="基本信息" style={cardStyle}>
            <Descriptions column={{ xs: 1, sm: 2 }} size="small">
              <Descriptions.Item label="商户编码">
                <Text style={monoStyle}>{merchant.code}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="法人名称">{merchant.legalName}</Descriptions.Item>
              <Descriptions.Item label="类型">{merchant.type}</Descriptions.Item>
              <Descriptions.Item label="风险等级">
                <RiskLevelBadge level={merchant.riskLevel} />
              </Descriptions.Item>
              <Descriptions.Item label="邮箱">
                <Link href={`mailto:${merchant.email}`}>{merchant.email}</Link>
              </Descriptions.Item>
              <Descriptions.Item label="电话">
                <Text style={monoStyle}>{merchant.phone}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="网站">
                <Link href={merchant.website} target="_blank">
                  {merchant.website}
                </Link>
              </Descriptions.Item>
              <Descriptions.Item label="MCC">
                <Text style={monoStyle}>{merchant.mcc}</Text> - 超市
              </Descriptions.Item>
              <Descriptions.Item label="行业">{merchant.industry}</Descriptions.Item>
              <Descriptions.Item label="商业模式">{merchant.businessModel}</Descriptions.Item>
              <Descriptions.Item label="国家">🇧🇷 {merchant.country} 巴西</Descriptions.Item>
              <Descriptions.Item label="地址">{merchant.address}</Descriptions.Item>
              <Descriptions.Item label="创建时间">
                <Text style={monoStyle}>{formatDate(merchant.createdAt)}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="激活时间">
                <Text style={monoStyle}>{formatDate(merchant.activatedAt!)}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Balance Card */}
        <Col xs={24} lg={10}>
          <Card title="余额概览" style={cardStyle}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Tag color="processing" icon={<GlobalOutlined />}>
                {balance.currency}
              </Tag>

              <div style={{ marginBottom: 8 }}>
                <Text type="secondary" style={{ fontSize: 11 }}>可用余额</Text>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#22c55e', ...monoStyle }}>
                  {formatCurrency(balance.available, balance.currency)}
                </div>
              </div>

              <Row gutter={8}>
                <Col span={12}>
                  <Card size="small" style={{ background: '#f8fafc', textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: 10 }}>处理中</Text>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#3b82f6', ...monoStyle }}>
                      {formatCurrency(balance.pending, balance.currency)}
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" style={{ background: '#f8fafc', textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: 10 }}>冻结</Text>
                    <div style={{ fontSize: 14, fontWeight: 600, ...monoStyle }}>
                      {formatCurrency(balance.frozen, balance.currency)}
                    </div>
                  </Card>
                </Col>
              </Row>

              <Card size="small" style={{ background: '#f8fafc' }}>
                <Row justify="space-between" align="middle">
                  <Text type="secondary" style={{ fontSize: 11 }}>已结算</Text>
                  <Text style={{ fontSize: 13, fontWeight: 600, ...monoStyle }}>
                    {formatCurrency(balance.settled, balance.currency)}
                  </Text>
                </Row>
              </Card>

              <Row gutter={8} style={{ marginTop: 8 }}>
                <Col span={12}>
                  <Statistic title="总交易数" value={stats.totalTransactions} valueStyle={monoStyle} />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="总交易额"
                    value={stats.totalAmount}
                    precision={0}
                    prefix="R$"
                    valueStyle={{ ...monoStyle, fontSize: 18 }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic title="活跃账户" value={stats.activeAccounts} valueStyle={monoStyle} />
                </Col>
                <Col span={12}>
                  <Statistic title="活跃用户" value={stats.activeUsers} valueStyle={monoStyle} />
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Tabs Section */}
      <Card style={cardStyle}>
        <Tabs items={tabItems} />
      </Card>

      {/* Status Change Modal */}
      <StatusChangeModal
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        currentStatus={merchant.status}
        merchantName={merchant.name}
      />
    </div>
  );
};
