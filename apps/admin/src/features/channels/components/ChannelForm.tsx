import React, { useEffect } from 'react';
import { Form, Input, Select, InputNumber, Switch, Space, Card, Row, Col } from 'antd';
import type { Channel, ChannelStatus, ChannelType } from '../types/domain';
import { useProviders } from '../hooks/useProviders';

const { TextArea } = Input;

export interface ChannelFormProps {
  initialValues?: Partial<Channel>;
  onSubmit?: (values: Partial<Channel>) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export function ChannelForm({ initialValues, onSubmit, onCancel, loading }: ChannelFormProps) {
  const [form] = Form.useForm();
  const { data: providers = [] } = useProviders();

  // Reset form when initialValues change
  useEffect(() => {
    form.resetFields();
  }, [initialValues, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    onSubmit?.(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        status: 'inactive',
        type: 'payment',
        priority: 100,
        ...initialValues,
      }}
      onFinish={handleSubmit}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="code"
            label="Channel Code"
            rules={[{ required: true, message: 'Please enter channel code' }]}
          >
            <Input placeholder="e.g. WECHAT_PAY" disabled={!!initialValues?.id} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Channel Name"
            rules={[{ required: true, message: 'Please enter channel name' }]}
          >
            <Input placeholder="e.g. 微信支付" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="provider_id"
        label="Provider"
        rules={[{ required: true, message: 'Please select a provider' }]}
      >
        <Select placeholder="Select provider">
          {providers.map(provider => (
            <Select.Option key={provider.id} value={provider.id}>
              {provider.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="payment">Payment</Select.Option>
              <Select.Option value="payout">Payout</Select.Option>
              <Select.Option value="combined">Combined</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
              <Select.Option value="maintenance">Maintenance</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={999} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="description" label="Description">
        <TextArea rows={3} placeholder="Enter channel description" />
      </Form.Item>

      <Card title="Transaction Limits" size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name={['limits', 'min_amount']} label="Min Amount">
              <InputNumber min={0} style={{ width: '100%' }} placeholder="100" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['limits', 'max_amount']} label="Max Amount">
              <InputNumber min={0} style={{ width: '100%' }} placeholder="5000000" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['limits', 'daily_amount']} label="Daily Limit">
              <InputNumber min={0} style={{ width: '100%' }} placeholder="100000000" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="Configuration" size="small">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name={['config', 'app_id']} label="App ID">
              <Input placeholder="App ID" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={['config', 'mch_id']} label="Merchant ID">
              <Input placeholder="Merchant ID" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name={['config', 'api_version']} label="API Version">
          <Input placeholder="e.g. v3" />
        </Form.Item>
      </Card>

      <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
        <Space>
          <button type="submit" className="ant-btn ant-btn-primary" disabled={loading}>
            {loading ? 'Saving...' : initialValues?.id ? 'Update Channel' : 'Create Channel'}
          </button>
          {onCancel && (
            <button type="button" className="ant-btn" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
}
