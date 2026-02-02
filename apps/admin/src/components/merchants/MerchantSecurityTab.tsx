import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Tag,
  message,
  Typography,
  Popconfirm,
  Empty,
  Alert,
} from 'antd';
import type { TableProps } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SafetyOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { brandColors, statusColors } from '@psp/shared';

// ============================================================
// Types
// ============================================================
interface IpWhitelist {
  id: string;
  ip_address: string;
  description: string;
  created_at: string;
}

interface AddIpForm {
  ip_address: string;
  description: string;
}

interface MerchantSecurityTabProps {
  merchantId: string;
}

// ============================================================
// Mock Data — TODO: API call
// ============================================================
const mockIpWhitelist: IpWhitelist[] = [
  {
    id: 'ip-1',
    ip_address: '203.0.113.10',
    description: '生产服务器',
    created_at: '2024-01-15',
  },
  {
    id: 'ip-2',
    ip_address: '203.0.113.20',
    description: '备份服务器',
    created_at: '2024-01-15',
  },
  {
    id: 'ip-3',
    ip_address: '198.51.100.0/24',
    description: '办公网络',
    created_at: '2024-01-18',
  },
];

// ============================================================
// Component
// ============================================================
export const MerchantSecurityTab: React.FC<MerchantSecurityTabProps> = ({ merchantId }) => {
  const [ipList] = useState<IpWhitelist[]>(mockIpWhitelist); // TODO: API call
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [form] = Form.useForm<AddIpForm>();
  const [adding, setAdding] = useState(false);

  const handleAddIp = async () => {
    try {
      const values = await form.validateFields();
      setAdding(true);
      // TODO: API call — POST /merchants/{merchantId}/security/ip-whitelist
      console.log('Adding IP:', { merchantId, ...values });
      await new Promise((r) => setTimeout(r, 800));
      message.success('IP 白名单添加成功');
      form.resetFields();
      setAddModalOpen(false);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteIp = async (record: IpWhitelist) => {
    // TODO: API call — DELETE /merchants/{merchantId}/security/ip-whitelist/{id}
    console.log('Deleting IP:', record.id);
    message.success(`IP ${record.ip_address} 已从白名单中移除`);
  };

  const ipAddressValidator = (_: unknown, value: string) => {
    if (!value) return Promise.reject('请输入 IP 地址');
    // Basic IPv4 / CIDR validation
    const ipv4 = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
    if (!ipv4.test(value)) {
      return Promise.reject('请输入有效的 IPv4 地址或 CIDR');
    }
    return Promise.resolve();
  };

  const columns: TableProps<IpWhitelist>['columns'] = [
    {
      title: 'IP 地址',
      dataIndex: 'ip_address',
      key: 'ip_address',
      width: 200,
      render: (ip) => (
        <Space>
          <GlobalOutlined style={{ color: brandColors.primary }} />
          <Typography.Text code style={{ fontFamily: 'monospace' }}>
            {ip}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 240,
    },
    {
      title: '添加时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title="确认删除此 IP？"
          description={`将从白名单中移除 ${record.ip_address}`}
          onConfirm={() => handleDeleteIp(record)}
          okText="删除"
          cancelText="取消"
          okButtonProps={{ danger: true }}
        >
          <Button type="link" size="small" icon={<DeleteOutlined />} danger>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      {/* IP Whitelist Section */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Space>
            <SafetyOutlined style={{ color: brandColors.primary, fontSize: 16 }} />
            <Typography.Text strong style={{ fontSize: 15 }}>IP 白名单</Typography.Text>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ background: brandColors.primary }}
            onClick={() => setAddModalOpen(true)}
          >
            添加 IP
          </Button>
        </div>

        <Alert
          type="info"
          showIcon
          message="仅白名单内的 IP 地址可访问商户 API"
          description="如未配置 IP 白名单，则不对来源 IP 做限制。添加任意白名单条目后，限制立即生效。"
          style={{ marginBottom: 16 }}
        />

        <Table
          columns={columns}
          dataSource={ipList}
          rowKey="id"
          size="small"
          pagination={false}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无 IP 白名单"
              />
            ),
          }}
        />
      </div>

      {/* Add IP Modal */}
      <Modal
        title="添加 IP 白名单"
        open={addModalOpen}
        onCancel={() => { setAddModalOpen(false); form.resetFields(); }}
        onOk={handleAddIp}
        okText="添加"
        cancelText="取消"
        confirmLoading={adding}
        width={480}
        styles={{ header: { borderBottom: '1px solid #E2E8F0', paddingBottom: 16 } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item
            name="ip_address"
            label="IP 地址"
            rules={[{ validator: ipAddressValidator }]}
          >
            <Input
              placeholder="如: 203.0.113.10 或 198.51.100.0/24"
              prefix={<GlobalOutlined style={{ color: '#71717A' }} />}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input placeholder="如: 生产服务器" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
