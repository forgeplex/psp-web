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
  Tag,
  Empty,
  Spin,
  Alert,
  message,
  Tooltip,
  Popconfirm,
  Input,
  Form,
  Modal,
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
  DeleteOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@psp/ui';
import { formatCurrency, formatDate } from '@psp/shared';
import {
  useMerchant,
  useMerchantBalance,
  useMerchantStats,
  useMerchantAccounts,
  useMerchantUsers,
  useMerchantApiKeys,
  useMerchantIpWhitelist,
  useAddIpWhitelist,
  useRemoveIpWhitelist,
  useFreezeAccount,
  useUnfreezeAccount,
  type MerchantAccount,
  type MerchantUser,
  type MerchantApiKey,
  type IpWhitelistEntry,
} from '@psp/api';
import {
  MerchantStatusBadge,
  KybStatusBadge,
  RiskLevelBadge,
  StatusChangeModal,
} from '../components';
import { apiClient } from '@psp/api';
import { useQuery } from '@tanstack/react-query';

const { Text, Link } = Typography;

// ─── Types for Pricing ─────────────────────────────────────

interface FeeTier {
  fixed_fee?: number;
  min_volume?: number;
  max_volume?: number;
  percentage_rate?: number;
}

interface FeeResponse {
  id?: string;
  fee_type?: string;
  transaction_type?: string;
  percentage_rate?: number;
  fixed_fee?: number;
  min_fee?: number;
  max_fee?: number;
  tiers?: FeeTier[];
  effective_from?: string;
  effective_to?: string;
}

interface AccountPricing {
  account_id?: string;
  account_number?: string;
  currency?: string;
  payment_method?: string;
  fees?: FeeResponse[];
}

interface MerchantPricingResponse {
  merchant_id?: string;
  merchant_code?: string;
  merchant_name?: string;
  accounts?: AccountPricing[];
}

// ─── Hook for Merchant Pricing ─────────────────────────────

function useMerchantPricing(merchantId: string) {
  return useQuery<MerchantPricingResponse>({
    queryKey: ['merchants', merchantId, 'pricing'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/v1/pricing/merchants/${merchantId}`);
      return data;
    },
    enabled: !!merchantId,
  });
}

// ─── Styles ────────────────────────────────────────────────

const cardStyle = { borderRadius: 8 };
const monoStyle = { fontFamily: 'JetBrains Mono, monospace' };

// ─── Main Component ────────────────────────────────────────

interface MerchantDetailPageProps {
  merchantId: string;
}

export const MerchantDetailPage: React.FC<MerchantDetailPageProps> = ({ merchantId }) => {
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [addIpModalOpen, setAddIpModalOpen] = useState(false);
  const [addIpForm] = Form.useForm();
  const [freezingAccountId, setFreezingAccountId] = useState<string | null>(null);

  // API Queries
  const { data: merchant, isLoading, error } = useMerchant(merchantId);
  const { data: balance } = useMerchantBalance(merchantId);
  const { data: stats } = useMerchantStats(merchantId);
  const { data: accounts, refetch: refetchAccounts } = useMerchantAccounts(merchantId);
  const { data: users } = useMerchantUsers(merchantId);
  const { data: apiKeys } = useMerchantApiKeys(merchantId);
  const { data: ipWhitelist, refetch: refetchIpWhitelist } = useMerchantIpWhitelist(merchantId);
  const { data: pricing } = useMerchantPricing(merchantId);

  // Mutations
  const freezeAccountMutation = useFreezeAccount();
  const unfreezeAccountMutation = useUnfreezeAccount();
  const addIpMutation = useAddIpWhitelist();
  const removeIpMutation = useRemoveIpWhitelist();

  // Handlers
  const handleFreezeAccount = async (accountId: string) => {
    setFreezingAccountId(accountId);
    try {
      await freezeAccountMutation.mutateAsync({ merchantId, accountId, reason: '管理员冻结' });
      message.success('账户已冻结');
      refetchAccounts();
    } catch {
      message.error('冻结失败');
    } finally {
      setFreezingAccountId(null);
    }
  };

  const handleUnfreezeAccount = async (accountId: string) => {
    setFreezingAccountId(accountId);
    try {
      await unfreezeAccountMutation.mutateAsync({ merchantId, accountId });
      message.success('账户已解冻');
      refetchAccounts();
    } catch {
      message.error('解冻失败');
    } finally {
      setFreezingAccountId(null);
    }
  };

  const handleAddIp = async (values: { ip_address: string; description?: string }) => {
    try {
      await addIpMutation.mutateAsync({ merchantId, ...values });
      message.success('IP 已添加');
      setAddIpModalOpen(false);
      addIpForm.resetFields();
      refetchIpWhitelist();
    } catch {
      message.error('添加失败');
    }
  };

  const handleRemoveIp = async (ipId: string) => {
    try {
      await removeIpMutation.mutateAsync({ merchantId, ipId });
      message.success('IP 已删除');
      refetchIpWhitelist();
    } catch {
      message.error('删除失败');
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
      title: 'PIX Key',
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
      render: (isDefault) => isDefault ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <Text type="secondary">-</Text>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        const isFrozen = record.status === 'frozen';
        const isLoading = freezingAccountId === record.id;
        return (
          <Popconfirm
            title={isFrozen ? '确认解冻？' : '确认冻结？'}
            onConfirm={() => isFrozen ? handleUnfreezeAccount(record.id) : handleFreezeAccount(record.id)}
          >
            <Button type="link" size="small" icon={isFrozen ? <UnlockOutlined /> : <LockOutlined />} loading={isLoading}>
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
      render: (email) => <Text copyable style={monoStyle}>{email}</Text>,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const cfg: Record<string, { color: string; label: string }> = {
          owner: { color: 'purple', label: 'Owner' },
          admin: { color: 'blue', label: 'Admin' },
          operator: { color: 'cyan', label: 'Operator' },
          viewer: { color: 'default', label: 'Viewer' },
        };
        return <Tag color={cfg[role]?.color}>{cfg[role]?.label || role}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const cfg: Record<string, { color: string; label: string }> = {
          active: { color: 'success', label: '正常' },
          inactive: { color: 'default', label: '未激活' },
          locked: { color: 'error', label: '已锁定' },
        };
        return <Tag color={cfg[status]?.color}>{cfg[status]?.label}</Tag>;
      },
    },
    {
      title: 'MFA',
      dataIndex: 'mfa_enabled',
      key: 'mfa_enabled',
      render: (enabled: boolean) => (
        <Tooltip title={enabled ? 'MFA 已启用' : 'MFA 未启用'}>
          {enabled ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <ExclamationCircleOutlined style={{ color: '#faad14' }} />}
        </Tooltip>
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'last_login_at',
      key: 'last_login_at',
      render: (date) => date ? <Text type="secondary" style={{ ...monoStyle, fontSize: 12 }}>{formatDate(date)}</Text> : <Text type="secondary">从未</Text>,
    },
  ];

  // API Key columns
  const apiKeyColumns: TableColumnsType<MerchantApiKey> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Key 前缀',
      dataIndex: 'prefix',
      key: 'prefix',
      render: (prefix) => <Text style={monoStyle}>{prefix}...</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const cfg: Record<string, { color: string; label: string }> = {
          active: { color: 'success', label: 'Active' },
          disabled: { color: 'default', label: 'Disabled' },
        };
        return <Tag color={cfg[status]?.color}>{cfg[status]?.label || status}</Tag>;
      },
    },
    {
      title: '过期时间',
      dataIndex: 'expires_at',
      key: 'expires_at',
      render: (date) => date ? <Text style={{ ...monoStyle, fontSize: 12 }}>{formatDate(date)}</Text> : <Tag>永不过期</Tag>,
    },
    {
      title: '最后使用',
      dataIndex: 'last_used_at',
      key: 'last_used_at',
      render: (date) => date ? <Text type="secondary" style={{ ...monoStyle, fontSize: 12 }}>{formatDate(date)}</Text> : <Text type="secondary">从未</Text>,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => <Text type="secondary" style={{ ...monoStyle, fontSize: 12 }}>{formatDate(date)}</Text>,
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Tooltip title="禁用"><Button type="text" size="small" icon={<StopOutlined />} /></Tooltip>
      ),
    },
  ];

  // IP Whitelist columns
  const ipWhitelistColumns: TableColumnsType<IpWhitelistEntry> = [
    {
      title: 'IP 地址',
      dataIndex: 'ip_address',
      key: 'ip_address',
      render: (ip) => <Text copyable style={monoStyle}>{ip}</Text>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (desc) => desc || <Text type="secondary">-</Text>,
    },
    {
      title: '添加时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => <Text type="secondary" style={{ ...monoStyle, fontSize: 12 }}>{formatDate(date)}</Text>,
    },
    {
      title: '添加人',
      dataIndex: 'created_by',
      key: 'created_by',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Popconfirm title="确认删除该 IP？" onConfirm={() => handleRemoveIp(record.id)}>
          <Button type="text" size="small" danger icon={<DeleteOutlined />} loading={removeIpMutation.isPending} />
        </Popconfirm>
      ),
    },
  ];

  // Tab items
  const tabItems: TabsProps['items'] = [
    {
      key: 'accounts',
      label: <span><BankOutlined /> 账户列表 {accounts?.length ? `(${accounts.length})` : ''}</span>,
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <Button type="primary" size="small" icon={<PlusOutlined />}>添加账户</Button>
          </div>
          <Table rowKey="id" columns={accountColumns} dataSource={accounts || []} pagination={false} size="middle" locale={{ emptyText: '暂无账户' }} />
        </div>
      ),
    },
    {
      key: 'users',
      label: <span><UserOutlined /> 用户列表 {users?.length ? `(${users.length})` : ''}</span>,
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text type="secondary">共 {users?.length || 0} 个用户，{users?.filter((u) => u.mfa_enabled).length || 0} 个已启用 MFA</Text>
            <Button type="primary" size="small" icon={<PlusOutlined />}>邀请用户</Button>
          </div>
          <Table rowKey="id" columns={userColumns} dataSource={users || []} pagination={false} size="middle" locale={{ emptyText: '暂无用户' }} />
        </div>
      ),
    },
    {
      key: 'rates',
      label: <span><DollarOutlined /> 费率配置</span>,
      children: (
        <div>
          {pricing?.accounts && pricing.accounts.length > 0 ? (
            <div>
              {pricing.accounts.map((account, idx) => (
                <Card key={account.account_id || idx} size="small" title={
                  <Space>
                    <Text strong>{account.payment_method || '支付方式'}</Text>
                    <Tag>{account.currency}</Tag>
                    <Text type="secondary" style={monoStyle}>{account.account_number}</Text>
                  </Space>
                } style={{ marginBottom: 16 }}>
                  {account.fees && account.fees.length > 0 ? (
                    <Table
                      rowKey={(r, i) => r.id || `${idx}-${i}`}
                      size="small"
                      pagination={false}
                      dataSource={account.fees}
                      columns={[
                        { title: '交易类型', dataIndex: 'transaction_type', key: 'type', render: (t) => <Tag>{t}</Tag> },
                        { title: '费率类型', dataIndex: 'fee_type', key: 'fee_type' },
                        { title: '百分比费率', dataIndex: 'percentage_rate', key: 'pct', render: (v) => v != null ? `${(v * 100).toFixed(2)}%` : '-' },
                        { title: '固定费用', dataIndex: 'fixed_fee', key: 'fixed', render: (v) => v != null ? formatCurrency(v / 100, account.currency || 'BRL') : '-' },
                        { title: '最低', dataIndex: 'min_fee', key: 'min', render: (v) => v != null ? formatCurrency(v / 100, account.currency || 'BRL') : '-' },
                        { title: '最高', dataIndex: 'max_fee', key: 'max', render: (v) => v != null ? formatCurrency(v / 100, account.currency || 'BRL') : '-' },
                        { title: '生效时间', dataIndex: 'effective_from', key: 'from', render: (d) => d ? formatDate(d) : '-' },
                      ]}
                    />
                  ) : (
                    <Text type="secondary">暂无费率配置</Text>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Empty description="暂无费率配置" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
          <Alert message="费率管理完整功能将在下个版本发布" type="info" showIcon style={{ marginTop: 16 }} />
        </div>
      ),
    },
    {
      key: 'apikeys',
      label: <span><KeyOutlined /> API Key {apiKeys?.length ? `(${apiKeys.length})` : ''}</span>,
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <Button type="primary" size="small" icon={<PlusOutlined />}>创建 API Key</Button>
          </div>
          <Table rowKey="id" columns={apiKeyColumns} dataSource={apiKeys || []} pagination={false} size="middle" locale={{ emptyText: '暂无 API Key' }} />
        </div>
      ),
    },
    {
      key: 'whitelist',
      label: <span><SafetyOutlined /> IP 白名单 {ipWhitelist?.length ? `(${ipWhitelist.length})` : ''}</span>,
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setAddIpModalOpen(true)}>添加 IP</Button>
          </div>
          <Table rowKey="id" columns={ipWhitelistColumns} dataSource={ipWhitelist || []} pagination={false} size="middle" locale={{ emptyText: '暂无 IP 白名单' }} />
        </div>
      ),
    },
    {
      key: 'logs',
      label: <span><HistoryOutlined /> 状态日志</span>,
      children: <Empty description="状态日志（待 API 支持）" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
    },
  ];

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;
  }

  if (error || !merchant) {
    return <Alert type="error" message="加载失败" description={error?.message || '无法加载商户信息'} showIcon />;
  }

  return (
    <div>
      <PageHeader
        title={<Space>{merchant.name}<MerchantStatusBadge status={merchant.status} /><KybStatusBadge status={merchant.kyb_status} /></Space>}
        breadcrumb={[{ title: '商户管理', href: '/merchants' }, { title: merchant.name }]}
        extra={
          <Space>
            <Button icon={<EditOutlined />}>编辑</Button>
            <Dropdown menu={{ items: statusMenuItems }} trigger={['click']}>
              <Button type="primary">状态变更 <DownOutlined /></Button>
            </Dropdown>
          </Space>
        }
      />

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={14}>
          <Card title="基本信息" style={cardStyle}>
            <Descriptions column={{ xs: 1, sm: 2 }} size="small">
              <Descriptions.Item label="商户编码"><Text style={monoStyle}>{merchant.merchant_code}</Text></Descriptions.Item>
              <Descriptions.Item label="法人名称">{merchant.legal_name}</Descriptions.Item>
              <Descriptions.Item label="类型">{merchant.merchant_type === 'company' ? '企业' : '个人'}</Descriptions.Item>
              <Descriptions.Item label="风险等级"><RiskLevelBadge level={merchant.risk_level} /></Descriptions.Item>
              <Descriptions.Item label="邮箱"><Link href={`mailto:${merchant.email}`}>{merchant.email}</Link></Descriptions.Item>
              <Descriptions.Item label="电话"><Text style={monoStyle}>{merchant.phone || '-'}</Text></Descriptions.Item>
              <Descriptions.Item label="网站">{merchant.website ? <Link href={merchant.website} target="_blank">{merchant.website}</Link> : '-'}</Descriptions.Item>
              <Descriptions.Item label="MCC"><Text style={monoStyle}>{merchant.mcc || '-'}</Text></Descriptions.Item>
              <Descriptions.Item label="行业">{merchant.industry || '-'}</Descriptions.Item>
              <Descriptions.Item label="国家">{merchant.country_code}</Descriptions.Item>
              <Descriptions.Item label="创建时间"><Text style={monoStyle}>{formatDate(merchant.created_at)}</Text></Descriptions.Item>
              <Descriptions.Item label="更新时间"><Text style={monoStyle}>{formatDate(merchant.updated_at)}</Text></Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title="余额概览" style={cardStyle}>
            {balance ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Tag color="processing" icon={<GlobalOutlined />}>{balance.currency}</Tag>
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>可用余额</Text>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#22c55e', ...monoStyle }}>{formatCurrency(balance.available, balance.currency)}</div>
                </div>
                <Row gutter={8}>
                  <Col span={12}>
                    <Card size="small" style={{ background: '#f8fafc', textAlign: 'center' }}>
                      <Text type="secondary" style={{ fontSize: 10 }}>处理中</Text>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#3b82f6', ...monoStyle }}>{formatCurrency(balance.pending, balance.currency)}</div>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" style={{ background: '#f8fafc', textAlign: 'center' }}>
                      <Text type="secondary" style={{ fontSize: 10 }}>冻结</Text>
                      <div style={{ fontSize: 14, fontWeight: 600, ...monoStyle }}>{formatCurrency(balance.frozen, balance.currency)}</div>
                    </Card>
                  </Col>
                </Row>
                <Card size="small" style={{ background: '#f8fafc' }}>
                  <Row justify="space-between" align="middle">
                    <Text type="secondary" style={{ fontSize: 11 }}>已结算</Text>
                    <Text style={{ fontSize: 13, fontWeight: 600, ...monoStyle }}>{formatCurrency(balance.settled, balance.currency)}</Text>
                  </Row>
                </Card>
                {stats && (
                  <Row gutter={8} style={{ marginTop: 8 }}>
                    <Col span={12}><Statistic title="总交易数" value={stats.total_transactions} valueStyle={monoStyle} /></Col>
                    <Col span={12}><Statistic title="总交易额" value={stats.total_amount} precision={0} prefix={balance.currency === 'BRL' ? 'R$' : '$'} valueStyle={{ ...monoStyle, fontSize: 18 }} /></Col>
                    <Col span={12}><Statistic title="活跃账户" value={stats.active_accounts} valueStyle={monoStyle} /></Col>
                    <Col span={12}><Statistic title="活跃用户" value={stats.active_users} valueStyle={monoStyle} /></Col>
                  </Row>
                )}
              </Space>
            ) : (
              <Empty description="暂无余额数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>

      <Card style={cardStyle}><Tabs items={tabItems} /></Card>

      <StatusChangeModal open={statusModalOpen} onClose={() => setStatusModalOpen(false)} currentStatus={merchant.status} merchantName={merchant.name} />

      <Modal title="添加 IP 白名单" open={addIpModalOpen} onCancel={() => setAddIpModalOpen(false)} onOk={() => addIpForm.submit()} confirmLoading={addIpMutation.isPending}>
        <Form form={addIpForm} layout="vertical" onFinish={handleAddIp}>
          <Form.Item name="ip_address" label="IP 地址" rules={[{ required: true, message: '请输入 IP 地址' }, { pattern: /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/, message: '请输入有效的 IP 地址' }]}>
            <Input placeholder="192.168.1.1 或 192.168.1.0/24" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input placeholder="可选描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
