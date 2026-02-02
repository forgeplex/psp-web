import React from 'react';
import { Modal, Form, Select, Input, Typography, Tag, Space, message, Alert } from 'antd';
import {
  CheckCircleOutlined,
  PauseCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { MerchantStatus, StatusChangeForm } from '../types';

const { Text } = Typography;
const { TextArea } = Input;

interface StatusChangeModalProps {
  open: boolean;
  onClose: () => void;
  currentStatus: MerchantStatus;
  merchantName: string;
  onSuccess?: () => void;
}

const statusOptions = [
  { value: 'suspended', label: '暂停 (Suspended)', color: 'warning' },
  { value: 'closed', label: '关闭 (Closed)', color: 'error' },
];

const statusWarnings: Record<string, string> = {
  suspended: '此操作将暂停该商户的所有业务，商户将无法进行交易。',
  closed: '此操作将永久关闭该商户，所有数据将被归档，请谨慎操作。',
};

export const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  open,
  onClose,
  currentStatus,
  merchantName,
  onSuccess,
}) => {
  const [form] = Form.useForm<StatusChangeForm>();
  const [loading, setLoading] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const targetStatus = Form.useWatch('targetStatus', form);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setConfirmOpen(true);
    } catch {
      // validation error
    }
  };

  const handleConfirm = async () => {
    try {
      const values = form.getFieldsValue();
      setLoading(true);

      // TODO: Replace with actual API call
      console.log('Changing status:', values);
      await new Promise(resolve => setTimeout(resolve, 800));

      message.success('商户状态已变更');
      form.resetFields();
      setConfirmOpen(false);
      onSuccess?.();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setConfirmOpen(false);
    onClose();
  };

  const currentStatusTag = (
    <Tag color="success" icon={<CheckCircleOutlined />}>
      {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
    </Tag>
  );

  return (
    <>
      <Modal
        title="变更商户状态"
        open={open && !confirmOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText="确认变更"
        cancelText="取消"
        width={440}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="当前状态">
            <Space>
              <Text strong>{merchantName}</Text>
              {currentStatusTag}
            </Space>
          </Form.Item>

          <Form.Item
            name="targetStatus"
            label="目标状态"
            rules={[{ required: true, message: '请选择目标状态' }]}
          >
            <Select placeholder="请选择目标状态" options={statusOptions} />
          </Form.Item>

          {targetStatus && (
            <Alert
              type={targetStatus === 'closed' ? 'error' : 'warning'}
              message={statusWarnings[targetStatus]}
              showIcon
              icon={<ExclamationCircleOutlined />}
              style={{ marginBottom: 16 }}
            />
          )}

          <Form.Item name="reason" label="变更原因（可选）">
            <TextArea rows={3} placeholder="请输入变更原因..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        title="二次确认"
        open={confirmOpen}
        onOk={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
        confirmLoading={loading}
        okText={targetStatus === 'closed' ? '确认关闭' : '确认暂停'}
        okButtonProps={{
          danger: targetStatus === 'closed',
        }}
        cancelText="取消"
        width={360}
        centered
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <ExclamationCircleOutlined
            style={{ fontSize: 40, color: targetStatus === 'closed' ? '#ff4d4f' : '#faad14', marginBottom: 12 }}
          />
          <Typography.Title level={5} style={{ marginBottom: 4 }}>
            确认变更状态？
          </Typography.Title>
          <Text type="secondary">{statusWarnings[targetStatus || 'suspended']}</Text>
        </div>
      </Modal>
    </>
  );
};
