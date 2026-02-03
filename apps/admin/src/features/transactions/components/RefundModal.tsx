import React, { useState } from 'react';
import { Modal, Form, InputNumber, Input, Button, Space, message } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';

interface RefundModalProps {
  visible: boolean;
  transactionId: string;
  maxAmount: number;
  currency: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const RefundModal: React.FC<RefundModalProps> = ({
  visible,
  transactionId,
  maxAmount,
  currency,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleRefund = async (values: any) => {
    setLoading(true);
    try {
      // TODO: 调用真实退款 API
      console.log('退款参数:', {
        transactionId,
        amount: values.amount,
        reason: values.reason,
      });
      message.success('退款申请已提交');
      form.resetFields();
      onSuccess?.();
      onCancel();
    } catch (error) {
      message.error('退款失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="申请退款"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleRefund}
      >
        <Form.Item label="交易ID">
          <span>{transactionId}</span>
        </Form.Item>

        <Form.Item label="可退金额">
          <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
            {maxAmount} {currency}
          </span>
        </Form.Item>

        <Form.Item
          name="amount"
          label="退款金额"
          rules={[
            { required: true, message: '请输入退款金额' },
            {
              validator: (_, value) => {
                if (value > maxAmount) {
                  return Promise.reject('退款金额不能超过可退金额');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0.01}
            max={maxAmount}
            precision={2}
            placeholder={`最多可退 ${maxAmount} ${currency}`}
          />
        </Form.Item>

        <Form.Item
          name="reason"
          label="退款原因"
          rules={[{ required: true, message: '请输入退款原因' }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="请输入退款原因..."
          />
        </Form.Item>

        <Form.Item>
          <Space style={{ float: 'right' }}>
            <Button onClick={onCancel}>取消</Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<RollbackOutlined />}
              loading={loading}
              danger
            >
              确认退款
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
