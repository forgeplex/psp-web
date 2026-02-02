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
  Spin,
  Alert,
  message,
  Tooltip,
  Switch,
  Popconfirm,
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
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  MailOutlined,
  MobileOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@psp/ui';
import { formatCurrency, formatDate } from '@psp/shared';
import {
  useMerchant,
  useMerchantBalance,
  useMerchantStats,
  useMerchantAccounts,
  useMerchantUsers,
  useFreezeAccount,
  useUnfreezeAccount,
  type MerchantDetail,
  type MerchantAccount,
  type MerchantUser,
  type MerchantStatus,
  type KYBStatus,
  type RiskLevel,
} from '@psp/api';
import { StatusChangeModal } from '../components';

const { Text, Link } = Typography;

// ─── Helper Components ─────────────────────────────────────

const MerchantStatusBadge: React.FC<{ status: MerchantStatus }> = ({ status }) => {
  const config: Record<MerchantStatus, { color: string; label: string }> = {
    pending: { color: 'warning', label: '待审核' },
    active: { color: 'success', label: '正常' },
    suspended: { color: 'orange', label: '已暂停' },
    closed: { color: 'default', label: '已关闭' },
    rejected: { color: 'error', label: '已拒绝' },
  };
  const c = config[status] || { color: 'default', label: status };
  return <Tag color={c.color}>{c.label}</Tag>;
};

const KybStatusBadge: React.FC<{ status: KYBStatus }> = ({ status }) => {
  const config: Record<KYBStatus, { color: string; label: string }> = {
    not_submitted: { color: 'default', label: '未提交' },
    submitted: { color: 'processing', label: '已提交' },
    under_review: { color: 'processing', label: '审核中' },
    approved: { color: 'success', label: '已通过' },
    rejected: { color: 'error', label: '已拒绝' },
    need_more_info: { color: 'warning', label: '需补充' },
  };
  const c = config[status] || { color: 'default', label: status };
  return <Tag color={c.color}>{c.label}</Tag>;
};

const RiskLevelBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  const config: Record<RiskLevel, { color: string; label: string }> = {
    low: { color: 'success', label: '低风险' },
    medium: { color: 'warning', label: '中风险' },
    high: { color: 'error', label: '高风险' },
    blacklist: { color: '#000', label: '黑名单' },
  };
  const c = config[level] || { color: 'default', label: level };
  return <Tag color={c.color}>{c.label}</Tag>;
};

// ─── Styles ────────────────────────────────────────────────

const cardStyle = { borderRadius: 8 };
const monoStyle = { fontFamily: 'JetBrains Mono, monospace' };

// ─── Main Component ────────────────────────────────────────

interface MerchantDetailPageProps {
  merchantId: string;
}

export const MerchantDetailPage: React.FC<MerchantDetailPageProps> = ({ merchantId }) => {
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  // API Queries
  const { data: merchant, isLoading, error } = useMerchant(merchantId);
  const { data: balance } = useMerchantBalance(merchantId);
  const { data: stats } = useMerchantStats(merchantId);
  const { data: accounts, refetch: refetchAccounts } = useMerchantAccounts(merchantId);
  const { data: users } = useMerchantUsers(merchantId);

  // Mutations
  const freezeAccountMutation = useFreezeAccount();
  const unfreezeAccountMutation = useUnfreezeAccount();

  // Handlers
  const handleFreezeAccount = async (accountId: string) => {
    try {
      await freezeAccountMutation.mutateAsync({
        merchantId,
        accountId,
        reason: '管理员冻结',
      });
      message.success('账户已冻结');
      refetchAccounts();
    } catch {
      message.error('冻结失败');
    }
  };

  const handleUnfreezeAccount = async (accountId: string) => {
    try {
      await unfreezeAccountMutation.mutateAsync({ merchantId, accountId });
      message.success('账户已解冻');
      refetchAccounts();
    } catch {
      message.error('解冻失败');
    }
  };

  // Status menu
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
    { title: '银行', dataIndex: 'bank_name', key: 'bank_name' },
    {
      title: '账户号码',
      dataIndex: 'account_number',
      key: 'account_number',
      render: (num) => <Text style={monoStyle}>{num}</Text>,
    },
    {
      title: 'PIX Key 类型',
      dataIndex: 'pix_key_type',
      key: 'pix_key_type',
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
        return <Tag color={config[status]?.color || 'default'}>{config[status]?.label || status}</Tag>;
      },
    },
    {
      title: '默认',
      dataIndex: 'is_default',
      key: 'is_default',
      render: (isDefault) =>
        isDefault ? (
          <CheckCircleOutlined style={{ color: '#52c41a' }} />
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        const isFrozen = record.status === 'frozen';
        return (
          <Popconfirm
            title={isFrozen ? '确认解冻该账户？' : '确认冻结该账户？'}
            onConfirm={() =>
              isFrozen ? handleUnfreezeAccount(record.id) : handleFreezeAccount(record.id)
            }
            okText="确认"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              icon={isFrozen ? <UnlockOutlined /> : <LockOutlined />}
              loading={freezeAccountMutation.isPending || unfreezeAccountMutation.isPending}
            >
              {isFrozen ? '解冻' : '冻结'}
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  // User columns
  const userColumns: TableColumnsType<MerchantUser> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (name, record) => (
        <Space>
          <Text strong>{name}</Text>
          {record.role === 'owner' && <Tag color="purple">Owner</Tag>}
        </Space>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <Space>
          <MailOutlined />
          <Text copyable style={monoStyle}>{email}</Text>
        </Space>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const roleConfig: Record<string, { color: string; label: string }> = {
          owner: { color: 'purple', label: 'Owner' },
          admin: { color: 'blue', label: 'Admin' },
          operator: { color: 'cyan', label: 'Operator' },
          viewer: { color: 'default', label: 'Viewer' },
        };
        const c = roleConfig[role] || { color: 'default', label: role };
        return <Tag color={c.color}>{c.label}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'active' | 'inactive' | 'locked') => {
        const config = {
          active: { color: 'success', label: '正常' },
          inactive: { color: 'default', label: '未激活' },
          locked: { color: 'error', label: '已锁定' },
        };
        return <Tag color={config[status]?.color}>{config[status]?.label}</Tag>;
      },
    },
    {
      title: 'MFA',
      dataIndex: 'mfa_enabled',
      key: 'mfa_enabled',
      render: (enabled: boolean) => (
        <Tooltip title={enabled ? 'MFA 已启用' : 'MFA 未启用'}>
          {enabled ? (
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} />
          ) : (
            <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 16 }} />
          )}
        </Tooltip>
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'last_login_at',
      key: 'last_login_at',
      render: (date) =>
        date ? (
          <Text type="secondary" style={{ ...monoStyle, fontSize: 12 }}>
            {formatDate(date)}
          </Text>
        ) : (
          <Text type="secondary">从未</Text>
        ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => (
        <Text type="secondary" style={{ ...monoStyle, fontSize: 12 }}>
          {formatDate(date)}
        </Text>
      ),
    },
  ];

  // Tab items
  const tabItems: TabsProps['items'] = [
    {
      key: 'accounts',
      label: (
        <span>
          <BankOutlined /> 账户列表 {accounts?.length ? `(${accounts.length})` : ''}
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
            dataSource={accounts || []}
            pagination={false}
            size="middle"
            locale={{ emptyText: '暂无账户' }}
          />
        </div>
      ),
    },
    {
      key: 'users',
      label: (
        <span>
          <UserOutlined /> 用户列表 {users?.length ? `(${users.length})` : ''}
        </span>
      ),
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Space>
              <Text type="secondary">
                共 {users?.length || 0} 个用户，
                {users?.filter((u) => u.mfa_enabled).length || 0} 个已启用 MFA
              </Text>
            </Space>
            <Button type="primary" size="small" icon={<PlusOutlined />}>
              邀请用户
            </Button>
          </div>
          <Table
            rowKey="id"
            columns={userColumns}
            dataSource={users || []}
            pagination={false}
            size="middle"
            locale={{ emptyText: '暂无用户' }}
          />
        </div>
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
        <Empty description="费率配置（待产品确认 MVP 范围）" image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
        <Empty description="API Key 管理（开发中）" image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
        <Empty description="IP 白名单（开发中）" image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
        <Empty description="状态日志（待 API 支持）" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ),
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  // Error state
  if (error || !merchant) {
    return (
      <Alert
        type="error"
        message="加载失败"
        description={error?.message || '无法加载商户信息'}
        showIcon
      />
    );
  }

  return (
    <div>
      <PageHeader
        title={
          <Space>
            {merchant.name}
            <MerchantStatusBadge status={merchant.status} />
            <KybStatusBadge status={merchant.kyb_status} />
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
                <Text style={monoStyle}>{merchant.merchant_code}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="法人名称">{merchant.legal_name}</Descriptions.Item>
              <Descriptions.Item label="类型">
                {merchant.merchant_type === 'company' ? '企业' : '个人'}
              </Descriptions.Item>
              <Descriptions.Item label="风险等级">
                <RiskLevelBadge level={merchant.risk_level} />
              </Descriptions.Item>
              <Descriptions.Item label="邮箱">
                <Link href={`mailto:${merchant.email}`}>{merchant.email}</Link>
              </Descriptions.Item>
              <Descriptions.Item label="电话">
                <Text style={monoStyle}>{merchant.phone || '-'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="网站">
                {merchant.website ? (
                  <Link href={merchant.website} target="_blank">
                    {merchant.website}
                  </Link>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="MCC">
                <Text style={monoStyle}>{merchant.mcc || '-'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="行业">{merchant.industry || '-'}</Descriptions.Item>
              <Descriptions.Item label="国家">{merchant.country_code}</Descriptions.Item>
              <Descriptions.Item label="创建时间">
                <Text style={monoStyle}>{formatDate(merchant.created_at)}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                <Text style={monoStyle}>{formatDate(merchant.updated_at)}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Balance Card */}
        <Col xs={24} lg={10}>
          <Card title="余额概览" style={cardStyle}>
            {balance ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Tag color="processing" icon={<GlobalOutlined />}>
                  {balance.currency}
                </Tag>

                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    可用余额
                  </Text>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#22c55e', ...monoStyle }}>
                    {formatCurrency(balance.available, balance.currency)}
                  </div>
                </div>

                <Row gutter={8}>
                  <Col span={12}>
                    <Card size="small" style={{ background: '#f8fafc', textAlign: 'center' }}>
                      <Text type="secondary" style={{ fontSize: 10 }}>
                        处理中
                      </Text>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#3b82f6', ...monoStyle }}>
                        {formatCurrency(balance.pending, balance.currency)}
                      </div>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" style={{ background: '#f8fafc', textAlign: 'center' }}>
                      <Text type="secondary" style={{ fontSize: 10 }}>
                        冻结
                      </Text>
                      <div style={{ fontSize: 14, fontWeight: 600, ...monoStyle }}>
                        {formatCurrency(balance.frozen, balance.currency)}
                      </div>
                    </Card>
                  </Col>
                </Row>

                <Card size="small" style={{ background: '#f8fafc' }}>
                  <Row justify="space-between" align="middle">
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      已结算
                    </Text>
                    <Text style={{ fontSize: 13, fontWeight: 600, ...monoStyle }}>
                      {formatCurrency(balance.settled, balance.currency)}
                    </Text>
                  </Row>
                </Card>

                {stats && (
                  <Row gutter={8} style={{ marginTop: 8 }}>
                    <Col span={12}>
                      <Statistic
                        title="总交易数"
                        value={stats.total_transactions}
                        valueStyle={monoStyle}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="总交易额"
                        value={stats.total_amount}
                        precision={0}
                        prefix={balance.currency === 'BRL' ? 'R$' : '$'}
                        valueStyle={{ ...monoStyle, fontSize: 18 }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="活跃账户"
                        value={stats.active_accounts}
                        valueStyle={monoStyle}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="活跃用户"
                        value={stats.active_users}
                        valueStyle={monoStyle}
                      />
                    </Col>
                  </Row>
                )}
              </Space>
            ) : (
              <Empty description="暂无余额数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
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
