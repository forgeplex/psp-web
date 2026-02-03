import React from 'react';
import { Form, Input, Select, InputNumber, Switch, Card, Space, Divider } from 'antd';
import type { ChannelFormData, ChannelType, ChannelLimits } from '@psp/shared';

const { Option } = Select;
const { TextArea } = Input;

interface ChannelFormProps {
  initialValues?: Partial<ChannelFormData>;
  onSubmit?: (values: ChannelFormData) => void;
  loading?: boolean;
  providers?: Array<{ id: string; name: string }>;
}

const defaultLimits: ChannelLimits = {
  min_amount: 100,
  max_amount: 1000000,
  daily_limit: 10000000,
  monthly_limit: 100000000,
};

export const ChannelForm: React.FC<ChannelFormProps> = ({
  initialValues,
  onSubmit,
  loading,
  providers = [],
}) => {
  const [form] = Form.useForm<ChannelFormData>();

  const channelTypes: { label: string; value: ChannelType }[] = [
    { label: '支付', value: 'payment' },
    { label: '代付', value: 'payout' },
    { label: '综合', value: 'combined' },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        type: 'payment',
        priority: 0,
        limits: defaultLimits,
        config: {},
        ...initialValues,
      }}
      onFinish={onSubmit}
    >
      <Card title="基本信息" bordered={false}>
        <Form.Item
          name="code"
          label="渠道编码"
          rules={[
            { required: true, message: '请输入渠道编码' },
            { pattern: /^[A-Z0-9_]{2,50}$/, message: '仅支持大写字母、数字、下划线' },
          ]}
        >
          <Input placeholder="WECHAT_PAY" disabled={!!initialValues?.code} />
        </Form.Item>

        <Form.Item
          name="name"
          label="渠道名称"
          rules={[{ required: true, message: '请输入渠道名称' }]}
        >
          <Input placeholder="微信支付" />
        </Form.Item>

        <Form.Item name="description" label="描述">
          <TextArea rows={3} placeholder="渠道描述信息" />
        </Form.Item>

        <Form.Item
          name="provider_id"
          label="提供商"
          rules={[{ required: true, message: '请选择提供商' }]}
        >
          <Select placeholder="选择提供商">
            {providers.map((p) => (
              <Option key={p.id} value={p.id}>
                {p.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="type"
          label="渠道类型"
          rules={[{ required: true }]}
        >
          <Select>
            {channelTypes.map((t) => (
              <Option key={t.value} value={t.value}>
                {t.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="priority"
          label="优先级"
          rules={[{ required: true }]}
          tooltip="数值越大优先级越高"
        >
          <InputNumber min={0} max={9999} style={{ width: 200 }} />
        </Form.Item>
      </Card>

      <Divider />

      <Card title="限额配置" bordered={false}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Form.Item
            name={['limits', 'min_amount']}
            label="最小金额（分）"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: 200 }} />
          </Form.Item>

          <Form.Item
            name={['limits', 'max_amount']}
            label="最大金额（分）"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: 200 }} />
          </Form.Item>

          <Form.Item
            name={['limits', 'daily_limit']}
            label="日限额（分）"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: 200 }} />
          </Form.Item>

          <Form.Item
            name={['limits', 'monthly_limit']}
            label="月限额（分）"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: 200 }} />
          </Form.Item>
        </Space>
      </Card>

      <Divider />

      <Card title="渠道配置" bordered={false}>
        {/* TODO: 动态表单，根据 provider.config_schema 生成 */}
        <Form.Item name="config" label="配置项">
          <TextArea
            rows={10}
            placeholder="{...}"
            disabled
            value="{ /* 动态表单字段将在此处渲染 */ }"
          />
        </Form.Item>
      </Card>
    </Form>
  );
};

export default ChannelForm;
