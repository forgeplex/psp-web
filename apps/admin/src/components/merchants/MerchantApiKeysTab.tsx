import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  message,
  Typography,
  Popconfirm,
  Alert,
  Checkbox,
} from 'antd';
import type { TableProps } from 'antd';
import {
  PlusOutlined,
  KeyOutlined,
  StopOutlined,
  CopyOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { brandColors, statusColors } from '@psp/shared';

// ============================================================
// Types
// ============================================================
type KeyStatus = 'active' | 'disabled' | 'expired';
type Permission = 'payment:read' | 'payment:write' | 'refund:write' | 'merchant:read' | 'webhook:manage';

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  permissions: Permission[];
  status: KeyStatus;
  created_at: string;
  last_used: string | null;
}

interface CreateApiKeyForm {
  name: string;
  permissions: Permission[];
}

interface MerchantApiKeysTabProps {
  merchantId: string;
}

// ============================================================
// Config
// ============================================================
const keyStatusConfig: Record<KeyStatus, { color: string; bg: string; text: string }> = {
  active: { color: statusColors.success, bg: statusColors.successBg, text: '有效' },
  disabled: { color: statusColors.failed, bg: statusColors.failedBg, text: '已禁用' },
  expired: { color: '#71717A', bg: '#F4F4F5', text: '已过期' },
};

const permissionLabels: Record<Permission, string> = {
  'payment:read': '查看支付',
  'payment:write': '发起支付',
  'refund:write': '发起退款',
  'merchant:read': '查看商户',
  'webhook:manage': '管理 Webhook',
};

// ============================================================
// Mock Data — TODO: API call
// ============================================================
const mockApiKeys: ApiKey[] = [
  {
    id: 'key-1',
    name: 'Production Key',
    key_prefix: 'pk_live_a',
    permissions: ['payment:read', 'payment:write', 'refund:write'],
    status: 'active',
    created_at: '2024-01-15',
    last_used: '2024-01-20 18:30',
  },
  {
    id: 'key-2',
    name: 'Sandbox Key',
    key_prefix: 'pk_test_b',
    permissions: ['payment:read', 'payment:write'],
    status: 'active',
    created_at: '2024-01-15',
    last_used: '2024-01-19 10:15',
  },
  {
    id: 'key-3',
    name: 'Webhook Key',
    key_prefix: 'pk_live_c',
    permissions: ['webhook:manage'],
    status: 'active',
    created_at: '2024-01-18',
    last_used: null,
  },
  {
    id: 'key-4',
    name: 'Old Key',
    key_prefix: 'pk_live_d',
    permissions: ['payment:read'],
    status: 'disabled',
    created_at: '2023-12-01',
    last_used: '2024-01-05 09:00',
  },
];

// ============================================================
// Component
// ============================================================
export const MerchantApiKeysTab: React.FC<MerchantApiKeysTabProps> = ({ merchantId }) => {
  const [apiKeys] = useState<ApiKey[]>(mockApiKeys); // TODO: API call
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [mfaConfirmOpen, setMfaConfirmOpen] = useState(false);
  const [pendingDisableKey, setPendingDisableKey] = useState<ApiKey | null>(null);
  const [form] = Form.useForm<CreateApiKeyForm>();
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      setCreating(true);
      // TODO: API call — POST /merchants/{merchantId}/api-keys
      console.log('Creating API key:', { merchantId, ...values });
      await new Promise((r) => setTimeout(r, 800));
      message.success('API Key 创建成功，请保存密钥');
      // TODO: Show the full key in a modal for one-time copy
      form.resetFields();
      setCreateModalOpen(false);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleDisableKey = (key: ApiKey) => {
    setPendingDisableKey(key);
    setMfaConfirmOpen(true);
  };

  const handleMfaConfirmDisable = async () => {
    if (!pendingDisableKey) return;
    // TODO: API call — POST /merchants/{merchantId}/api-keys/{keyId}/disable (with MFA token)
    console.log('Disabling API key (MFA confirmed):', pendingDisableKey.id);
    message.success(`API Key "${pendingDisableKey.name}" 已禁用`);
    setMfaConfirmOpen(false);
    setPendingDisableKey(null);
  };

  const handleCopyPrefix = (prefix: string) => {
    navigator.clipboard?.writeText(prefix);
    message.success('已复制到剪贴板');
  };

  const columns: TableProps<ApiKey>['columns'] = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 160,
      render: (name) => (
        <Space>
          <KeyOutlined style={{ color: brandColors.primary }} />
          <Typography.Text strong>{name}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Key 前缀',
      dataIndex: 'key_prefix',
      key: 'key_prefix',
      width: 160,
      render: (prefix) => (
        <Space>
          <Typography.Text code style={{ fontFamily: 'monospace' }}>
            {prefix}********
          </Typography.Text>
          <Button
            type="text"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => handleCopyPrefix(prefix)}
          />
        </Space>
      ),
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      key: 'permissions',
      width: 240,
      render: (perms: Permission[]) => (
        <Space size={[0, 4]} wrap>
          {perms.map((p) => (
            <Tag
              key={p}
              style={{
                fontSize: 11,
                color: brandColors.primary,
                backgroundColor: brandColors.primaryLight,
                border: `1px solid ${brandColors.primary}20`,
                borderRadius: 4,
              }}
            >
              {permissionLabels[p]}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: KeyStatus) => {
        const cfg = keyStatusConfig[status];
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
      width: 110,
    },
    {
      title: '最后使用',
      dataIndex: 'last_used',
      key: 'last_used',
      width: 150,
      render: (time) => time || <Typography.Text type="secondary">从未使用</Typography.Text>,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => {
        if (record.status !== 'active') return null;
        return (
          <Button
            type="link"
            size="small"
            icon={<StopOutlined />}
            danger
            onClick={() => handleDisableKey(record)}
          >
            禁用
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography.Text type="secondary">管理商户 API 访问密钥</Typography.Text>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ background: brandColors.primary }}
          onClick={() => setCreateModalOpen(true)}
        >
          创建 API Key
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={apiKeys}
        rowKey="id"
        size="small"
        pagination={false}
      />

      {/* Create API Key Modal */}
      <Modal
        title="创建 API Key"
        open={createModalOpen}
        onCancel={() => { setCreateModalOpen(false); form.resetFields(); }}
        onOk={handleCreate}
        okText="创建"
        cancelText="取消"
        confirmLoading={creating}
        width={520}
        styles={{ header: { borderBottom: '1px solid #E2E8F0', paddingBottom: 16 } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入 Key 名称' }]}
          >
            <Input placeholder="如: Production Key" />
          </Form.Item>
          <Form.Item
            name="permissions"
            label="权限"
            rules={[{ required: true, message: '请至少选择一项权限' }]}
          >
            <Checkbox.Group style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(permissionLabels).map(([value, label]) => (
                <Checkbox key={value} value={value}>
                  {label}
                  <Typography.Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                    {value}
                  </Typography.Text>
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>
          <Alert
            type="warning"
            showIcon
            icon={<ExclamationCircleOutlined />}
            message="创建后密钥仅显示一次，请妥善保存"
            style={{ marginTop: 8 }}
          />
        </Form>
      </Modal>

      {/* MFA Confirmation Modal */}
      <Modal
        title="需要 MFA 验证"
        open={mfaConfirmOpen}
        onCancel={() => { setMfaConfirmOpen(false); setPendingDisableKey(null); }}
        onOk={handleMfaConfirmDisable}
        okText="确认禁用"
        cancelText="取消"
        okButtonProps={{ danger: true }}
        width={420}
        styles={{ header: { borderBottom: '1px solid #E2E8F0', paddingBottom: 16 } }}
      >
        <div style={{ marginTop: 16 }}>
          <Alert
            type="warning"
            showIcon
            message="此操作需要 MFA 验证"
            description={`您正在禁用 API Key "${pendingDisableKey?.name}"。禁用后所有使用此 Key 的接口调用将立即失效。`}
            style={{ marginBottom: 16 }}
          />
          <Form layout="vertical">
            <Form.Item label="MFA 验证码" required>
              <Input
                placeholder="请输入 6 位验证码"
                maxLength={6}
                style={{ width: 200, textAlign: 'center', letterSpacing: 8, fontFamily: 'monospace' }}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};
