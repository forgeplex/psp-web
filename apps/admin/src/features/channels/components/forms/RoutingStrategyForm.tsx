import React from 'react';
import { Form, Input, InputNumber, Switch, Card, Space, Select, Button, Row, Col } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { RoutingStrategyFormData, Operator, RuleLogic } from '@psp/shared';

const { Option } = Select;
const { TextArea } = Input;

interface RoutingStrategyFormProps {
  initialValues?: Partial<RoutingStrategyFormData>;
  onSubmit?: (values: RoutingStrategyFormData) => void;
  loading?: boolean;
  channels?: Array<{ id: string; name: string }>;
}

const operators: { label: string; value: Operator }[] = [
  { label: '等于', value: 'eq' },
  { label: '不等于', value: 'ne' },
  { label: '大于', value: 'gt' },
  { label: '大于等于', value: 'gte' },
  { label: '小于', value: 'lt' },
  { label: '小于等于', value: 'lte' },
  { label: '属于', value: 'in' },
  { label: '不属于', value: 'not_in' },
  { label: '介于', value: 'between' },
];

const conditionFields = [
  { label: '金额', value: 'amount' },
  { label: '币种', value: 'currency' },
  { label: '国家', value: 'country' },
  { label: '商户ID', value: 'merchant_id' },
];

export const RoutingStrategyForm: React.FC<RoutingStrategyFormProps> = ({
  initialValues,
  onSubmit,
  loading,
  channels = [],
}) => {
  const [form] = Form.useForm<RoutingStrategyFormData>();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        priority: 1,
        rules: { conditions: [], logic: 'AND' as RuleLogic },
        failover_config: { enabled: true, max_retries: 3, retry_interval_ms: 1000 },
        targets: [],
        ...initialValues,
      }}
      onFinish={onSubmit}
    >
      <Card title="基本信息" bordered={false}>
        <Form.Item
          name="name"
          label="策略名称"
          rules={[{ required: true, message: '请输入策略名称' }]}
        >
          <Input placeholder="高金额优先策略" />
        </Form.Item>

        <Form.Item name="description" label="描述">
          <TextArea rows={2} placeholder="策略描述" />
        </Form.Item>

        <Form.Item
          name="priority"
          label="优先级"
          rules={[{ required: true }]}
          tooltip="数值越小优先级越高（1为最高）"
        >
          <InputNumber min={1} max={9999} style={{ width: 200 }} />
        </Form.Item>
      </Card>

      <Card title="匹配条件" bordered={false} className="mt-4">
        <Form.Item label="逻辑关系">
          <Select defaultValue="AND" disabled style={{ width: 120 }}>
            <Option value="AND">全部满足</Option>
          </Select>
          <span className="text-gray-500 ml-2">（Sprint 2 仅支持 AND 逻辑）</span>
        </Form.Item>

        <Form.List name={['rules', 'conditions']}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Row key={field.key} gutter={16} align="middle" className="mb-2">
                  <Col span={6}>
                    <Form.Item
                      {...field}
                      name={[field.name, 'field']}
                      rules={[{ required: true }]}
                      noStyle
                    >
                      <Select placeholder="字段">
                        {conditionFields.map((f) => (
                          <Option key={f.value} value={f.value}>
                            {f.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      {...field}
                      name={[field.name, 'operator']}
                      rules={[{ required: true }]}
                      noStyle
                    >
                      <Select placeholder="操作符">
                        {operators.map((op) => (
                          <Option key={op.value} value={op.value}>
                            {op.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      {...field}
                      name={[field.name, 'value']}
                      rules={[{ required: true }]}
                      noStyle
                    >
                      <Input placeholder="值" />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Col>
                </Row>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                添加条件
              </Button>
            </>
          )}
        </Form.List>
      </Card>

      <Card title="目标渠道" bordered={false} className="mt-4">
        <Form.List name="targets">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Row key={field.key} gutter={16} align="middle" className="mb-2">
                  <Col span={10}>
                    <Form.Item
                      {...field}
                      name={[field.name, 'channel_id']}
                      rules={[{ required: true }]}
                      noStyle
                    >
                      <Select placeholder="选择渠道">
                        {channels.map((c) => (
                          <Option key={c.id} value={c.id}>
                            {c.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      {...field}
                      name={[field.name, 'weight']}
                      rules={[{ required: true }]}
                      noStyle
                    >
                      <InputNumber min={1} placeholder="权重" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      {...field}
                      name={[field.name, 'display_order']}
                      rules={[{ required: true }]}
                      noStyle
                    >
                      <InputNumber min={0} placeholder="显示顺序" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Col>
                </Row>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                添加目标渠道
              </Button>
            </>
          )}
        </Form.List>
      </Card>

      <Card title="故障转移配置" bordered={false} className="mt-4">
        <Form.Item name={['failover_config', 'enabled']} valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>

        <Space>
          <Form.Item
            name={['failover_config', 'max_retries']}
            label="最大重试次数"
          >
            <InputNumber min={0} max={10} />
          </Form.Item>

          <Form.Item
            name={['failover_config', 'retry_interval_ms']}
            label="重试间隔(ms)"
          >
            <InputNumber min={100} step={100} />
          </Form.Item>
        </Space>
      </Card>
    </Form>
  );
};

export default RoutingStrategyForm;
