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
  Dropdown,
  Typography,
  Switch,
} from 'antd';
import type { TableProps, MenuProps } from 'antd';
import {
  PlusOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ReloadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { brandColors, statusColors } from '@psp/shared';

// ============================================================
// Types
// ============================================================
type UserRole = 'owner' | 'admin' | 'operator' | 'viewer';
type UserStatus = 'active' | 'disabled' | 'invited';

interface MerchantUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  mfa_enabled: boolean;
  status: UserStatus;
  last_login: string | null;
}

interface AddUserForm {
  username: string;
  email: string;
  role: UserRole;
}

interface MerchantUsersTabProps {
  merchantId: string;
}

// ============================================================
// Config
// ============================================================
const roleLabels: Record<UserRole, { text: string; color: string }> = {
  owner: { text: '所有者', color: brandColors.primary },
  admin: { text: '管理员', color: '#3B82F6' },
  operator: { text: '操作员', color: statusColors.pending },
  viewer: { text: '只读', color: '#71717A' },
};

const userStatusConfig: Record<UserStatus, { color: string; bg: string; text: string }> = {
  active: { color: statusColors.success, bg: statusColors.successBg, text: '正常' },
  disabled: { color: statusColors.failed, bg: statusColors.failedBg, text: '已禁用' },
  invited: { color: statusColors.pending, bg: statusColors.pendingBg, text: '已邀请' },
};

// ============================================================
// Mock Data — TODO: API call
// ============================================================
const mockUsers: MerchantUser[] = [
  {
    id: 'usr-1',
    username: 'zhangsan',
    email: 'zhang@merchant.com',
    role: 'owner',
    mfa_enabled: true,
    status: 'active',
    last_login: '2024-01-20 14:30',
  },
  {
    id: 'usr-2',
    username: 'lisi',
    email: 'li@merchant.com',
    role: 'admin',
    mfa_enabled: true,
    status: 'active',
    last_login: '2024-01-19 09:15',
  },
  {
    id: 'usr-3',
    username: 'wangwu',
    email: 'wang@merchant.com',
    role: 'operator',
    mfa_enabled: false,
    status: 'active',
    last_login: '2024-01-18 16:42',
  },
  {
    id: 'usr-4',
    username: 'zhaoliu',
    email: 'zhao@merchant.com',
    role: 'viewer',
    mfa_enabled: false,
    status: 'disabled',
    last_login: '2024-01-10 11:20',
  },
  {
    id: 'usr-5',
    username: 'sunqi',
    email: 'sun@merchant.com',
    role: 'operator',
    mfa_enabled: false,
    status: 'invited',
    last_login: null,
  },
];

// ============================================================
// Component
// ============================================================
export const MerchantUsersTab: React.FC<MerchantUsersTabProps> = ({ merchantId }) => {
  const [users] = useState<MerchantUser[]>(mockUsers); // TODO: API call
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [form] = Form.useForm<AddUserForm>();
  const [adding, setAdding] = useState(false);

  const handleAddUser = async () => {
    try {
      const values = await form.validateFields();
      setAdding(true);
      // TODO: API call — POST /merchants/{merchantId}/users
      console.log('Adding user:', { merchantId, ...values });
      await new Promise((r) => setTimeout(r, 800));
      message.success('用户邀请已发送');
      form.resetFields();
      setAddModalOpen(false);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleStatusAction = async (user: MerchantUser, action: 'activate' | 'disable') => {
    // TODO: API call — POST /merchants/{merchantId}/users/{userId}/activate|disable
    console.log(`${action} user:`, user.id);
    message.success(action === 'activate' ? '用户已激活' : '用户已禁用');
  };

  const handleResetMFA = async (user: MerchantUser) => {
    // TODO: API call — POST /merchants/{merchantId}/users/{userId}/reset-mfa
    console.log('Reset MFA for user:', user.id);
    message.success(`已重置 ${user.username} 的 MFA`);
  };

  const getActionMenu = (record: MerchantUser): MenuProps['items'] => {
    const items: MenuProps['items'] = [];

    if (record.status === 'active') {
      items.push({
        key: 'disable',
        icon: <StopOutlined />,
        label: '禁用',
        danger: true,
        onClick: () => handleStatusAction(record, 'disable'),
      });
    } else if (record.status === 'disabled') {
      items.push({
        key: 'activate',
        icon: <CheckCircleOutlined />,
        label: '激活',
        onClick: () => handleStatusAction(record, 'activate'),
      });
    }

    if (record.mfa_enabled) {
      items.push({
        key: 'reset-mfa',
        icon: <ReloadOutlined />,
        label: '重置 MFA',
        onClick: () => handleResetMFA(record),
      });
    }

    return items;
  };

  const columns: TableProps<MerchantUser>['columns'] = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120,
      render: (name) => (
        <Space>
          <UserOutlined style={{ color: '#71717A' }} />
          <Typography.Text strong>{name}</Typography.Text>
        </Space>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: UserRole) => {
        const cfg = roleLabels[role];
        return (
          <Tag
            style={{
              color: cfg.color,
              backgroundColor: `${cfg.color}10`,
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
      title: 'MFA',
      dataIndex: 'mfa_enabled',
      key: 'mfa_enabled',
      width: 80,
      align: 'center',
      render: (enabled: boolean) => (
        <Tag
          style={{
            color: enabled ? statusColors.success : '#71717A',
            backgroundColor: enabled ? statusColors.successBg : '#F4F4F5',
            border: `1px solid ${enabled ? statusColors.success : '#71717A'}20`,
            borderRadius: 9999,
          }}
        >
          {enabled ? '已启用' : '未启用'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: UserStatus) => {
        const cfg = userStatusConfig[status];
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
      title: '最后登录',
      dataIndex: 'last_login',
      key: 'last_login',
      width: 150,
      render: (time) => time || <Typography.Text type="secondary">-</Typography.Text>,
    },
    {
      title: '操作',
      key: 'action',
      width: 60,
      render: (_, record) => {
        const items = getActionMenu(record);
        if (!items || items.length === 0) return null;
        return (
          <Dropdown menu={{ items }} trigger={['click']}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography.Text type="secondary">管理商户下属用户及权限</Typography.Text>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ background: brandColors.primary }}
          onClick={() => setAddModalOpen(true)}
        >
          添加用户
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        size="small"
        pagination={false}
      />

      {/* Add User Modal */}
      <Modal
        title="添加用户"
        open={addModalOpen}
        onCancel={() => { setAddModalOpen(false); form.resetFields(); }}
        onOk={handleAddUser}
        okText="发送邀请"
        cancelText="取消"
        confirmLoading={adding}
        width={480}
        styles={{ header: { borderBottom: '1px solid #E2E8F0', paddingBottom: 16 } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" prefix={<UserOutlined style={{ color: '#71717A' }} />} />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效邮箱' },
            ]}
          >
            <Input placeholder="user@example.com" />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select
              placeholder="选择角色"
              options={Object.entries(roleLabels).map(([value, cfg]) => ({
                value,
                label: cfg.text,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
