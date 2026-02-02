import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Tag,
  message,
  Popconfirm,
  Typography,
} from 'antd';
import type { TableProps } from 'antd';
import {
  PlusOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { brandColors, statusColors } from '@psp/shared';

// ============================================================
// Types
// ============================================================
type AccountType = 'settlement' | 'fee' | 'deposit' | 'reserve';
type AccountStatus = 'active' | 'frozen' | 'closed';

interface MerchantAccount {
  id: string;
  account_type: AccountType;
  currency: string;
  balance: number;
  status: AccountStatus;
  created_at: string;
}

interface CreateAccountForm {
  account_type: AccountType;
  currency: string;
  initial_balance?: number;
}

interface MerchantAccountsTabProps {
  merchantId: string;
}

// ============================================================
// Config
// ============================================================
const accountTypeLabels: Record<AccountType, string> = {
  settlement: '结算账户',
  fee: '手续费账户',
  deposit: '保证金账户',
  reserve: '准备金账户',
};

const accountStatusConfig: Record<AccountStatus, { color: string; bg: string; text: string }> = {
  active: { color: statusColors.success, bg: statusColors.successBg, text: '正常' },
  frozen: { color: statusColors.failed, bg: statusColors.failedBg, text: '冻结' },
  closed: { color: '#71717A', bg: '#F4F4F5', text: '已关闭' },
};

const currencySymbols: Record<string, string> = {
  BRL: 'R$',
  MXN: '$',
  USD: '$',
};

// ============================================================
// Mock Data — TODO: API call
// ============================================================
const mockAccounts: MerchantAccount[] = [
  {
    id: 'acc-1',
    account_type: 'settlement',
    currency: 'BRL',
    balance: 125680.50,
    status: 'active',
    created_at: '2024-01-15',
  },
  {
    id: 'acc-2',
    account_type: 'fee',
    currency: 'BRL',
    balance: 3420.00,
    status: 'active',
    created_at: '2024-01-15',
  },
  {
    id: 'acc-3',
    account_type: 'deposit',
    currency: 'USD',
    balance: 10000.00,
    status: 'active',
    created_at: '2024-01-20',
  },
  {
    id: 'acc-4',
    account_type: 'reserve',
    currency: 'BRL',
    balance: 5000.00,
    status: 'frozen',
    created_at: '2024-02-01',
  },
];

// ============================================================
// Component
// ============================================================
export const MerchantAccountsTab: React.FC<MerchantAccountsTabProps> = ({ merchantId }) => {
  const [accounts] = useState<MerchantAccount[]>(mockAccounts); // TODO: API call
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm<CreateAccountForm>();
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      setCreating(true);
      // TODO: API call — POST /merchants/{merchantId}/accounts
      console.log('Creating account:', { merchantId, ...values });
      await new Promise((r) => setTimeout(r, 800));
      message.success('账户创建成功');
      form.resetFields();
      setCreateModalOpen(false);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleFreeze = async (account: MerchantAccount) => {
    const action = account.status === 'frozen' ? '解冻' : '冻结';
    // TODO: API call — POST /merchants/{merchantId}/accounts/{accountId}/freeze|unfreeze
    console.log(`${action} account:`, account.id);
    message.success(`账户${action}成功`);
  };

  const columns: TableProps<MerchantAccount>['columns'] = [
    {
      title: '账户类型',
      dataIndex: 'account_type',
      key: 'account_type',
      width: 140,
      render: (type: AccountType) => (
        <Typography.Text strong>{accountTypeLabels[type]}</Typography.Text>
      ),
    },
    {
      title: '币种',
      dataIndex: 'currency',
      key: 'currency',
      width: 80,
      render: (currency) => (
        <Typography.Text code>{currency}</Typography.Text>
      ),
    },
    {
      title: '余额',
      dataIndex: 'balance',
      key: 'balance',
      width: 160,
      align: 'right',
      render: (balance: number, record) => (
        <Typography.Text strong style={{ fontFamily: 'monospace' }}>
          {currencySymbols[record.currency] || ''}{' '}
          {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Typography.Text>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: AccountStatus) => {
        const cfg = accountStatusConfig[status];
        return (
          <Tag
            style={{
              color: cfg.color,
              backgroundColor: cfg.bg,
              border: `1px solid ${cfg.color}20`,
              borderRadius: 9999,
            }}
          >
            {cfg.text}
          </Tag>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => {
        if (record.status === 'closed') return null;
        const isFrozen = record.status === 'frozen';
        return (
          <Popconfirm
            title={isFrozen ? '确认解冻此账户？' : '确认冻结此账户？'}
            description={isFrozen ? '解冻后账户可正常使用' : '冻结后账户将无法进行交易'}
            onConfirm={() => handleToggleFreeze(record)}
            okText="确认"
            cancelText="取消"
            okButtonProps={isFrozen ? {} : { danger: true }}
          >
            <Button
              type="link"
              size="small"
              icon={isFrozen ? <UnlockOutlined /> : <LockOutlined />}
              danger={!isFrozen}
            >
              {isFrozen ? '解冻' : '冻结'}
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography.Text type="secondary">管理商户的资金账户</Typography.Text>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ background: brandColors.primary }}
          onClick={() => setCreateModalOpen(true)}
        >
          创建账户
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={accounts}
        rowKey="id"
        size="small"
        pagination={false}
      />

      {/* Create Account Modal */}
      <Modal
        title="创建账户"
        open={createModalOpen}
        onCancel={() => { setCreateModalOpen(false); form.resetFields(); }}
        onOk={handleCreate}
        okText="创建"
        cancelText="取消"
        confirmLoading={creating}
        width={480}
        styles={{ header: { borderBottom: '1px solid #E2E8F0', paddingBottom: 16 } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item
            name="account_type"
            label="账户类型"
            rules={[{ required: true, message: '请选择账户类型' }]}
          >
            <Select
              placeholder="选择账户类型"
              options={Object.entries(accountTypeLabels).map(([value, label]) => ({ value, label }))}
            />
          </Form.Item>
          <Form.Item
            name="currency"
            label="币种"
            rules={[{ required: true, message: '请选择币种' }]}
          >
            <Select
              placeholder="选择币种"
              options={[
                { value: 'BRL', label: '🇧🇷 BRL - 巴西雷亚尔' },
                { value: 'MXN', label: '🇲🇽 MXN - 墨西哥比索' },
                { value: 'USD', label: '🇺🇸 USD - 美元' },
              ]}
            />
          </Form.Item>
          <Form.Item name="initial_balance" label="初始余额">
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={2}
              placeholder="0.00"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
