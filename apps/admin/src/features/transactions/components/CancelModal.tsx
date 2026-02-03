import React, { useState } from 'react';
import { Modal, Form, Input, Button, Space, message, Alert } from 'antd';
import { StopOutlined } from '@ant-design/icons';

interface CancelModalProps {
  visible: boolean;
  transactionId: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const CancelModal: React.FC<CancelModalProps> = ({
  visible,
  transactionId,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCancel = async (values: any) => {
    setLoading(true);
    try {
      // TODO: 调用真实取消 API
      console.log('取消交易:', {
        transactionId,
        reason: values.reason,
      });
      message.success('交易已取消');
      form.resetFields();
      onSuccess?.();
      onCancel();
    } catch (error) {
      message.error('取消失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="取消交易"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Alert
        message="警告"
        description="取消交易后不可恢复，请谨慎操作！"
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleCancel}
      >
        <Form.Item label="交易ID">
          <span>{transactionId}</span>
        </Form.Item>

        <Form.Item
          name="reason"
          label="取消原因"
          rules={[{ required: true, message: '请输入取消原因' }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="请输入取消原因..."
          />
        </Form.Item>

        <Form.Item>
          <Space style={{ float: 'right' }}>
            <Button onClick={onCancel}>关闭</Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<StopOutlined />}
              loading={loading}
              danger
            >
              确认取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
