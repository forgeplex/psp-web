import React, { useEffect } from 'react';
import { Form, Input, Select, Switch, Space, Card, Row, Col, InputNumber, Slider } from 'antd';
import type { RoutingStrategy } from '../types/domain';
import { useChannels } from '../hooks';

const { TextArea } = Input;

export interface RoutingStrategyFormProps {
  initialValues?: Partial<RoutingStrategy>;
  onSubmit?: (values: Partial<RoutingStrategy>) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export function RoutingStrategyForm({ initialValues, onSubmit, onCancel, loading }: RoutingStrategyFormProps) {
  const [form] = Form.useForm();
  const { data: channelsData } = useChannels();
  const channels = channelsData?.items || [];

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
        enabled: true,
        priority: 1,
        ...initialValues,
      }}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="name"
        label="Strategy Name"
        rules={[{ required: true, message: 'Please enter strategy name' }]}
      >
        <Input placeholder="e.g. VIP Customer Priority" />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <TextArea rows={2} placeholder="Enter strategy description" />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={999} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="enabled" valuePropName="checked" style={{ marginTop: 29 }}>
            <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
          </Form.Item>
        </Col>
      </Row>

      <Card title="Routing Rules" size="small" style={{ marginBottom: 16 }}>
        <Form.Item label="Amount Range" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col span={11}>
              <Form.Item name={['rules', 'amount', 'min']} noStyle>
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="Min"
                  formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
            <Col span={2} style={{ textAlign: 'center' }}>~</Col>
            <Col span={11}>
              <Form.Item name={['rules', 'amount', 'max']} noStyle>
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="Max"
                  formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item name={['rules', 'currencies']} label="Currencies">
          <Select
            mode="multiple"
            placeholder="Select currencies"
            options={[
              { label: 'CNY', value: 'CNY' },
              { label: 'USD', value: 'USD' },
              { label: 'EUR', value: 'EUR' },
              { label: 'JPY', value: 'JPY' },
            ]}
          />
        </Form.Item>

        <Form.Item name={['rules', 'countries']} label="Countries">
          <Select
            mode="multiple"
            placeholder="Select countries"
            options={[
              { label: 'China', value: 'CN' },
              { label: 'USA', value: 'US' },
              { label: 'Japan', value: 'JP' },
              { label: 'EU', value: 'EU' },
            ]}
          />
        </Form.Item>

        <Form.Item name={['rules', 'merchants']} label="Target Merchants">
          <Select
            mode="multiple"
            placeholder="Select merchants (empty = all)"
            showSearch
            options={[
              { label: 'Merchant A', value: 'mch_001' },
              { label: 'Merchant B', value: 'mch_002' },
              { label: 'Merchant C', value: 'mch_003' },
            ]}
          />
        </Form.Item>
      </Card>

      <Card title="Target Channels" size="small">
        <Form.Item name={['targets', 'channel_ids']} label="Channel Priority">
          <Select
            mode="multiple"
            placeholder="Select channels in priority order"
            options={channels.map(c => ({ label: c.name, value: c.id }))}
          />
        </Form.Item>
        
        <Form.Item name={['targets', 'fallback_enabled']} valuePropName="checked">
          <Switch checkedChildren="Fallback enabled" unCheckedChildren="Fallback disabled" />
        </Form.Item>
      </Card>

      <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
        <Space>
          <button type="submit" className="ant-btn ant-btn-primary" disabled={loading}>
            {loading ? 'Saving...' : initialValues?.id ? 'Update Strategy' : 'Create Strategy'}
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
